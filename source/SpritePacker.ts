import { extend, groupBy, keyBy, toCamelCase } from './Helpers';

import { EngineInterface } from './Interfaces/EngineInterface';
import { Error } from './Classes/Error';
import { GraphicsMagick } from './Engines/GraphicsMagick';
import { Image } from './Classes/Image';
import { OptionsInterface } from './interfaces/OptionsInterface';
import { PackerInterface } from './Interfaces/PackerInterface';
import { PeterPacker } from './Packers/PeterPacker';
import { Sort } from './Classes/Sort';
import { Validator } from 'jsonschema';
import { execFile } from 'child_process';

const fs = require('fs-extra');
const path = require('path');
const calipers = require('calipers')(...['png', 'jpeg', 'webp', 'gif', 'svg']);
const glob = require('glob'),
    Promise = require('bluebird'),
    json = require('jsonfile');

/**
 * SpritePacker
 */
export class SpritePacker {

    private packer: PackerInterface;
    private engine: EngineInterface;
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
            config: {
                path: 'sprite.json'
            },
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
                enabled: false,
                quality: 80,
                speed: 2,
                output: './min'
            }
        };
    }

    /**
     * Creates an instance of SpritePacker.
     * 
     * @param {OptionsInterface} options
     */
    constructor(options: OptionsInterface) {

        let defaults = this.defaults;

        try {
            options = extend(
                json.readFileSync(
                    path.normalize(options.config || defaults.config.path)
                ), options
            );
        } catch (error) {
            if (options.config) throw error;
        }

        this.options = extend(defaults, options);

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
            glob(path.normalize(`${this.options.output}/${this.options.name}-*`))
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
                format, width, height, path: path.join(output, `${name}-${num}.${format}`),
            };

            /**
             * Create Dir
             */
            try {
                fs.mkdirsSync(path.join(output, optimize.enabled ? optimize.output : ''));
            } catch (error) {
                Error.handle(Error.DIR, 1);
            }

            /**
             * Create Sprite
             */
            const promise = this.engine
                .create(<Image[]>bins[num], data)
                .catch(Error.handle);

            if (optimize.enabled) promise.then(() => this.optimize(num, data.path));

            /**
             * Write Json Data
             */
            let file = path.join(output, `${name}-${num}.json`),
                meta = bins[num].map((image: Image) => image.export());

            json.writeFile(file, keyBy(meta, 'name'), { spaces: 2 }, error => {
                if (error) console.log(error);
            });

            promises.push(promise);

        }

        Promise.all(promises).then(function () {
            console.log('Finished');
        });

    }

    private optimize(num: string | number, input: string) {

        const pngquant = require('pngquant-bin'),
            { output, name, format, optimize} = this.options,
            destination = path.join(output, optimize.output, `${name}-${num}.min.${format}`);

        execFile(pngquant, ['--speed', optimize.speed, '--quality', optimize.quality, '-o', destination, input], error => {
            if (error) throw error;
        });
    }

}