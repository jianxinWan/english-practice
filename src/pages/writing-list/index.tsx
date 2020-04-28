import Taro, { useEffect, useState, useCallback } from "@tarojs/taro";
import { View } from "@tarojs/components";
import NavBar from "@/components/nav-bar";
import { AtCard } from "taro-ui";
import { getStemList } from "@/api/index";

import "./index.scss";

const Index = () => {
  const [writingTest, setWritingTest] = useState([]);
  useEffect(() => {
    getStemList(5).then((data) => {
      setWritingTest(data);
    });
  }, []);
  const goWritingDetail = useCallback((stem_id) => {
    Taro.navigateTo({
      url: `/pages/writing-detail/index?stem_id=${stem_id}`
    });
  }, []);
  return (
    <View className="writing-wrapper">
      <NavBar />
      {writingTest &&
        !!writingTest.length &&
        writingTest.map((item, index) => {
          const { type_str, chapter_name, add_time_str, stem_id } = item;
          return (
            <AtCard
              onClick={() => goWritingDetail(stem_id)}
              key={`${index}`}
              note={add_time_str}
              extra={type_str}
              title={chapter_name}
            >
              英语写作
            </AtCard>
          );
        })}
    </View>
  );
};

export default Index;
