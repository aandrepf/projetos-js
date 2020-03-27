import { Firebase } from './../util/Firebase';
import { ClassEvent } from './../util/ClassEvent';

export class User extends ClassEvent {
    /** Método que retora a referencia a coleção de usuarios */
    static getRef() {
        return Firebase.db().collection('/users');
    }

    /** Metodo que que pega a Referencia da coleção através de um id especificado */
    static findByEmail(email) { // email no caso será o email funcionando como um id    
        return User.getRef().doc();
    }
}