export interface PageInterface {
    width: number;
    height: number;
    num: number;
}

export class Page {

    public num: number;
    public maxWidth: number;
    public maxHeight: number;
    public width: number = 0;
    public height: number = 0;
    private images = [];

    constructor({num, width, height}: PageInterface) {
        this.num = num;
        this.maxWidth = width;
        this.maxHeight = height;
    }

    public supports(width: number, height): boolean {

        if (this.width + width > this.maxWidth &&
            this.height + height > this.maxHeight) {
            return false;
        }

        return true;
    }

    public add(item: any): void {
        this.width += item.width;
        this.height += item.height;
        this.images.push(item);
    }

    public duplicate() {
        return new Page({
            num: this.num++,
            width: this.maxWidth,
            height: this.maxHeight
        });
    }

}