class CalcController {
  constructor(){
    this._locale = 'pt-BR';
    this._operation = [];
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
  }

  addEventListenerAll(element, events, fn) {
    events.split(' ').forEach(event => {
      element.addEventListener(event, fn, false);
    });
  }

  clearAll() {
    this._operation = [];
  }

  cancelEntry() {
    this._operation.pop();
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

  addOperation(value) {

    if (isNaN(this.getLastOperation())) {
        // quando for string
        if(this.isOperator(value)) {
          this.setLastOperation(value);
        } else if(isNaN(value)) {
          console.log(value);
        } else {
          this._operation.push(value);
        }
    } else {
      // quando for numero
      let newValue = this.getLastOperation().toString() + value.toString();
      this.setLastOperation(parseInt(newValue));
    }

    console.log('Array operation', this._operation);
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
