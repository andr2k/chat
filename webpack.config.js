module.exports = {
    entry: './client/client.js',
    output: {
        path: '/home/a/projects/chat/pub',
        filename: 'app.js',
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }]
    }
}