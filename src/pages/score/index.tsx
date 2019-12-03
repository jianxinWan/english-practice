import Taro, { useEffect } from '@tarojs/taro'
import { View } from '@tarojs/components'


const Index = () => {
  useEffect(() => {
    console.log('special')
  }, [])
  return (
    <View>
      <View>成绩1</View>
      <View>成绩2</View>
      <View>成绩3</View>
      <View>成绩4</View>
      <View>成绩5</View>
    </View>
  )
}

export default Index