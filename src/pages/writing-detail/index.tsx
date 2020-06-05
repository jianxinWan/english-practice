import Taro, {
  useEffect,
  useRouter,
  useState,
  useCallback
} from "@tarojs/taro";
import { View, RichText, ScrollView } from "@tarojs/components";
import {
  AtTextarea,
  AtMessage,
  AtButton,
  AtTabBar,
  AtImagePicker,
  AtModal
} from "taro-ui";
import NavBar from "@/components/nav-bar";
import "./index.scss";
import { getStemDetail, submitAnswer } from "@/api/index";
import { getStorage } from "@/utils/localstroage";
interface IExerciseInfo {
  thinking: string;
  title_html: string;
}

const baseInfo = {
  stem_id: 0,
  chapter_id: 0,
  question_id: 0
};
let userId;

const Index = () => {
  const router = useRouter();
  const [exerciseInfo, setExerciseInfo] = useState<IExerciseInfo>();
  const [hasAnswer, setHasAnswer] = useState<boolean>(false);
  const [textVal, setTextVal] = useState<string>("");
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [imageFiles, setImageFiles] = useState<any>([]);
  const [confirmSubmit, setConfirmSubmit] = useState<boolean>(false);

  /**
   * 获取题目详细信息
   */
  const fetchInfo = useCallback(() => {
    const { stem_id } = router.params;
    if (!stem_id) return;
    getStorage("userId").then(({ data }) => {
      userId = data;
      getStemDetail(stem_id, data).then((data) => {
        const { stem_parent_questions, user_answer_info } = data;
        if (!stem_parent_questions.length) return;
        const { chapter_id, question_id } = stem_parent_questions[0];
        baseInfo.stem_id = parseInt(stem_id, 10);
        baseInfo.chapter_id = chapter_id;
        baseInfo.question_id = question_id;
        setExerciseInfo(stem_parent_questions[0]);
        if (user_answer_info) {
          const { answer_array } = user_answer_info;
          const answer = JSON.parse(answer_array);
          setTextVal(answer[0].value);
          setImageFiles(answer[1].value);
          setHasAnswer(true);
        }
      });
    });
  }, [router.params]);

  /**
   * 提交答题信息
   */
  const handleSubmit = useCallback(() => {
    submitAnswer({
      uid: userId,
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
    }).then(({ msg, prompt }) => {
      fetchInfo();
      setConfirmSubmit(false);
      Taro.atMessage({
        message: prompt,
        type: msg
      });
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
  const { title_html, thinking } = exerciseInfo;

  return (
    <View className="writing-detail-wrapper ">
      <AtMessage />
      <View className="nav-bar">
        <NavBar title="" />
      </View>

      <ScrollView className="writing-content">
        {title_html && (
          <RichText
            className="at-article__p exercise-wrapper"
            nodes={title_html}
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
              onChange={(val: string) => {
                setTextVal(val);
              }}
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
        {!hasAnswer && (
          <AtButton type="primary" onClick={() => setConfirmSubmit(true)}>
            提交答案
          </AtButton>
        )}
      </ScrollView>
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
