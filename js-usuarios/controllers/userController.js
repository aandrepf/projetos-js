class UserController{
    constructor(formId, tableId) {
        this.formEl = document.getElementById(formId); // atributo que pega o id do formulario
        this.tableEl = document.getElementById(tableId); // atributo que pega o id da tabela

        this.onSubmit(); // inicia o onSubmit
    }

    // FAZ O ENVIO DO FORMULARIO
    onSubmit() {
        // com as arrow functions consguimos evitar problemas de escopo
        document.getElementById('form-user-create').addEventListener('submit', event => {
            event.preventDefault();

            let values = this.getValues();

            let btn = this.formEl.querySelector('[type=submit]');
            btn.disabled = true;

            this.getFoto().then(
                (content) => {
                    values.photo = content; // para para o usuario o valor da imagem que foi feito o upload

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

    // MÉTODO QUE PEGA OS DADOS DO FORMULARIO E RETORNA UM NOVO USUARIO COM SEUS DADOS
    getValues() {
        let user = {};

        // NO ES5 usariamos - Array.prototype.forEach.call(this.formEl.elements, callback);
        // No ES6 com o operador spread
        [...this.formEl.elements].forEach(function(field){
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

    // PEGA O ARQUIVO QUE FOI FEITO UPLOAD E CONVERTE EM BASE64 VIA API FILEREADER
    getFoto() {
        /**
         @resolve = quando a promise ocorre com sucesso
         @reject = quando a promisr da erro 
        **/
        return new Promise((resolve, reject) =>{
            let fileReader = new FileReader();

            let elements = [...this.formEl.elements].filter(item=>{
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
       ADICIONA UMA LINHA NO CORPO DA TABELA
       @dataUser = Parametro com os dados do usuario a ser passado para a tabela
    **/
    addLine(dataUser) {
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${ dataUser.photo }" alt="User Image" class="img-circle img-sm"></td>
            <td>${ dataUser.name }</td>
            <td>${ dataUser.email }</td>
            <td>${ (dataUser.admin) ? 'Sim' : 'Não' }</td>
            <td>${ Utils.dateFormat(dataUser.register) }</td>
            <td>
            <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
            <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        `;
        this.tableEl.appendChild(tr);
    }
}
