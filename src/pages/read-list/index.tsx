import "./index.scss";

import Taro, { useCallback, useEffect, useState } from "@tarojs/taro";

import { AtCard } from "taro-ui";
import NavBar from "@/components/nav-bar";
import { View } from "@tarojs/components";
import { getStemList } from "@/api/index";

const Index = () => {
  const [readList, setReadList] = useState([]);
  useEffect(() => {
    getStemList(2).then((data) => {
      setReadList(data);
    });
  }, []);
  const goWritingDetail = useCallback((stem_id) => {
    Taro.navigateTo({
      url: `/pages/read-detail/index?stem_id=${stem_id}`
    });
  }, []);
  return (
    <View className="read-list-wrapper">
      <NavBar />
      {readList &&
        !!readList.length &&
        readList.map((item, index) => {
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
