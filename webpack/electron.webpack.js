const path = require('path');
const webpack = require('webpack');

module.exports = {
    name: 'photon-app',
    entry: './app/main.ts',
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    devtool: 'source-map',
    target: 'electron-main',
    plugins: [
        new webpack.ExternalsPlugin('commonjs', ['native-reg', 'node-pty']),
    ],
    module: {
        rules: [
            {
                test: /\.(js|ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
    output: {
        path: path.resolve(__dirname, '..', 'dist'),
        filename: '[name].js',
    },
};
