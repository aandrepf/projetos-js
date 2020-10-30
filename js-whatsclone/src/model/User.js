import { Firebase } from './../util/Firebase';
import { Model } from './Model';

export class User extends Model {

    constructor(id) {
        super();

        if(id) this.getById(id);
    }

    get name() { return this._data.name; }
    set name(value) {  this._data.name = value; }

    get email() { return this._data.email; }
    set email(value) {  this._data.email = value; }

    get photo() { return this._data.photo; }
    set photo(value) {  this._data.photo = value; }

    get chatId() { return this._data.chatId; }
    set chatId(value) {  this._data.chatId = value; }

    getById(id) {
        return new Promise((s, f) => {
            User.findByEmail(id).onSnapshot(doc => { // onSnapshot fica escutando alterações
                this.fromJSON(doc.data());
                s(doc);
            });
        });
    }

    /** Salva os dados do usuário no Firebase */
    save() {
        return User.findByEmail(this.email).set(this.toJSON());
    }

    /** Adiciona um contato para o usuário 
        @contact informações do contato para salvar
    */
    addContact(contact) {
        return User.getContactsRef(this.email).doc(btoa(contact.email)).set(contact.toJSON()); 
    }
    
    /** Método que retorna a lista de contatos do usuário
        @filter por padrão vem vazio, mas pode vir com algum nome de usuário 
    */
    getContacts(filter = '') {
        return new Promise((s, f) => {
            User.getContactsRef(this.email).where('name', '>=', filter).onSnapshot(docs => {
                let contacts = [];
                docs.forEach(doc => {
                    let data = doc.data();
                    data.id = doc.id;
                    contacts.push(data);
                });
                this.trigger('contactschange', docs);
                s(contacts);
            })
        })
    }

    /** Método que retora a referencia a coleção de usuarios */
    static getRef() {
        return Firebase.db().collection('/users');
    }

    /** Pega a referencia dos contatos através do id do usuário 
        @id identificação do usuário
    */
    static getContactsRef(id) {
        return User.getRef().doc(id).collection('contacts');
    }

    /** Metodo que que pega a Referencia da coleção através de um id especificado */
    static findByEmail(email) { // email no caso será o email funcionando como um id    
        return User.getRef().doc(email);
    }
}