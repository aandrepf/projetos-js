var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');

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

/* DELETA OS ARQUIVOS QUE FORAM SELECIONADOS TANTO LOCAL QUANTO NO FIREBASE */
router.delete('/file', function(req, res) {
  let form = new formidable.IncomingForm({
    uploadDir: './upload',
    keepExtensions: true // mantem a extensão do arquivo
  });
  form.parse(req, (err, fields, files)=> {
    let path = './' + fields.path;
    if(fs.existsSync(path)) {
      fs.unlink(path, err=> {
        if (err) {
          res.status(400).json({
            err
          });
        } else {
          res.json({
            fields
          });
        }
      });
    } else {
      res.status(404).json({
        err: 'File not found.'
      });
    }
  });
});

/* USADO PARA ABRIR UM ARQUIVO NO NAVEGADOR DE ACORDO COM O PATH PASSADO PELO QUERYPARAMS NA URL */
router.get('/file', function(req, res) {
  let path = './' + req.query.path; //pega da queryString o valor de 'path' na url
  if(fs.existsSync(path)) {
    fs.readFile(path, (err, data)=> {
      if(err) {
        console.log(err);
        res.status(400).json({
          error: err
        })
      } else {
        res.status(200).end(data);
      }
    })
  } else {
    res.status(404).json({
      error: 'File not found.'
    })
  }
});

module.exports = router;
