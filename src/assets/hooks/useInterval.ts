import { useEffect, useRef } from '@tarojs/taro'

function useInterval(cb,delay) {
    const ref = useRef<any>()
    let timer // 当前定时器的timer
    useEffect(() => {
        ref.current = cb
    })
    useEffect(() => {
        if(!delay) return 
        timer = setInterval(() => ref.current(), delay)
        return () => clearInterval(timer)
    }, [delay])
}

export default useInterval