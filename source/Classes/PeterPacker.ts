import { AbstractPacker } from './../Abstract/AbstractPacker';
import { BasicImageInterface } from './../Interfaces/BasicImageInterface';
import { Image } from './../Image';
import { PackerInterface } from './../Interfaces/PackerInterface';
import { Sort } from './../Sort';
import Promise = require('bluebird');

export class PeterPacker extends AbstractPacker {

    public pack(images: Image[]): Image[] {

        let bin = 0,
            clone = images.slice();

        while (clone.length) {

            clone = <any[]>clone
                .map(image => this.fit(image, bin + 1))
                .filter(result => result instanceof Image);

            bin += 1;
            this.resetBin();

        }

        return images;

    }

    private fit(image: Image, bin: number) {

        let node = this.process(this.bin, image);

        if (node) {
            return image.setPacking(bin, this.split(node, image.width, image.height));
        }

        return image;
    }

    process(root, image: Image) {

        if (root.used)
            return this.process(root.right, image) || this.process(root.down, image);
        else if ((image.width <= root.width) && (image.height <= root.height))
            return root;

        return null;

    }

    split(node, width, height) {
        node.used = true;
        node.down = { x: node.x, y: node.y + height, width: node.width, height: node.height - height };
        node.right = { x: node.x + width, y: node.y, width: node.width - width, height };
        return node;
    }

}