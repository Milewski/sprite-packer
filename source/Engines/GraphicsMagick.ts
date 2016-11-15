import { EngineInterface } from './../Interfaces/EngineInterface';

let Promisse = require('bluebird'),
    gm = require('gm').subClass({ imageMagick: true });

export class GraphicsMagick implements EngineInterface {

    public create(images, {width, height, path, format}) {

        let frame = gm(width, height, 'transparent');

        return new Promisse(function (accept, reject) {

            for (let {x, y, path, margin} of images) {
                frame.out('-page');
                frame.out(`+${x + margin}+${y + margin}`);
                frame.out(path);
                frame.gravity('center');
            }

            frame
                .mosaic()
                .background('transparent');

            frame.write(path, error => error ? reject(error) : accept());

        });
    }
}