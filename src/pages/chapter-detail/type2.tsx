import "./index.scss";

import { AtButton, AtCard, AtCheckbox, AtIcon, AtMessage } from "taro-ui";
import { RichText, Text, View } from "@tarojs/components";
import Taro, { useEffect, useState } from "@tarojs/taro";
import { IProps } from "./type1";
interface IExerciseInfo {
  thinking: string;
  title_html: string;
}

interface IOptionsArr {
  parent_id: string;
  option_str: string;
  title_html: string;
  stem_id: number;
  chapter_id: number;
  question_id: number;
  priority: number;
  order_num: number;
}

interface IUserSelect {
  [key: string]: string[];
}

const baseInfo = {
  stem_id: 0,
  chapter_id: 0,
  question_id: 0
};

const Index = ({ data, toNext, onChange }: IProps) => {
  const [exerciseInfo, setExerciseInfo] = useState<IExerciseInfo>();
  const [hasAnswer, setHasAnswer] = useState<boolean>(false);
  const [optionsArr, setOptionArr] = useState<IOptionsArr[]>([]);
  const [showThinking, setShowThinking] = useState<boolean>(false);
  const [userSelect, setUserSelect] = useState<IUserSelect>({});
  const [score, setScore] = useState<number>();
  const [rightQues, setRightQues] = useState<string[]>([]);
  const [wrongQues, setWrongQues] = useState<string[]>([]);

  const dealWithData = (data) => {
    const {
      stem_parent_questions,
      stem_child_questions,
      user_answer_info,
      stem_id
    } = data;
    if (!stem_parent_questions.length || !stem_child_questions.length) return;
    if (!stem_parent_questions.length || !stem_child_questions.length) return;
    // 处理选项数组
    const { chapter_id, id, question_id } = stem_parent_questions[0];
    // 父选项
    baseInfo.stem_id = parseInt(stem_id, 10);
    baseInfo.chapter_id = chapter_id;
    baseInfo.question_id = question_id;
    setExerciseInfo(stem_parent_questions[0]);
    const optionArr = stem_child_questions.filter(({ parent_id }) => {
      return parent_id == id;
    });
    setOptionArr(optionArr);
    if (user_answer_info) {
      const { answer_array } = user_answer_info;
      console.log("answer_array", answer_array);
      setHasAnswer(true);
      setUserSelect(JSON.parse(answer_array));
      countScore(stem_child_questions, id, JSON.parse(answer_array));
    }
  };

  useEffect(() => {
    onChange(2, userSelect);
  }, [userSelect]);

  useEffect(() => {
    dealWithData(data);
  }, []);

  /** 统计成绩 */
  const countScore = (option, id, answer_array) => {
    let score = 0;
    const rightArr: string[] = [];
    const wrongArr: string[] = [];
    const arr = option.filter(({ parent_id }) => {
      return parent_id === id;
    });
    arr.forEach((item) => {
      const { option_str, order_num } = item;
      const { answerID } = JSON.parse(option_str);
      console.log(JSON.parse(option_str));
      if (typeof answerID === "string") {
        if (
          answer_array[order_num] &&
          answerID === answer_array[order_num][0]
        ) {
          rightArr.push(order_num);
          score++;
        } else {
          wrongArr.push(order_num);
        }
      }
    });
    // 设置成绩
    console.log(rightArr);
    setWrongQues(wrongArr);
    setRightQues(rightArr);
    setScore(score * (100 / arr.length));
  };

  const handleChange = (item: string[], key: number) => {
    const temp = {};
    temp[key] = item;
    setUserSelect({ ...userSelect, ...temp });
  };

  const handleShowThinkingClick = () => {
    setShowThinking(!showThinking);
  };

  if (!exerciseInfo) return null;
  const { title_html, thinking } = exerciseInfo;

  return (
    <View className="writing-detail-wrapper ">
      <AtMessage />
      <View className="writing-content">
        {title_html && (
          <RichText
            style={{
              margin: ".53333rem .64rem 0",
              color: "#666",
              fontSize: ".59733rem",
              lineHeight: ".896rem"
            }}
            nodes={title_html}
          />
        )}
        {hasAnswer && (
          <View>
            <AtCard title="答题结果分析" extra="满分：100">
              <View className="score-ratio">成绩占比：</View>
              <View>成绩：{score}分</View>
              <View>答对题目数：{rightQues.length}</View>
              <View>正确题目：{rightQues.join(",")}</View>
              <View>错误题目：{wrongQues.join(",")}</View>
            </AtCard>
            <AtButton
              type="primary"
              size="small"
              onClick={handleShowThinkingClick}
            >
              查看解析
            </AtButton>
            {showThinking && (
              <RichText
                style={{
                  margin: ".53333rem .64rem 0",
                  color: "#666",
                  fontSize: ".59733rem",
                  lineHeight: ".896rem"
                }}
                nodes={thinking}
              />
            )}
          </View>
        )}
        {optionsArr &&
          optionsArr.length &&
          optionsArr.map((item) => {
            const { option_str, order_num } = item;
            let { options } = JSON.parse(option_str);
            console.log(item);
            let tit = item.title_html;
            let optionsArray =
              options.map((option) => {
                const { optionText, iD } = option;
                return {
                  label: optionText,
                  value: iD,
                  iD,
                  disabled: hasAnswer
                };
              }) || [];
            return (
              <View key={`${order_num}`}>
                <View>
                  <Text className="child-tit">{order_num}</Text>
                  <AtIcon value="tag" size="20" color="#6190e8" />
                  <Text className="child-tit">{tit}</Text>
                </View>
                <AtCheckbox
                  options={optionsArray}
                  selectedList={userSelect[order_num] || []}
                  onChange={(val: string[]) => handleChange(val, order_num)}
                />
              </View>
            );
          })}
        <AtButton
          type="primary"
          onClick={() => {
            toNext(2);
          }}
        >
          下一题
        </AtButton>
      </View>
    </View>
  );
};

export default Index;
