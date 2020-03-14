import './index.less'

import Taro, { Component, Config } from '@tarojs/taro'
import { add, asyncAdd, minus } from '../../actions/counter'

import { AtTabBar } from 'taro-ui'
/* eslint-disable no-unused-vars */
/* eslint-disable react/sort-comp */
import { ComponentClass } from 'react'
import ErrorRecovery from '@/pages/error-recovery'
import PersonalCenter from '@/pages/personal-center'
import Score from '@/pages/score'
import Special from '@/pages/special'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'

// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796

type PageStateProps = {
  counter: {
    num: number
  }
}

type PageDispatchProps = {
  add: () => void
  dec: () => void
  asyncAdd: () => any
}

type PageOwnProps = {}

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
}

interface IState {
  current: number
}
@connect(({ counter }) => ({
  counter
}), (dispatch) => ({
  add() {
    dispatch(add())
  },
  dec() {
    dispatch(minus())
  },
  asyncAdd() {
    dispatch(asyncAdd())
  }
}))
class Index extends Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      current: 0
    }
  }

  /**
 * 指定config的类型声明为: Taro.Config
 *
 * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
 * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
 * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
 */
  config: Config = {
    navigationBarTitleText: '考研英语'
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  handleChange = (index) => {
    this.setState({ current: index })
  }

  render() {
    const { current } = this.state
    return (
      <View className='index'>
        <View className='content'>
          {current === 0 && <Special />}
          {current === 1 && <Score />}
          {current === 2 && <ErrorRecovery />}
          {current === 3 && <PersonalCenter />}
        </View>
        <AtTabBar
          fixed
          iconSize={16}
          fontSize={12}
          tabList={[
            { title: '专项练习', iconType: 'edit' },
            { title: '成绩查询', iconType: 'tag' },
            { title: '错题记录', iconType: 'folder' },
            { title: '个人中心', iconType: 'user' }
          ]}
          onClick={this.handleChange}
          current={current}
        />
      </View>
    )
  }
}

export default Index as ComponentClass<PageOwnProps, PageState>
