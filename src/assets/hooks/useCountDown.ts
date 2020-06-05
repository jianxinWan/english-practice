import { useState } from "@tarojs/taro";
import useInterval from "./useInterval";

/**
 * 数字转换为字符串类型
 * @param num
 */
function timerNumberToStr(num) {
  console.log(num);
  const min = Math.floor(num / 60);
  const second = num % 60;
  return `${min}:${second}`;
}
/**
 * 定时器主函数
 * @param initTimer  初始化的时间  120*60  秒
 * @param timeEndCallBack 定时器结束时要触发的回调函数
 */
function useCountDown(initTimer, timeEndCallBack) {
  const [time, setTime] = useState(initTimer);
  const [isRunning, setIsRunning] = useState(true);
  useInterval(
    () => {
      setTime(time - 1);
    },
    isRunning ? 1000 : null //通过isRunning 判定是否暂停与执行，传入null为暂停
  );
  /**
   * 时间小于0,定时器归零，触发回调函数
   */
  if (time <= 0) {
    timeEndCallBack();
    setIsRunning(false);
  }
  /**
   * 暂停定时器
   */
  function pause() {
    setIsRunning(false);
  }
  /**
   * 重新开启定时器
   */
  function restart() {
    setIsRunning(true);
  }
  return {
    time: timerNumberToStr(time), //定时器的时间
    pause, //暂停方法
    restart //重新开始的方法
  };
}

export default useCountDown;
