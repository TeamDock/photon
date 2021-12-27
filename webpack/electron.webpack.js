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
    externals: {
        'node-pty': 'commonjs2 node-pty',
    },
    plugins: [new webpack.ExternalsPlugin('commonjs', ['native-reg'])],
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
