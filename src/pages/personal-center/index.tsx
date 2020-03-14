import Taro, { useEffect } from '@tarojs/taro'
import { View,Image,Text ,Icon } from '@tarojs/components'
import { AtIcon,AtAvatar,AtList,AtListItem ,AtTag} from 'taro-ui'

import './index.less';

// const {AtListItem} = AtList

const Index = () => {
  useEffect(() => {
    console.log('special')
  }, [])
  return (
    <View className="personal-wrapper">
      {/* <AtIcon className="go-back" value='chevron-left' size='30' color='#ffffff' /> */}
      <View className="cover-wrapper">
        <Image className="cover" src={require("@/images/personal-bg.jpg")} />
      </View>
      <AtAvatar className="avatar" circle size="large" image=''></AtAvatar>

      <View className="user-info">
        <View className="base">
          <View className="left">
            <Text className="username">Dolary</Text>
            <Text className="desc">这个人很懒，啥都没写～～～</Text>
          </View>
          <AtTag className="edit-btn" size="small" type='primary' >编辑资料</AtTag>
        </View>
        <View className="list-wrapper">
          <AtList>
            <AtListItem title='模块1' />
            <AtListItem title='模块2' />
          </AtList>
        </View>
      </View>
    </View>
  )
}

export default Index