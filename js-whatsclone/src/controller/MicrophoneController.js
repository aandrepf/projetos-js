import { ClassEvent } from "../util/ClassEvent";

export class MicrophoneController extends ClassEvent {
    constructor() {
        super(); //chama o construtor de ClassEvent

        this._availble = false;
        this._mimeType = 'audio/webm';

        const constraints = {
            audio: true
        };

        navigator.mediaDevices.getUserMedia(constraints).then(stream => {
            this._availble = true;

            this._stream = stream;
            
            this.trigger('ready', this._stream);

        }).catch(err => {
            console.error(err);
        })
    }

    isAvailable() {
        return this._availble;
    }

    /**
     Método que para todas as tracks de media ativas
    */
    stop() {
        this._stream.getTracks().forEach(track => {
            track.stop();
        });
    }

    /**
    Método que inicia a gravação do audio 
    */
    startRecorder() {
        if(this.isAvailable()) {
            this._mediaRecorder = new MediaRecorder(this._stream, {
                mimeType: this._mimeType
            });

            this._recorderChunks = [];

            // quando existir algo que foi capturado pelo microfone
            this._mediaRecorder.addEventListener('dataavailable', e => {
                if(e.data.size > 0) this._recorderChunks.push(e.data);
            });

            // quando parar a gravação, gera um arquivo blob do tipo webm
            this._mediaRecorder.addEventListener('stop', e => {
                let blob = new Blob(this._recorderChunks, {
                    type: this._mimeType
                });

                let filename = `rec${Date.now()}.webm`;

                let audioContext = new AudioContext();
                let reader = new FileReader();

                reader.onload = e => {
                    audioContext.decodeAudioData(reader.result).then(decode => {
                        let file = new File([blob], filename, {
                            type: this._mimeType,
                            lastModified: Date.now()
                        });
                        this.trigger('recorded', file, decode);
                    });
                }

                reader.readAsArrayBuffer(blob);

                /* reader.onload = e => {
                    let audio = new Audio(reader.result);
                    audio.play();
                }
                reader.readAsDataURL(file); */
            });

            // inicia a gravação
            this._mediaRecorder.start();
            this.startTimer();
        }
    }

    /**
    Método que para a gravação do audio 
    */
    stopRecorder() {
        if(this.isAvailable()) {
            this._mediaRecorder.stop();
            this.stop();
            this.stopTimer();
        }
    }

    /** Método que inicia a contagem do tempo de gravação do microfone */
    startTimer() {
        let start = Date.now();
        this._recordMicrophone = setInterval(() => {
            this.trigger('recordtimer', (Date.now() - start));
        }, 100);
    }

    /** Método que termina a contagem do tempo de gravação do microfone */
    stopTimer() {
        clearInterval(this._recordMicrophone);
    }
}