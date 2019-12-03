import Taro, { useEffect } from '@tarojs/taro'
import { View } from '@tarojs/components'


const Index = () => {
  useEffect(() => {
    console.log('special')
  }, [])
  return (
    <View>个人中心</View>
  )
}

export default Index