import * as firebase from 'firebase';
import * as firestore from 'firebase/firestore';

export class Firebase {
    constructor() {
        this._config = {
            apiKey: "AIzaSyDpVcPNLbUYBSJbrPUJ5pCZi1Sel1vYVSs",
            authDomain: "whatsapp-clone-6e183.firebaseapp.com",
            databaseURL: "https://whatsapp-clone-6e183.firebaseio.com",
            projectId: "whatsapp-clone-6e183",
            storageBucket: "gs://whatsapp-clone-6e183.appspot.com",
            messagingSenderId: "387939298084",
            appId: "1:387939298084:web:f063f8fa578fca7909a1b1"
        };

        this.init();
    }

    /** Inicializa o Firebase */
    init() {
        if(!window._initialized) { // definimos a variavel globalmente para que não seja diferente em mais de uma instancia
            firebase.initializeApp(this._config); // config que foi gerado no momento de criaçao do banco
            window._initialized = true;
        }
    }

    /** Autentica o usuário via login de uma conta no Google */
    initAuth() {
        return new Promise((s, f) => {
            let provider = new firebase.auth.GoogleAuthProvider(); // autenticação via login do Google
            firebase.auth().signInWithPopup(provider).then(
               (result) => {
                   let token = result.credential.accessToken;
                   let user = result.user;
                   s({
                       user,
                       token
                    });
               } 
            ).catch(err => f(err))
        })
    }

    /** Retorna o banco de dados do Firestore */
    static db() {
        return firebase.firestore();
    }

    /** Retorna o Storage de Armazenamento do Firebase */
    static hd() {
        return firebase.storage();
    }
}