import { SizeInterface } from './SizeInterface';

interface LocationInterface {
    x: number;
    y: number;
}

interface DownInterface extends SizeInterface, LocationInterface {
}

export interface PackingDataInterface extends SizeInterface, LocationInterface {
    used: boolean;
    down: DownInterface;
    right: DownInterface;
}