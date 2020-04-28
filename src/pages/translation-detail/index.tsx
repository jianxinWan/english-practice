import Taro, {
  useEffect,
  useRouter,
  useState,
  useCallback
} from "@tarojs/taro";
import { View, RichText } from "@tarojs/components";
import {
  AtTextarea,
  AtMessage,
  AtButton,
  AtTabBar,
  AtImagePicker,
  AtModal,
  AtAccordion
} from "taro-ui";
import NavBar from "@/components/nav-bar";
import "./index.scss";
import fetch from "@/utils/fetch";

interface IExerciseInfo {
  thinking: string;
  titleHTML: string;
  answer: string;
}

const baseInfo = {
  stem_id: 1,
  chapter_id: 1,
  question_id: 1
};

const Index = () => {
  const router = useRouter();
  const [exerciseInfo, setExerciseInfo] = useState<IExerciseInfo>();
  const [hasAnswer, setHasAnswer] = useState<boolean>(false);
  const [showThinking, setShowThinking] = useState<boolean>(true);
  const [textVal, setTextVal] = useState<string>("");
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [imageFiles, setImageFiles] = useState<any>([]);
  const [confirmSubmit, setConfirmSubmit] = useState<boolean>(false);
  const fetchInfo = useCallback(() => {
    const { show_type_id } = router.params;
    if (!show_type_id) return;
    fetch({
      url: `http://127.0.0.1:7001/english-practice/api/spider/translation/detail/?show_type_id=${show_type_id}&uid=567876767`
    }).then(({ data, status }) => {
      if (status !== 200) {
        return;
      }
      const { quesNormalData, user_answer_info } = data;
      const { jsonStr } = quesNormalData[0];
      baseInfo.stem_id = parseInt(show_type_id, 10);
      setExerciseInfo(JSON.parse(jsonStr));
      console.log(user_answer_info);
      if (user_answer_info) {
        console.log(user_answer_info);
        const { answer_array } = user_answer_info;
        const answer = JSON.parse(answer_array);
        setTextVal(answer[0].value);
        setImageFiles(answer[1].value);
        setHasAnswer(true);
      }
    });
  }, [router.params]);

  /**
   * 提交答题信息
   */
  const handleSubmit = useCallback(() => {
    fetch({
      url: "http://127.0.0.1:7001/english-practice/api/answer/submit/",
      method: "POST",
      params: JSON.stringify({
        uid: "567876767",
        answer_array: [
          {
            type: "text",
            value: textVal
          },
          {
            type: "images",
            value: imageFiles
          }
        ],
        ...baseInfo
      }),
      headers: {
        "content-type": "application/json"
      }
    }).then(({ msg, prompt }) => {
      setConfirmSubmit(false);
      console.log(msg, prompt);
      // fetchInfo();
      // Taro.atMessage({
      //   message: prompt,
      //   type: msg
      // });
    });
  }, [fetchInfo, textVal, imageFiles]);

  /**
   * 切换提交方式卡片
   */
  const handleChange = useCallback(
    (item) => {
      setTabIndex(item);
    },
    [tabIndex]
  );

  useEffect(() => {
    fetchInfo();
  }, [fetchInfo]);

  if (!exerciseInfo) return;
  const { titleHTML, answer } = exerciseInfo;

  return (
    <View className="writing-detail-wrapper ">
      <AtMessage />
      <View className="nav-bar">
        <NavBar title="" />
      </View>
      <View className="writing-content" style={{ padding: "0 5px 30px" }}>
        {titleHTML && (
          <RichText
            className="at-article__p exercise-wrapper"
            nodes={titleHTML}
          />
        )}
        <View className="answer-wrapper">
          <AtTabBar
            tabList={[
              { title: "文本作答", iconType: "edit" },
              { title: "拍照上传", iconType: "camera" }
            ]}
            onClick={handleChange}
            current={tabIndex}
          />
          {tabIndex === 0 && (
            <AtTextarea
              autoFocus
              count={true}
              maxLength={2000}
              value={textVal}
              onChange={(val: string) => setTextVal(val)}
              placeholder="Answer here"
            />
          )}
          {tabIndex === 1 && (
            <AtImagePicker
              files={imageFiles}
              onChange={(files) => setImageFiles(files)}
              onFail={() =>
                Taro.atMessage({
                  message: "上传出错！请稍后再试",
                  type: "error"
                })
              }
            />
          )}
        </View>
        {hasAnswer && (
          <AtAccordion
            title="查看解析："
            open={showThinking}
            onClick={(value: any) => setShowThinking(value)}
          >
            <RichText className="at-article__p" nodes={answer} />
          </AtAccordion>
        )}

        {!hasAnswer && (
          <AtButton type="primary" onClick={() => setConfirmSubmit(true)}>
            提交答案
          </AtButton>
        )}
      </View>
      <AtModal
        isOpened={confirmSubmit}
        title="确认提交"
        cancelText="取消"
        confirmText="确认"
        onClose={() => setConfirmSubmit(false)}
        onCancel={() => setConfirmSubmit(false)}
        onConfirm={() => handleSubmit()}
      />
    </View>
  );
};

export default Index;
