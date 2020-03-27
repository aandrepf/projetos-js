const path = require('path');

module.exports = {
    entry: {
        'app': './src/app.js',
        'wordcloud': './src/wordcloud2.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.join(__dirname, '/dist'),
        publicPath: 'dist'
    }
}