import Taro, { useEffect, useState, useCallback } from "@tarojs/taro";
import { View } from "@tarojs/components";
import NavBar from "@/components/nav-bar";
import { AtCard } from "taro-ui";
import { getTranslation } from "@/api/index";

import "./index.scss";

const Index = () => {
  const [translation, setTranslation] = useState([]);

  useEffect(() => {
    getTranslation().then(({ list }) => {
      setTranslation(list);
    });
  }, []);

  const goTranslationDetail = useCallback((show_type_id) => {
    Taro.navigateTo({
      url: `/pages/translation-detail/index?show_type_id=${show_type_id}`
    });
  }, []);

  return (
    <View className="translation-wrapper">
      <NavBar />
      {translation &&
        !!translation.length &&
        translation.map((item, index) => {
          const { add_time_str, showTypeID, showTypeName } = item;
          return (
            <AtCard
              onClick={() => goTranslationDetail(showTypeID)}
              key={`${index}`}
              note={add_time_str}
              extra={"专项练习"}
              title={showTypeName}
            >
              翻译
            </AtCard>
          );
        })}
    </View>
  );
};

export default Index;
