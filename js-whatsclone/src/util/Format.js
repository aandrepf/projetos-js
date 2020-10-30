export class Format {
    /**
        Método que será utilizado para criar um objeto com as propriedades nomeadas a partir do atributo id do elemento HTML retornando o nome da propriedad em
        formato camelCase
        @elementId é o parametro que recebe o valor do atributo id do elemento HTML
    **/
    static getCamelCase(elementId) {
        let div = document.createElement('div');
        div.innerHTML = `<div data-${elementId}="id"></div>`;
        return Object.keys(div.firstChild.dataset)[0];
    }

    /**
        Método que será utilizado para formatar o tempo em milisegundos para padrão 00:00:00
        @duration é o parametro que recebe o valor do tempo em milisegundos
    **/
    static toTime(duration) {
        let seconds = parseInt((duration / 1000) % 60);
        let minutes = parseInt((duration / (1000 * 60)) % 60);
        let hours = parseInt((duration / (1000 * 60 * 60)) % 24);

        if(hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, 0)}:${seconds.toString().padStart(2, '0')}`;
        } else {
            return `${minutes.toString().padStart(2, 0)}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    /** Método que converte data para hora
        @date a data recebida
     */
    static dateToTime(date, locale = 'pt-BR') {
        return date.toLocaleTimeString(locale, {
            hour: '2-digit',
            minute: '2-digit'
        });

    }

    /** Método que converte modelo timeStamp do Firebase para padrão 00:00:00 
        @timestamp valor do timeStamp recebido do Firebase
    */
    static timeStampToTime(timestamp) {
        return (timestamp && typeof timestamp.toDate === 'function') ? Format.dateToTime(timestamp.toDate()) : '';
    }
}
