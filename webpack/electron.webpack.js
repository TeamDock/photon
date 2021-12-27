const path = require('path');

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
