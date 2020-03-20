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
    this._videoEl.src = URL.createObjectURL(stream); // cria uma url a partir do retorno da Promise - stream
    this._videoEl.play(); // executa o vídeo
})
.catch(error => {
    console.error(error);
})
```