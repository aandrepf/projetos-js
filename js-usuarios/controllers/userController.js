class UserController{
    constructor(formIdCreate, formIdUpdate, tableId) {
        this.formEl = document.getElementById(formIdCreate); // atributo que pega o id do formulario
        this.formUpdateEl = document.getElementById(formIdUpdate); // atributo que pega o id do formulario de update
        this.tableEl = document.getElementById(tableId); // atributo que pega o id da tabela

        this.onSubmit(); // inicia o onSubmit
        this.onEdit() // inicial o evento de click para o botão CANCELAR do edit
        this.selectAll(); // adiciona os usuarios armazenados no sessionStorage
    }

    // ENVIA O FORMULÁRIO AO EDITAR OS DADOS
    onEdit() {
        document.querySelector('#box-user-update .btn-cancel').addEventListener('click', ()=>{
            this.showPanelCreate();
        });

        this.formUpdateEl.addEventListener('submit', e=>{
            e.preventDefault();

            let btn = this.formUpdateEl.querySelector('[type=submit]');
            btn.disabled = true;

            let values = this.getValues(this.formUpdateEl);

            let indexTr = this.formUpdateEl.dataset.trIndex;

            let tr = this.tableEl.rows[indexTr]; // INDICA A LINHA QUE QUEREMOS EDITAR
            
            let userOld = JSON.parse(tr.dataset.user);

            let result = Object.assign({}, userOld, values); // values substitui ou cria valores nas propriedades de userOld e userOld replica seus atributos no objeto vazio(alvo) criando um novo objeto

            this.getFoto(this.formUpdateEl).then(
                (content) => {
                    if(!values.photo) { 
                        result._photo = userOld._photo;
                    } else {
                        result._photo = content;
                    }

                    let user = new User();
                    user.loadFromJSON(result);
                    user.save();

                    this.getTr(user, tr);
                    
                    this.updateCount();

                    this.formUpdateEl.reset();

                    btn.disabled = false;

                    this.showPanelCreate();
                },
                (error) => {
                    console.error(error);
                }
            );
        });
    }

    // FAZ O ENVIO DO FORMULARIO AO CRIAR UM USUARIO NOVO
    onSubmit() {
        // com as arrow functions consguimos evitar problemas de escopo
        this.formEl.addEventListener('submit', event => {
            event.preventDefault();

            let btn = this.formEl.querySelector('[type=submit]');
            btn.disabled = true;

            let values = this.getValues(this.formEl);

            if(!values) {
                return false;
            }

            this.getFoto(this.formEl).then(
                (content) => {
                    values.photo = content; // para para o usuario o valor da imagem que foi feito o upload

                    values.save();

                    // aqui o this faz referência a classe devido ao uso das arrow functions
                    this.addLine(values);
                    
                    // reseta o formulário
                    this.formEl.reset();

                    btn.disabled = false;
                },
                (error) => {
                    console.error(error);
                }
            );
        });
    }

    /**
        MÉTODO QUE PEGA OS DADOS DO FORMULARIO E RETORNA UM NOVO USUARIO COM SEUS DADOS
        @param formEl = indica qual o formulário se quer pegar os valores 
    **/
    getValues(formEl) {
        let user = {};
        let isFormValid = true; // inicia como formulario VALIDO

        // NO ES5 usariamos - Array.prototype.forEach.call(this.formEl.elements, callback);
        // No ES6 com o operador spread
        [...formEl.elements].forEach(function(field){

            if(['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value){
                field.parentElement.classList.add('has-error');
                isFormValid = false;
            }

            if(field.name == 'gender') {
                if(field.checked) {
                    user[field.name] = field.value;
                }
            } else if(field.name === 'admin') {
                user[field.name] = field.checked;
            } else {
                user[field.name] = field.value;
            }
        });

        if(!isFormValid) {
            return false;
        }
    
        return new User(
            user.name,
            user.gender,
            user.birth,
            user.country,
            user.email,
            user.password,
            user.photo,
            user.admin
        );
    }

    /**
        PEGA O ARQUIVO QUE FOI FEITO UPLOAD E CONVERTE EM BASE64 VIA API FILEREADER
        @param formEl = formulario o qual está sendo usado o método 
    **/
    getFoto(formEl) {
        /**
         @param resolve = quando a promise ocorre com sucesso
         @param reject = quando a promisr da erro 
        **/
        return new Promise((resolve, reject) =>{
            let fileReader = new FileReader();

            let elements = [...formEl.elements].filter(item=>{
                if(item.name === 'photo') {
                    return item;
                }
            });

            let file = elements[0].files[0]; // informação sobre o arquivo que foi importado no upload

            fileReader.onload = ()=>{
                // quando a Promisse de certo e passa no parametro de resolve o resultado base64 do arquivo que foi feito upload;
                resolve(fileReader.result);
            };

            fileReader.onerror = (e)=>{
                reject(e);
            };

            if(file) {
                fileReader.readAsDataURL(file);
            } else {
                resolve('./dist/img/boxed-bg.jpg'); // colocar uma imagem em branco se não for feito upload da imagem
            }

            
        });
    }

    /**
       ADICIONA UMA LINHA NO CORPO DA TABELA COM O CADASTRO ENVIADO DO FORMULARIO
       @param dataUser = Parametro com os dados do usuario a ser passado para a tabela
    **/
    addLine(dataUser) {
        let tr = this.getTr(dataUser);

        this.tableEl.appendChild(tr);

        this.updateCount();
    }

    /**
       CRIA UMA LINHA (SE ELA NÃO EXISTIR) COM O CADASTRO ENVIADO DO FORMULARIO
       @param dataUser = Parametro com os dados do usuario a ser passado para a tabela
       @param tr = parametro não obrigatório, que contem a tr se ela ja foi criada. Caso contrário ela é null e não precisa passar no parametro da function
    **/
    getTr(dataUser, tr = null) { //a atribuição "=" indica que o valor padrão definido é opcional
        if(tr === null) tr = document.createElement('tr');

        tr.dataset.user = JSON.stringify(dataUser);

        tr.innerHTML = `
            <td><img src="${ dataUser.photo }" alt="User Image" class="img-circle img-sm"></td>
            <td>${ dataUser.name }</td>
            <td>${ dataUser.email }</td>
            <td>${ (dataUser.admin) ? 'Sim' : 'Não' }</td>
            <td>${ Utils.dateFormat(dataUser.register) }</td>
            <td>
            <button type="button" class="btn btn-primary btn-xs btn-flat btn-edit">Editar</button>
            <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
            </td>
        `;

        this.addEventsTr(tr);
        return tr;
    }

    // RETORNA TODOS OS USUARIOS ARMAZENADOS NA SESSIONSTORAGE/LOCALSTORAGE
    getUsersStorage() {
        let users = [];

        if(localStorage.getItem('users')) {
            users = JSON.parse(localStorage.getItem('users'));
        }

        return users;
    }

    // SELECIONA TODOS OS USUARIOS ARMAZENADOS NA SESSIONSTORAGE/LOCALSTORAGE E MONTA A TABELA NA PAGINA
    selectAll() {
        let users = this.getUsersStorage();

        users.forEach(dataUser=>{

            let user = new User();
            user.loadFromJSON(dataUser);

            this.addLine(user);
        });
    }

    // ATUALIZA A CONTAGEM DOS USUARIOS CADASTRADOS
    updateCount() {
        let numberUsers = 0;
        let numberAdmin = 0;

        [...this.tableEl.children].forEach(tr=>{
            numberUsers++;
            let user = JSON.parse(tr.dataset.user);
            if(user._admin) numberAdmin++;
        });

        document.querySelector('#number-user').innerHTML = numberUsers;
        document.querySelector("#number-user-admin").innerHTML = numberAdmin;
    }

    // MOSTRA O FORMULÁRIO DE CADASTRO DE USUARIO
    showPanelCreate() {
        document.querySelector('#box-user-create').style.display = 'block';
        document.querySelector('#box-user-update').style.display = 'none';
    }

    // MOSTRA O FORMULÁRIO DE UPDATE DOS DADOS DO USUARIO
    showPanelUpdate() {
        document.querySelector('#box-user-create').style.display = 'none';
        document.querySelector('#box-user-update').style.display = 'block';
    }

    // ADICIONA EVENTO NA TR
    addEventsTr(tr) {
        tr.querySelector('.btn-delete').addEventListener('click', e=>{
            if(confirm('Deseja realmente excluir?')) {
                tr.remove();
                this.updateCount();
            }
        });

        tr.querySelector('.btn-edit').addEventListener('click', e=>{
            let json = JSON.parse(tr.dataset.user);

            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;

            for(let name in json) {
                let field = this.formUpdateEl.querySelector('[name='+name.replace('_', '')+']');
                if(field) {
                    switch(field.type) {
                        case 'file':
                            continue; // se o campo for do tipo file avança pra o próximo
                        case 'radio':
                            field = this.formUpdateEl.querySelector('[name='+name.replace('_', '')+'][value='+json[name]+']');
                            field.checked = true;
                        break;
                        case 'checkbox':
                            field.checked = json[name];
                        break;
                        default:
                            field.value = json[name];

                    }
                }
            }

            this.formUpdateEl.querySelector('.photo').src = json._photo;

            this.showPanelUpdate();
        });
    }
}
