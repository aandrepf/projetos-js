
# Projeto Usuários JS - Recursos Utilizados

Template usado [AdminLTE](https://adminlte.io/themes/AdminLTE/)

Uma premissa muito importante é que ao programar devemos deixar o código mais **genérico** possível.

**SPA** = um padrão muito utilizado hoje em dia onde a aplicação funciona toda em uma unica pagina.

## variáveis

espaço na memória que armazenamos valores temporariamente. Usamos a palavra reservada **var** para declarar uma variável.

Uma variável que armazena um objeto, vira uma **referência** desse objeto e assim, ela tem acesso aos atributos e métodos deste objeto.

Ao nomear variáveis não utilizar caracteres especiais exceto **underline** e o **cifrão** e também não podem começar com números.

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

Um detalhe importante é que o **this** respeita o escopo em que ele está inserido. Usando as **arrow functions** conseguimos resolver problemas de escopo de funções.

# Operador Spread

**spread(...)** = é uma expressão que permite que um objeto, seja um array ou string onde não é preciso especificar quantos índices existem;

No ES5 fariamos da seguinte forma
```js
var arr1 = [0, 1, 2];
var arr2 = [3, 4, 5];
// Acrescenta todos itens do arr2 ao arr1
Array.prototype.push.apply(arr1, arr2);
```

No Es6 com spread
```js
var arr1 = [0, 1, 2];
var arr2 = [3, 4, 5];
arr1.push(...arr2);
```

# Trabalhando com Arquivos - Api FileReader

**Api FileReader** = é uma Api de JS que permite trabalhar com leitura e manipulação de pastas e arquivos
```js
let fileReader = new FileReader();
```

**fileReader.onload** = contem um manipulador de evento executando uma função de callback quando o evento de carregamento (load) é ativado, quando o conteúdo lido com  readAsArrayBuffer, readAsBinaryString, readAsDataURL ou readAsText fica disponível.

**fileReader.readAsDataUrl** = O método readAsDataURL é usado para ler o conteúdo do tipo *Objeto Blob* ou *Objeto File*.

**base64** = é uma codificação de dados muito usada na internet, muito frequentemente usado para dados *binários* por meio de transmissão de texto.

# Configurando Promise no Javascript

**sincrono** = toda a ação entre aplicação e usuario ocorre de forma síncrona

**assincrono** = ações e recursos da aplicação não dependem da interação do usuário

**Promise** = uma ação assíncrona que testa duas situações as quais são: faz alguma coisa se deu certo (*resolve*) ou faz outra coisa se deu erro (*reject*).

```js
	retornaPromise() {
		return new Promise((reject, resolve)=>{
			resolve(); // quando SUCCESS
			reject();  // quando ERROR
		});
	}

	// tratando o retorno
	retornaPromise().then(
		(ret) => {
			console.log('retorno do resolve', ret);
		},
		(error) => {
			console.error('retorno do reject', error);
		}
	);
```

# Ajustando a View

**appendChild** = adiciona código HTML como filho do elemento atual;

# Datas - Getters and Setters

Usamos o método **set** para definir algum valor ao atributo de uma classe e o **get** para retornar o valor de um atributo. Geralmente usado para o conceito de atributos privados da classe.

```js
	let date = new Date();
```

uma biblioteca interessante é o [moment.js](https://momentjs.com/)

# Métodos Estáticos

São métodos que não precisam de uma instancia de uma classe para serem invocados. Usamos a palavra reservada **static** para definir como estático.

# Validando Forms

**elemento.classList** = é uma coleção (conjunto de atributos e métodos de um objeto) de classes do elemento que foi referenciado.
**elemento.classList.add(classeCss:string)** = adicionar na coleção de classes uma classe que foi definida dentro do parametro;

# Atualizando Estatísticas utilizando dataset

**DataSet** = Faz parte da Api Web do JS e permite a leitura e escrita em elementos com atributo *data-algumaCoisa*.

**Serializar** = Termo usado para quando transformamos um Objeto em um texto.

# Edição de dados - Editando a View

Sempre criar códigos dinâmicos mantendo um padrão de nome de objetos e utilizar laços.

**continue** = palavra reservada do JS que ignora o restante das intruçoes e avança.

**for...in** = loop usado para para interagir sobre as propriedades de um objeto na ordem original de inserção. Também pode ser usado para cada propriedade distinta do objeto.

```js
/Objeto
var obj = {a:1, b:2, c:3};

//Para prop (propriedade) in obj (objeto) faça
for (var prop in obj) {
  console.log("obj." + prop + " = " + obj[prop]);
}

//A saída (output) deverá ser:
// "obj.a = 1"
// "obj.b = 2"
// "obj.c = 3"
```

**rowIndex** = Ele conta a posição da linha a partir de 1, baseada no total. Temos tambem a *sectionRowIndex*, onde a diferença é que essa começa no indice 0.

```js
tr.sectionRowIndex
```

# Edição de dados - Editando imagem com FileReader

**Object.assign** = Copia o valor de atributos de um objeto, criando um objeto de destino e retorna esse objeto novo.

# Excluindo dados de um Objeto

**confirm(mensagem: string)** = Abre uma janela de confirmação com OK e CANCELAR

# Armazenando dados na sessão - Session Storage e Local Storage

**sessionStorage** = recurso da Api Web usado para armazenar dados na sessão do usuário. Os dados gravados são limpos ao expirar a sessão da página. A sessão da página dura enquanto o browser está aberto e se mantém no recarregamento da página

**localStorage** = funciona da mesma forma que sessionStorage, porém os dados armazenados não expiram a não ser que limpe o cache, ou ir em Application e limpar manualmente ou redefinindo as configurações do navegador;

**sessionStorage.setItem(chave: string, valor: string)** = permite gravar dados na sessão. Se o browser fechar, os dados deixam de existir.

**sessionStorage.getItem(chave: string)** = permite recuperar o valor da chave da sessão.

**sessionStorage.removeItem(chave: string)/localStorage.removeItem(chave: string)** = remove a chave definida no parametro e seu valor completamente.