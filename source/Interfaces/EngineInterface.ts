import { Image } from './../Image';
import { SizeInterface } from './SizeInterface';

interface InputInterface extends SizeInterface {
    path: string;
    format: string;
}

export interface EngineInterface {
    create<A>(images: Image[], options: InputInterface): PromiseLike<A>;
}