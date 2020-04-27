import Taro, { useCallback } from "@tarojs/taro";
import { AtNavBar } from "taro-ui";
import { isWeixin } from "@/utils/ua";
import { View } from "@tarojs/components";
interface IProps {
  title?: string;
  color?: string;
}

const NavBar = (props: IProps) => {
  const { title } = props;
  const returnHandle = useCallback(() => {
    Taro.navigateBack({ delta: 1 });
  }, []);

  //处理微信或者其他小程序下顶部bar的问题
  if (isWeixin)
    return (
      <View className="null-wrapper" style={{ width: 0, height: 0 }}></View>
    );

  return (
    <AtNavBar
      onClickLeftIcon={returnHandle}
      color="#333"
      title={title}
      leftIconType="chevron-left"
    />
  );
};

export default NavBar;
