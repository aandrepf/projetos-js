export class CameraController {

    constructor(videoEl) {
        this._videoEl = videoEl;

        const constraints = {
            video: true
        };

        navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
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

    /**
     Método que para todas as tracks de media ativas
     */
    stop() {
        this._stream.getTracks().forEach(track => {
            track.stop();
        });
    }

    tackPicture(mimeType = 'image/png') {
        let canvas = document.createElement('canvas');
        canvas.setAttribute('width', this._videoEl.videoWidth);
        canvas.setAttribute('height', this._videoEl.videoHeight);

        let ctx = canvas.getContext('2d');
        ctx.drawImage(this._videoEl, 0, 0, canvas.width, canvas.height);

        return canvas.toDataURL(mimeType);
    }
}
