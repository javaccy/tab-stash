var webpack    = require('webpack');
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

module.exports = {
    entry: {
        background: './src/js/background.js',
        options: './src/js/options.js',
        popup: './src/js/popup.js'
    },

    output: {
        path: './src/js',
        filename: '[name].bundle.js'
    },

    module: {
        loaders: [
            { test: /\.vue$/,           loader: 'vue' },
            { test: /\.css$/,           loader: 'style!css' },
            { test: /\.js$/,            loader: 'jsx?harmony!babel', exclude: [/node_modules/] },
            { test: /\.less$/,          loader: 'style!css!less' },
            { test: /\.(png|jpg)$/,     loader: 'url-loader?limit=8192' }
        ]
    },

    resolve: {
        extensions: ['','.js', '.json', '.scss', '.less']
    },
    plugins: [
        new CommonsChunkPlugin('common.bundle.js')
    ]

};
