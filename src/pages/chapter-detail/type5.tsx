import Taro, {
    useEffect,
    useRouter,
    useState,
    useCallback
  } from "@tarojs/taro";
import { View, RichText, ScrollView } from "@tarojs/components";
import {IProps } from './type1'
  
  import {
    AtTextarea,
    AtMessage,
    AtButton,
    AtTabBar,
    AtImagePicker,
  } from "taro-ui";
  import NavBar from "@/components/nav-bar";
  import "./index.scss";
  
  interface IExerciseInfo {
    thinking: string;
    title_html: string;
  }
  
  const baseInfo = {
    stem_id: 0,
    chapter_id: 0,
    question_id: 0
  };
  
  const Index = ({ data,toNext,onChange}:IProps) => {
    const [exerciseInfo, setExerciseInfo] = useState<IExerciseInfo>();
    const [hasAnswer, setHasAnswer] = useState<boolean>(false);
    const [textVal, setTextVal] = useState<string>("");
    const [tabIndex, setTabIndex] = useState<number>(0);
    const [imageFiles, setImageFiles] = useState<any>([]);
    /**
     * 切换提交方式卡片
     */
    const handleChange = useCallback(
      item => {
        setTabIndex(item);
      },
      [tabIndex]
    );
  
    useEffect(() => {
        const {
            stem_parent_questions,
            user_answer_info
          } = data;
          if (!stem_parent_questions.length) return;
    
          const { stem_id,chapter_id, question_id } = stem_parent_questions[0];
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
    }, []);
  
    if (!exerciseInfo) return null;
    const { title_html } = exerciseInfo;
  
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
                onChange={(event: any) => setTextVal(event.target.value)}
                placeholder="Answer here"
              />
            )}
            {tabIndex === 1 && (
              <AtImagePicker
                files={imageFiles}
                onChange={files => setImageFiles(files)}
                onFail={() =>
                  Taro.atMessage({
                    message: "上传出错！请稍后再试",
                    type: "error"
                  })
                }
              />
            )}
          </View>
        </ScrollView>
        <AtButton type="primary" onClick={() => { console.log('提交答案')}}>
            提交
        </AtButton>
      </View>
    );
  };
  
  export default Index;
  