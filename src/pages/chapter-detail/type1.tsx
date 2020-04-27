import Taro, {
  useEffect,
  useState,
  useCallback
} from "@tarojs/taro";
import {
  View,
  RichText,
  Block,
  Text,
} from "@tarojs/components";
import {
  AtRadio,
  AtIcon,
  AtButton,
  AtMessage,
  AtCard,
  AtAccordion
} from "taro-ui";


interface IExerciseInfo {
  thinking: string;
  title_html: string;
}
interface IOptionInfoItem {
  stem_id: number;
  chapter_id: number;
  question_id: number;
  option_str: string;
  priority: string;
}

interface IAnswerItem {
  priority: number;
  value: string;
  iD: string;
}

interface IAnswerCollect {
  rightArray: number[];
  errorArray: number[];
}


const baseInfo = {
  stem_id: 0,
  chapter_id: 0,
  question_id: 0
};

const initAnswerCollect = {
  rightArray: [],
  errorArray: []
};

export interface IProps {
  data: any
  finishCallback: () => void
  onChange: (current:number,ans: IAnswerItem[]) => void
  toNext: (current:number) => void
}

const Type1 = ({ data,toNext,onChange}:IProps) => {
  const [exerciseInfo, setExerciseInfo] = useState<IExerciseInfo>();
  const [optionInfo, setOptionInfo] = useState<IOptionInfoItem[]>([]);
  const [answer, setAnswer] = useState<IAnswerItem[]>([]);
  const [hasAnswer, setHasAnswer] = useState<boolean>(false);
  const [showThinking, setShowThinking] = useState<boolean>(false);

  const [answerCollect, setAnswerCollect] = useState<IAnswerCollect>(
    initAnswerCollect
  );

  const dealWithData = (data) => {
    const {
      stem_parent_questions,
      stem_child_questions,
      user_answer_info,
      stem_id
    } = data;
    console.log(stem_parent_questions[0])
    if (!stem_parent_questions.length || !stem_child_questions.length) return;
    try {
      const initAnswer: IAnswerItem[] = [];
      for (let i = 0; i < stem_child_questions.length; i++) {
        const item = {
          priority: i + 1,
          value: "",
          iD: ""
        };
        initAnswer[i] = item;
      }
      setExerciseInfo(stem_parent_questions[0]);
      setOptionInfo(stem_child_questions);
      const { chapter_id, question_id } = stem_parent_questions[0];
      baseInfo.stem_id = parseInt(stem_id, 10);
      baseInfo.chapter_id = chapter_id;
      baseInfo.question_id = question_id;
      setAnswer(initAnswer);
    
      if (user_answer_info) {
        const { answer_array } = user_answer_info;
        setAnswer(JSON.parse(answer_array));
        setHasAnswer(true);
      }
    } catch (e) {
      console.log(e)
    }
  }

  // 统计成绩
  const calculateScore = useCallback(() => {
    if (!hasAnswer) return;
    optionInfo.map((item, index) => {
      const { option_str } = item;
      const { answerID } = JSON.parse(option_str);
      let { rightArray, errorArray } = answerCollect;
      if (answerID === answer[index].iD) {
        rightArray.push(index + 1);
      } else {
        errorArray.push(index + 1);
      }
      setAnswerCollect({
        rightArray,
        errorArray
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answer, hasAnswer, optionInfo]);
  /**
   * 选项点击
   */

  const handleOptionClick = useCallback(
    (optionValue, index, item) => {
      const { iD } = item;
      const temp: IAnswerItem = {
        priority: index,
        value: optionValue,
        iD: iD
      };
      // 取消选中
      if (optionValue === answer[index].value) {
        temp.value = "";
      }
      setAnswer([...answer.slice(0, index), temp, ...answer.slice(index + 1)]);
    },
    [answer]
  );

  useEffect(() => {
    calculateScore();
  }, [calculateScore]);

  useEffect(() => {
    dealWithData(data)
  }, []);

  useEffect(() => {
    onChange(1,answer)
  },[answer])

  if (!exerciseInfo) return null;
  const { title_html, thinking } = exerciseInfo;

  return (
    <View className="cloze-detail-wrapper" >
      <AtMessage />
      <View className="cloze-content">
        {title_html && (
          <RichText
            style={{
              margin: '.53333rem .64rem 0',
              color: '#666',
              fontSize: '.59733rem',
              lineHeight: '.896rem',
            }}
            nodes={title_html}
          />
        )}
        {hasAnswer && (
          <Block>
            <AtCard title="答题结果分析" extra="满分：100">
              <View className="score-ratio">成绩占比：</View>
              <View>
                成绩：
                {answerCollect.rightArray.length * (100 / optionInfo.length)}分
              </View>
              <View>答对题目数：{answerCollect.rightArray.length}</View>
              <View>正确题目：{answerCollect.rightArray.join(",")}</View>
              <View>错误题目：{answerCollect.errorArray.join(",")}</View>
            </AtCard>
            <AtAccordion
              title="查看解析："
              open={showThinking}
              onClick={(value: any) => setShowThinking(value)}
            >
              <RichText
                style={{
                  margin: '.53333rem .64rem 0',
                  color: '#666',
                  fontSize: '.59733rem',
                  lineHeight: '.896rem',
                }}
                nodes={thinking}
              />
            </AtAccordion>
          </Block>
        )}
        {optionInfo &&
          optionInfo.length &&
          optionInfo.map((item, index: number) => {
            const { option_str } = item;
            const { options, answerID } = JSON.parse(option_str);
            let answerValue = "";
            const optionArray = options.map(option => {
              const { optionText, iD } = option;
              if (answerID === iD) {
                answerValue = optionText;
              }
              return {
                label: optionText,
                value: optionText,
                iD,
                disabled: hasAnswer
              };
            });
            return (
              <View key={`${index}`}>
                <View className="top-card">
                  <View className="left">
                    <AtIcon value="tag" size="20" color="#6190e8" />
                    <Text className="card-text">option:{index + 1}</Text>
                    {hasAnswer && answerID === answer[index].iD && (
                      <View
                        className="answer-type"
                        style={{ borderColor: "#13CE66" }}
                      >
                        <AtIcon
                          value="check"
                          size="12"
                          color="#13CE66"
                        ></AtIcon>
                      </View>
                    )}
                    {hasAnswer && answerID !== answer[index].iD && (
                      <View
                        className="answer-type"
                        style={{ borderColor: "#FF4949" }}
                      >
                        <AtIcon
                          value="close"
                          size="12"
                          color="#FF4949"
                        ></AtIcon>
                      </View>
                    )}
                  </View>
                  {hasAnswer && <Text>正确答案: {answerValue}</Text>}
                </View>
                <AtRadio
                  options={optionArray}
                  value={answer[index].value}
                  onClick={(optionValue: string, optionItem: any) =>
                    handleOptionClick(optionValue, index, optionItem)
                  }
                />
              </View>
            );
          })}
        {!hasAnswer && (
          <Block>
            <AtButton type="primary" onClick={() => { toNext(1)}}>
              下一题
            </AtButton>
          </Block>
        )}
      </View>
    </View>
  );
};

export default Type1;
