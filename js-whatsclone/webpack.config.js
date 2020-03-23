const path = require('path');

module.exports = {
    entry: {
        'app': './src/app.js',
        'pdf.worker': 'pdfjs-dist/build/pdf.worker.entry.js'
    },
    output: {
        filename: '[name].bundle.js', // [name] - como temos 2 arquivos de entry ele define um bundle para cada um
        path: path.join(__dirname, '/dist'),
        publicPath: 'dist'
    }
};
