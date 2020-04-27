import "./index.scss";

import Taro, { useEffect } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import { AtAvatar, AtList, AtListItem, AtTag } from "taro-ui";
import { isWeixin } from "@/utils/ua";

const Index = () => {
  useEffect(() => {
    if (isWeixin) {
      Taro.getUserInfo().then((res) => {
        console.log(res)
      })
    }
  }, []);
  return (
    <View>
      <View className="personal-wrapper">
        <View className="cover-wrapper">
          <Image className="cover" src={require("@/images/personal-bg.jpg")} />
        </View>
        <AtAvatar className="avatar" circle size="large" image=""></AtAvatar>

        <View className="user-info">
          <View className="base">
            <View className="left">
              <Text className="username">Dolary</Text>
              <Text className="desc">这个人很懒，啥都没写～～～</Text>
            </View>
            <AtTag className="edit-btn" size="small" type="primary">
              编辑资料
            </AtTag>
          </View>
          <View className="list-wrapper">
            <AtList>
              <AtListItem title="模块1" />
              <AtListItem title="模块2" />
            </AtList>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Index;
