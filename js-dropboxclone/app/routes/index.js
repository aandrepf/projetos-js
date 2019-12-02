var express = require('express');
var router = express.Router();
var formidable = require('formidable');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* RECEBE OS ARQUIVOS QUE FORAM FEITOS UPLOAD */
router.post('/upload', (req, res) => {
  let form = new formidable.IncomingForm({
    uploadDir: './upload',
    keepExtensions: true // mantem a extensão do arquivo
  });
  form.parse(req, (err, fields, files)=> {
    res.json({
      files
    });
  });
})

module.exports = router;
