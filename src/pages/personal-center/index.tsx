import "./index.scss";

import Taro, { useEffect } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import { AtAvatar, AtList, AtListItem, AtTag } from "taro-ui";
import { isWeixin } from "@/utils/ua";

const Index = () => {
  useEffect(() => {
    if (isWeixin) {
      Taro.getUserInfo().then((res) => {
        console.log(res);
      });
    }
  }, []);
  return (
    <View>
      <View className="personal-wrapper">
        <View className="cover-wrapper">
          <View className="avatar" />
        </View>
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
              <AtListItem title="手机号：152****4355" />
              <AtListItem title="邮箱：2582152019@qq.com" />
              <AtListItem title="个性签名：越努力越幸运" />
            </AtList>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Index;
