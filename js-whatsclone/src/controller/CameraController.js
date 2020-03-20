class CameraController {

    constructor(videoEl) {
        this._videoEl = videoEl;

        navigator.mediaDevices.getUserMedia()
        .then(stream => {
            this._videoEl.src = URL.createObjectURL(stream); // cria uma url a partir do retorno da Promise - stream
            this._videoEl.play(); // executa o vídeo
        })
        .catch(error => {
            console.error(error);
        })
    }
}
