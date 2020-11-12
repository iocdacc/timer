import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import './assets/css/reset.css';
import './assets/css/index.css';


Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
}

function second2time(second){
  return {
    hour: Math.floor(second/3600),
    min: Math.floor((second%3600)/60),
    second: (second%3600)%60
  }
}

let timerId
let audio = new Audio('./d.mp3')

let App = props=>{
  let [timeText, setTimeText] = useState('00:00:00')

  let timerFun = e=>{
    timerId && clearInterval(timerId)
    let second = e.target.dataset.second
    let startTime = second2time(second)
    setTimeText(`${startTime.hour.pad()}:${startTime.min.pad()}:${startTime.second.pad()}`)
    timerId = setInterval(() => {
      let time = second2time(--second)
      setTimeText(`${time.hour.pad()}:${time.min.pad()}:${time.second.pad()}`)
      second === 0 && (clearInterval(timerId),audio.play())
    }, 1000);
  }

  return (
    <>
      <ul className="timer">
        <li><button onClick={timerFun} data-second="30">30秒</button></li>
        <li><button onClick={timerFun} data-second="60">60秒</button></li>
        <li><button onClick={timerFun} data-second="120">120秒</button></li>
        <li><span className="timer-text">{timeText}</span></li>
      </ul>
    </>
  )
}


ReactDOM.render(<App/>, document.getElementById('app'))