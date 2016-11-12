#!/usr/bin/env node

import { SpritePacker } from './../Index';

let program = require('commander'),
    json = require('jsonfile'),
    chalk = require('chalk');

program
    .version('1.0');

function Boolean(input: string) {

    if (typeof input === 'string') {
        return input.toLowerCase() === 'true';
    }

    return !!input;

}

program
    .arguments('<config>')
    .option('-w, --width [number]', 'Desired Width', parseInt)
    .option('-e, --engine [string]', 'Engine to render out the images. defaults to [gm]', 'gm')
    .option('-c, --config [path]', 'Specify a custom configuration file. defaults to spirit.json in the current directory.', false)
    .option('-o, --optimize [boolean]', 'Optimize output.', Boolean)
    .parse(process.argv);

const userConfig = (typeof program.config === 'string') ? program.config : false;

json.readFile(userConfig || './spirit.json', function (error, config) {

    if (error) {

        if (userConfig) {
            return console.log('you provided wrong config');
        }
        // return console.error(
        //     chalk.yellow('Configuration file not found. Please place a spirit.json file in your root directory.')
        // );
    }

    try {

        let options = program.opts();

        for (let property in options) {
            if (options[property] === undefined) {
                delete options[property];
            }
        }

        const spirit = new Spirit(options);

    } catch (error) {

        if (error instanceof Array) {
            error.forEach(e => console.error(chalk.red(e)));
        } else {
            console.error(chalk.yellow(error));
        }

        process.exit(1);

    };

});