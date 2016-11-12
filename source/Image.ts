import { PackingDataInterface } from './Interfaces/PackingDataInterface';
import { SizeInterface } from './Interfaces/SizeInterface';
const pather = require('path');

export class Image {

    public data: PackingDataInterface;
    public bin: number;
    public name: string;
    public width: number;
    public height: number;
    public type: string;
    public path: string;
    public area: number;
    public margin: number;

    public x: string;
    public y: string;

    constructor({path, width, height, type, margin}) {
        this.width = width + (margin * 2);
        this.height = height + (margin * 2);
        this.type = type;
        this.path = path;
        this.name = pather.basename(path, `.${type}`);
        this.area = width * height;
        this.margin = margin;
    }

    pack(bin: number, data: PackingDataInterface) {
        this.data = data;
        this.bin = bin;
    }

    setPacking(bin: number, {x, y}) {
        this.x = x;
        this.y = y;
        this.bin = bin;
    }

    export() {
        return {
            name: this.name,
            width: this.width,
            height: this.height,
            sprite: {
                name: `sprite-${this.bin}.png`,
                width: this.x + this.width,
                height: this.x + this.width,
            },
            x: this.x,
            y: this.y,
        };
    }

}