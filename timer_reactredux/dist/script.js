function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}
var timeVar;


// utility functions
const MINUTECONSTANT = 60;
miliToMinute = mili => {
  var secs = Math.floor(mili / 1000);
  //console.log(secs);
  var newMinute = Math.floor(secs / MINUTECONSTANT);
  var newSec = secs % MINUTECONSTANT;
  return { min: ("0" + newMinute).slice(-2),
    sec: ("0" + newSec).slice(-2) };
};

// play sound 
playSound = () => {
  const audio = document.getElementById('beep');
  audio.currentTime = 0;
  audio.volume = 1;
  audio.play();
};

endSound = () => {
  const audio = document.getElementById('beep');
  audio.pause();
  audio.currentTime = 0;
  audio.volume = 1;
};


//console.log(miliToMinute(100000));

// sound related
const soundPath = 'https://raw.githubusercontent.com/piecesofreg09/study_on_free_code_camp/master/reactDrum/100.mp3';


const CHANGETIME = 'CHANGETIME';
const START = 'START';
const PAUSE = 'PAUSE';
const END = 'END';
const UPDATETIMER = 'UPDATETIMER';
const timeLimit = { break: { up: 60, down: 1 }, session: { up: 60, down: 1 } };
const initialSessionLength = 25;
const initialBreakLength = 5;
// totalTime is the length of total time in miliseconds
// fullTime is the counting for current start
// time left is used for counting
// inSession indicates whether it's in session or break
// clockGoing indicates if the clock is currently running
// working: change between reset and working
const initialState = { break: initialBreakLength, session: initialSessionLength, inSession: true, clockGoing: false, working: false, totalTime: initialSessionLength * MINUTECONSTANT * 1000, fullTime: initialSessionLength * MINUTECONSTANT * 1000, timeLeftInMiliSecs: initialSessionLength * MINUTECONSTANT * 1000, refTime: null };

// actions
const changeTime = (inc, tuner) => {
  return {
    type: CHANGETIME,
    tuner: tuner,
    inc: inc };

};

const startTimer = (ref, tuner) => {
  //console.log(ref);
  //console.log(tuner);
  return {
    type: START,
    ref: ref,
    tuner: tuner };

};

const pauseTimer = (ref, tuner) => {
  return {
    type: PAUSE,
    ref: ref,
    tuner: tuner };

};

const endTimer = tuner => {
  return {
    type: END,
    tuner: tuner };

};

const updateTimer = tuner => {
  return {
    type: UPDATETIMER,
    tuner: tuner };

};

const controlReducer = (state = initialState, action) => {
  let newState = Object.assign({}, state);
  switch (action.type) {
    case CHANGETIME:
      var temp = {};
      if (action.inc == true) {
        temp[action.tuner] = timeLimit[action.tuner].up > state[action.tuner] + 1 ? state[action.tuner] + 1 : timeLimit[action.tuner].up;
        newState = Object.assign({}, newState, temp);
      } else
      {
        temp[action.tuner] = timeLimit[action.tuner].down < state[action.tuner] - 1 ? state[action.tuner] - 1 : timeLimit[action.tuner].down;
        newState = Object.assign({}, newState, temp);
      }

      var temp2 = {};
      if (state.working == false && action.tuner == 'session') {
        temp2['timeLeftInMiliSecs'] = temp[action.tuner] * MINUTECONSTANT * 1000;
        temp2['totalTime'] = temp[action.tuner] * MINUTECONSTANT * 1000;
        temp2['fullTime'] = temp[action.tuner] * MINUTECONSTANT * 1000;
        newState = Object.assign({}, newState, temp2);
      }

      return newState;


    case START:
      //console.log('in start');
      //console.log(action.ref);

      var temp = { refTime: action.ref, clockGoing: true };
      if (state.working == false) {
        temp['timeLeftInMiliSecs'] = state[action.tuner] * MINUTECONSTANT * 1000;
        temp['totalTime'] = state[action.tuner] * MINUTECONSTANT * 1000;
        temp['fullTime'] = state[action.tuner] * MINUTECONSTANT * 1000;
        temp['working'] = true;
      }
      //console.log(temp);
      newState = Object.assign({}, newState, temp);
      //console.log(newState);

      return newState;


    case PAUSE:
      //console.log('in pause');
      //console.log(action.ref);
      var temp = { refTime: action.ref, clockGoing: false, fullTime: state.timeLeftInMiliSecs };
      newState = Object.assign({}, newState, temp);
      return newState;


    case END:
      //console.log('in end');
      endSound();
      var temp = { inSession: true, clockGoing: false,
        working: false,
        totalTime: newState.session * MINUTECONSTANT * 1000,
        fullTime: newState.session * MINUTECONSTANT * 1000,
        timeLeftInMiliSecs: newState.session * MINUTECONSTANT * 1000, refTime: null };
      newState = Object.assign({}, newState, temp);
      return initialState;


    case UPDATETIMER:
      //console.log('in update');

      var temp = { timeLeftInMiliSecs: newState.fullTime - (new Date().getTime() - newState.refTime) };

      if (temp.timeLeftInMiliSecs <= 0) {
        playSound();
        if (state.inSession == true) {
          temp['inSession'] = false;
          temp['totalTime'] = newState.break * MINUTECONSTANT * 1000;
          temp['fullTime'] = newState.break * MINUTECONSTANT * 1000;
          temp['timeLeftInMiliSecs'] = newState.break * MINUTECONSTANT * 1000;
          temp['refTime'] = new Date();
        } else
        if (state.inSession == false) {
          temp['inSession'] = true;
          temp['totalTime'] = newState.session * MINUTECONSTANT * 1000;
          temp['fullTime'] = newState.session * MINUTECONSTANT * 1000;
          temp['timeLeftInMiliSecs'] = newState.session * MINUTECONSTANT * 1000;
          temp['refTime'] = new Date();
        }
      }

      newState = Object.assign({}, newState, temp);

      return newState;
    default:
      return initialState;}

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
    changeTime: (inc, tuner) => {
      dispatch(changeTime(inc, tuner));
    },
    startTimer: (ref, inSession) => {
      dispatch(startTimer(ref, inSession));
    },
    pauseTimer: (ref, inSession) => {
      dispatch(pauseTimer(ref, inSession));
    },
    endTimer: (...args) => {
      dispatch(endTimer(args));
    },
    updateTimer: (...args) => {
      dispatch(updateTimer(args));
    } };


};



// React
// Tuner
class Tuner extends React.Component {
  constructor(props) {
    super(props);_defineProperty(this, "lengthUp",


    () => {
      this.props.changeTime(true, this.props.name);
    });_defineProperty(this, "lengthDown",

    () => {
      this.props.changeTime(false, this.props.name);
    });}

  render() {
    //console.log(this.props.state);
    return (
      React.createElement("div", null,
      React.createElement("p", { id: this.props.name + '-label' }, this.props.name, " Length"),
      React.createElement("div", { id: "tuner-inner-container" },
      React.createElement("div", { class: "tuner-pads" }),
      React.createElement("div", { class: "tuner-pads", id: this.props.name + '-increment', onClick: this.lengthUp }, React.createElement("i", { class: "fas fa-arrow-up" })),
      React.createElement("div", { class: "tuner-pads", id: this.props.name + '-length' }, this.props.state[this.props.name]),
      React.createElement("div", { class: "tuner-pads", id: this.props.name + '-decrement', onClick: this.lengthDown }, React.createElement("i", { class: "fas fa-arrow-down" })),
      React.createElement("div", { class: "tuner-pads" }))));



  }}


const ContainerTuner = connect(mapStateToProps, mapDispatchToProps)(Tuner);



// Controller
class Controller extends React.Component {
  constructor(props) {
    super(props);_defineProperty(this, "start",


    () => {
      this.props.startTimer(new Date().getTime(), this.props.state.inSession ? 'session' : 'break');
      //console.log(this.props.state);

      timeVar = setInterval(this.updateTimer.bind(this), 100);
    });_defineProperty(this, "updateTimer",

    () => {
      //console.log(this.props.state);
      this.props.updateTimer(this.props.state.inSession ? 'session' : 'break');
    });_defineProperty(this, "pause",

    () => {
      this.props.pauseTimer(new Date().getTime(), this.props.state.inSession ? 'session' : 'break');
      //console.log(this.props.state);
      clearInterval(timeVar);
      timeVar = null;
    });_defineProperty(this, "end",

    () => {
      if (timeVar) {
        clearInterval(timeVar);
        timeVar = null;
      }
      this.props.endTimer(this.props.state.inSession ? 'session' : 'break');
    });}

  render() {
    return (
      React.createElement("div", null,
      React.createElement("div", { id: "controller-containter" },
      React.createElement("div", null),
      React.createElement("div", null),
      React.createElement("div", { id: "start_stop", onClick: this.props.state.clockGoing ? this.pause : this.start },
      React.createElement("i", { class: "fas fa-play" }),
      React.createElement("i", { class: "fas fa-pause" })),

      React.createElement("div", null),
      React.createElement("div", null),
      React.createElement("div", { id: "reset", onClick: this.end },
      React.createElement("i", { class: "fas fa-stop" })),

      React.createElement("div", null),
      React.createElement("div", null))));



  }}


const ContainerController = connect(mapStateToProps, mapDispatchToProps)(Controller);



// Clock
class Clock extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var time = miliToMinute(this.props.state.timeLeftInMiliSecs);
    return (
      React.createElement("div", { id: "clock" },
      React.createElement("div", { id: "timer-label" }, this.props.state.inSession ? 'In Session' : 'In Break'),
      React.createElement("div", { id: "time-left" }, time.min, ":", time.sec)));


  }}


const ContainerClock = connect(mapStateToProps, mapDispatchToProps)(Clock);

class Outer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var barStyle = { width: ((this.props.state.totalTime - this.props.state.timeLeftInMiliSecs) / this.props.state.totalTime).toFixed(4) * 100 + '%' };
    //console.log(barStyle);
    return (
      React.createElement("div", null,
      React.createElement("div", { id: "test1" },
      React.createElement("div", { id: "break-session-container" },
      React.createElement("div", null, React.createElement(ContainerTuner, { name: "break" })),
      React.createElement("div", null, React.createElement(ContainerTuner, { name: "session" }))),

      React.createElement("div", { id: "control-container" },
      React.createElement(ContainerController, null)),

      React.createElement("div", { id: "clock-container" },
      React.createElement(ContainerClock, null),
      React.createElement("audio", { src: soundPath, id: "beep", class: "clip" })),

      React.createElement("div", { id: "progress-outer" },
      React.createElement("div", { id: "bar", style: barStyle })))));




  }}


const ContainerOuter = connect(mapStateToProps, mapDispatchToProps)(Outer);

class AppWrapper extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      React.createElement(Provider, { store: store },
      React.createElement("div", { id: "title" }, "Pomodoro Clock"),
      React.createElement(ContainerOuter, null)));


  }}


ReactDOM.render(React.createElement(AppWrapper, null), document.getElementById('test'));