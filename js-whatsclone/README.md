# Projeto WhatsApp Clone

Projeto desenvolvimento de um clone do Whatsapp - Projeto de curso de JS.

## Recursos Usados

Lista de recursos usados em aula para este projeto

| Recurso | Link |
| ------ | ------ |
| Webpack | https://webpack.js.org/ |
| Firebase Authentication | https://firebase.google.com/docs/auth/?authuser=0 |
| Cloud Firestore | https://firebase.google.com/docs/firestore/?authuser=0 |
| Cloud Functions | https://firebase.google.com/docs/functions/?hl=pt-br |
| Cloud Storage | https://firebase.google.com/docs/storage/?authuser=0 |
| PDF.js | https://mozilla.github.io/pdf.js/ |
| MediaDevices.getUserMedia() | https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia |

### Criando o Controle Principal do App

Para criar o controle principal criamos um objeto que tem seus atributos vindos de um forEach de todos os elementos html com *id*, onde através de um método criamos as divs com o dataset com nome dos ids de cada elemento e retornamos os nomes das propriedades (em camelCase) via **Object.keys**.

```js
static getCamelCase(text) {
    let div = document.createElement('div');
    div.innerHTML = `<div data-${text}="id"></div>`;
    return Object.keys(div.firstChild.dataset)[0];
}
```

### Prototype

é uma forma de alterar um objeto ou uma classe dentro de sua estrutura de informações do JS. Com ele podemos criar métodos que podem ser usados por qualquer parte da aplicação que use o objeto o qual estamos alterando com o *prototype*.

```js
// no Objeto Element criamos um método hide que esconde o elemento que utilizar essa função sem que seja
// preciso chamar a propriedade style.display
Element.prototype.hide = function(){
    this.style.display = 'none';
    return this;
}
```

### Usando o FormData para capturar dados do formulário

Uma forma de capturar dados de um formulário é utilizando o objeto da API *FormData* onde ele armazena todos os campos de um formulário existente na aplicação.
No caso dessa aplicação, utilizamos o **HTMLFormElement**, que herda do objeto **Element**, para criar em seu prototype dois métodos para trabalhar com os dados e seus campos dos formulários da aplicação.

```js
// método que recupera os campos do formulário que o utiliza
HTMLFormElement.prototype.getForm = function() {
    return new FormData(this);
}

// converte os campos e seus valores em um objeto JSON
HTMLFormElement.prototype.toJSON = function() {
    let json = {}
    this.getForm().forEach((value, key) => {
        json[key] = value;
    });
    return json;
}
```

### Menu Anexar, utilizando bind() e removeEventListener()

Ao clicar no 'clipe' que está no topo do painel de conversa, temos várias opções de anexar algo, seja foto, documento e etc. Ao clicar fora do menu devemos fechar, mas para isso temos que definir que ao clicar no clipe, devemos adicionar no documento a ação de clique para fechar o menu. Só que, ao clicar em document perdemos o escopo do WhatsappController e para resolver isso, utilizamos o **bind()**.

**bind(aguments)** = com o bind conseguimos adicionar em um escopo, outro escopo e assim a ação passa a ser executada dentro desse escopo em bind.

Toda vez que clicamos no clipe ele também dispara o mesmo evento em document, ou seja, ele está propagando o evento do menu para o document que no caso executa o evento adicionado a ele. Para impedir multiplas propagações temos o **Event.stopPropagation()** que impede que os listeners do evento em questão também executem o mesmo evento.

```js
// ao clicar no 'clipezinho' de anexar alguma coisa na mensagem
this.el.btnAttach.on('click', e=>{
    e.stopPropagation(); // não deixa que os outros escutem o evento de click
    this.el.menuAttach.addClass('open');
    document.addEventListener('click', this.closeMenuAttach.bind(this));
});
```

## Método para formatar milissegundos em segundos, minutos e hora

Para formatar o tempo que será exibido no momento da gravação do audio criamos no utils *Format* um método que converte de milisegundos para padrão de hora, minutos e segundos.

**String.prototype.padStart(lengthTotal, valor_que_será_adicionado)** = preenche a string alvo com outra string(muitas vezes, se necessário) até que a string resultante alcance o length estipulado. Será preenchido do inicio(a esquerda) da string.

```js
static toTime(duration) {
    let seconds = parseInt((duration / 1000) % 60);
    let minutes = parseInt((duration / (1000 * 60)) % 60);
    let hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    if(hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}
```

## Inserir emoji no campo de mensagem - cloneNode(), dispatchEvent(), new Event()

**node.cloneNode(deep)** = Conseguimos com ele clonar um elemento e obter algumas propriedades do mesmo. O parametro **deep** é um booleano que indica se queremos clonar nós filhos do node ou se só queremos clonar o node especificamente.
**target.dispatchEvent(event)** = Conseguimos forçar no target o disparo de um evento.

```js
var event = new Event('build');

// Ouve pelo evento.
elemento.addEventListener('build', function (e) { ... }, false);

// Dispara o evento.
elemento.dispatchEvent(event);
```

## Inserir emoji - getSelection(), createRange() e DocumentFragment()

**window.getSelection()** = Retorna um objeto *Selection* representando a parte do texto selecionada pelo usuário ou a posição atual do cursor.

```js
selection = window.getSelection();
```

**document.createRange()** = cria um range retornando um objeto *Range*.

```js
range = document.createRange(); // a variavel range é o objeto Range retornado
```

**Selection.getRangeAt(index)** = método que retorna objeto Range representando um dos ranges selecionados a partir de um *index*.

**Range.deleteContents()** = método que remove os conteúdos do Range a partid do Document.

**Range.insertNode(node)** = método que insere um nó no inicio do Range.

**Range.setStartAfter(node)** = método define a posição de início de um intervalo em relação a um nó.

**document.createFragment()** = Cria um novo *DocumentFragment* vazio no qual nós do DOM podem ser adicionados para criar uma árvore DOM fora da tela.

```js
var fragment = document.createDocumentFragment();
```

## Ativando a camera com a API MediaDevices e getUserMedia()

Para usar a camera criamos um controller específico para tratar os eventos de uso da Camera. No método construtor passamos o elemento que irá receber o vídeo da camera após permitir seu uso.

```js
var _camera = new CameraController(this.el.videoCamera);
```

A propriedade somente leitura **Navigator.mediaDevices** retorna um objeto *MediaDevices*, que fornece acesso a dispositivos de entrada de mídia conectados, como câmeras e microfones, além de compartilhamento de tela.

O método **MediaDevices.getUserMedia()** solicita ao usuário permissão para usar uma entrada de mídia que produz um *MediaStream* com faixas contendo os tipos de mídia solicitados. Retorna uma Promise de um objeto *MediaStream*. Se o usuário não permitir ou a mídia não estiver disponível, vai cair em um erro **NotAllowedError** ou **NotFoundError**.

**URL.createObjectURL(blob)** = Cria um novo objeto URL. O novo objeto URL representa o objeto *File* ou o objeto *Blob* passado como argumento.

```js
navigator.mediaDevices.getUserMedia()
.then(stream => {
    this._videoEl.srcObject = stream; // define o srcs a partir do retorno da Promise - stream
    this._videoEl.play(); // executa o vídeo
})
.catch(error => {
    console.error(error);
})
```

## Criando um servidor web com Webpack Dev Server

Webpack é um empacotador de módulos estáticos para apps modernas de Javascript. Uma app moderna tem uma serie de ferramentas complexas e o webpack ele gera um bundle das ferramentas para que possam rodar no browser.

**Webpack Dev Server** = é um server de desenvolvimento que podemos utilizar quando estamos desenvolvendo com webpack.

Para utilizar criamos um package.json via *npm init* e instalamos as dependencias abaixo.

Versões utilizadas:

- webpack@3.1.0
- webpack-dev-server@2.5.1

## webpack.config.js

Podemos colocar outros módulos funcionando como plugins dentro do arquivo webpack.config.js. O webpack não é obrigatório o uso do webpack.config.js assumento que o ponto de entrada **entry** é *src/index* e o **output** o *dist/main.js* tudo minificado e otimizado para produção. Entretanto geralmente será necessário utilizar o arquivo de configuração.

Abaixo temos os comandos para buildar o projeto com webpack e a execução do webpack-dev-server:

```js
"scripts": {
    "build": "webpack --config webpack.config.js",
    "start": "webpack-dev-server" 
},
```

## Importando e exportando módulos com webpack

Para importar os módulos usamos o **import** seguido do módulo. Nesse caso o módulo deve ser exportado via **export default**. Também podemos importar o módulo entre **chaves** e no caso de exportar usamos somente o **export**.

```js
const path = require('path');

module.exports = {
    entry: { // onde são apontados os js de entrada necessarios
        'app': './src/app.js',
        'pdf.worker': 'pdfjs-dist/build/pdf.worker.entry.js'
    },
    output: { // caminho quando a aplicação é compilada
        filename: '[name].bundle.js', // [name] - como temos 2 arquivos de entry ele define um bundle para cada um
        path: path.join(__dirname, '/dist'), // join - ele concatena a pasta dist com os caminhos dos arquivos
        publicPath: 'dist'
    }
};
```

## Parando a captura da imagem da camera com getTracks()

**MediaTracks.getTracks()** = método da interface *MediaStream* retorna um array de todos os objetos *MediaStreamTrack*.
**MediaStreamTrack.stop()** = método que termina a track.

## gerando imagens com canvas

A **Canvas API** provê maneiras de desenhar gráficos via JavaScript e via elemento HTML *canvas* gerando um *HTMLCanvasElement*. Entre outras coisas, ele pode ser utilizado para animação, gráficos de jogos, visualização de dados, manipulação de fotos e processamento de vídeo em tempo real.

**HTMLCanvasElement.getContext()** = método que pega o contexto daquele elemento - a coisa sobre a qual o desenho será renderizado.
**HTMLCanvasElement.drawImage(image, x, y, width, height)** = método que desenha uma imagem, canvas ou video dentro do canvas. Pode desenhar partes de uma imagem e aumentar ou reduzir o tamanho de uma imagem.

## Lendo a capa de um arquivo PDF e gerando uma imagem com PDF.js

É uma lib provida pela Mozilla, onde é possível trabalhar com arquivos pdf. Inclusive o Whatsapp web usa essa lib no seu projeto. Depois de instalado a lib com **npm install pdfjs-dist** devemos fazer o require.

**webworker** = é um script JS que roda em segundo plano independentemente de outros scripts JS e não afeta a performance da pagina, por ser assincrono. Pode ficar em loop até que ele termine a ação que ele tenha que executar.

```js
const pdfJSLib = require('pdfjs-dist');
const path = require('path'); // lib para resolver caminhos de diretorios

// é um webworker nativo lib PDF.js
pdfJSLib.GlobalWorkerOptions.workerSrc = path.resolve(__dirname, '../../dist/pdf.worker.bundle.js');
```

**FileReader.readAsArrayBuffer(Blob || File)** = O método é utilizado para ler o conteúdo de um Blob ou File específico. Quando a operação de leitura é finalizada, o *readyState* torna-se DONE (finalizado), e o evento loadend é acionado. Então, o atributo result retorna um *ArrayBuffer* representando os dados do arquivo.

**pdfJSLib.getDocument(new Uint8Array(reader.result))** = esse método é o principal ponto de entrada para carregar um PDF e interagir com ele. No caso de um arquivo local devemos converter o memso em um array de 8bits com o *Uint8Array*. Esse método é uma promise que retorna um objeto com as informações do arquivo feito upload.

## gravando audio com MediaRecorder

A interface *MediaRecorder* da **API MediaStream Recording** que fornece funcionalidade para gravar facilmente mídias. É criado usando o construtor MediaRecorder().

**MediaRecorder.isTypeSupported(mimeType)** = método estático que retorna um booleano onde é true se o tipo MIME é suportado pelo browser para gravação.

## Firebase e Firebase Authentication

Para configurar o Firebase Storage e o Firebase Store, criamos um util com a classe *Firebase*. Nele importamos a lib do firebase instalada via npm. nele criamos um método que inicia as configurações que são geradas no momento que se cria o banco de dados no console do Firebase na internet.

```js
 /** Inicializa o Firebase */
init() {
    // verificamos se o Firebase já foi inicializado em alguma instancia
    if(!window._initialized) { // definimos a variavel globalmente para que não seja diferente em mais de uma instancia
        firebase.initializeApp(this._config); // config que foi gerado no momento de criaçao do banco
        window._initialized = true;
    }
}
```

Com o Firebase inicializado, habilitamos a autenticação via um um provedor do Google (uma conta). Criamos um método que fará a autenticação via um popup onde selecionamos uma conta google para se autenticar

**firebase.auth().signInWithPopup(provider)** = Autentica um cliente Firebase usando um fluxo de autenticação OAuth através de um pop-up. O método retorna uma *Promise* que se bem-sucedido, retorna o usuário conectado junto com a credencial do provedor. Se a entrada não tiver êxito, retornará um objeto de erro contendo informações adicionais sobre o erro.

```js
/** Autentica o usuário via login de uma conta no Google */
initAuth() {
    return new Promise((s, f) => {
        let provider = new firebase.auth.GoogleAuthProvider(); // autenticação via login do Google
        firebase.auth().signInWithPopup(provider).then(
            (result) => {
                let token = result.credential.accessToken;
                let user = result.user;
                s({
                    user,
                    token
                });
            } 
        ).catch(err => f(err))
    })
}
```

## Salvando os dados do usuario no firebase

Como trabalharemos com o modelo MVC, criamos um model para fazer referencia ao Usuario, onde no mesmo importamos a lib do Firebase. Com isso criamos um método que retornará uma referencia a uma coleção de usuarios.

```js
/** Método que retora a referencia a coleção de usuarios */
static getRef() {
    return Firebase.db().collection('/users');
}
```

Feito a referencia, precisamos criamos os documentos a partir de um id que no caso será o e-mail do usuário

```js
/** Metodo que que pega a Referencia da coleção através de um id especificado */
static findByEmail(email) { // email no caso será o email funcionando como um id    
    return User.getRef().doc(); // criamos o documento baseado no email do usuário autenticado
}
```

Feito isso, importamos o model no controller do Whatsapp para que, na autenticação criamos um usuario, passamos o email para criar o documento do usuario no banco e setamos os dados do documento do mesmo, sendo que os dados salvos serão nome, email e foto do usuario.

```js
this._user = new User(); // criamos um novo usuario

let userRef = User.findByEmail(response.user.email); // o email será a referencia do documento da coleção

userRef.set({ // definimos os dados que serão inseridos no documento
    name: response.user.displayName,
    email: response.user.email,
    photo: response.user.photoURL 
})
```