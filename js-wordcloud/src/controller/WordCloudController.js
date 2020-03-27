export class WordCloudController {
  constructor(words) {
    this._config = {}
    this._words = [];
    this._wordsDown = [];
    this._cloudEl;
    this._canvas;
    this._frame;
    this._wordContainer;
    this._canvasContext;
    this._startPoint = {};

    this.setCloudConfigurations();
    this.createWordCloudList(words);

    this.placeWords();
    // this.traceSpiral();
  }

  /** Inicia a construção dos elementos e canvas */
  init() {
    this.cloudEl = document.querySelector('#word-cloud');
    this.cloudEl.style.position = 'relative';
    this.cloudEl.style.fontFamily = this.config.font;

    this.canvas = document.createElement("canvas");
    this.canvas.width = this.cloudEl.offsetWidth;
    this.canvas.height = this.cloudEl.offsetHeight;

    this.canvasContext = this.canvas.getContext('2d');

    this.cloudEl.appendChild(this.canvas);

    this.startPoint = {
      x: this.cloudEl.offsetWidth / 4,
      y: this.cloudEl.offsetHeight / 4
    };
  }

  /** Define as configurações para montar a nuvem de palavras */
  setCloudConfigurations() {
    this.config = {
      trace: true,
      spiralResolution: 0.5, //Lower = melhor resolução
      spiralLimit: 360 * 5,
      lineHeight: 0.8,
      xWordPadding: 0,
      yWordPadding: 3,
      font: "Roboto"
    }

    this.init();
  }

  /** Cria o array ordenado por maior frequencia - do maior pro menor 
   @list o array de palavras
  */
  createWordCloudList(list) {
    this.words = list.map((word) => {
      return {
          word: word.Name,
          freq: Math.floor(word.Value / 10),
          color: word.Color
      }
    }).sort(function(a, b) {
      return -1 * (a.freq - b.freq);
    });
  }

  /** Cria uma div contendo a palavra para inserir dentro do canvas
   @word a palavra vinda do array
   @freq a frequencia da palavra
   */
  createWordObject(word, freq, color) {
    this.wordContainer = document.createElement("div");
    this.wordContainer.style.position = "absolute";
    this.wordContainer.style.fontSize = freq + "px";
    this.wordContainer.style.fontWeight = freq * 10;
    this.wordContainer.style.lineHeight = this.config.lineHeight;
    this.wordContainer.style.color = color;
    // this.wordContainer.style.transform = "translateX(-50%) translateY(-50%)";
    this.wordContainer.appendChild(document.createTextNode(word));

    return this.wordContainer;
  }

  /** Método que posiciona as palavras na nuvem */
  placeWords() {
    for (var i = 0; i < this.words.length; i += 1) {
      let word = this.createWordObject(this.words[i].word, this.words[i].freq, this.words[i].color);
      for (let j = 0; j < this.config.spiralLimit; j++) {
        // Se a função this.spiral retornar true, colocamos a palavra para baixo e podemos interromper o loop j
        if (this.spiral(j, (x, y) => {
            if (!this.intersect(word, this.startPoint.x + x, this.startPoint.y + y)) {
              this.placeWord(word, this.startPoint.x + x, this.startPoint.y + y);
              return true;
            }
        })) {
          break; // interrompe o loop
        }
      }
    }
  }

  /** criar a espiral */
  traceSpiral() {
    this.canvasContext.beginPath();
    if (this.config.trace) {
        this.frame = 1; 
        let animate = () => {
          this.spiral(this.frame, (x, y) => {
              this.trace(this.startPoint.x + x, this.startPoint.y + y);
          });

          this.frame += 1;

          if (this.frame < this.config.spiralLimit) {
              window.requestAnimationFrame(animate);
          }
      }

      animate();
    }
  }

  /** Coloca a palavra dentro da div de cloud 
   @word a palavra vinda do array
   @x posição horizontal da palavra na div
   @y posição vertical da palavra na div
  */
  placeWord(word, x, y) {
    this.cloudEl.appendChild(word);
    word.style.left = x - word.offsetWidth / 2 + "px";
    word.style.top = y - word.offsetHeight / 2 + "px";
    this.wordsDown.push(word.getBoundingClientRect());
  }

  /** Cria o retangulo
   @x define a coordenada x do canto superior esquerdo do retângulo 
   @y define a coordenada y do canto superior esquerdo do retângulo
  */
  trace(x, y) {
    //this.canvasContext.lineTo(x, y);
    //this.canvasContext.stroke();
    this.canvasContext.fillRect(x, y, 1, 1);
  }

  /** Método para fazer uma rotação 
   @i valor para montar a angulação da rotação
   @callback método que vai ser utilizado no momento da rotação
  */
  spiral(i, callback) {
    let angle = this.config.spiralResolution * i;
    let x = (1 + angle) * Math.cos(angle);
    let y = (1 + angle) * Math.sin(angle);
    return callback ? callback(x, y) : null;
  }

  /** Cria a animação em espiral 
   @frame valor do frame
  */
  animate() {
    this.spiral(this.frame, (x, y) => {
        this.trace(this.startPoint.x + x, this.startPoint.y + y);
    });
    this.frame += 1;
    if (this.frame < this.config.spiralLimit) {
        window.requestAnimationFrame(this.animate);
    }
  }

  intersect(word, x, y) {
    this.cloudEl.appendChild(word);    
    
    word.style.left = x - word.offsetWidth/2 + "px";
    word.style.top = y - word.offsetHeight/2 + "px";
    
    let currentWord = word.getBoundingClientRect();
    
    this.cloudEl.removeChild(word);
    
    for(let i = 0; i < this.wordsDown.length; i+=1){
        let comparisonWord = this.wordsDown[i];
        
        if(!(currentWord.right + this.config.xWordPadding < comparisonWord.left - this.config.xWordPadding ||
            currentWord.left - this.config.xWordPadding > comparisonWord.right + this.config.wXordPadding ||
            currentWord.bottom + this.config.yWordPadding < comparisonWord.top - this.config.yWordPadding ||
            currentWord.top - this.config.yWordPadding > comparisonWord.bottom + this.config.yWordPadding)){
          return true;
        }
    }
    return false;
  }

  // getter and setter of configurations
  set config(value) {
    this._config = value;
  }
  get config() {
    return this._config;
  }

  // getter and setter of word array
  set words(value) {
    this._words = value;
  }
  get words() {
    return this._words;
  }

  // getter and setter of wordsDown array
  set wordsDown(value) {
    this._words = value;
  }
  get wordsDown() {
    return this._wordsDown;
  }

  // getter and setter of start point
  set startPoint(value) {
    this._startPoint = value;
  }
  get startPoint() {
    return this._startPoint;
  }

  // getter and setter of canvasContext
  set canvasContext(value) {
    this._canvasContext = value;
  }
  get canvasContext() {
    return this._canvasContext;
  }

  // getter and setter of canvas
  set canvas(value) {
    this._canvas = value;
  }
  get canvas() {
    return this._canvas;
  }

  // getter and setter of canvas
  set cloudEl(value) {
    this._cloudEl = value;
  }
  get cloudEl() {
    return this._cloudEl;
  }

  // getter and setter of wordContainer
  set wordContainer(value) {
    this._wordContainer = value;
  }
  get wordContainer() {
    return this._wordContainer;
  }

  // getter and setter of frame
  set frame(value) {
    this._frame = value;
  }
  get frame() {
    return this._frame;
  }
}