import Taro, { useEffect, useState, useCallback } from "@tarojs/taro";
import { View } from "@tarojs/components";
import NavBar from "@/components/nav-bar";
import { AtCard } from "taro-ui";
import fetch from "@/utils/fetch";

import "./index.scss";

const Index = () => {
  const [chapterList, setChapterList] = useState([]);
  useEffect(() => {
    fetch({
      url: "http://127.0.0.1:7001/english-practice/api/exercise/list/?type=2"
    }).then(({ data, msg }) => {
      if (msg === "success") {
        setChapterList(data);
      }
    });
  }, []);
  const goWritingDetail = useCallback((stem_list_id) => {
    Taro.navigateTo({
      url: `/pages/chapter-detail/index?stem_list_id=${stem_list_id}`
    });
  }, []);
  return (
    <View className="writing-wrapper">
      <NavBar />
      {chapterList &&
        !!chapterList.length &&
        chapterList.map((item, index) => {
          const { type_str, chapter_name, add_time_str, stem_list_id } = item;
          console.log(item);
          return (
            <AtCard
              onClick={() => goWritingDetail(stem_list_id)}
              key={`${index}`}
              note={add_time_str}
              extra={type_str}
              title={chapter_name}
            >
              模拟考试
            </AtCard>
          );
        })}
    </View>
  );
};

export default Index;
