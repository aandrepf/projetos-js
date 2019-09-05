
# Calculadora JS - Recursos Utilizados

## Orientação a Objetos e MVC
A estrutura de classes é o segredo da OO, pois nela fica toda regra de negócio com agrupamento de métodos e atributos e além disso essa forma de programar é prática, reutilizável e abstraída.

**MVC (Model, View, Controller)** = é uma forma de organizar a manipulação dos dados (models), a visualização/interface/templates (views) e as regras de negócio (controllers).

## método construtor e encapsulamento
Dentro de uma classe temos um método que toda vez que a mesma for instanciada ela automaticamente chama esse método **constructor()** que pode conter parâmetros que a função precisa.

**encapsulamento** = é um processo onde definimos o controle de acesso a um atributo ou método de uma classe. Temos 3 tipos de encapsulamentos:

 - **public**    = Aquele que está acessível a todos.
 - **protected** = Se uma classe (mesmo que esteja fora do pacote) estende da classe com o atributo `protected`, ela terá acesso a ele.
 - **private**   = A única classe que tem acesso ao atributo é a própria classe que o define

Existe uma convenção em JS, onde colocamos o underline na frente do nome do atributo para informar que esse atributo é *private*.

Os métodos **getters** (recuperar valor) e **setters** (atribuir valor) permitem definir como acessar os valores de uma classe.

Sempre que tivermos um atributo ou método private é preciso do getter e setter dele, para que possamos setar e recuperar valor do mesmo.

## manipulando DOM
**DOM** = Document Object Model, ou seja, podemos manipular e modificar todos os elementos de um documento HTML (objeto *Document* - usamos a palavra **document**).
**document.querySelector(selector: string)** = retorna o primeiro elemento de acordo com o seletor definido no parâmetro. Se não achar retorna *null*.
**document.querySelector(selector: string).innerHTML** = insere uma informação em formato HTML dentro do elemento definido.

*quanto mais interações com o DOM mais a aplicação vai ficando pesada*

**BOM** = Browser Object Model, ou seja, faz referência aos objetos relacionados ao browser (objeto *Window* - usamos a palavra **window**)
**window.close()** = método do objeto Window que fecha a janela ativa.

**Eventos** = interações do usuário via mouse, teclado ou qualquer outro tipo de evento, onde são ações disparadas na aplicação

## data e hora
No JS temos o objeto **Date()** que representa um valor de tempo. Ele é baseado em um valor de tempo que é um numero em milissegundos desde 1/1/1970.

```js
var date = new Date();
```

**date.toLocaleDateString(locale: string, options: object)** = retorna uma string com a representação de parte da data baseando-se no idioma definido no locale.

```js
// requer um dia da semana jutamente com uma data longa
var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
console.log(date.toLocaleDateString('de-DE', options));
//"Donnerstag, 20. Dezember 2012"
```

**date.toLocaleTimeString(locale: string, options: object)** = retorna uma string com uma representação sensível ao idioma de uma porção de tempo desta data.

```js
var date = new Date(Date.UTC(2012, 11, 20, 3, 0, 0));

// Os formatos abaixo assumem o fuso horário local da região;
// America/Los_Angeles for the US

// uma aplicação pode querer usar UTC e tornar isso visível
var options = { timeZone: 'UTC', timeZoneName: 'short' };
console.log(date.toLocaleTimeString('en-US', options));
// "3:00:00 AM GMT"
```

**setInterval(callback, tempo)** =  Função executada em um intervalo de tempo em milissegundos. Quando o setInterval é executado o navegador gera um id para esse intervalo.
**clearInterval(id)** = método usado para parar o setInterval de acordo com seu id.

**setTimeout(callback, tempo)** = Função executada uma unica vez depois de um determinado tempo em milissegundos.
**clearTimeout(id)** = método usado para parar o setTimeout de acordo com seu id.

## querySelector
O *querySelector* é muito importante para quando precisamos manipualr um ou mais elementos do DOM.
**document.querySelectorAll(selector(s): string)** = retorna todos os elementos de acordo com o seletor definido no parâmetro. Se não achar retorna *null*.

## evento click
O JS fica escutando eventos de click, teclado, tempo e interações do usuário, reagindo a esse evento.

**element.className.baseVal** = retorna a classe de um elemento HTML. o *baseVal* é necessário no caso de se tratar de um SVG.

## aplicando eventos com split
**split(separador)** = método que divide um objeto String em um array de strings pelo separador definido no parametro.

## switch
Ele é uma estrutura controladora de fluxo onde ele analisa casos e se algum atender, executal algo e para por ali mesmo.

## isNaN & Array.length
**Array.length** = é uma propriedade do objeto *Array* que indica a quantidade de itens dentro do array.

**Array.indexOf(value)** = ele busca no array o indice do value passado no parâmetro. Se encontrar ele retorna o numero do indice, senão retorna o valor **-1**.

**window.isNaN(value)** = método em que verifica se o value passado no parâmetro **NÃO** é um número retornando um booleano.

## eval
**eval(codigo: string)** = Ele avalia uma sequencia de caracteres representando uma expressão JS, declaração, ou sequencias de declarações em formato string, podendo essas expressões incluir variaveis e propriedades de objetos existentes. Ele retorna o resultado do calculo da expressão passada. Se for vazio retornara *undefined*.
```js
var x = 2;
var y = 39;
var z = "42";
eval("x + y + 1"); // retorna 42
eval(z);           // retorna 42
```

## for
**for(inicialização;condição;expressão final)** = é um loop que consiste em três expressões opcionais, separadas por ponto e virgula, seguidas por uma declaração ou sequencia de declarações executadas em sequencia.

```js
for (let i = 0; i < 9; i++) {
   console.log(i);
}
```
