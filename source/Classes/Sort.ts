export class Sort {

    static AUTOMATIC = 'automatic';
    static RANDOM = 'random';
    static WIDTH = 'w';
    static HEIGHT = 'h';
    static MIN = 'min';
    static MAX = 'max';
    static MAX_HEIGHT = 'height';
    static MAX_WIDTH = 'width';
    static AREA = 'area';
    static SIDE = 'maxside';

    constructor(private collection: any[], public algorithm: string = Sort.AUTOMATIC) { }

    sort(algorithm: string = this.algorithm) {
        return this.collection.sort(Sort[algorithm]);
    }

    private static random(a, b) { return Math.random() - 0.5; }
    private static w(a, b) { return b.width - a.width; }
    private static h(a, b) { return b.height - a.height; }
    private static automatic(a, b) { return b.area - a.area; }
    private static max(a, b) { return Math.max(b.width, b.height) - Math.max(a.width, a.height); }
    private static min(a, b) { return Math.min(b.width, b.height) - Math.min(a.width, a.height); }

    private static height(a, b) { return Sort.msort(a, b, ['h', 'w']); }
    private static width(a, b) { return this.msort(a, b, ['w', 'h']); }
    private static area(a, b) { return this.msort(a, b, ['automatic', 'h', 'w']); }
    private static maxside(a, b) { return this.msort(a, b, ['max', 'min', 'h', 'w']); }

    private static msort(a, b, criteria: string[]): number {

        for (let sort of criteria) {
            let diff = Sort[sort](a, b);
            if (diff !== 0) {
                return diff;
            }
        }

        return 0;
    }

}