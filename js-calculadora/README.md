# Calculadora JS - Recursos Utilizados

## Orientação a Objetos e MVC
A estrutura de classes é o segredo da OO, pois nela fica toda regra de negócio com agrupamento de métodos e atributos e além disso essa forma de programar é prática, reutilizável e abstraída.

**MVC (Model, View, Controller)** = é uma forma de organizar a manipulação dos dados (models), a visualização/interface/templates (views) e as regras de negócio (controllers).

## método construtor e encapsulamento
Dentro de uma classe temos um método que toda vez que a mesma for instanciada ela automaticamente chama esse método **constructor()** que pode conter parâmetros que a função precisa.

**encapsulamento** = é um processo onde definimos o controle de acesso a um atributo ou método de uma classe. Temos 3 tipos de encapsulamentos:

 - **public** = Aquele que está acessível a todos.
 - **protected** = Se uma classe (mesmo que esteja fora do pacote) estende da classe com o atributo `protected`, ela terá acesso a ele.
 - **private**  = A única classe que tem acesso ao atributo é a própria classe que o define

Existe uma convenção em JS, onde colocamos o underline na frente do nome do atributo para informar que esse atributo é *private*.

Os métodos **getters** (recuperar valor) e **setters** (atribuir valor) permitem definir como acessar os valores de uma classe.

Sempre que tivermos um atributo ou método private é preciso do getter e setter dele, para que possamos setar e recuperar valor do mesmo.
