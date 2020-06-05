import Taro, { useState, useCallback } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtAccordion, AtList, AtListItem, AtSearchBar } from "taro-ui";

const Index = () => {
  const [searchVal, setSearchVal] = useState<string>("");
  const [openChapter, setOpenChapter] = useState<boolean>(true);
  const [openCloze, setOpenCloze] = useState<boolean>(true);
  const [openRead, setOpenRead] = useState<boolean>(false);
  const [openWrite, setOpenWrite] = useState<boolean>(false);

  const handleClozeClick = useCallback(
    (value) => {
      setOpenCloze(value);
    },
    [openCloze]
  );

  const handleChapterClick = useCallback(
    (value) => {
      setOpenChapter(value);
    },
    [openChapter]
  );

  const handleReadClick = useCallback(
    (value) => {
      setOpenRead(value);
    },
    [openRead]
  );

  const handleWriteClick = useCallback(
    (value) => {
      setOpenWrite(value);
    },
    [openWrite]
  );

  const handleSearchChange = useCallback(
    (value) => {
      setSearchVal(value);
    },
    [openWrite]
  );

  return (
    <View>
      <AtSearchBar value={searchVal} onChange={handleSearchChange} />
      <AtAccordion
        title="真题演练"
        icon={{ value: "bookmark", size: "15" }}
        open={openChapter}
        onClick={handleChapterClick}
      >
        <AtList hasBorder={false}>
          <AtListItem
            onClick={() => {
              Taro.navigateTo({
                url: `/pages/chapter-detail/index?stem_id=9313`
              });
            }}
            title="2018年考研英语二考前押题（四）"
            note="真题演练"
            arrow="right"
          />
        </AtList>
      </AtAccordion>
      <AtAccordion
        title="完形填空"
        icon={{ value: "bookmark", size: "15" }}
        open={openCloze}
        onClick={handleClozeClick}
      >
        <AtList hasBorder={false}>
          <AtListItem
            onClick={() => {
              Taro.navigateTo({
                url: `/pages/cloze-detail/index?stem_id=4725`
              });
            }}
            title="2018年考研英语二考前押题（四）"
            note="得分：20 正确率：20%"
            arrow="right"
          />
        </AtList>
      </AtAccordion>
      <AtAccordion
        title="阅读理解"
        icon={{ value: "calendar", size: "15" }}
        open={openRead}
        onClick={handleReadClick}
      >
        <AtList hasBorder={false}>
          <AtListItem
            onClick={() => {
              Taro.navigateTo({
                url: `/pages/read-detail/index?stem_id=4726`
              });
            }}
            title="2018年考研英语一考前押题（四）"
            note="得分：75 正确率：75%"
            arrow="right"
          />
        </AtList>
      </AtAccordion>
      <AtAccordion
        title="作文"
        icon={{ value: "message", size: "15" }}
        open={openWrite}
        onClick={handleWriteClick}
      >
        <AtList hasBorder={false}>
          <AtListItem
            onClick={() => {
              Taro.navigateTo({
                url: `/pages/writing-detail/index?stem_id=4729`
              });
            }}
            title="2018年考研英语二考前押题（四）"
            note=""
            arrow="right"
          />
        </AtList>
      </AtAccordion>
      <AtAccordion
        title="翻译"
        icon={{ value: "message", size: "15" }}
        open={openWrite}
        onClick={handleWriteClick}
      >
        <AtList hasBorder={false}></AtList>
      </AtAccordion>
    </View>
  );
};

export default Index;
