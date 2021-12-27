const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    name: 'photon-app',
    entry: './src/index.tsx',
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        mainFields: ['main', 'module', 'browser'],
    },
    target: 'electron-renderer',
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.(js|ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.s[ac]ss$/i,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    devServer: {
        historyApiFallback: true,
        compress: true,
        hot: true,
        port: 3000,
    },
    output: {
        path: path.resolve(__dirname, '..', 'dist', 'renderer'),
        filename: 'js/[name].js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '..', 'public', 'index.html'),
        }),
    ],
};
