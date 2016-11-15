import { PackingDataInterface } from '../Interfaces/PackingDataInterface';
import { SizeInterface } from '../Interfaces/SizeInterface';
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

    public x: number;
    public y: number;

    constructor({path, width, height, type, margin}) {
        this.width = width + (margin * 2);
        this.height = height + (margin * 2);
        this.type = type;
        this.path = path;
        this.name = pather.basename(path).replace(/\.[^/.]+$/, '');
        this.area = width * height;
        this.margin = margin;
    }

    pack(bin: number, data: PackingDataInterface) {
        this.data = data;
        this.x = data.x;
        this.y = data.y;
        this.bin = bin;
    }

    export({width, height}: any): any {

        let x = this.x,
            y = this.y;

        let v1 = 1 - (this.height + y) / height,
            v2 = 1 - y / height,
            u1 = x / width,
            u2 = (x + this.width) / width;

        return {
            name: this.name,
            width: this.width,
            height: this.height,
            sprite: {
                name: `sprite-${this.bin}.png`,
                width: width,
                height: height
            },
            uv: {
                u1, v1, u2, v2,
                uDistance: u2 - u1,
                vDistance: v2 - v1,
            },
            x: this.x,
            y: this.y
        };
    }

}