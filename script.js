//Code for accurate interval from the freecodecamp version of the pomodoro clock as it was the most efficient and accurate code for timekeeping I could find. And I found the function on freeCodecamp 
// Github: https://gist.github.com/Squeegy/1d99b3cd81d610ac7351
// Slightly modified to accept 'normal' interval/timeout format (func, time) just like in the fCC sample project.
const accurateInterval = function (fn, time) {
  var cancel, nextAt, timeout, wrapper;
  nextAt = new Date().getTime() + time;
  timeout = null;
  wrapper = function () {
    nextAt += time;
    timeout = setTimeout(wrapper, nextAt - new Date().getTime());
    return fn();
  };
  cancel = function () {
    return clearTimeout(timeout);
  };
  timeout = setTimeout(wrapper, nextAt - new Date().getTime());
  return {
    cancel: cancel };

};

class Pomodoro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeLeft: 1500,
      workLength: 25,
      breakLength: 5,
      activeSession: 'Work',
      clockStatus: 'Stopped',
      intervalFunc: '' };

    this.timeClock = this.timeClock.bind(this);
    this.handlePlayPause = this.handlePlayPause.bind(this);
    this.setWorkTime = this.setWorkTime.bind(this);
    this.setBreakTime = this.setBreakTime.bind(this);
    this.handleStop = this.handleStop.bind(this);
    this.displayValue = this.displayValue.bind(this);
    this.startClock = this.startClock.bind(this);
  }

  handlePlayPause() {
    if (this.state.clockStatus == 'Stopped') {
      this.setState({
        clockStatus: 'Playing' });

      this.startClock();
      return;
    } else
    if (this.state.clockStatus == 'Paused') {
      this.setState({ clockStatus: 'Playing' });
      this.startClock();
      return;
    } else
    {
      this.setState({ clockStatus: 'Paused' });
      if (this.state.intervalFunc) {
        this.state.intervalFunc.cancel();
      }
      return;
    }
  }

  handleStop() {
    document.getElementById("beep").pause();
    document.getElementById("beep").load();
    if (this.state.intervalFunc) {
      this.state.intervalFunc.cancel();
    }
    this.setState({
      timeLeft: 1500,
      workLength: 25,
      breakLength: 5,
      activeSession: 'Work',
      clockStatus: 'Stopped',
      intervalFunc: '' });

  }

  startClock() {
    this.setState({
      intervalFunc: accurateInterval(() => {
        this.timeClock();
      }, 1000) });

  }

  setWorkTime(text) {
    if (this.state.clockStatus == 'Playing') {
      return;
    } else
    if (this.state.activeSession == 'Work') {
      if (text == 'plus' && this.state.workLength < 60) {
        this.setState(oldState => ({
          workLength: oldState.workLength + 1,
          timeLeft: (oldState.workLength + 1) * 60 }));

      } else
      if (text == 'minus' && this.state.workLength > 1) {
        this.setState(oldState => ({
          workLength: oldState.workLength - 1,
          timeLeft: (oldState.workLength - 1) * 60 }));

      }
    } else
    if (text == 'plus' && this.state.workLength < 60) {
      this.setState(oldState => ({
        workLength: oldState.workLength + 1 }));

    } else
    if (text == 'minus' && this.state.workLength > 1) {
      this.setState(oldState => ({
        workLength: oldState.workLength - 1 }));

    }
  }

  setBreakTime(text) {
    if (this.state.clockStatus == 'Playing') {
      return;
    } else
    if (this.state.activeSession == 'Break') {
      if (text == 'plus' && this.state.breakLength < 60) {
        this.setState(oldState => ({
          breakLength: oldState.breakLength + 1,
          timeLeft: (oldState.breakLength + 1) * 60 }));

      } else
      if (text == 'minus' && this.state.breakLength > 1) {
        this.setState(oldState => ({
          breakLength: oldState.breakLength - 1,
          timeLeft: (oldState.breakLength - 1) * 60 }));

      }
    } else
    if (text == 'plus' && this.state.breakLength < 60) {
      this.setState(oldState => ({
        breakLength: oldState.breakLength + 1 }));

    } else
    if (text == 'minus' && this.state.breakLength > 1) {
      this.setState(oldState => ({
        breakLength: oldState.breakLength - 1 }));

    }
  }
  //   document.getElementById("beep").pause()
  // document.getElementById("beep").load()

  timeClock() {
    let timeLeft = this.state.timeLeft - 1;
    if (timeLeft >= 0) {
      this.setState({ timeLeft: timeLeft });
    } else
    {
      document.getElementById("beep").currentTime = 0;
      document.getElementById("beep").play();
      if (this.state.intervalFunc) {
        this.state.intervalFunc.cancel();
      }
      if (this.state.activeSession == 'Work') {
        this.setState({
          activeSession: 'Break',
          timeLeft: this.state.breakLength * 60 });

        this.startClock();
      } else
      {
        this.setState({
          activeSession: 'Work',
          timeLeft: this.state.workLength * 60 });

        this.startClock();
      }
    }
  }

  displayValue() {
    let clockMin = Math.floor(this.state.timeLeft / 60);
    let clockSec = this.state.timeLeft - clockMin * 60;
    clockMin = clockMin < 10 ? '0' + clockMin : clockMin;
    clockSec = clockSec < 10 ? '0' + clockSec : clockSec;
    return clockMin + ':' + clockSec;
  }

  render() {

    return (
      React.createElement("div", null,
      React.createElement("h1", null, "Pomodoro Clock"),
      React.createElement("div", { id: "timekeeper" },
      React.createElement("div", { id: "workSetter" },
      React.createElement(Timesetter, { labelId: "session-label", lengthId: "session-length", incBtnId: "session-increment", decBtnId: "session-decrement", displayText: "Work Timer", time: this.state.workLength, setLength: this.setWorkTime })),

      React.createElement("div", { id: "breakSetter" },
      React.createElement(Timesetter, { labelId: "break-label", lengthId: "break-length", incBtnId: "break-increment", decBtnId: "break-decrement", displayText: "Break Timer", time: this.state.breakLength, setLength: this.setBreakTime })),

      React.createElement("div", { id: "main-clock" },
      React.createElement("div", { id: "timer-label" }, this.state.activeSession),
      React.createElement("div", { id: "time-left" }, this.displayValue()),
      React.createElement("div", null,
      React.createElement("button", { id: "start_stop", onClick: () => this.handlePlayPause() }, React.createElement("i", { class: "fas fa-play" })),
      React.createElement("button", { id: "reset", onClick: () => this.handleStop() }, React.createElement("i", { class: "fas fa-sync" }))),

      React.createElement("audio", { id: "beep", src: "https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" }))),


      React.createElement("div", { id: "footer" }, "25 + 5 Clock for freeCodeCamp", React.createElement("br", null), "-by Abhijith Preshobhan")));


  }}


//"https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"

class Timesetter extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      React.createElement("div", null,
      React.createElement("div", { id: this.props.labelId },
      this.props.displayText),

      React.createElement("div", { id: this.props.lengthId },
      this.props.time),

      React.createElement("button", { id: this.props.decBtnId, onClick: () => this.props.setLength('minus') }, React.createElement("i", { className: "fa fa-minus" })),
      React.createElement("button", { id: this.props.incBtnId, onClick: () => this.props.setLength('plus') }, React.createElement("i", { className: "fa fa-plus" }))));


  }}


ReactDOM.render(React.createElement(Pomodoro, null), document.getElementById("root"));