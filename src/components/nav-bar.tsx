import Taro, { useCallback } from '@tarojs/taro'
import { AtNavBar, } from 'taro-ui'

interface IProps {
  title?: string
  color?: string
}

const NavBar = (props: IProps) => {
  const { title } = props
  const returnHandle = useCallback(() => {
    Taro.navigateBack({ delta: 1 })
  }, [])

  return (
    <AtNavBar
      onClickLeftIcon={returnHandle}
      color='#333'
      title={title}
      leftIconType='chevron-left'
    />
  )
}

export default NavBar