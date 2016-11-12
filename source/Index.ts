import { extend, groupBy, keyBy, toCamelCase } from './Helpers';

import { EngineInterface } from './Interfaces/EngineInterface';
import { GraphicsMagick } from './Engines/GraphicsMagick';
import { Image } from './Image';
import { OptionsInterface } from './interfaces/OptionsInterface';
import { Packer } from './Classes/Packer';
import { PackerInterface } from './Interfaces/PackerInterface';
import { Page } from './Page';
import { PeterPacker } from './Classes/PeterPacker';
import { Sort } from './Sort';
import { Validator } from 'jsonschema';

const fs = require('fs');
const execFile = require('child_process').execFile;
const calipers = require('calipers')('png', 'jpeg', 'webp', 'gif', 'svg');

const chalk = require('chalk');
const glob = require('glob'),
    layout = require('layout'),
    Promise = require('bluebird'),
    json = require('jsonfile'),
    PngQuant = require('pngquant');

export class SpritePacker {

    private packer: PackerInterface;
    private engine: EngineInterface;
    private output: any;
    private validator = new Validator();
    private schema: OptionsInterface = require('../schema.json');
    private options: OptionsInterface;

    get engines() {
        return {
            'gm': GraphicsMagick
        };
    };

    get defaults(): OptionsInterface {
        return {
            width: 1024,
            height: 1024,
            engine: 'gm',
            source: './**/*.{png,jpg}',
            name: 'sprite',
            format: 'png',
            output: './',
            margin: 1,
            sort: Sort.AUTOMATIC,
            optimize: {
                enabled: true,
                quality: 80,
                speed: 2,
                output: './min'
            }
        };
    }

    constructor(options: OptionsInterface) {

        this.options = extend(this.defaults, options);
        console.log(this.options);
        /**
         * @todo Wrap out the error to display which property is wrong...
         * 
         * Validate configuration file
         */
        const validation = this.validator.validate(this.options, this.schema);

        if (validation.errors.length) {
            throw 'Invalid configuration file...';
        }

        this.packer = new PeterPacker(this.options.width, this.options.height);
        this.engine = new this.engines[this.options.engine];

        this.cleanOutputDir()
            .then(() => this.measure())
            .then(images => this.process(images));

    }

    /**
    * Clean dir before start
    */
    private cleanOutputDir() {
        return new Promise((accept, reject) => {
            glob(`${this.options.output}/${this.options.name}-*`)
                .on('match', fs.unlinkSync)
                .on('end', accept)
                .on('error', reject);
        });
    }

    /**
     * @todo 
     * 
     * 1 - Handle the case where the user might not use a wild card on source and output
     * so for example if he sends ./images thinking it will do as ./images/**\/*.*
     * 
     * 2 - clean up callback hell...
     */
    private measure() {
        return new Promise((accept, reject) => {
            glob(this.options.source, { ignore: this.options.output })
                .on('end', (files: string[]) => {

                    Promise
                        .map(files, path => {

                            /**
                             * Mesure all files
                             */
                            return calipers.measure(path).then(({type, pages}) => {
                                return new Image({
                                    path: path,
                                    type: type,
                                    width: pages[0].width,
                                    height: pages[0].height,
                                    margin: this.options.margin
                                });
                            });

                        }, { concurrency: 3 }).then((images: Image[]) => {

                            /**
                             * Prevent creating if any of the given images
                             * has width way bigger than the maxium specified
                             */
                            const errors = [];

                            let totalWidth = 0,
                                totalHeight = 0;

                            for (let {width, height, path, name} of images) {

                                totalWidth += width;
                                totalHeight += height;

                                if (width > this.options.width || height > this.options.height) {
                                    errors.push(
                                        `Maximium Dimension Exceeded: ${name}' -> ${width}x${height} -> ${width}x${height}`
                                    );
                                }

                            }

                            /**
                             * Decide which sorting algorithm to use 
                             */
                            if (this.options.sort === Sort.AUTOMATIC) {
                                this.options.sort = (totalWidth < totalHeight ? Sort.WIDTH : Sort.HEIGHT);
                            }

                            if (errors.length) {
                                throw errors;
                            }

                            return images;

                        })
                        .then(accept)
                        .catch(reject);

                });
        });
    }

    /**
     * Initiate the packing process
     */
    private process(images: Image[]) {

        /**
         * Sort and Pack
         */
        const packaged = this.packer.pack(
            this.packer.sort(images, this.options.sort)
        );

        let {output, name, format, width, height, optimize} = this.options,
            bins = groupBy(packaged, 'bin'),
            promises = [];

        for (let num in bins) {

            const data = {
                format, width, height, path: `${output}/${name}-${num}.${format}`,
            };

            const promise = this.engine.create(<Image[]>bins[num], data);

            if (optimize.enabled) promise.then(() => this.optimize(num, data.path));

            let file = `${output}/${name}-${num}.json`,
                meta = bins[num].map((image: Image) => image.export());

            json.writeFile(file, keyBy(meta, 'name'), { spaces: 2 }, error => {
                if (error) throw error;
            });

            promises.push(promise);

        }

        Promise.all(promises).then(function () {
            console.log('done');
        });

    }

    private optimize(num: string | number, path: string) {

        const pngquant = require('pngquant-bin'),
            { output, name, format, optimize} = this.options;

        execFile(pngquant, ['--speed', optimize.speed, '--quality', optimize.quality, '-o', `${output}/${optimize.output}/${name}-${num}.min.${format}`, path], error => {
            if (error) throw error;
        });
    }

}