function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;} // audio related data
const root_path = 'https://raw.githubusercontent.com/piecesofreg09/study_on_free_code_camp/master/reactDrum/';
//const root_path = '';

const files_name = [...Array(8).fill('').map((x, i) => i + 1 + '.mp3'),
...Array(1).fill('').map((x, i) => i + 9 + '.ogg'),
...Array(20).fill('').map((x, i) => i + 10 + '.wav')];

const bank = [files_name.slice(0, 9).map((x, i) => root_path + x),
files_name.slice(9, 18).map((x, i) => root_path + x),
files_name.slice(18, 27).map((x, i) => root_path + x)];

// description for sounds
const descriptionBank = [['Bell Chimes Low', 'Drum Single Low', 'Hit Hat', 'Low Drum',
'Bell Chimes Mid', 'Drum Single High', 'Hit Hat High',
'Bell Chimes High', 'Button Clik'],
['Cartoon Sound', 'Whitsle', 'Gong',
'Military Drum', 'Hit Hat High', 'Cassette',
'Harp', 'Windows', 'Horror Knock'],
['Sheep', 'Hit Hat Long', 'Strange',
'Chirp', 'Doorbell', 'Dog Bark',
'Raven', 'Frontdoor Bell', 'Bell Chimes']];
// number to letters match
const nameBank = { '1': 'Q', '2': 'W', '3': 'E', '4': 'A',
  '5': 'S', '6': 'D', '7': 'Z', '8': 'X',
  '9': 'C' };

// color of bank background colors
const colorBank = ['#95B9FC', '#FCDEA2', '#96FF96'];

// color of power button
const powerBank = ['#6E6E6E', '#EEEEEE'];

//console.log(bank);
//console.log(files_name);

// Redux
const CHANGEPOWER = 'CHANGEPOWER';
const CHANGEBANK = 'CHANGEBANK';
const SLIDEVOLUME = 'SLIDEVOLUME';
const CHANGEPAD = 'CHANGEPAD';
const initialState = { bankNum: 0, onOff: false, volume: 50, activePad: -1 };

// Action, change power on or off, change bank selection, change volume
const changePower = onOff => {
  return {
    type: CHANGEPOWER,
    onOff: onOff };

};

const changeBank = bankNum => {
  return {
    type: CHANGEBANK,
    bankNum: bankNum };

};

const changeVolume = volume => {
  return {
    type: SLIDEVOLUME,
    volume: volume };

};

const changePad = num => {
  return {
    type: CHANGEPAD,
    activePad: num };

};
const controlReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGEPOWER:
      return Object.assign({}, state, { onOff: action.onOff });
    case CHANGEBANK:
      return Object.assign({}, state, { bankNum: action.bankNum });
    case SLIDEVOLUME:
      return Object.assign({}, state, { volume: action.volume });
    case CHANGEPAD:
      return Object.assign({}, state, { activePad: action.activePad });
    default:
      return state;}

};

const store = Redux.createStore(controlReducer);

// React:
const Provider = ReactRedux.Provider;
const connect = ReactRedux.connect;

// Maps
const mapStateToProps = (state, ownState) => {
  //console.log(ownState);
  // the first method will change the state of the global state
  //return {state: Object.assign({}, state, ownState)};
  return { state: Object.assign({}, state) };
};

const mapDispatchToProps = dispatch => {
  return {
    changePower: onOff => {
      dispatch(changePower(onOff));
    },
    changeBank: bankNum => {
      dispatch(changeBank(bankNum));
    },
    changeVolume: volume => {
      dispatch(changeVolume(volume));
    },
    changePad: padNum => {
      dispatch(changePad(padNum));
    } };

};


// React
class PadUnit extends React.Component {
  constructor(props) {
    super(props);
    //console.log(this.props);
    _defineProperty(this, "playSound",

    () => {
      this.props.changePad(this.props.num - 1);
      const audio = document.getElementById(nameBank[this.props.num]);
      audio.currentTime = 0;
      audio.volume = this.props.state.volume / 100;
      audio.play();
    });_defineProperty(this, "handleClick",

    () => {
      //console.log(this.props.num);
      //console.log(this.props);
      this.playSound();
    });_defineProperty(this, "handleKeyDown",









    e => {
      if (e.keyCode == nameBank[this.props.num].charCodeAt(0)) {
        this.playSound();
      }
    });}componentWillMount() {document.addEventListener('keydown', this.handleKeyDown);}componentWillUnmount() {document.removeEventListener('keydown', this.handleKeyDown);}

  render() {
    return (
      React.createElement("div", { class: "drum-pad", numKey: this.props.num, onClick: this.handleClick, id: 'pad' + this.props.num },
      nameBank[this.props.num],
      React.createElement("audio", { src: bank[this.props.state.bankNum][this.props.num - 1], id: nameBank[this.props.num], class: "clip" })));


  }}


const ContainerPadUnit = connect(mapStateToProps, mapDispatchToProps)(PadUnit);

class ControlUnit extends React.Component {
  constructor(props) {
    super(props);_defineProperty(this, "handleVolumeSlide",







    () => {
      let slider = document.getElementById("volumeSlider");
      //console.log(slider.value);
      this.setState({
        volume: slider.value });

      // set volume in props
      this.props.changeVolume(slider.value);
    });_defineProperty(this, "handleBankClick",

    () => {
      //console.log('Bank Clicked');
      // set bank in props
      let nextBankNum = this.props.state.bankNum + 1;
      if (nextBankNum == 3) {
        nextBankNum = 0;
      }
      this.props.changeBank(nextBankNum);
      // reset bank original pad num to -1
      this.props.changePad(-1);
    });_defineProperty(this, "handlePowerClick",

    () => {
      //console.log('Power Clicked');
      this.props.changePower(!this.props.state.onOff);
      console.log(this.props.state.onOff);

      // reset bank original pad num to -1
      this.props.changePad(-1);

      // switching the pads on an doff
      if (this.props.state.onOff == false) {
        var nodes1 = document.getElementsByClassName("pad");
        for (var i = 0; i < nodes1.length; i++) {
          nodes1[i].classList.add('disabled');
        }
        var nodes2 = document.getElementsByTagName("audio");
        for (var i = 0; i < nodes2.length; i++) {
          nodes2[i].muted = true;
        }
        //console.log(nodes2);
      } else
      {

        var nodes1 = document.getElementsByClassName("pad");
        for (var i = 0; i < nodes1.length; i++) {
          nodes1[i].classList.remove('disabled');
        }

        var nodes2 = document.getElementsByTagName("audio");
        for (var i = 0; i < nodes2.length; i++) {
          nodes2[i].muted = false;
        }
      }

    });this.state = { volume: 50 };}

  render() {
    return (
      React.createElement("div", { id: "control-container" },
      React.createElement("div", { class: "control-child-container" },
      React.createElement("div", { class: "control-child control-button", onClick: this.handlePowerClick, style: this.props.state.onOff ? { backgroundColor: powerBank[0] } : { backgroundColor: powerBank[1] } },
      React.createElement("p", { class: "control-button-text" }, "Power"))),


      React.createElement("div", { class: "control-child-container" },
      React.createElement("div", { class: "control-child control-button", onClick: this.handleBankClick, style: { backgroundColor: colorBank[this.props.state.bankNum] } },
      React.createElement("p", { class: "control-button-text" }, 'Bank ' + (this.props.state.bankNum + 1)))),


      React.createElement("div", { id: "slidevolumecontainer", class: "control-child-container" },
      React.createElement("p", null, "Volume")),

      React.createElement("div", { class: "slidecontainer", class: "control-child-container" },
      React.createElement("input", { type: "range", min: "1", max: "100", value: this.state.volume, class: "slider control-child", id: "volumeSlider", onInput: this.handleVolumeSlide }))));



  }}



const ContainerControlUnit = connect(mapStateToProps, mapDispatchToProps)(ControlUnit);

class PadBox extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    const pads = Array(9).fill('').map((i, x) => React.createElement(ContainerPadUnit, { num: x + 1 }));

    return (
      React.createElement("div", null,
      React.createElement("h1", null, "A Sampler"),
      React.createElement("div", { id: "pad-outer-container" },
      React.createElement("div", { id: "pad-container" },
      pads),

      React.createElement("div", null,
      React.createElement(ContainerControlUnit, null))),


      React.createElement("div", { id: "display" },
      React.createElement("p", null, this.props.state.activePad == -1 || this.props.state.onOff == true ? React.createElement("b", null, "PLEASE CLICK OR PRESS DOWN") : descriptionBank[this.props.state.bankNum][this.props.state.activePad]))));



  }}


const ContainerPadBox = connect(mapStateToProps, mapDispatchToProps)(PadBox);

class AppWrapper extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      React.createElement(Provider, { store: store },
      React.createElement(ContainerPadBox, null)));


  }}


ReactDOM.render(React.createElement(AppWrapper, null), document.getElementById('drum-machine'));