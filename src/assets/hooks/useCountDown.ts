import {
    useState,
} from "@tarojs/taro";
import useInterval from './useInterval'

function timerNumberToStr(num) { 
    console.log(num)
    const min = Math.floor(num / 60)
    const second = num % 60
    return `${min}:${second}`
}

function useCountDown(initTimer,timeEndCallBack) {
    const [time, setTime] = useState(initTimer);
    const [isRunning, setIsRunning] = useState(true);
    useInterval(() => {
        setTime(time - 1)
    }, isRunning ? 1000 : null)
    if (time <= 0) {
        timeEndCallBack()
        setIsRunning(false)
    }
    function pause() {
        setIsRunning(false)
    }
    function restart() {
        setIsRunning(true)
    }
    return {
        time: timerNumberToStr(time),
        pause,
        restart
    }
}

export default useCountDown