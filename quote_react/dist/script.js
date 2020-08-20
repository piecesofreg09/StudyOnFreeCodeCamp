function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}class Button extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      quote: "",
      author: "",
      fontFamily: "Courier",
      fontSize: "25px",
      colorTri: this.randomColor() };


    this.fetchQuote = this.fetchQuote.bind(this);
    this.handleButton = this.handleButton.bind(this);
    this.updateColor = this.updateColor.bind(this);
  }

  updateColor() {
    this.setState({
      colorTri: this.randomColor() });

    //console.log('changed color in buttons');
  }

  randomColor() {
    var x = Math.floor(Math.random() * 5 + 5).toString(16);
    var y = Math.floor(Math.random() * 5 + 4).toString(16);
    var z = Math.floor(Math.random() * 4 + 6).toString(16);
    var a = Math.floor(Math.random() * 3 + 5).toString(16);
    var b = Math.floor(Math.random() * 3 + 6).toString(16);
    var c = Math.floor(Math.random() * 4 + 5).toString(16);
    return [x, y, z, a, b, c];
  }

  colorToSend(color) {
    return color.map(x => Math.floor(parseInt(x, 16) * 1.35).toString(16));
  }

  componentWillMount() {
    this.fetchQuote();
    this.updateColor();
    this.props.sendColor(this.colorToSend(this.state.colorTri));
  }

  fetchQuote() {
    fetch('https://api.quotable.io/random').
    then(response => response.json()).
    then(data => {
      //console.log(`${data.content} —${data.author}`);
      this.setState({
        quote: data.content,
        author: data.author });

    });

  }


  handleButton() {
    //console.log('button clicked');
    this.fetchQuote();
    this.updateColor();
    this.props.sendColor(this.colorToSend(this.state.colorTri));
  }

  render() {
    // button text color change
    const buttonTextColor = "#" + this.state.colorTri.join('');
    console.log(buttonTextColor);
    // link for twitter
    const tweet_link = 'https://twitter.com/intent/tweet?text=' + this.state.quote + " -- " + this.state.author;
    return (
      React.createElement("div", null,
      React.createElement("p", { id: "text" }, "\"", this.state.quote, "\""),
      React.createElement("p", { id: "author" }, "BY ", this.state.author),
      React.createElement("div", null,
      React.createElement("button", { type: "button", class: "btn btn-outline-light", id: "new-quote", onClick: this.handleButton }, React.createElement("i", { class: "fas fa-redo", style: { color: buttonTextColor } })),
      React.createElement("a", { href: tweet_link, target: "_blank", id: "tweet-quote", type: "button", class: "btn btn-outline-light" }, React.createElement("i", { class: "fab fa-twitter", style: { color: buttonTextColor } })))));



  }}


class Outer extends React.Component {
  constructor(props) {
    super(props);_defineProperty(this, "receiveColor",








    colorTri => {
      this.setState({
        colorTri: colorTri });

    });this.state = { fontFamily: "monospace", fontSize: "16px", colorTri: [] };}

  bodyColor(colorTri) {
    return colorTri.map(x => Math.floor(parseInt(x, 16) * 1.25).toString(16));
  }

  render() {
    // create background color
    const bgColor = "#" + this.state.colorTri.join('');
    //console.log(bgColor);

    // create body color
    const bodyColor = "#" + this.bodyColor(this.state.colorTri).join('');
    document.body.style = 'background: ' + bodyColor;
    //console.log(bodyColor);

    return (
      React.createElement("div", { id: "quote-box", style: { background: bgColor } },
      React.createElement("p", { style: { fontFamily: this.state.fontFamily, fontSize: this.state.fontSize } }, "A Random Quote"),
      React.createElement(Button, { sendColor: this.receiveColor })));


  }}


ReactDOM.render(React.createElement(Outer, null), document.getElementById('x'));


const reducer = (state = 5) => {
  return state;
};