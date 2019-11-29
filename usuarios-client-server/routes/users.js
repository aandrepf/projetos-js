var express = require('express');
var restify = require('restify-clients');
var assert = require('assert');
var router = express.Router();

var client = restify.createJsonClient({
  url: 'http://localhost:4000'
});

/* GET - CONSULTA A LISTA DE USUARIOS. */
router.get('/', function(req, res, next) {
  client.get('/users', function(err, request, response, obj) {
    assert.ifError(err);
    res.json(obj);
  });
});

/* GET - REFINANDO A CONULTA PARA UM USUARIO ESPECIFICO */
router.get('/:id', function(req, res, next) {
  client.get(`/users/${req.params.id}`, function(err, request, response, obj) {
    assert.ifError(err);
    res.json(obj);
  });
});

/* PUT - ATUALIZANDO DADOS DO USUARIO */
router.put('/:id', function(req, res, next) {
  client.put(`/users/${req.params.id}`, req.body, function(err, request, response, obj) {
    assert.ifError(err);
    res.json(obj);
  });
});

/* DELETE - DELETA USUARIO */
router.delete('/:id', function(req, res, next) {
  client.del(`/users/${req.params.id}`, function(err, request, response, obj) {
    assert.ifError(err);
    res.json(obj);
  });
});

/* POST - CADASTRA NOVO USUARIO */
router.post('/', function(req, res, next) {
  client.post(`/users`, req.body, function(err, request, response, obj) {
    assert.ifError(err);
    res.json(obj);
  });
});

module.exports = router;
