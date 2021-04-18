# Projeto Restaurante com Painel Admin

Projeto desenvolvimento de um site de restaurante com painel admin em tempo real - Projeto de curso de JS Avançado.

## Recursos Usados

Lista de recursos usados em aula para este projeto

| Recurso | Link |
| ------ | ------ |
| Express Generator | https://expressjs.com/pt-br/starter/generator.html |
| MySQL | https://downloads.mysql.com/archives/installer/ |
| mysql2 | https://www.npmjs.com/package/mysql2/v/1.6.1 |
| EJS | https://ejs.co/ |
| Express Session | https://www.npmjs.com/package/express-session |
| Connect Redis | https://www.npmjs.com/package/connect-redis |
| Formidable | https://www.npmjs.com/package/formidable |
| Moment.js | https://momentjs.com/ |
| Chart.js | https://www.chartjs.org |
| Socket.io | https://socket.io

## Criando a estrutura do projeto

Para criar a estrutura básica do projeto instalaremos globalmente o **express generator** que é uma ferramenta geradora de aplicativos, onde ele cria uma estrutura básica da aplicação.

```node
npm install express-generator -g
```

Após instalado no local onde o projeto será criado com toda sua estrutura, rodamos o comando abaixo

```node
express --ejs <nome-projeto>
```

Depois de criado tudo, dentro da pasta instalamos as dependências que se encontram no *package.json* do projeto

```node
npm install
```

E também as dependências do bower dendo da pasta do conteúdo do painel de admin com o **bower install**

Será definido também uma váriavel de ambiente para rodar a aplicação

```js
// No WINDOWS
set DEBUG=myapp:* "&" npm start

//No MACOS
DEBUG=myapp:* npm start
```

## Instalando e configurando o MySQL

Baixamos a versão 8.0.12 do MySQL configuramos a senha para root e adicionamos um usuário para o banco e depois de criado o Workbench logamos na instancia do banco de criamos o banco de dados do restaurante.

Importante configurar os privilégios de user para localhost, 127.0.0.1 e também poderemos ter um problema com o plugin do MySQL ao tentar se conectar via Node. Para isso no Workbench do MySQL executamos a seguinte query:

Com CTRL+ENTER rodamos a mesma query só alterando o host depois do @.

```mysql
ALTER USER 'user'@'%'IDENTIFIED WITH mysql_native_password BY 'password';
ALTER USER 'user'@'localhost'IDENTIFIED WITH mysql_native_password BY 'password';
ALTER USER 'user'@'127.0.0.1'IDENTIFIED WITH mysql_native_password BY 'password';
```

## Conectando NodeJS com MySQL

Primeiramente instalamos o mysql2

```node
npm install mysql2@1.6.1 --save
```

Criamos um arquivo **db.js** para criar a conexão com o banco de dados

```js
// @/inc/db.js
const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'user',
    password: 'password',
    database: 'saboroso',
    multipleStatements: true //permite fazer várias queries de banco através de um array de queries
});

module.exports = connection;

// @/routes/users.js
var conn = require('./../inc/db'); // fazemos um require para connection

router.get('/', function(req, res, next) {
  // fazemos uma query para selecionar todos os users da tabela
  conn.query("SELECT * FROM tb_users ORDER BY name", (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.send(results);
    }
  });
});
```

## Exibindo dados do BD com EJS (Embedded JavaScript) Templates do ExpressJS

**EJS** é uma linguagem para gerar HTML com Javascript. Todos os arquivos *.ejs* ficam na pasta **view** do projeto. Na pasta public tinhamos um index.html que era renderizado pelo express, mas ao deletar a rota irá buscar o index dentro da pasta view do projeto.

```html
<!-- @/views/index.ejs -->
<% menus.forEach(function(row) { %>
<div class="col-lg-4 col-md-4 col-sm-6">
    <a href="<%= row.photo %>" class="fh5co-card-item image-popup">
        <figure>
            <div class="overlay">
                <i class="ti-plus"></i>
            </div>
            <img src="<%= row.photo %>" alt="Image" class="img-responsive">
        </figure>
        <div class="fh5co-text">
            <h2><%= row.title %></h2>
            <p><%= row.description %></p>
            <p>
                <span class="price cursive-font"><%= row.price %></span>
            </p>
        </div>
    </a>
</div>
<% }); %>
```

## EJS Includes

Includes são relativos ao template que está sendo chamado. Por exemplo, se vc tem um arquivo './views/users.ejs' e './views/user/show.ejs' podemos usar

```html
<% include('user/show'); %>
```

Podemos também pode querer usar a tag de saida <%- com seu include para evitar duplicidade no HTML.

```html
<ul>
  <% users.forEach(function(user){ %>
    <%- include('user/show', {user: user}); %>
  <% }); %>
</ul>
```

## Express Sessions com Redis

NodeJs não trabalha com session. Já que o projeto está usando express, podemos instalar o express-session juntamente com o connect-redis. Porém essa lib não é recomendada para uso em produção. 

Temos o bando de dados **Redis**, ele é um Redis Store, armazeando dados via chave valor. Ele consegue trabalhar com arquivos ou memória do server.

Precisaremos instalar o repositório do redis compatível com Windows via link https://github.com/MicrosoftArchive/redis. Em releases baixamos o msi da versão 3.2.0. Depois de instalado tudo, fazemos nossa configuração

```js
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

app.use(session({
  store: new RedisStore({
    host: 'localhost',
    port: 6379
  }),
  secret: 'p@ssw0rd',
  resave: true, // se a sessão expirar ele cria uma nova sessão
  saveUninitialized: true // mesmo não usando a sessão mantém ela salva no banco de dados
}));
```

## Middeleware a nivel de roteador para validar sessão

O Express é uma estrutura de rotas e middlewares, onde ele nada mais é que uma série de chamadas de funções de middleware.

Os Middlewares tem acesso ao objeto de requisição (req) e resposta (res) e a próxima função de middleware no ciclo de solicitação-resposta do app. A proxima função de middleware é denotada por uma variável chamada **next**

```js
//@ admin.js
// middlewate de controle de rotas do admin
router.use(function(req, res, next) {
    var listRoutes = ['/login']; // lista de rotas para não serem verificadas

    if(listRoutes.indexOf(req.url) === -1 && !req.session.user) {
        res.redirect('/admin/login');
    } else {
        next();
    }
});
```

## Enviando novo menu com POST

Primeiramente configuraremos o Formidable na aplicação para tratar os dados vindos do formulário

```js
// middleware para trabalhar com dados de formulário com POST
app.use(function(req, res, next) {
  if (req.method === 'POST') {
    var form = formidable.IncomingForm({
      uploadDir: path.join(__dirname, '/public/images'),
      keepExtensions: true
    });
  
    form.parse(req, function(err, fields, files) {
      req.fields = fields;
      req.files = files;
  
      next();
    });
  } else {
    next();
  }
  
});
```

## Plugin para ler e exibir um arquivo de imagem

```js
// @js/pFileReader.js
class PluginFileReader {
  constructor(inputEl, imgEl) {
    this.inputEl = inputEl;
    this.imgEl = imgEl;

    this.initInputEvent();
  }

  initInputEvent() {
    document.querySelector(this.inputEl).addEventListener('change', e => {
      this.reader(e.target.files[0]).then(result => {
        document.querySelector(this.imgEl).src = result;
      });
    });
  }

  reader(file) {
    return new Promise((res, rej) => {
      let reader = new FileReader();
      reader.onload = function() {
        res(reader.result);
      }  
      reader.onerror = function() {
        rej('Não foi possível ler a imagem');
      }
      reader.readAsDataURL(file);
    });
  }
}

//@views/admin/menus.ejs
new PluginFileReader('#modal-create [type=file]', '#modal-create img');
new PluginFileReader('#modal-update [type=file]', '#modal-create img');
```

## Prototype para enviar form via Ajax

```js
HTMLFormElement.prototype.save = function(config) {
  let form = this;
  form.addEventListener('submit', e => {
    e.preventDefault();
    let formData = new FormData(form); // gerencia dados de formulário

    // passando dados via AJAX
    fetch(form.action, {
      method: form.method,
      body: formData
    })
    .then(response => response.json() )
    .then(json => {
      if (json.error) { 
        if (typeof config.failure === 'function') config.failure(json.error);    
      } else { 
        if (typeof config.success === 'function') config.success(json);
      }
    }).catch(err => {
        if (typeof config.failure === 'function') config.failure(err);
    });
  });
}
```

## Formatando datas com Moment.js e EJS

```js
// @routes/admin.js
var moment = require('moment');
moment.locale('pt-BR');

res.render('admin/reservations', admins.getAdminParams(req, { date: {}, reservas: data, moment })); // passando moment por parametro

// @views/admin/reservations.ejs
 <td><%= moment(row.date).format('DD [de] MMMM [de] YYYY') %></td> // usando moment no ejs
```

## Componente de Grid para tabela

```js
// @public/js/grid-component.js
class GridComponent {
  constructor(configs) {

    // listeners de eventos
    configs.listeners = Object.assign({
      afterUpdateClick: (e) => {
        $('#modal-update').modal('show');
      },
      afterDeleteClick: (e) => {
        window.location.reload();
      },
      afterFormCreate: (e) => {
        window.location.reload();
      },
      afterFormCreateError: (e) => {
        alert('Não foi possível enviar o formulário');
      },
      afterFormUpdate: (e) => {
        window.location.reload();
      },
      afterFormUpdateError: (e) => {
        alert('Não foi possível enviar o formulário');
      }
    }, config.listeners);
    
    // opções do componente
    this.options = Object.assign({}, {
      formCreate: '#modal-create form',
      formUpdate: '#modal-update form',
      btnUpdate: '.btn-update',
      btnDelete: '.btn-delete',
      onUpdateLoad: (form, name, data) => { /* ... */ }
    }, configs);

    this.rows = [...document.querySelectorAll('table tbody tr')];
    
    this.initForms();
    this.initButtons();
  }

  // método dos Forms de criar e update com seus eventos de salvar
  initForms() { /* ... */ }

  // método que insere os eventos de click de todos os botões de DELETE e UPDATE dos forms
  initButtons() { /* ... */ }

  // método que dispara o evento ao clicar no botão fazendo alguma coisa
  // de acordo com o listener nos configs
  fireEvent(eventName, args) { /* ... */ }

  // método que dispara o evento dos botões de update do painel admin
  btnUpdateClick(event) { /* ... */ }

  // método que dispara o evento dos botões de delete do painel admin
  btnDeleteClick(e) { /* ... */ }

  // retornar os dados que estam armazenados no dataset da TR da tabela
  getTrData(e) { /* ... */ }
}
```

```html
<!-- @views/admin/reservations.ejs -->
<script src="/js/grid-component.js"></script>

<script>
  // instanciando o componente e definindo suas configurações

  // @views/reservations.ejs e @views/menus.ejs
  new GridComponent({
    deleteUrl: '/admin/reservations/${data.id}',
    deleteMsg: 'Deseja realmente excluir a reserva do dia ${moment(data.date).format("DD/MM/YYYY")}?',
    onUpdateLoad: (form, name, data) => { /* ... */ }
  });

  // @views/users.ejs
  new GridComponent({
    deleteUrl: '/admin/users/${data.id}',
    deleteMsg: 'Deseja realmente excluir o usuário ${data.name}?',
    listeners: {
      buttonClick: (btn, data, e) => { /* ... */ }
    }
  });
</script>
```

## Paginação de dados para listagem de reservas

```js
// @inc/pagination.js
class Pagination {
  constructor(query, params = [], itensPerPage = 10) {
    this.query = query;
    this.params = params;
    this.itensPerPage = itensPerPage;
    this.currentPage = 1;
  }

  getPage(pagina) {
    this.currentPage = pagina - 1;
    this.params.push(
      this.currentPage * this.itensPerPage,
      this.itensPerPage
    )
    return new Promise((res, rej) => {
      conn.query([this.query, 'SELECT FOUND_ROWS() AS FOUND_ROWS'].join(';'), this.params, (err, results) => {
        if (err) { rej(err); } else { 
          this.data = results[0];
          this.total = results[1][0].FOUND_ROWS;
          this.totalPages = Math.ceil(this.total / this.itensPerPage);
          this.currentPage++;

          res(this.data); 
        }
      });
    });
  }

  getPageNavigation(params) {
    let limitPagesNav = 5;
    let links = [];
    let nrstart = 0;
    let nrend = 0;

    if (this.getTotalPages() < limitPagesNav) {
      limitPagesNav = this.getTotalPages();
    }

    // se estamos nas primeiras paginas
    if( ( this.getCurrentPage() - parseInt(limitPagesNav / 2) ) < 1) {
      nrstart = 1;
      nrend = limitPagesNav;
    } 
    // estamos chegando nas ultimas paginas
    else if ( ( this.getCurrentPage() + parseInt(limitPagesNav / 2) ) > this.getTotalPages() ) {
      nrstart = this.getTotalPages() - limitPagesNav;
      nrend = this.getTotalPages();
    }
    // estamos no meio da navegação
    else {
      nrstart = this.getCurrentPage() - parseInt(limitPagesNav / 2);
      nrend = this.getCurrentPage() + parseInt(limitPagesNav / 2);
    }

    if(this.getCurrentPage() > 1) {
      links.push({
        text: '«',
        href: '?' + this.getQueryString( Object.assign({}, params, {page: this.getCurrentPage() - 1 }) ),
      });
    }

    for (let x = nrstart; x <= nrend; x++) {
      links.push({
        text: x,
        href: '?' + this.getQueryString( Object.assign({}, params, {page: x}) ),
        active: (x === this.getCurrentPage())
      });
    }

    if(this.getCurrentPage() < this.getTotalPages()) {
      links.push({
        text: '»',
        href: '?' + this.getQueryString( Object.assign({}, params, { page: this.getCurrentPage() + 1 }) ),
      });
    }

    return links;
  }

  getQueryString(params) {
    let queryString = [];
    for(let name in params) {
      queryString.push(`${name}=${params[name]}`)
    }

    return queryString.join('&');
  }

  getTotal = () => this.total;
  getCurrentPage = () => this.currentPage;
  getTotalPages = () => this.totalPages;
}
```

```js
// @inc/reservations.js
getReservations(req) {
  return new Promise((res, rej) => {
    let page = req.query.page;
    let dtstart = req.query.start;
    let dtend = req.query.end;

    if(!page) page = 1;

    let params = [];
    if (dtstart && dtend) params.push(dtstart, dtend);

    let pag = new Pagination(
      `SELECT SQL_CALC_FOUND_ROWS * 
      FROM tb_reservations 
      ${(dtstart && dtend) ? 'WHERE date BETWEEN ? AND ?' : ''}
      ORDER BY name LIMIT ?, ?`,
      params
    );

    pag.getPage(page).then(data => {
      res({
        data,
        links: pag.getPageNavigation(req.query)
      })
    });
  });
},
```

```js
// @routes/admin.js
router.get('/reservations', function(req, res, next) {
  let start = (req.query.start) ? req.query.start : moment().subtract(1, 'year').format('YYYY-MM-DD');
  let end = (req.query.end) ? req.query.end : moment().format('YYYY-MM-DD');

  reservations.getReservations(req).then(pag => {
    res.render('admin/reservations', admins.getAdminParams(req, { 
      date: { start, end }, 
      reservas: pag.data, 
      moment,
      links: pag.links
    }));
  }).catch(err => res.send(err));
});
```

## Gráficos com Charts.js

```js
//@routes/admin
router.get('/reservations/chart', function(req, res, next) {
  req.query.start = (req.query.start) ? req.query.start : moment().subtract(1, 'year').format('YYYY-MM-DD');
  req.query.end = (req.query.end) ? req.query.end : moment().format('YYYY-MM-DD');

  reservations.chart(req).then(charData => {
    res.send(charData);
  });
});
```

```js
// @inc/reservations.js
chart(req) {
  return new Promise((res, rej) => {
    conn.query(`
      SELECT
          CONCAT(YEAR(date), '-', MONTH(date)) AS date,
          COUNT(*) AS total,
          SUM(people) / COUNT(*) as avg_people
      FROM saboroso.tb_reservations
      WHERE
          date BETWEEN ? AND ?
      GROUP BY YEAR(date) DESC, MONTH(date) DESC
      ORDER BY YEAR(date) DESC, MONTH(date) DESC;
    `, [req.query.start, req.query.end], (err, results) => {
      if (err) { rej(err) } else {
        let month = [];
        let values = [];

        results.forEach(row => {
            month.push(moment(row.date).format('MMM YYYY'));
            values.push(row.total);
        });

        res({
            month, values
        });
      }
    })
  });
}
```

```html
<!-- @views/admin/reservations.ejs -->
<div style="padding: 10px;">
  <canvas id="chart" style="height: 250px;"></canvas>
</div>

<!-- script para carregar o chart.js depois do script de momenj.js -->
<script src="/admin/bower_components/chart.js/dist/Chart.min.js"></script>

<script>
  // instanciando o gragico
  let grafico = new Chart(document.querySelector('#chart').getContext('2d'), {
    type: 'line',
    options: {
      tooltips: {
        mode: 'index',
        intersect: false
      },
      scales: {
        xAxes: [{ display: true, scaleLabel: { display: true, labelString: 'Mês' }}],
        yAxes: [{ display: true, scaleLabel: { display: true, labelString: 'Reservas' }}]
      }
    }
  });

  fetch(`/admin/reservations/chart${window.location.search}`)
  .then(response => response.json())
  .then(json => {
    // preenchendo o grafico com dados do banco
    grafico.data = {
      labels: json.month,
      datasets: [{
        data: json.values,
        label: 'Reservas',
        backgroundColor: 'rgb(54, 162, 235)',
        borderColor: 'rgb(54,162,235)',
        fill: true, // preenchimento da linha
        pointBackgroundColor: '#FFF'
      }]
    };

    grafico.update(); // obrigamos a atualizar as informações do gráfico
  });
</script>
```

## Trabalhando em tempo real com Socket.io
Em WebSocket trabalhamos com o conceito de statefull e stateless. A diferença entre **stateful** e **stateless** é que uma vai guardar o estado dos objetos (stateful) e o outro vai reconhecer cada requisição como uma requisição nova (stateless).

### Stateless: 
- nenhum registro de todas as interações são salvos.
- cada interação é tratada com base nas infos disponíveis para a interação
- vantagens: [Reduz o uso de memória do server, reduz problemas de sessão expirada]
- desvantagens: [mais dificil de manter a interação do usuario e criar uma app web sem emenda, pode exigir infos extras a serem enviadas para o cliente]

exemplo: IPs, Protocolo de transmissão de Hyper Text.

### Stateful (oposto de stateless)
- mantém o controle do estado de interação
- permite que os dados sejam mantidos entre diferentes requisições
- vantagens: [mantem o controle do usuario durante toda execução da app, mais intuitivo em que dados de entidade se mantem no server entre requisições, pode melhorar o desempenho quando a recuperação de dados é necessária apenas uma vez]
- desvantagens: [requer memória alocada para armazenar os dados, pode levar uma diminuição do desempenho se o armazenamento de sessão não é mantido de forma eficiente]

exemplo: Java HttpSession, ASP.Net Session

o Socket.io é uma ferramenta retrocompatível, onde mesmo browser que não suportam conexoes socket eles tentaram fazer a conexão de outras formas.

Para configurar no Express@4.16.1:

```js
// @app.js
var http = require('http'); // necessita acessar o http
var socket = require('socket.io');

var http = http.Server(app);
var io = socket(http);

io.on('connection', function(socket) {
  console.log('novo usuario conectado');
  // com o 'io' voce avisa a todos os usuário que estiverem conectados no websocket
  // se usar o parametro 'socket' avisa apenas ao usuário que acabou de se conectar e não todos os usuário
  // restringindo o escopo de envio
  /* io.emit('reservations update', {
    date: new Date()
  }); */
});

// passamos o io para serem usadas nas rotas da aplicação
var indexRouter = require('./routes/index')(io);
var adminRouter = require('./routes/admin')(io);

// no final do arquivo removemos o module.exports e adicionamos a conexao via http
http.listen(3000, function() {
  console.log('server em execução...');
});
```

Para saber se etá funcionando digite o hosto do projeto seguido de */socket.io/socket.io.js* que é um arquivo que não existe fisicamente, mas o socket.io cria. Se aparecer o script significa que o mesmo está funcionando.

```js
// @routes/admin.js
module.exports = function(io) { 
  /* 
    * passamos todas as rotas para dentro da função 
    * para assim as rotas que forem usar o 'io' possam chamar o método abaixo
    * depois de receber o success da requisição e atualizar as infos do dashboard
    * via edição, criação ou exclusão de algum dado via painel de admin
  */ 
 io.emit('dashboard update');
}

// @routes/index.js
module.exports = function(io) { 
  /* 
    * passamos todas as rotas para dentro da função 
    * para assim as rotas que forem usar o 'io' possam chamar o método abaixo
    * depois de receber o success da requisição e atualizar as infos do dashboard
    * através de algum cadastro no site
  */ 
 io.emit('dashboard update');
}
```

```html
<!-- @views/admin/index.ejs -->
<script src="/socket.io/socket.io.js"></script>
<script>
  function refreshDashboard() {
    fetch('/admin/dashboard')
    .then(response => response.json())
    .then(json => {
      document.querySelector('#nrreservations').innerHTML = json.nrreservations;
      document.querySelector('#nrcontacts').innerHTML = json.nrcontacts;
      document.querySelector('#nrmenus').innerHTML = json.nrmenus;
      document.querySelector('#nrusers').innerHTML = json.nrusers;
    })
  }

  let socket = io();

  // recebemos as informações emitidas do servidor e atualizamos a informação em tempo real
  // no painel admin principal
  socket.on('dashboard update', function() {
    refreshDashboard();
  });
</script>
```