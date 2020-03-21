export class CameraController {

    constructor(videoEl) {
        this._videoEl = videoEl;

        const constraints = {
            video: true
        };

        navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            console.log(stream)
            /* this._videoEl.src = URL.createObjectURL(stream); // cria uma url a partir do retorno da Promise - stream
            this._videoEl.play(); // executa o vídeo */
            this._stream = stream;
            this._videoEl.srcObject = stream;
            this._videoEl.play();
        })
        .catch(error => {
            console.error(error);
        })
    }

    stop() {
        this._stream.getTracks().forEach(track => {
            track.stop();
        });
    }
}
