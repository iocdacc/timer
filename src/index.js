import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import NoSleep from 'nosleep.js';

import './assets/css/reset.css';
import './assets/css/index.css';

const noSleep = new NoSleep();

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

let App = props=>{
  let [audio] = useState(new Audio('./d.mp3'))
  let [timerId, setTimerId] = useState(undefined)
  let [custom, setCustom] = useState('')
  let [timeText, setTimeText] = useState({
    hour: 0,
    min: 0,
    second: 0,
  })
  let [from, setFrom] = useState({
    silent: true
  })

  useEffect(()=>{
    return ()=>{
      timerId && clearInterval(timerId)
    }
  }, [])

  let timerFun = e=>{
    timerId && clearInterval(timerId)
    let second = e.target.dataset.second
    timerId = second > 0 && setInterval(() => {
      let time = second2time(--second)
      setTimeText({...time})
      second <= 0 && (clearInterval(timerId),noSleep.disable());
      second <= 0 && !from.silent && audio.play();
    }, 1000);
    
    setTimerId(timerId)
    let startTime = second2time(second)
    setTimeText({...startTime})
    
    noSleep.enable();
  }

  let resetTimerFun = e=>{
    timerId && (clearInterval(timerId),setTimeText({
      hour: 0,
      min: 0,
      second: 0,
    }))
  }

  return (
    <>
      <ul className="timer">
        <li>
          <label className="silent">
            <input type="radio" name="silent" onChange={e=>setFrom({...from, silent: true})} checked={from.silent}/> 静音
          </label>
          <label className="silent">
            <input type="radio" name="silent" onChange={e=>setFrom({...from, silent: false})} checked={!from.silent}/> 响铃
          </label>
        </li>
        <li><button onClick={timerFun} data-second="30">30秒</button></li>
        <li><button onClick={timerFun} data-second="60">60秒</button></li>
        <li>
          <input className="custom" type="text" value={custom} name="custom" onChange={e=>{
            /^\d{0,}$/gm.test(e.target.value) && setCustom(e.target.value)
          }} placeholder="自定义时间"/>
          <button className="custom-botton" onClick={timerFun} data-second={custom}>确定</button>
        </li>
        <li><button onClick={resetTimerFun}>重置</button></li>
        <li><span className="timer-text">{`${timeText.hour.pad()}:${timeText.min.pad()}:${timeText.second.pad()}`}</span></li>
      </ul>
    </>
  )
}


ReactDOM.render(<App/>, document.getElementById('app'))