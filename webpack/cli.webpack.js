const path = require('path');

const nodeEnv = process.env.NODE_ENV || 'development';
const isDev = nodeEnv === 'development';

module.exports = {
    name: 'photon-cli',
    entry: './cli/index.ts',
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    },
    devtool: 'cheap-module-source-map',
    mode: 'none',
    target: 'node',
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /index.js/,
                loader: 'shebang-loader',
                include: [/node_modules\/rc/],
            },
        ],
    },
    output: {
        path: path.resolve(__dirname, '..', 'bin'),
        filename: 'cli.js',
    },
};
