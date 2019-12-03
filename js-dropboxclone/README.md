# Drobpbox Clone JS - Recursos Utilizados

## Criando Projeto com Express Generator

Via terminal ou console acessamos a pasta do projeto e dentro dela executamos o comando *express --ejs app* para criar a estrutura do clien-server com express-generator.

Após criado a estrutura, acessamos a pasta app criada e instalamos suas dependencias via 'npm install' e jogamos a estrutura do front (arquivos e pastas estaticas) na pasta public e o index.html jogamos na pasta views e renomeamos para *index.ejs*. A estrutura está pronta para rodar, basta dar o comando *node ./bin/www* para rodar a aplicação na porta 3000 (por default).

## Criando Controller e Evento Click no botão ENVIAR ARQUIVOS

Na pasta public do app criamos uma pasta src e dentro dela um arquivo index.js onde instanciaremos o controller, que será criado dentro de uma pasta controller.

```js
class DropboxController() {
    constructor(){
        this.btnSendFileEl // faz referencia ao botão que terá a ação de clik que fará o change do inputFileEl
        this.inputFilesEl  // faz referencia ao input do tipo file
        this.snackModalEl  // faz referencia ao snackbar que mostra o progresso do arquivo selecionado no inputFilesEl
        this.initEvents(); // método que inicia os eventos de click do btnSendFileEL e do change do inputFilesEl
    }
}
```

```js
// instanciando o controller na app
window.app = new DropboxController();
```

no index.ejs chamamos esses arquivos para que possamos usar na aplicação.


## Enviando files via AJAX e Promise.all()

Podemos usar o recurso de **Promise.all()**, onde ele cria uma Promise que é resolvida com um array de resultados quando todas as Promises do array forem resolvidas ou rejeitadas no caso de alguma Promise der erro. Ela recebe por parametro um array de Promises e por fim retorna uma Promise.

```js
let promises = [];

[...files].forEach(file=>{
    promises.push(new Promise((res, rej)=>{
        // faz o resolve e o reject de cada Promise
    }));
});

return Promise.all(promises); // retorna uma promise do array de promises resolvidas ou não
```

Como no caso da aplicação usamos via AJAX o método POST, precisamos enviar body contendo o arquivo que está sendo selecionado no input. Uma forma de construir esse corpo é usando um recurso da API Web chamado **FormData**.

Ele é uma maneira fácil de construir um objeto com um conjunto de chave/valor representando os campos de um form e seus valores que poderão ser enviados via método *XMLHttpRequest.send()*. O tipo de formatação que ele usa é *multipart/form-data*.

**Formdata.append** = método que acrescenta um novo valor em uma chave existente dentro de um objeto FormData, ou adiciona a chave se ela ainda não existir.

```js
let formData = new FormData();
formData.append('input-file', file); // cria uma chamve input-file e seu valor é o arquivo recebido
ajax.send(formData); // envio do objeto FormData via ajax (XMLHttpRequest.send())
```

## Recebendo files no Node.JS com Formidable

Temos o body-parser no Node.JS que podemos usar para tratar o corpo de uma solicitação POST ou qualquer outra solicitação que receba dados em um body. Entretando, no caso de upload de arquivos o body-parser não é tão efetivo, mas temos uma dependência/extensão muito interessante que é o **Formidable** que especificamente é um módulo para parsear dados de formulário, especificamente upload de arquivos.

Para instalar o mesmo usamos o *npm install --save formidable*.

No arquivo que contém as rotas criamos uma variável que faz um require para a lib do formidable instalada no node_modules. Feito isso criamos uma variavel que irá instanciar o formidable.

```js
// variavel form instanciando o formidable com algumas configs padrão
let form = new formidable.IncomingForm({
    uploadDir: 'path_onde_sera_feito_o_uload',
    keepExtensions: true // true - mantem a extensão do arquivo, caso contrario só vem o nome do mesmo sem a extensão
});
form.parse(req, (err, fields, files)=> {
    res.json({
      files // json com as infos dos arquivos
    });
  });
```

**formidable.IncomingForm().parse(request, callback?: (err: any, fields: Fields, files: Files))** = Parseia uma requisição node.js contendo um formdata. Recebe 2 parametros. O primeiro é a requisição vinda do multipart/form-data, o segundo é uma calback (não obrigatória) que contem os parametros sendo, um erro caso ocorra, os campos recebidos do form e o terceiro os arquivos recebidos.

## Atualizando a view com infos de Progresso de Upload

o AJAX tem um método específico para controlar o progresso do upload chamado **ajax.upload.onprogress** que retorna um objeto do tipo *ProgressEvent*. Com ele conseguimos pegar o tamanho do arquivo em bytes e o que ja foi carregado e com isso calcular o tempo para que o usuário possa ver quanto falta para terminar o upload.

## Adicionando Firebase à sua aplicação Web

Primeiramente é preciso ter uma conta Google para ter acesso ao Firebase e assim la dentro criar um projeto novo no Console. Depois de criado o banco, para desenvolvimento escolhemos o Realtime Database em modo teste que tem permissões de escrita e leitura abertas sem necessidades de autenticação. Depois de criado o banco, criamos a conexão para app web e colocamos a configuração no controller.

```js
// CONECTA O FIREBASE E INICIA
connectFirebase() {
    var firebaseConfig = {
        // propriedades da conexão criada pelo Firebase
    };
    // Inicializa o Firebase
    firebase.initializeApp(firebaseConfig);
}
```

## Gravando dados no Firebase Realtime Database

Com o firebase configurado e iniciado, podemos então começar a gravar os dados na base de dados no Firebase Realtime.

```js
// Pegamos a referencia do banco de dados
getFirebaseRef() {
    return firebase.database().ref('files');
}
```

Com a referência criada fazemos a inclusão dos dados do arquivo que foi feito upload (em JSON) e gravamos na referencia (que é um array-like)

```js
this.getFirebaseRef().push().set('objeto Files com as informações do arquivo');
```

## Listando dados do Firebase Realtime Database