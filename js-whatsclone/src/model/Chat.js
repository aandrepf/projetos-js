import { Model } from "./Model";
import { Firebase } from './../util/Firebase'

export class Chat extends Model {
    constructor() {
        super();
    }

    get users() { return this._data.users; }
    set users(value) { this._data.users = value; }

    get timeStamp() { return this._data.timeStamp; }
    set timeStamp(value) { this._data.timeStamp = value; }

    /** Pega a referencia no Firebase Database de chats */
    static getRef() {
        return Firebase.db().collection('/chats');
    }

    /** Cria um chat entre o usuario e o contato pelos respectivos emails
     @meEmail email do usuario
     @contactEmail email do contato
    */
    static create(meEmail, contactEmail) {
        return new Promise((s, f) => {
            let users = {};
            users[btoa(meEmail)] = true;
            users[btoa(contactEmail)] = true;
            
            Chat.getRef().add({
                users,
                timeStamp: new Date()
            }).then(doc => {
                Chat.getRef().doc(doc.id).get().then(chat => {
                    s(chat);
                }).catch(err => f(err));
            }).catch(err => f(err));
        })
    }

    /** Procura chats existentes entre o usuario e o contato pelos respectivos emails
     @meEmail email do usuario
     @contactEmail email do contato
    */
    static find(meEmail, contactEmail) {
        return Chat.getRef()
                .where(btoa(meEmail), '==', true)
                .where(btoa(contactEmail), '==', true)
                .get();
    }

    /** Método que cria ou retorna um chat existente entre usuario e contato
     @meEmail email do usuario
     @contactEmail email do contato
    */
    static createIfNotExists(meEmail, contactEmail) {
        return new Promise((s, f) => {
            Chat.find(meEmail, contactEmail).then(chats => {
                if(chats.empty){
                    Chat.create(meEmail, contactEmail).then(chat => {
                        s(chat);
                    });
                } else {
                    chats.forEach(chat => {
                        s(chat);
                    })
                }
            })
        }).catch(err => f(err));
    }
}