#!/usr/bin/env node

import { SpritePacker } from './../SpritePacker';

const chalk = require('chalk');

function Boolean(input: string) {

    if (typeof input === 'string') {
        return input.toLowerCase() === 'true';
    }

    return !!input;

}

try {

    let options = require('yargs')
        .options(require('../../arguments.json'))
        .coerce('optimize', value => {
            return typeof value === 'string' ? Boolean(value) : value;
        })
        .help()
        .wrap(null)
        .epilog('copyright 2016')
        .argv;

    /**
     * Clean up undefined values
     */
    for (let property in options) {
        if (options[property] === undefined || property.length <= 2) {
            delete options[property];
        }
    }

    options.config = (typeof options.config === 'string') ? options.config : false;

    const packer = new SpritePacker(options);

} catch (error) {

    if (error instanceof Array) {
        error.forEach(e => console.error(chalk.red(e)));
    } else {
        console.error(chalk.yellow(error));
    }

    process.exit(1);

};
