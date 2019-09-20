
# Projeto Usuários JS - Recursos Utilizados

Uma premissa muito importante é que ao programar devemos deixar o código mais **genérico** possível.

**SPA** = um padrão muito utilizado hoje em dia onde a aplicação funciona toda em uma unica pagina.

## variáveis

espaço na memória que armazenamos valores temporariamente. Usamos a palavra reservada **var** para declarar uma variável.

Uma variável que armazena um objeto, vira uma **referência** desse objeto e assim, ela tem acesso aos atributos e métodos deste objeto.

Ao nomear variáveis não utilizar caracteres especiais exceto **undeline** e o **cifrão** e também não podem começar com números.

Temos os **pseudo seletores** que seguem uma regra baseada no CSS.

## JSON

Javascript Object Notation, nada mais é que um padrão de notação javascript baseado em chave e valor.
```js
	//chave e valor
	let json = {chave: valor}
```

# Eventos

Sabemos que o JS interage com as ações do usuário seja por formulário, teclado, mouse e **eventos** são ações que reagem à interação do usuário.

**this** = faz referência a atributos e métodos da própria classe.

**preventDefault** = método que cancela o comando padrão que o evento teria.

Os formulários sempre fazem uma nova requisição a cada submit dado. Podemos ter alguns métodos de requisição no formulário:

**GET** = os dados enviados sempre serão enviados via URL

# Funções

São ações que sempre retornam valor. Podemos ter também as **subRotinas** que é uma função que não retorna valor nenhum.

**return** = comando usado para retornar valores.

# POO - Classes e MVC - MODEL

**MODEL** = Onde as informações são armazenadas.
**VIEW**  = É a interface que o usuário vê/interaje.
**CONTROLLER** = Ele controla as regras de negócio e interações, ligando o MODEL a VIEW.

Orientação de Objetos (um estilo de programação onde cria-se estruturas - *Classes* - e usamos em vários locais do código) ajuda a trabalhar melhor o código com reaproveitamento, abstração e outras coisas como o padrão MVC.

Toda Classe começa com letra maiúscula.

**constructor()** = método que é chamado automaticamente quando instanciamos a classe a qual ele pertence.

Quando instanciamos uma classe com a palavra reservada *new*, ela passa a ser um Objeto.

**instância de uma classe** = é quando criamos um Objeto através da palavra *new*, onde esse mesmo se torna uma cópia/representação dessa classe.

# POO - Classes e MVC - CONTROLLER

