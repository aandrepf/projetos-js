class CalcController {
  constructor(){
    this._locale = 'pt-BR';
    this._operation = [];
    this._lastOperator = '';
    this._lastNumber = '';
    this._displayCalcEl = document.querySelector('#display');
    this._dateEl = document.querySelector('#data');
    this._timeEl = document.querySelector('#hora');
    this._currentDate;
    this.initialize();
    this.initButtonsEvents();
  }

  initialize() {
    this.setDisplayDateTime();
    setInterval(()=>{
      this.setDisplayDateTime();
    }, 1000);
    this.setLastNumberOnDisplay();
  }

  addEventListenerAll(element, events, fn) {
    events.split(' ').forEach(event => {
      element.addEventListener(event, fn, false);
    });
  }

  //ação do botão AC
  clearAll() {
    this._operation = [];
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
    return eval(this._operation.join('')); // o eval faz a operação da expressão em string
  }

  calc() {
    let last = '';
    this._lastOperator = this.getLastItem(); // TRUE ou VAZIO retorna o ultimo operador

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
        } else if(isNaN(value)) {
          // outra coisa
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
        this.setLastOperation(parseInt(newValue));

        // atualizar o display da calculadora
        this.setLastNumberOnDisplay();
      }
    }
  }

  setError() {
    this.displayCalc = 'ERROR';
  }

  execBtn(value) {
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
        this.addOperation('.');
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
    this._displayCalcEl.innerHTML = value;
  }

  get currentDate() {
    return new Date();
  }

  set currentDate(date) {
    this._currentDate = date;
  }
}
