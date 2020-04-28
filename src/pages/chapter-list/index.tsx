import Taro, { useEffect, useState, useCallback } from "@tarojs/taro";
import { View } from "@tarojs/components";
import NavBar from "@/components/nav-bar";
import { AtCard } from "taro-ui";
import { getExerciseList } from "@/api/index";

import "./index.scss";

const Index = () => {
  const [chapterList, setChapterList] = useState([]);
  useEffect(() => {
    getExerciseList(1).then((data) => {
      setChapterList(data);
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
              真题演练
            </AtCard>
          );
        })}
    </View>
  );
};

export default Index;
