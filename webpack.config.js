const path = require('path');

var distributionDir = 'distribution',
    common = {
        context: __dirname + '/source',
        externals: [
            /^[a-z\-0-9]+$/
        ]
    }

const cli = {
    entry: './Bin/Packer.js',
    target: 'node',
    output: {
        filename: 'packer.js',
        path: path.join(__dirname, distributionDir, 'bin'),
    },
    module: {
        loaders: [
            {test: /\.js$/, loader: "shebang-loader"}
        ]
    }
}

const main = {
    context: __dirname + '/source',
    entry: {
        index: 'shebeng!./SpritePacker.js',
    },
    target: 'node',
    output: {
        library: 'sprite-packer',
        libraryTarget: 'umd',
        filename: '[name].js',
        path: path.join(__dirname, distributionDir),
        umdNamedDefine: true,
    }
}

module.exports = [
    Object.assign(common, main), Object.assign(common, cli)
];
