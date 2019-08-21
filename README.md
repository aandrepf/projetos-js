# Introdução ao JS

## **Conceitos:**
**script incorporado** = Quando o arquivo JS está no mesmo arquivo HTML. Não é uma boa prática a ser utilizada.
**comentários** = linhas de códigos que são ignoradas pelo interpretador de código JS.
**variável** = espaço na memória usada para armazenar um valor. Para isso usamos o **var**.

No ES6 e ES7 temos declarações de variáveis por escopo. Nesse caso temos o **let** (definida no bloco onde foi declarado e não mostra no restante do código) e o **const** que é uma constante onde seu valor nunca muda.

**typeof** = comando usado para saber qual o tipo de dado de uma determinada variavel.
exemplo: var a = [];
*typeof a*
> retorna 'object'

**instanceOf** = comando usado para saber de qual instancia ou Objeto veio uma determinada variável.
exemplo: var a = [];
*a instanceof Object*
> retorna true

No JS as variáveis são fracamente tipadas, mas por ser dinamica permite a tipagem das variaveis ou o parse das mesmas como por exemplo parseInt, parseFloat, toString

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
