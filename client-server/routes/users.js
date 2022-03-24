var express = require('express');
var assert = require('assert');
var restify = require('restify-clients');
var router = express.Router();


// Cria um client JSON

var client = restify.createJsonClient({

  url: 'http://localhost:4000' 

});


// solicitaçao de rota da restfulAPI

router.get('/', function(req, res, next) {
  
  client.get('/users', function (err, request, response, obj){ // quando o usuario chamar /users na rota, o restful retorna /users
  assert.ifError(err);
  res.json(obj);

  // aqui, os parametros do router sao pro usuario, e os do client sao pro servidor. Entao, router = localhost3000 / client = localhost4000
  
  });
  
});

router.get('/:id', function(req, res, next) {
  
  client.get(`/users/${req.params.id}`, function (err, request, response, obj){ 
  assert.ifError(err);
  res.json(obj)

  });
  
});

router.put('/:id', function(req, res, next) {
  
  // como o put retorna os dados que foram alterados, ele precisa do parametro a mais informando quais dados foram esses, esse parametro nesse caso é o req.body
  client.put(`/users/${req.params.id}`, req.body, function (err, request, response, obj){ 
  assert.ifError(err);
  res.json(obj)

  });
  
});

router.delete('/:id', function(req, res, next) {
  
  client.del(`/users/${req.params.id}`, function (err, request, response, obj){ 
  assert.ifError(err);
  res.json(obj)

  });
  
});

// recebido na rota principal, entao ele nao tem id, o id vai ser gerado
router.post('/', function(req, res, next) {
  
  client.post(`/users/`, req.body, function (err, request, response, obj){ 
  assert.ifError(err);
  res.json(obj)

  });
  
});

module.exports = router;
