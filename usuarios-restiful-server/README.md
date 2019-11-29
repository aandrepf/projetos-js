# Bower

Um detalhe importate: temos uma pasta bower_components que contem toda estrutura de css e dependencias visuais da aplicação para isso devemos instalar o bower globalmente na maquina e depois na pasta do projeto rodar o comando *bower install*

# Criando um projeto restfull api com Express Generator

O Express Generator é um gerador de projetos em expressJS. Com ele conseguimos criar a base da nossa aplicação. 

Para instalar usamos o comando **npm install express-generator -g** e assim poderemos usar ele em qualquer diretorio da máquina onde ele foi instalado.

Para criar um novo projeto usando o express-gerator na pasta onde queremos criar inserimos o comando **express --ejs nome_do_projeto**. Depois de criado a pasta do projeto devemos instalar as dependencias que o projeto criado usa do expressjs.

Na estrutura temos uma pasta chamada *public* onde ficam todos os arquivos estáticos do projeto com  html, js, css e etc. Feito isso, o index.html tiramos dessa pasta e colocamos na pasta *views* e trocamos a extensão para ejs.

# Usando Restify para acessar API Rest

O Restify é um framework escrito em NodeJS que permite ter a partes do lado server Restfull e o lado Client consumindo do restfull. No nosso caso instalaremos somente o lado client com o comando **npm install restify-clients --save**.

```js
var restify = require('restify');

var client = restify.createJsonClient({
  url: 'caminho para o servidor restful onde ele acessara'
});

router.get('/', function(req, res, next) {
  // FEITO UM GET PARA O SERVIDOR DEFINIDO NA URL PARA LISTAR OS USUARIOS DO BANCO DE DADOS  
  client.get('/users', function(err, request, response, obj) {
    assert.ifError(err);
    res.end(JSON.stringify(obj, null, 2));
  });
});
```

# Ajax com XMLHttpRequest (XHR)

O Ajax é muito utilizado para fazer requisições assincronas (que não depende de interação de usuário) utilizando o XMLHttpRequest.

```js
var ajax = new XMLHttpRequest(); // instanciamos o objeto XHR
ajax.open('GET', '/users'); // abrimos a requisição com o tipo  e o path do serviço
ajax.onload = () => {
    // Aqui a callback será executada quando a requisição foi completada com sucesso
    ajax.responseText // retorna o texto recebido do servidor depois que a requisição foi enviada
}
ajax.send(body?); // envia uma requisição para o servidor. aceita um parametro body que não é obrigatório (nesse caso vai como null) ou envia o corpo da requisição (geralmente usados em PUT)
```

# Aumentando limite de bytes enviados por POST

No Express o POST ele tem um limite de tamanho de dados que podem ser enviados por ele. Para isso usamos a propriedade *limit* dos métodos do express, json() e urlencoded(). Isso deve ser tanto feito no lado do client server como do restiful server.

```js
let express = require('express');

let app = express();
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
```

# Refatorando para fetch API

API fetch é um recurso novo do ES2015 permitindo trabalhar melhor com o AJAX, e inclusive no futuro vem para substituir o AJAX. Alguns navegadores podem ainda não estar prontos para aceitar essa nova tecnologia, nesse caso temos o *polyfill* que é um recurso que irá fazer com que esses navegadores/dispositivos se adaptem a essa nova tecnologia.

```js
// statico não necessita de instancia da classe podendo ser chamado diretamente
static request(method, url, params = {}) {
  return new Promise((resolve, reject) => {
    let request;
    switch(method.toLowerCase()) {
      case 'get':
        request = url;
      break;
      default:
        request = new Request(url, {
          method,
          body: JSON.stringify(params),
          headers: new Headers({
              'Content-Type': 'application/json'
          })
        });
    };
    
    fetch(request).then(response => {
      response.json().then(json=>{
          resolve(json);
      }).catch(e=>{
          reject(e);
      });
    }).catch(e=>{
      reject(e);
    });
  }); 
} 
```
