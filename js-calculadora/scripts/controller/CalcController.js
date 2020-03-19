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

  /**
    Método que inicia alguns eventos, como mostrar a data e a hora no display da calculadora e mostrar o ultimo numero salvo
  **/
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

  /**
    Ativa ou desativa o áudio
  **/
  toggleAudio() {
    this._audioOnOff = !this._audioOnOff;
  }

  /**
    Toca o som do beep
  **/
  playAudio() {
    if(this._audioOnOff) {
      this._audio.currentTime = 0;
      this._audio.play();
    }
  }

  /**
    Método que atribui eventos para um elemento definido no parametro
    @param element elemento html
    @param events uma string com um ou mais eventos separados por espaço
    @param fn uma callback que irá ter alguma ação específica 
  **/
  addEventListenerAll(element, events, fn) {
    events.split(' ').forEach(event => {
      element.addEventListener(event, fn, false);
    });
  }

  /**
   Ação do botão AC (All Clear)
  */
  clearAll() {
    this._operation = [];
    this._lastNumber = '';
    this._lastOperator = '';
    // atualizar o display da calculadora
    this.setLastNumberOnDisplay();
  }

  /**
   Ação do botão CE (Cancel Entry)
  */
  cancelEntry() {
    this._operation.pop();
    // atualizar o display da calculadora
    this.setLastNumberOnDisplay();
  }

  /**
   Retorna a ultima operação feita na calculadora
  */
  getLastOperation() {
    return this._operation[this._operation.length-1];
  }

  /**
   Define qual será o ultimo valor da operação
   @value valor que será passado para a ultima operação
  */
  setLastOperation(value) {
    this._operation[this._operation.length-1] = value;
  }

  /**
   De acordo com o valor passado verifica se é um operador ou não
   @param value valor passado para a validação
  */
  isOperator(value) {
    return (['+', '-', '*', '%', '/'].indexOf(value) > -1);
  }

  /**
   Adiciona na lista da operação o valor passado, se o length do array for maior que 3 ele executa a operação
   @param value valor passado para a operação
  */
  pushOperation(value) {
    this._operation.push(value);

    if (this._operation.length > 3) {
      this.calc();
    }
  }

  /**
   Retorna o resultado da operação. Caso falhe, retorna uma mensagem de ERROR na tela
  */
  getResult() {
    try {
      return eval(this._operation.join('')); // o eval faz a operação da expressão em string
    } catch (error) {
      setTimeout(() => {
        this.setError();  
      }, 1);
    }
  }

  /**
   Método que faz o calculo da operação, obedecendo algumas regras, caso porcentagem, ou se o ultimo valor é um operador ou não
  */
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

  /**
   Pega o ultimo item dentro do array de operação. Se for um operador retorna o mesmo, senão retorna o número
   @param isOperator booleano que por padrão é definido como true (ou seja é um operador por padrão) retornando um operador. Caso false, retorna é um número
  */
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

  /**
   Mostra na tela o ultimo número. Se o mesmo não exisir ele é 0
  */
  setLastNumberOnDisplay() {
    let lastNumber = this.getLastItem(false);
    if(!lastNumber) lastNumber = 0;
    this.displayCalc = lastNumber;
  }

  /**
   Método que adiciona um número ou um operador
   @param value valor passado podendo ser um número ou um operador
  */ 
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

  /**
   Mostra no display da calculadora a mensagem 'ERROR'
  */
  setError() {
    this.displayCalc = 'ERROR';
  }

  /**
   Métoddo que verifica a ultima operação e verifica se ela contem o ponto do decimal. Caso não existe adiciona o ponto
  */
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

  /**
   Métdo que atribui uma ação para cada botão da calculadora
   @param value é o valor que define qual o tipo de botão está sendo pressionado
  */
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

  /**
   Método que executa o CTRL+C 
  */
  copyToClipboard() {
    let input = document.createElement('input');
    input.value = this.displayCalc;
    document.body.appendChild(input);
    input.select();
    document.execCommand('Copy');
    input.remove();
  }

  /**
   Método que executa o CTRL+V 
  */
  pasteFromClipboard() {
    document.addEventListener('paste', e => {
      let text = e.clipboardData.getData('Text');
      this.displayCalc = parseFloat(text);
    });
  }

  /**
   Método que inicializa os eventos dos botoes da calculadora 
  */
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

  /**
   Método que inicializa e define uma ação de acordo com o que foi pressionado no teclado
  */
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

  /**
   Mostra no display da calculadora a dara e a hora da região (no caso pt-BR)
  */
  setDisplayDateTime() {
    this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
  }

  /**
   getter que retorna o valor da hora do display
  */
  get displayTime() {
    return this._timeEl.innerHTML;
  }

  /**
   setter que define o valor da hora do display
   @param value valor passado a propriedade
  */
  set displayTime(value) {
    this._timeEl.innerHTML = value;
  }

  /**
   getter que retorna o valor da data do display
  */
  get displayDate() {
    return this._dateEl.innerHTML;
  }

  /**
   setter que define o valor da data do display
   @param value valor passado a propriedade
  */
  set displayDate(value) {
    this._dateEl.innerHTML = value;
  }

  /**
   getter que retorna o valor na calculadora
  */
  get displayCalc() {
    return this._displayCalcEl.innerHTML;
  }

  /**
   setter que define o valor da operação no display
   @param value valor passado a propriedade
  */
  set displayCalc(value) {
    if(value.toString().length > 10) {
      this.setError();
      return false;
    }
    this._displayCalcEl.innerHTML = value;
  }

  /**
   getter que retorna a data atual
  */
  get currentDate() {
    return new Date();
  }

  /**
   setter que define a data atual
   @param date valor data para a propriedade
  */
  set currentDate(date) {
    this._currentDate = date;
  }
}
