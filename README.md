# Introdução ao JS

## **Parte 1 - Conceitos:**
**script incorporado** = Quando o arquivo JS está no mesmo arquivo HTML. Não é uma boa prática a ser utilizada.
**comentários** = linhas de códigos que são ignoradas pelo interpretador de código JS.
**variável** = espaço na memória usada para armazenar um valor. Para isso usamos o **var**.
**timestamp** = quantidade em segundos desde 01/01/1970 até a data atual. Usada em diversas linguagens de programação. Em JS o valor da timestamp é em milissegundos.

Uma boa prática importante é que sempre que possível, carregue os arquivos JS no final do arquivo index.html

No ES6 e ES7 temos declarações de variáveis por escopo. Nesse caso temos o **let** (definida no bloco onde foi declarado e não mostra no restante do código) e o **const** que é uma constante onde seu valor nunca muda.

**typeof** = comando usado para saber qual o tipo de dado de uma determinada variavel.
exemplo: var a = [];
*typeof a*
> retorna 'object'

**instanceOf** = comando usado para saber de qual instancia ou Objeto veio uma determinada variável.
exemplo: var a = [];
*a instanceof Object*
> retorna true

No JS as variáveis são fracamente tipa das, mas por ser dinâmica permite a tipagem das variáveis ou o parse das mesmas como por exemplo parseInt, parseFloat, toString

**operadores**

*atribuição ( = ),  comparação de valores ( == ), comparação de valor e tipo ( === ), diferentes valor ( != ), diferentes valor e tipo ( !== )*

**operadores lógicos**

*AND ( && ) - TRUE se as duas condições são verdadeiras*

*OR ( || ) - TRUE se pelo menos uma das condições é verdadeira*

**operador incremento ( ++ )**  = acrescenta 1 ao valor de uma variável toda vez que o loop passar por ela

**operador decremento ( -- )** = diminui 1 ao valor da variável toda vez que o loop passar por ela

**operador condicional if(condição){}else{}** = verifica se uma condição é TRUE, senão ela cai no bloco else. temos o *else if* para caso queiramos mais de uma verificação. Uma condição if que for TRUE anula as outras condições else if ou else.

**switch(condicao)** = quando se sabe as opções da condição esse recurso pode ser usado substituindo o *else if*. Analisa a condição e se ela cair em um caso executa algo dentro dele e para por aí. Podemos ter ainda o *default* que é uma condição em que não caia em nenhum dos cases.

**for(valor inicial;valor final;incremento)** = estrutura de repetição que executa alguma ação dentro das instruções passadas para ele.

**forEach(index, callback)** = para cada index de um array, por exemplo, chamamos uma função que executará alguma coisa.

**for(propriedade in objeto)** = para cada propriedade de um objeto ele executa algo.

Para interromper a execução de um laço, podemos usar o **break** (geralmente usado dentro de uma condição inserida dentro do laço).
Temos o **continue** que ele ignora as instruções e vai para a próxima repetição;

**template string (  \`${ operadores/valor/variavel/comandos }\`  )** = permite que se pule linhas, coloque comandos e etc;

## **Parte 2 - Funções e Objetos:**

No JS os códigos são reaproveitáveis.

### Funções
Esse conceito se aplica a **Funções** que são trechos de código que podem ser reutilizados e executam alguma coisa e retornam um resultado usando o *return* e depois esse mesmo encerra a função. Temos 3 tipos, função **comum** que tem um nome e faz algo e pode ser chamada quantas vezes for necessário, função **anonima** que não tem um nome definido e executa dentro de um trecho de código num determinado contexto e no ES6 temos as **arrow function** facilita a escrita de funções permitindo que o código não seja isolado e assim tendo alguns tipos de comportamentos dependendo de onde a mesma se encontra.

As funções podem ter **argumentos/parâmetros** que são variáveis criadas no momento da invocação da função e se caso a função tenha é obrigatório respeitar esses argumentos

Uma função de **callback** é uma função de retorno como parâmetro de outra função

**eval(string)** = Função nativa do JS que avalia uma expressão string e retorna o valor da mesma; Caso o argumento seja vazio o retorno é *undefined*.

### DOM (Document Object Model)
É a estrutura como o HTML é formado e o JS manipula a estrutura através do DOM, dando vida ao código HTML.
Temos então os **Eventos** que são ações realizadas na aplicação que dispara rotinas sempre escutando a interação dos usuários e assim reagir as mesmas.

**alvo.addEventListener(evento, callback)** = executa uma função de callback a partir do tipo de evento que o alvo recebe.

**window** = é toda a janela do browser onde contém o document, histórico do usuário, podemos fazer refresh, mudar propriedades da mesma.

**document** = é a aplicação em si.

### Objetos e Classes
No caso de termos variáveis e funções dentro de um objeto, nesse caso temos as **Classes** que é um agrupador de atributos e métodos.
Para criar uma **instância** (representação de uma classe em uma variável ou objeto) de uma classe usamos a palavra reservada *new* antes da classe.

*QUANTO MAIS INTELIGENTE FOR A CLASSE MAIS LIMPO É O CÓDIGO*

O JS é uma linguagem reativa, pois necessita de uma interação do usuário para que o código funcione e reagir de acordo com essa interação.

No JS temos a classe/Objeto **Date()** e nela temos um método muito importante que é o **toLocaleString(string com a região esperada)** que formata a data para a região configurada no navegador.

No JS os Array podem ser de diversos tipos.

A *Orientação a Objetos* é uma das coisas mais importantes em programação, pois ele é reutilizável, limpo e funcional, onde tudo acontece em uma Classe.

O comando **this** dentro de uma Classe nada mais é que uma referência a um atributo ou método daquela classe.
```js
  // exemplo normal
  // criando uma classe celular
  let celular = function(){
    this.cor = 'prata';
    this.ligar = function() {
      console.log('uma ligaçao');
      return 'ligando';
    }
  }
  let objeto = new celular(); //instancia da classe celular
  console.log(objeto.ligar());
```
exemplo ES6:
```js
  class celular {
    constructor() {
    this.cor = 'prata';
    }
    ligar() {
      console.log('uma ligaçao');
      return 'ligando';
    }
  }
  let objeto = new celular();
  console.log(objeto.ligar());
```
