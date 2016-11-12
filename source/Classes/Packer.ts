import { BasicImageInterface } from './../Interfaces/BasicImageInterface';
import { Image } from './../Image';
import { Sort } from './../Sort';

export class Rect {

    public x = 0;
    public y = 0;
    public width;
    public height;

    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

}

export class Packer {

    public left: Packer = null;
    public right: Packer = null;
    public rect: Rect = null;
    public filled: boolean = false;

    private bin: BasicImageInterface;

    constructor(public width: number = null, public height: number = null) {
        this.createBin(width, height);
    }

    createBin(width: number, height: number): BasicImageInterface {
        return this.rect = {
            x: 0, y: 0, width, height
        };
    }

    resetBin(): BasicImageInterface {
        this.right = null;
        this.left = null;
        return this.createBin(this.width, this.height);
    }

    pack(images: Image[], sortAlgorithm: string) {
        return this.fit(
            (new Sort(images, sortAlgorithm)).sort()
        );
    }

    fit(images: Image[], bin: number = 1, index: number = 0) {

        for (let i = index; i < images.length; i++) {

            let image = images[i],
                node = this.add(image);

            if (node) {
                image.setPacking(
                    bin, node.rect
                );
                continue;
            }

            this.resetBin();

            return this.fit(images, bin + 1, i);
        }

        return images;

    }

    private fits(rect: Rect) {
        return this.rect.width >= rect.width && this.rect.height >= rect.height;
    };

    private equal(rect: Rect) {
        return rect.width === this.rect.width && this.rect.height === rect.height;
    };

    public add(rect: Rect): Packer | null {

        if (this.left != null)
            return this.left.add(rect) || this.right.add(rect);

        if (this.filled)
            return null;

        if (!this.fits(rect))
            return null;

        if (this.equal(rect)) {
            this.filled = true;
            return this;
        }

        this.left = new Packer();
        this.right = new Packer();

        let width_diff = this.rect.width - rect.width;
        let height_diff = this.rect.height - rect.height;

        let me = this.rect;

        if (width_diff > height_diff) {
            this.left.rect = new Rect(me.x, me.y, rect.width, me.height);
            this.right.rect = new Rect(me.x + rect.width, me.y, me.width - rect.width, me.height);
        }
        else {
            this.left.rect = new Rect(me.x, me.y, me.width, rect.height);
            this.right.rect = new Rect(me.x, me.y + rect.height, me.width, me.height - rect.height);
        }

        return this.left.add(rect);

    };

}