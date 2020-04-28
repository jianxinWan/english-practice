import Taro, { useEffect, useState, useCallback } from "@tarojs/taro";
import { View } from "@tarojs/components";
import NavBar from "@/components/nav-bar";
import { AtCard } from "taro-ui";
import { getStemList } from "@/api/index";
import "./index.scss";

const Index = () => {
  const [clozeTest, setClozeTest] = useState([]);

  useEffect(() => {
    getStemList(1).then((data) => {
      setClozeTest(data);
    });
  }, []);

  const goClozeDetail = useCallback((stem_id) => {
    Taro.navigateTo({
      url: `/pages/cloze-detail/index?stem_id=${stem_id}`
    });
  }, []);

  return (
    <View className="cloze-wrapper">
      <NavBar />
      {clozeTest &&
        !!clozeTest.length &&
        clozeTest.map((item, index) => {
          const { type_str, chapter_name, add_time_str, stem_id } = item;
          return (
            <AtCard
              onClick={() => goClozeDetail(stem_id)}
              key={`${index}`}
              note={add_time_str}
              extra={type_str}
              title={chapter_name}
            >
              完形填空
            </AtCard>
          );
        })}
    </View>
  );
};

export default Index;
