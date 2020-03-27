import { CameraController } from './CameraController';
import { MicrophoneController } from './MicrophoneController';
import { DocumentPreviewController } from './DocumentPreviewController';
import { Format } from './../util/Format';
import { Firebase } from './../util/Firebase';
import { User } from '../model/User';

export class WhatsAppController {
    constructor() {
        console.log('WhatsAppController OK');

        this._firebase = new Firebase();
        this.initAuth();
        this.elementsPrototype();
        this.loadElements();
        this.initEvents();
        
    }

    /** Autentica o usuario e abre a janela de conversa do whatsapp web */
    initAuth() {
        this._firebase.initAuth().then(response => {
            console.log('res', response);
            this._user = new User(); // criamos um novo usuario

            let userRef = User.findByEmail(response.user.email); // o email será a referencia do documento da coleção
            
            userRef.set({ // definimos os dados que serão inseridos no documento
                name: response.user.displayName,
                email: response.user.email,
                photo: response.user.photoURL 
            }).then(() => {
                this.el.appContent.css({
                    display: 'flex'
                });
            })            
        }).catch(err => {
            console.log(err);
        });
    }

    /**
        Cria as propriedades do controller do Whatsapp onde todos os elementos com id ficam acessíveis como Objeto
    **/ 
    loadElements() {
        this.el = {};
        document.querySelectorAll('[id]').forEach(element=>{
            this.el[Format.getCamelCase(element.id)] = element;
        });
    }

    /**
        Método que modifica o objeto nativo Element do JS, via prototype, criando alguns métodos uteis para uso 
    **/
    elementsPrototype() {
        Element.prototype.hide = function(){
            this.style.display = 'none';
            return this;
        }
        Element.prototype.show = function(){
            this.style.display = 'block';
            return this;
        }
        Element.prototype.toggle = function(){
            this.style.display = (this.style.display === 'none') ? 'block' : 'none';
            return this;
        }
        Element.prototype.on = function(events, fn){
            events.split(' ').forEach(event=>{
                this.addEventListener(event, fn);
            });
            return this;
        }
        Element.prototype.css = function(styles){
            for(let name in styles) {
                this.style[name] = styles[name];
            }
            return this;
        }
        Element.prototype.addClass = function(name){
            this.classList.add(name);
            return this;
        }
        Element.prototype.removeClass = function(name){
            this.classList.remove(name);
            return this;
        }
        Element.prototype.toggleClass = function(name){
            this.classList.toggle(name);
            return this;
        }
        Element.prototype.hasClass = function(name){
            return this.classList.contains(name);
        }
        HTMLFormElement.prototype.getForm = function() {
            return new FormData(this);
        }
        HTMLFormElement.prototype.toJSON = function() {
            let json = {}
            this.getForm().forEach((value, key) => {
                json[key] = value;
            });
            return json;
        }
    }

    /**
        Método que inicia os eventos acionados nos elementos
    **/
    initEvents() {
        // evento ao clicar no icone da foto do perfil principal
        this.el.myPhoto.on('click', e=>{
            this.closeAllLeftPanel();
            this.el.panelEditProfile.show();

            // adiciona a classe 300ms depois por conta do css transition que tem 300ms de delay
            setTimeout(()=> {
                this.el.panelEditProfile.addClass('open');
            }, 300);
        });

        // evento ocorre ao clicar no icone de novo contato
        this.el.btnNewContact.on('click', e=>{
            this.closeAllLeftPanel();
            this.el.panelAddContact.show();

            // adiciona a classe 300ms depois por conta do css transition que tem 300ms de delay
            setTimeout(()=> {
                this.el.panelAddContact.addClass('open');
            }, 300);
        });

        // evento ocorre ao clicar na setinha de voltar do painel de Editar Perfil
        this.el.btnClosePanelEditProfile.on('click', e=>{
            this.el.panelEditProfile.removeClass('open');
        });

        // evento ocorre ao clicar na setinha de voltar do painel de Novo Contato
        this.el.btnClosePanelAddContact.on('click', e=>{
            this.el.panelAddContact.removeClass('open');
        });

        // evento ao clicar na foto do perfil para editar a foto
        this.el.photoContainerEditProfile.on('click', e=>{
            this.el.inputProfilePhoto.click();
        });

        // ao dar enter no campo de editar o nome do perfil
        this.el.inputNamePanelEditProfile.on('keypress', e=>{
            if(e.key === 'Enter') {
                e.preventDefault();
                this.el.btnSavePanelEditProfile.click();
            }
        });

        // ao clicar no check do campo do nome do perfil pega o valor digitado no campo
        this.el.btnSavePanelEditProfile.on('click', e=>{
            console.log(this.el.inputNamePanelEditProfile.innerHTML);
        });

        // ao enviar o formulário de adicionar contato
        this.el.formPanelAddContact.on('submit', e=>{
            e.preventDefault();
            let formData = new FormData(this.el.formPanelAddContact);
        });

        //traz a lista de contatos e ao clicar no contato mostra o painel de mensagens
        this.el.contactsMessagesList.querySelectorAll('.contact-item').forEach((item) => {
            item.on('click', e=>{
                this.el.home.hide();
                this.el.main.css({
                    'display': 'flex'
                });
            });
        });
        
        // ao clicar no 'clipezinho' de anexar alguma coisa na mensagem
        this.el.btnAttach.on('click', e=>{
            e.stopPropagation(); // evita que ele propage eventos para seus ancestrais
            this.el.menuAttach.addClass('open');
            document.addEventListener('click', this.closeMenuAttach.bind(this)); // bind permite que ele junte escopos
            // aqui nesse caso com o bind estamos adicionando o escopo do btnAttach ao clicar no document para que a função execute dentro do escopo
            // de btnAttach
        });

        /* ---- TIRAR E ENVIAR FOTO PELA CAMERA ---- */ 
        this.el.btnAttachCamera.on('click', e=>{
            this.closeAllMainPanel();
            this.el.panelCamera.addClass('open');
            this.el.panelCamera.css({
                'height':'calc(100% - 0px)'
            });

            // para para o controler qual elemento irá carregar a camera
            this._camera = new CameraController(this.el.videoCamera); 
        });

        this.el.btnClosePanelCamera.on('click', e=> {
            this.closeAllMainPanel();
            this.el.panelMessagesContainer.show();
            this._camera.stop();
        });

        this.el.btnTakePicture.on('click', e=>{
            let dataURL = this._camera.tackPicture();

            this.el.pictureCamera.src = dataURL;
            this.el.pictureCamera.show();
            this.el.videoCamera.hide();
            this.el.btnReshootPanelCamera.show();
            this.el.containerTakePicture.hide();
            this.el.containerSendPicture.show();
        });

        this.el.btnReshootPanelCamera.on('click', e=> {
            this.el.pictureCamera.hide();
            this.el.videoCamera.show();
            this.el.btnReshootPanelCamera.hide();
            this.el.containerTakePicture.show();
            this.el.containerSendPicture.hide();
        });

        this.el.btnSendPicture.on('click', e=>{
            console.log(this.el.pictureCamera.src)
        });
        /* ---- end TIRAR E ENVIAR FOTO PELA CAMERA ---- */
        
        /* ---- ENVIAR UMA FOTO NA MENSAGEM ---- */
        this.el.btnAttachPhoto.on('click', e=>{
            this.el.inputPhoto.click();
        });

        this.el.inputPhoto.on('change', e=>{
            [...this.el.inputPhoto.files].forEach(file => {
                console.log(file);
            })
        });
        /* ---- end ENVIAR UMA FOTO NA MENSAGEM ---- */

        /* ---- PREVIEW E ANEXAR DOCUMENTO ---- */
        this.el.btnAttachDocument.on('click', e=>{
            this.closeAllMainPanel();
            this.el.panelDocumentPreview.addClass('open');
            this.el.panelDocumentPreview.css({
                'height':'calc(100% - 0px)'
            });

            this.el.inputDocument.click();
        });

        this.el.inputDocument.on('change', e=>{
            if(this.el.inputDocument.files.length) {
                this.el.panelDocumentPreview.css({
                    'height':'1%'
                });

                let file = this.el.inputDocument.files[0];

                this._documentPreviewController = new DocumentPreviewController(file);

                this._documentPreviewController.getPreviewData().then(data => {

                    this.el.imgPanelDocumentPreview.src = data.src;
                    this.el.infoPanelDocumentPreview.innerHTML = data.info;
                    this.el.imagePanelDocumentPreview.show();
                    this.el.filePanelDocumentPreview.hide();

                    this.el.panelDocumentPreview.css({
                        'height':'calc(100% - 0px)'
                    });

                }).catch(err => {
                    this.el.panelDocumentPreview.css({
                        'height':'calc(100% - 0px)'
                    });

                    switch (file.type) {
                       case 'application/vnd.ms-excel':
                       case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                        this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-xls';
                       break;
                       case 'application/vnd.ms-powerpoint':
                       case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                        this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-ppt';
                       break;
                       case 'application/msword':
                       case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                        this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-doc';
                       break;
                       default:
                        this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-generic';
                    }

                    this.el.filenamePanelDocumentPreview.innerHTML = file.name;
                    this.el.imagePanelDocumentPreview.hide();
                    this.el.filePanelDocumentPreview.show();
                 })
            }
        });

        this.el.btnClosePanelDocumentPreview.on('click', e=>{
            this.closeAllMainPanel();
            this.el.imagePanelDocumentPreview.hide();
            this.el.panelMessagesContainer.show();
        });

        this.el.btnSendDocument.on('click', e=>{
            console.log('send document');
        });
        /* ---- end PREVIEW E ANEXAR DOCUMENTO ---- */

        /* ---- ADICIONAR ENVIAR CONTATO NA MENSAGEM ---- */
        this.el.btnAttachContact.on('click', e=>{
            this.el.modalContacts.show();
        });

        this.el.btnCloseModalContacts.on('click', e=>{
            this.el.modalContacts.hide();
        });
        /* ---- end ADICIONAR ENVIAR CONTATO NA MENSAGEM ---- */

        /* ---- ENVIAR AUDIO E EMOJI NA MENSAGEM ---- */
        this.el.btnSendMicrophone.on('click', e=>{
            this.el.recordMicrophone.show();
            this.el.btnSendMicrophone.hide();

            this._microphoneController = new MicrophoneController();

            this._microphoneController.on('ready', audio => {
                console.log('event ready');
                this._microphoneController.startRecorder();
            });

            this._microphoneController.on('recordtimer', timer => {
                this.el.recordMicrophoneTimer.innerHTML = Format.toTime(timer);
            });
        });

        this.el.btnCancelMicrophone.on('click', e=>{
            this._microphoneController.stopRecorder();
            this.closeRecordMicrophone();
        });

        this.el.btnFinishMicrophone.on('click', e=>{
            this._microphoneController.stopRecorder();
            this.closeRecordMicrophone();
        });

        this.el.inputText.on('keypress', e=> {
            if(e.key === 'Enter' && !e.ctrlKey) {
                e.preventDefault();
                this.el.btnSend.click();
            }
        });

        this.el.inputText.on('keyup', e=>{
            if(this.el.inputText.innerHTML.length) {
                this.el.inputPlaceholder.hide();
                this.el.btnSendMicrophone.hide();
                this.el.btnSend.show();
            } else {
                this.el.inputPlaceholder.show();
                this.el.btnSendMicrophone.show();
                this.el.btnSend.hide();
            }
        });

        this.el.btnSend.on('click', e=> {
            console.log(this.el.inputText.innerHTML)
        });

        this.el.btnEmojis.on('click', e=>{
            this.el.panelEmojis.toggleClass('open');
        });

        this.el.panelEmojis.querySelectorAll('.emojik').forEach(emoji => {
            emoji.on('click', e=>{
                console.log(emoji.dataset.unicode)
                let img = this.el.imgEmojiDefault.cloneNode();
                img.style.cssText = emoji.style.cssText // o elemento clonado recebe as mesmas propriedades css do original
                img.dataset.unicode = emoji.dataset.unicode; // recebe o mesmo unicode do dataset original
                img.alt = emoji.dataset.unicode;

                emoji.classList.forEach(nome => {
                    img.classList.add(nome); // adicionando todas as classes do original no clonado
                });

                // this.el.inputText.append(img);
                let cursor = window.getSelection();

                if(!cursor.focusNode || !cursor.focusNode.id === 'input-text') {
                    this.el.inputText.focus();
                    cursor = window.getSelection(); // pegamos a seleção de onde está selecionado
                }

                let range = document.createRange();
                
                range = cursor.getRangeAt(0); // pega o range do cursor no inicio dele
                range.deleteContents(); //remove o conteudo selecionado no range

                let frag = document.createDocumentFragment(); // criamos um fragmento de Documento
                frag.appendChild(img); // adiciona o clone do emoji no fragmento

                range.insertNode(frag); // insere o fragmento no lugar do range deletado
                range.setStartAfter(img); // move o cursor para depois do emoji adicionado

                this.el.inputText.dispatchEvent(new Event('keyup')); // forçamos no elemento um evento de keyup
            });
        });
        /* ---- end ENVIAR AUDIO E EMOJI NA MENSAGEM ---- */
    }

    /**
        Método que fecha a gravação do audio
    **/
    closeRecordMicrophone() {
        this.el.recordMicrophone.hide();
        this.el.btnSendMicrophone.show();
    }

    /**
        Método que fecha os paineis de attach e mostra o painel de mensagem
    **/
    closeAllMainPanel() {
        this.el.panelMessagesContainer.hide();
        this.el.panelCamera.removeClass('open');
        this.el.panelDocumentPreview.removeClass('open');
    }

    /**
        Método que fecha os paineis laterais esquerdo que estam abertos, que não sejam painel principal
    **/
    closeAllLeftPanel() {
        this.el.panelAddContact.hide();
        this.el.panelEditProfile.hide();
    }

    /** Método que fecha o menu do clipe que adiciona algo na mensagem  **/
    closeMenuAttach(e) {
        document.removeEventListener('click', this.closeMenuAttach);
        this.el.menuAttach.removeClass('open');
    }
}