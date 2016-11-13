import { BasicImageInterface } from './../Interfaces/BasicImageInterface';
import { Image } from '../Classes/Image';
import { PackerInterface } from './../Interfaces/PackerInterface';
import { Sort } from '../Classes/Sort';

export abstract class AbstractPacker implements PackerInterface {

    public bin: BasicImageInterface;

    constructor(public width: number, public height: number) {
        this.createBin(width, height);
    }

    createBin(width: number, height: number): BasicImageInterface {
        return this.bin = {
            x: 0, y: 0, width, height
        };
    }

    resetBin(): BasicImageInterface {
        return this.createBin(this.width, this.height);
    }

    sort(images: Image[], algorithm: string): Image[] {
        return (new Sort(images, algorithm)).sort();
    }

    abstract pack(images: Image[]): Image[];

}