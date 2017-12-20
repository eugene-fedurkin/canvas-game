module.exports = {
    entry: './src/main.js',
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "eslint-loader"
            }
        ],
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/
        }]
    },
    devtool: '#inline-source-map'
}