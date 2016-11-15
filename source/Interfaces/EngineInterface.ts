import { Image } from './../Classes/Image';
import { SizeInterface } from './SizeInterface';

interface InputInterface extends SizeInterface {
    path: string;
    format: string;
}

export interface EngineInterface {
    create(images: Image[], options: InputInterface): Promise<void>;
}