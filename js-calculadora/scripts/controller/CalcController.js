class CalcController {
  constructor(){
    this._displayCalc = '0';
    this._dataAtual;
  }

  // getter do _displayCalc
  get displayCalc() {
    return this._displayCalc;
  }

  // setter do _displayCalc
  set displayCalc(valor) {
    this._displayCalc = valor;
  }

  // getter do _dataAtual
  get dataAtual() {
    return this._dataAtual;
  }

  // setter do _dataAtual 
  set dataAtual(data) {
    this._dataAtual = data;
  }
}
