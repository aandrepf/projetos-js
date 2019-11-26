# Criando um servidor Web com Node.JS

Para criar um servidor com Node.js, criamos uma pasta onde dentro dele existe um arquivo *index.js*.

Nesse arquivo criamos uma const que ira fazer um require do módulo *http*

```js
	const http = require('http');
```

A partir dessa const criamos uma variavel que recebe um método do *http*

**createServer(requestListener: RequestListener)** = cria um listener do servidor propriamente dito

Com isso podemos usar o método *listen* que recebe alguns parametros;

**listen(porta?: number, hostname?: string, listener:? () => void)** = método que inicia um listener e fica escutando requisições do server criado. Por padrão o node usa a porta 3000;


# Detectando URLs Diferentes

Para detectar que urls estamos acessando, dentro do método de criação do server que é um listener, temos o request onde podemos pegar a url que estamos querendo acessar.

**request.url** = atributo do requestListener que informa a url acessada pelo listen;

Podemos definir o response do acesso a url com algumas informações;

**response.statusCode** = informa o código (padrão do protocolo Http) da requisição feita;

**responde.setHeader(name: string, value: string)** = define o cabeçalho da requisição que será feita;

**response.end()** = dentro do parametro do método temos o retorno da requisição para o usuário;

# Entendendo o package.json e instalando o Express

**npm** = Node Package Manager - entendido como um gerenciador de pacotes do Node.JS;

**package.json** = um arquivo json que guarda toda configuração do projeto onde ele está embutido. Para criar um arquivo package.json rodamos dentro da pasta do projeto o comando *npm init* e assim no prompt do comando ele abre um helper e o criador preenche algumas informações que ficarão alocadas no arquivo.

Para instalar pacotes usamos o comando *npm install* dentro da pasta do projeto e podemos usar a flag *--save* para salvar como uma dependência do projeto, ou seja, é um pacote necessário para o funcionamento da aplicação. Ele criará uma pasta node_modules contendo os arquivos dos pacotes que foram instalados.

# Nodemon e criando um server com Express

**Nodemon** = um serviço do node em que onde ele é rodado, fica observando a pasta onde ele está rodando e quando houver qualquer alteração dentro dela ele espera um pouco e sobe novamente o servidor para aplicar essa alteração automaticamente.

Para criar um server com o Express, precisamos fazer um require para o express

```js
	const express = require('express');

	// Para executr o express criamos uma variavel que chama o método express (que é o server criado)
	let app = express();
```

A diferencia pro http é que não precisamos setar manualmente as url de requisição, fazendo assim diretamente a chamada via método seja get, post, put, delete já apontando para a url;

**app.get(path: string, handler: RequestHandlers<ParamsDictionary> () => {})** = Método do tipo GET que faz consulta de algum dado de uma determinada url

# Separando Rotas do arquivo principal

o Express ele fornece um recurso de rotas através do método *Router()*, onde criamos arquivos separados cada um contendo suas rotas de requisição específicas e exportamos essas rotas para o arquivo principal;

```js
let express = require('express');
let routes = express.Router();

// exportamos as rotas do arquivo
module.exports = routes;
```

Assim dessa forma conseguimos fazer as requisições GET, POST, PUT, DELETE via rotas. No index.js principal fazemos o requerimento das rotas

```js
let routesIndex = require('./routes/index');
let routesUsers = require('./routes/users');
```

No index.js principal usamos o método **use(path, rotaImportada)** para utilizar os métodos.

```js
app.use(routesIndex);
app.use('/users', routesUsers);
```

# Carregando rotas com Consign

É uma extensão do NodeJS então instalamos o mesmo via npm install usando a flag --save para salvar nas dependencias da aplicação. O mesmo facilita o desenvolvimento de aplicações com separação de arquivos e carregamento automatico de scripts. Também carrega modelos, rotas e etc.

```js
const express = require('express');
const consign = require('consign');

let app = express();

// inclui todos os arquivos da pasta routes no app e passa o 'app' para os arquivos de routes
consign().includes('routes').into(app);
```

# Recebendo dados via POST e instalando o Postman

Quando executamos o método post precisamos passar um body que são os dados enviados via requisição com o *req.body*.

O Express em si não consegue tratar o que ele recebe do método POST, precisando assim instalar uma extensão do mesmo chamada **body-parser**.

Ele analisa os corpos de solicitação de entrada em um middleware antes de seus manipuladores, disponíveis na propriedade de *req.body*.

```js
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
```

**json()** = Retorna middleware que analisa apenas json e analisa apenas solicitações em que o cabeçalho Content-Type corresponde à opção type. Esse analisador aceita qualquer codificação Unicode do body.

**urlencoded({ extended: false })** = Retorna o middleware que analisa apenas os corpos codificados em url e analisa apenas as solicitações em que o cabeçalho Content-Type corresponde à opção type. Esse analisador aceita apenas a codificação UTF-8 do body. A sintaxe "extended" permite que objetos e matrizes avançados sejam codificados no formato codificado por URL, permitindo uma experiência semelhante a JSON com codificado por URL.

# Persistencia de dados com NeDB, banco de dados JS

Primeiramente devemos instalar o nedb com a flag --save para ter o mesmo como dependencia da aplicação.
No arquivo JS onde o banco será utilizado devemos requerer o banco e depois instanciar o mesmo com algumas informações.

```js
let NeDB = require('nedb');
let db = new NeDB({
    filename: 'users.db', // nome do arquivo db onde estaram armazenados os dados
    autoload: true // por padrão vem false, mas no caso de ser true o banco será carregado automaticamente sem necessidade de chamar o método loadDatabase()
});
```

Para inserir dados no banco usamos:

```js
var doc = { ola: 'world', n: 5, hoje: new Date(), nedbELegal: true, nadaAqui: null, naoSeraSalvo: undefined, frutas: [ 'apple', 'orange', 'pear' ], infos: { name: 'nedb' } };
db.insert(doc, function (err, newDoc) {// A callback é opcional
  // newDoc é o nodo documento, incluindo seu _id
  // newDoc não terá a propriedade 'naoSeraSalvo' visto que seu valor é undefined
});
```

# Listando usuários do banco NeDB

**find()** = método usario para procurar vários documentos correspondentes à sua consulta.
**sort()** = método que ordena a busca por determinada chave. os valores *1* servem para trazer em ordem crescente e *-1* em ordem decrescente

```js
db.find({}).sort({name: 1}).exec((err, users)=> {
    // retorna um array de usuarios ordenado em crescente pelo nome
});
```

# Obtendo dados de um usuário

**findOne()** = Esse método refina a busca de um item específico por definição de um parametro.

```js
let routeId = app.route('/users/:id');
routeId.get((req, res) => {
    db.findOne({ _id: req.params.id}).exec((err, users) => {
        // o retorno será um array contendo o usuario que contém o id passado na rota
    });
});
```

# Editando dados de um usuário

**db.update(query, update, options, callback)** = Esse método atualizará todos os documentos correspondentes à consulta de acordo com as regras de atualização.

```js
routeId.put((req, res) => {
    db.update({_id: req.params.id}, req.body, err => {
       // vai retornar um objeto com a alteração que foi definida
    });
});
```

# Excluindo dados de um usuário

**db.remove(query, options, callback)** = Esse método removerá todos os documentos correspondentes à consulta de acordo com as opções.

```js
routeId.delete((req, res) => {
    db.remove({_id: req.params.id}, {}, err => {
       // vai remover o objeto que tem o id definido na query
    });
});
```

# Validado dados via POST com Express

O Express tem uma extensão muito útil para fazer validações utilizando validator.js, sanitizer que se chama *express-validator*. Instalamos o mesmo via npm e salvando nas dependencias com a flag --save.