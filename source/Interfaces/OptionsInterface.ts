interface OptimizeInterface {
    enabled: boolean;
    quality: number;
    speed: number;
    output: string;
}

export interface OptionsInterface {
    width?: number;
    height?: number;
    source?: string;
    engine?: string;
    name?: string;
    format?: string;
    output?: string;
    optimize?: OptimizeInterface;
    sort?: string;
    margin?: number;
    config?: {
        path: string
    };
}