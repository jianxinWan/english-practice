import Taro, { useEffect, useState, useCallback } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtNavBar, AtCard } from 'taro-ui'

import './index.less';

const Index = () => {
  const [clozeTest, setClozeTest] = useState([])
  useEffect(() => {
    window.fetch('http://127.0.0.1:7001/english-practice/api/get-stem/?type=1')
      .then(res => res.json())
      .then(({ data, msg }) => {
        if (msg === 'success') {
          setClozeTest(data)
        }
      })
  }, [])
  const returnHandle = useCallback(() => {
    Taro.navigateTo({
      url: '/pages/index/index'
    })
  }, [])
  const goClozeDetail = useCallback((stem_id) => {
    Taro.navigateTo({
      url: `/pages/cloze-detail/index?stem_id=${stem_id}`
    })
  }, [])
  return (
    <View className='cloze-wrapper'>
      <AtNavBar
        // onClickRgIconSt={}
        // onClickRgIconNd={}
        onClickLeftIcon={returnHandle}
        color='#ccc'
        title=''
        leftText='<'
      />
      {
        clozeTest && !!clozeTest.length && clozeTest.map((item, index) => {
          const { type_str, chapter_name, add_time_str, stem_id } = item
          return (
            <AtCard
              onClick={() => goClozeDetail(stem_id)}
              key={index}
              note={add_time_str}
              extra={type_str}
              title={chapter_name}
            >
              完形填空
            </AtCard>
          )
        })
      }
    </View>
  )
}

export default Index