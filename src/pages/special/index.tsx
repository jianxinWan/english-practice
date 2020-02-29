import Taro, { useEffect, useCallback } from '@tarojs/taro'
import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components'
import { AtGrid } from "taro-ui"
import './index.less'

const Index = () => {
  useEffect(() => {
    console.log('special')
  }, [])
  const jumpLink = useCallback((item, index) => {
    if (index === 0) {
      Taro.navigateTo({
        url: '/pages/cloze-list/index'
      })
    }
    if (index === 2) {
      Taro.navigateTo({
        url: '/pages/writing-list/index'
      })
    }
  }, [])
  return (
    <View>
      <Swiper
        className='swiper-wrapper'
        indicatorColor='#999'
        indicatorActiveColor='#333'
        vertical={false}
        circular
        indicatorDots
      // autoplay
      >
        <SwiperItem>
          <View className='swiper1 swiper-item'>
            <Image src='//sf3-ttcdn-tos.pstatp.com/img/motor-img/005fe8e44f4eb8059957f3096a39f76c~noop.png' />
            <Text className='swiper-title'>赋予每一个人实现的最大潜力</Text>
          </View>
        </SwiperItem>
        <SwiperItem>
          <View className='swiper2 swiper-item'>
            <Image src='//faas.llscdn.com/builds/frontend/liulishuo.com/images/liulishuo/banner-bg.jpg?t=1573184776885' />
          </View>
        </SwiperItem>
        <SwiperItem>
          <View className='swiper3 swiper-item'>
            <Image src='//faas.llscdn.com/builds/frontend/liulishuo.com/images/liulishuo/banner-bg.jpg?t=1573184776885' />
          </View>
        </SwiperItem>
      </Swiper>
      <AtGrid
        hasBorder
        onClick={jumpLink}
        data={
          [
            {
              image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png',
              value: '完形填空',
            },
            {
              image: 'https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png',
              value: '阅读理解',
            },
            {
              image: 'https://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png',
              value: '作文'
            },
            {
              image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t10660/330/203667368/1672/801735d7/59c85643N31e68303.png',
              value: '真题演练'
            },
            {
              image: 'https://img14.360buyimg.com/jdphoto/s72x72_jfs/t17251/336/1311038817/3177/72595a07/5ac44618Na1db7b09.png',
              value: '模拟考试'
            },
            {
              image: 'https://img30.360buyimg.com/jdphoto/s72x72_jfs/t5770/97/5184449507/2423/294d5f95/595c3b4dNbc6bc95d.png',
              value: '长难句解析'
            }
          ]
        }
      />
    </View>
  )
}

export default Index