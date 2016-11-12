import { BasicImageInterface } from './BasicImageInterface';
import { Image } from './../Image';

export interface PackerInterface {

    bin: BasicImageInterface;
    width: number;
    height: number;

    pack(images: Image[]): Image[];
    sort(images: Image[], algorithm: string): Image[];

}