class CalcController {
  constructor(){
    this._locale = 'pt-BR';
    this._operation = [];
    this._lastOperator = '';
    this._lastNumber = '';
    this._audioOnOff = false;
    this._audio = new Audio('click.mp3');
    this._displayCalcEl = document.querySelector('#display');
    this._dateEl = document.querySelector('#data');
    this._timeEl = document.querySelector('#hora');
    this._currentDate;
    this.initialize();
    this.initButtonsEvents();
    this.initKeyBoardEvents();
  }

  initialize() {
    this.setDisplayDateTime();
    setInterval(()=>{
      this.setDisplayDateTime();
    }, 1000);
    this.setLastNumberOnDisplay();
    this.pasteFromClipboard();

    document.querySelectorAll('.btn-ac').forEach(btn => {
      btn.addEventListener('dblclick', e => {
        this.toggleAudio();
      });
    })
  }

  // ATIVA OU DESATIVA O AUDIO
  toggleAudio() {
    this._audioOnOff = !this._audioOnOff;
  }

  // MÉTODO QUE TOCA O AUDIO
  playAudio() {
    if(this._audioOnOff) {
      this._audio.currentTime = 0;
      this._audio.play();
    }
  }

  addEventListenerAll(element, events, fn) {
    events.split(' ').forEach(event => {
      element.addEventListener(event, fn, false);
    });
  }

  //ação do botão AC
  clearAll() {
    this._operation = [];
    this._lastNumber = '';
    this._lastOperator = '';
    // atualizar o display da calculadora
    this.setLastNumberOnDisplay();
  }

  // ação do botão CE
  cancelEntry() {
    this._operation.pop();
    // atualizar o display da calculadora
    this.setLastNumberOnDisplay();
  }

  getLastOperation() {
    return this._operation[this._operation.length-1];
  }

  setLastOperation(value) {
    this._operation[this._operation.length-1] = value;
  }

  isOperator(value) {
    return (['+', '-', '*', '%', '/'].indexOf(value) > -1);
  }

  pushOperation(value) {
    this._operation.push(value);

    if (this._operation.length > 3) {
      this.calc();
    }
  }

  getResult() {
    try {
      return eval(this._operation.join('')); // o eval faz a operação da expressão em string
    } catch (error) {
      setTimeout(() => {
        this.setError();  
      }, 1);
    }
  }

  calc() {
    let last = '';
    this._lastOperator = this.getLastItem(); // TRUE ou VAZIO retorna o último operador

    if(this._operation.length < 3) {
      let firstItem = this._operation[0];
      this._operation = [firstItem, this._lastOperator, this._lastNumber];
    }

    if(this._operation.length > 3) {
      last = this._operation.pop(); // quando vier um outro operador no array, remove esse ultimo e guarda na variavel
      this._lastNumber = this.getResult();
    } else if(this._operation.length === 3) {
      this._lastNumber = this.getLastItem(false); // FALSE retorna o ultimo numero
    }

    let result = this.getResult();

    if(last === '%') {
      result /= 100;
      this._operation = [result]; // quando se trata de porcentagem o calculo é feito uma unica vez, portando o last é descartado
    } else {
      this._operation = [result];
      if(last) this._operation.push(last);
    }

    // atualizar o display da calculadora
    this.setLastNumberOnDisplay();
  }

  // PEGA O ULTIMO ITEM DENTRO DO ARRAY SE FOR OPERADOR RETORNA o operador
  // SENÃO RETORNA O NUMERO
  getLastItem(isOperator = true) {
    let lastItem;
    for(let i = this._operation.length -1; i >= 0; i--) {
      if (this.isOperator(this._operation[i]) === isOperator) { // se for um operador
        lastItem = this._operation[i];
        break;
      }
    }

    if (!lastItem) {
      lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
    }

    return lastItem;
  }

  setLastNumberOnDisplay() {
    let lastNumber = this.getLastItem(false);
    if(!lastNumber) lastNumber = 0;
    this.displayCalc = lastNumber;
  }

  addOperation(value) {
    if (isNaN(this.getLastOperation())) {
        // quando for string
        if(this.isOperator(value)) {
          this.setLastOperation(value);
        } else {
          this.pushOperation(value);
          // atualizar o display da calculadora
          this.setLastNumberOnDisplay();
        }
    } else {
      if (this.isOperator(value)) {
        this.pushOperation(value);
      }else {
        // quando for numero
        let newValue = this.getLastOperation().toString() + value.toString();
        this.setLastOperation(newValue);

        // atualizar o display da calculadora
        this.setLastNumberOnDisplay();
      }
    }
  }

  setError() {
    this.displayCalc = 'ERROR';
  }

  // USADO PARA O BOTÃO PONTO
  addDot() {
    let lastOperation = this.getLastOperation();

    // verifica se o lastOperation é uma string e se ela ja contem um ponto
    if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

    if (this.isOperator(lastOperation) || !lastOperation) {
      this.pushOperation('0.');
    } else {
      this.setLastOperation(lastOperation.toString() + '.');
    }

    this.setLastNumberOnDisplay();
  }

  execBtn(value) {
    this.playAudio();
    switch(value) {
      case 'ac':
        this.clearAll();
      break;
      case 'ce':
        this.cancelEntry();
      break;
      case 'soma':
        this.addOperation('+');
      break;
      case 'subtracao':
        this.addOperation('-');
      break;
      case 'multiplicacao':
        this.addOperation('*');
      break;
      case 'divisao':
        this.addOperation('/');
      break;
      case 'porcento':
        this.addOperation('%');
      break;
      case 'igual':
        this.calc();
      break;
      case 'ponto':
        this.addDot();
      break;
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        this.addOperation(parseInt(value));
      break;
      default:
        this.setError();
      break;
    }
  }

  // EVENTO DE COPIAR
  copyToClipboard() {
    let input = document.createElement('input');
    input.value = this.displayCalc;
    document.body.appendChild(input);
    input.select();
    document.execCommand('Copy');
    input.remove();
  }

  // EVENTO DE COLAR
  pasteFromClipboard() {
    document.addEventListener('paste', e => {
      let text = e.clipboardData.getData('Text');
      this.displayCalc = parseFloat(text);
    });
  }

  // INICIA OS EVENTOS DE BOTÃO
  initButtonsEvents() {
    let buttons = document.querySelectorAll('#buttons > g, #parts > g');
    buttons.forEach((btn, index) =>{
      this.addEventListenerAll(btn, 'click drag', e=>{
        let textbtn = btn.className.baseVal.replace('btn-', '');
        this.execBtn(textbtn);
      });

      this.addEventListenerAll(btn, 'mouseover mouseup mousedown', e=>{
        btn.style.cursor = 'pointer';
      });
    });
  }

  // INICIA OS EVENTOS DE TECLADO
  initKeyBoardEvents() {
    document.addEventListener('keyup', e => {
      this.playAudio();
      switch(e.key) {
        case 'Escape':
          this.clearAll();
        break;
        case 'Backspace':
          this.cancelEntry();
        break;
        case '+':
        case '-':
        case '*':
        case '/':
        case '%':
          this.addOperation(e.key);
        break;
        case 'Enter':
        case '=':
          this.calc();
        break;
        case '.':
        case ',':
          this.addDot();
        break;
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          this.addOperation(parseInt(e.key));
        break;
        case 'c':
          if(e.ctrlKey) this.copyToClipboard();
          break;
      }
    });
  }

  setDisplayDateTime() {
    this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
  }

  get displayTime() {
    return this._timeEl.innerHTML;
  }

  set displayTime(value) {
    this._timeEl.innerHTML = value;
  }

  get displayDate() {
    return this._dateEl.innerHTML;
  }

  set displayDate(value) {
    this._dateEl.innerHTML = value;
  }

  get displayCalc() {
    return this._displayCalcEl.innerHTML;
  }

  set displayCalc(value) {
    if(value.toString().length > 10) {
      this.setError();
      return false;
    }
    this._displayCalcEl.innerHTML = value;
  }

  get currentDate() {
    return new Date();
  }

  set currentDate(date) {
    this._currentDate = date;
  }
}
