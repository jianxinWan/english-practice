import Taro, { useEffect, useState, useCallback } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtAccordion, AtList, AtListItem } from "taro-ui";

const Index = () => {
  const [openCloze, setOpenCloze] = useState<boolean>(true);
  const [openRead, setOpenRead] = useState<boolean>(false);
  const [openWrite, setOpenWrite] = useState<boolean>(false);

  const handleClozeClick = useCallback(
    (value) => {
      setOpenCloze(value);
    },
    [openCloze]
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

  return (
    <View>
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
            title="2018年考研英语一考前押题（五）"
            note="得分：0 正确率：0%"
            arrow="right"
          />
          <AtListItem
            title="2018年考研英语一考前押题（四）"
            note="得分：40 正确率：40%"
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
            title="2018年考研英语一考前押题（五）"
            note=""
            arrow="right"
          />
        </AtList>
      </AtAccordion>
    </View>
  );
};

export default Index;
