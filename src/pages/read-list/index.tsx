import "./index.scss";

import Taro, { useCallback, useEffect, useState } from "@tarojs/taro";

import { AtCard } from "taro-ui";
import NavBar from "@/components/nav-bar";
import { View } from "@tarojs/components";
import fetch from "@/utils/fetch";

const Index = () => {
  const [writingTest, setWritingTest] = useState([]);
  useEffect(() => {
    fetch({
      url: "http://127.0.0.1:7001/english-practice/api/get-stem/?type=2"
    }).then(({ data, msg }) => {
      if (msg === "success") {
        setWritingTest(data);
      }
    });
  }, []);
  const goWritingDetail = useCallback((stem_id) => {
    Taro.navigateTo({
      url: `/pages/read-detail/index?stem_id=${stem_id}`
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
              英语阅读
            </AtCard>
          );
        })}
    </View>
  );
};

export default Index;
