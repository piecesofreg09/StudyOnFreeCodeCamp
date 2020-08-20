function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}const nonNumbers = ['AC', 'C', '=',
'.', '+', '-',
0, '×', '÷'];
const multiDivi = { '×': '*', '÷': '/' };
const operators = ['+', '-', '×', '÷'];

const idsNum = ['one', 'two', 'three',
'four', 'five', 'six',
'seven', 'eight', 'nine'];

const idsNonNum = ['clear', 'clr', 'equals',
'decimal', 'add', 'subtract',
'zero', 'multiply', 'divide'];

// Global for actions type
const INPUTDIGIT = 'INPUTDIGIT';
const INPUTOPERATOR = 'INPUTOPERATOR';
const EQUAL = 'EQUAL';
const CLEARALL = 'CLEARALL';
const CLEARCURRENTINPUT = 'CLEARCURRENTINPUT';

// Initial state
// the bit operatorDigit indicates are we previously typing in operators
// operatorIn = true means yes we were typing in operators in the previous round
const initialState = { resultMode: true,
  equations: [],
  currentInput: '',
  result: 0,
  operatorIn: -1 };


// Actions
// input digit s
const inputDigit = digit => {
  return {
    type: INPUTDIGIT,
    digit: digit };

};

// input operators
const inputOperator = operator => {
  return {
    type: INPUTOPERATOR,
    operator: operator };

};

// input equal sign
const enterEqual = () => {
  return {
    type: EQUAL };

};

// clear all inputs, including equations and input
const clearAllInput = () => {
  return {
    type: CLEARALL };

};

// clear only the input part
const clearCurrentInput = () => {
  return {
    type: CLEARCURRENTINPUT };

};

// clear screen

function calculate(inputString) {
  return Math.random();
}

const controlReducer = (state = initialState, action) => {
  let newState = Object.assign({}, state);
  switch (action.type) {
    case INPUTDIGIT:
      // if previous input is operator
      if (state.operatorIn == true || state.operatorIn == -1) {
        // push the currentInput into equations
        newState = Object.assign({}, newState, { equations: [...state.equations, state.currentInput] });

        // check if digit
        if (action.digit == '.') {
          newState = Object.assign({}, newState, { currentInput: '0' + action.digit });
        } else
        {
          newState = Object.assign({}, newState, { currentInput: '' + action.digit });
        }
        newState = Object.assign({}, newState, { operatorIn: false });
      }
      // if previous input is an number
      else if (state.operatorIn == false) {
          //console.log(state);
          let updatedCurrentIput = state.currentInput + action.digit;

          //console.log(state);

          // deal with digit
          if (action.digit == '.') {
            if (state.currentInput.indexOf('.') == -1) {
              newState = Object.assign({}, newState, { currentInput: updatedCurrentIput });
            }
          } else
          {
            if (action.digit == '0') {
              if (state.currentInput.indexOf('.') == -1 && state.currentInput == '0') {
                newState = Object.assign({}, newState, { currentInput: '0' });
              } else
              {
                newState = Object.assign({}, newState, { currentInput: updatedCurrentIput });
              }
            } else
            {
              newState = Object.assign({}, newState, { currentInput: updatedCurrentIput });
            }

          }

          //console.log(state);

          //newState = Object.assign({}, newState, {operatorIn: false});
        }
      //console.log(newState);
      newState = Object.assign({}, newState, { resultMode: false });
      return newState;

    case INPUTOPERATOR:
      if (state.operatorIn == false || state.operatorIn == -1) {
        // push the currentInput into equations
        newState = Object.assign({}, newState, { equations: [...state.equations, state.currentInput] });

        //console.log(action.operator);
        newState = Object.assign({}, newState, { currentInput: action.operator }, { operatorIn: true });
      } else
      if (state.operatorIn == true) {
        if (action.operator != '-') {
          newState = Object.assign({}, newState, { currentInput: action.operator });
        } else
        {
          if (state.currentInput.charAt(state.currentInput.length - 1) == '-') {
            newState = Object.assign({}, newState, { currentInput: state.currentInput });
          } else
          {
            newState = Object.assign({}, newState, { currentInput: state.currentInput + action.operator });
          }

        }
      }

      //console.log(newState);

      //newState = Object.assign({}, newState, {operatorIn: true});
      newState = Object.assign({}, newState, { resultMode: false });
      return newState;

    case EQUAL:
      let result = 0;
      //console.log('in equal');
      //console.log(state);
      if (state.operatorIn == true) {
        let eqToEvaluate = state.equations.join('');
        console.log(eqToEvaluate);
        result = math.evaluate(eqToEvaluate.replace(/×/gi, '*').replace(/÷/gi, '/'));
      } else
      if (state.operatorIn == false) {
        let eqToEvaluate = state.equations.join('') + state.currentInput;
        //console.log(eqToEvaluate);
        result = math.evaluate(eqToEvaluate.replace(/×/gi, '*').replace(/÷/gi, '/'));
      }
      //console.log(result);
      // return the new result and set the result mode as true
      return Object.assign({}, state,
      { result: result, resultMode: true, equations: initialState.equations, currentInput: result, operatorIn: initialState.operatorIn });
    case CLEARALL:
      return initialState;
    case CLEARCURRENTINPUT:
      newState = Object.assign({}, newState, { resultMode: false, currentInput: '' });
      return newState;
    default:
      return Object.assign({}, state);}

};

const store = Redux.createStore(controlReducer);

// React:
const Provider = ReactRedux.Provider;
const connect = ReactRedux.connect;

// Maps
const mapStateToProps = (state, ownState) => {
  return { state: Object.assign({}, state) };
};

const mapDispatchToProps = dispatch => {
  return {
    inputDigit: digit => {
      dispatch(inputDigit(digit));
    },

    inputOperator: operator => {
      dispatch(inputOperator(operator));
    },

    enterEqual: () => {
      dispatch(enterEqual());
    },

    clearAllInput: () => {
      dispatch(clearAllInput());
    },

    clearCurrentInput: () => {
      dispatch(clearCurrentInput());
    } };

};


// React

class DisplayFormulaBox extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    //console.log(this.props.state.equations);
    return (
      React.createElement("div", null,
      React.createElement("div", { id: "formula-container" },
      React.createElement("div", null, this.props.state.equations.join('') + this.props.state.currentInput))));



  }}


const ContainerDisplayFormulaBox = connect(mapStateToProps, mapDispatchToProps)(DisplayFormulaBox);

class DisplayInputBox extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      React.createElement("div", null,
      React.createElement("div", { id: "input-container" },
      React.createElement("div", { id: "display" }, this.props.state.resultMode ? this.props.state.result : this.props.state.currentInput))));



  }}


const ContainerDisplayInputBox = connect(mapStateToProps, mapDispatchToProps)(DisplayInputBox);

class DisplayBox extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      React.createElement("div", null,
      React.createElement("div", { id: "display-container" },
      React.createElement(ContainerDisplayFormulaBox, null),
      React.createElement(ContainerDisplayInputBox, null))));



  }}


const ContainerDisplayBox = connect(mapStateToProps, mapDispatchToProps)(DisplayBox);


class Digits extends React.Component {
  constructor(props) {
    super(props);_defineProperty(this, "handleClick",


    () => {

      if (this.props.num == 'AC') {
        this.props.clearAllInput();
      } else
      if (this.props.num == 'C') {
        this.props.clearCurrentInput();
      } else
      if (this.props.num == '=') {
        this.props.enterEqual();
      } else
      if (operators.indexOf(this.props.num) != -1) {
        this.props.inputOperator(this.props.num);
      } else
      {
        this.props.inputDigit(this.props.num);
      }

      //console.log(this.props);

      return 0;
    });}

  render() {
    return (
      React.createElement("div", { class: "digit-pad", onClick: this.handleClick, id: this.props.ids },
      React.createElement("div", { class: "inside-digit-pad" }, this.props.num)));


  }}


const ContainerDigits = connect(mapStateToProps, mapDispatchToProps)(Digits);

class DigitsBox extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    const pads = Array(9).fill('').map((i, x) => React.createElement(ContainerDigits, { num: x + 1, ids: idsNum[x] }));
    const controls = nonNumbers.map((i, x) => React.createElement(ContainerDigits, { num: i, ids: idsNonNum[x] }));
    return (
      React.createElement("div", null,
      React.createElement("div", { id: "digits-equal-container" },
      React.createElement("div", { id: "digits-container" },
      pads),

      React.createElement("div", { id: "equals-container" },
      controls))));




  }}


const ContainerDigitsBox = connect(mapStateToProps, mapDispatchToProps)(DigitsBox);


class AppWrapper extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      React.createElement(Provider, { store: store },
      React.createElement(ContainerDisplayBox, null),
      React.createElement(ContainerDigitsBox, null)));


  }}


ReactDOM.render(React.createElement(AppWrapper, null), document.getElementById('test'));
//console.log(math.evaluate('1.2 * (2 + 4.5)'));
//console.log(math.evaluate('1 * (2.2  / - 4.5651)'));
ReactDOM.render(React.createElement("div", null, "Designed By WL"), document.getElementById('attr'));
try {
  //console.log(math.evaluate('1.2 * (2 + 4.5 + 23151)'));
}
catch (err) {
  ///console.log(err.message)
}