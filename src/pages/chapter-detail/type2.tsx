import "./index.scss";

import {
  AtButton,
  AtCard,
  AtCheckbox,
  AtIcon,
  AtMessage,
} from "taro-ui";
import { RichText, Text, View } from "@tarojs/components";
import Taro, {
  useCallback,
  useEffect,
  useState
} from "@tarojs/taro";
import {IProps } from './type1'
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

const Index = ({ data,toNext,onChange}:IProps) => {
  const [exerciseInfo, setExerciseInfo] = useState<IExerciseInfo>();
  const [hasAnswer, setHasAnswer] = useState<boolean>(false);
  const [confirmSubmit, setConfirmSubmit] = useState<boolean>(false);
  const [optionsArr, setOptionArr] = useState<IOptionsArr[]>([]);
  const [parentId, setParentId] = useState<string>("");
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
    // 处理选项数组
    setOptionArr(stem_child_questions);
    // 父选项
    const { chapter_id, id, question_id } = stem_parent_questions[0];
    baseInfo.stem_id = parseInt(stem_id, 10);
    baseInfo.chapter_id = chapter_id;
    baseInfo.question_id = question_id;
    setParentId(id);
    setExerciseInfo(stem_parent_questions[0]);
    if (user_answer_info) {
      const { answer_array } = user_answer_info;
      setHasAnswer(true);
      setUserSelect(JSON.parse(answer_array));
      countScore(stem_child_questions, id);
    }
  }

  /**
   * 提交答题信息
   */
  const handleSubmit = useCallback(() => {
    window
      .fetch("http://127.0.0.1:7001/english-practice/api/answer/submit/", {
        method: "POST",
        // credentials: 'include',
        body: JSON.stringify({
          uid: "567876767",
          answer_array: userSelect,
          ...baseInfo
        }),
        headers: {
          "content-type": "application/json"
        }
      })
      .then(res => res.json())
      .then(({ msg, prompt }) => {
        setConfirmSubmit(false);
        Taro.atMessage({
          message: prompt,
          type: msg
        });
      });
  }, []);

  useEffect(() => {
    dealWithData(data)
  }, []);

  /** 统计成绩 */

  const countScore = (option, id) => {
    let score = 0;
    const rightArr: string[] = [];
    const wrongArr: string[] = [];
    const arr = option.filter(item => {
      const { parent_id } = item;
      if (parent_id !== id) {
        return false;
      } else {
        return true;
      }
    });
    arr.forEach(item => {
      const { option_str, title_html } = item;
      const { answerID } = JSON.parse(option_str);
      const index = title_html.slice(0, 1);

      console.log(index);
      if (typeof answerID === "string") {
        if (userSelect[index] && answerID === userSelect[index][0]) {
          rightArr.push[index];
          score++;
        } else {
          wrongArr.push(index);
        }
      }
    });
    // 设置成绩
    setWrongQues(wrongArr);
    setRightQues(rightArr);
    setScore(score * (100 / arr.length));
  };

  const handleChange = (item: string[], index: string) => {
    const temp = userSelect;
    temp[index] = item;
    setUserSelect(temp);
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
              margin: '.53333rem .64rem 0',
              color: '#666',
              fontSize: '.59733rem',
              lineHeight: '.896rem',
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
                  margin: '.53333rem .64rem 0',
                  color: '#666',
                  fontSize: '.59733rem',
                  lineHeight: '.896rem',
                }}
                nodes={thinking}
              />
            )}
          </View>
        )}
        {/* {optionsArr &&
          optionsArr.length &&
          optionsArr.map((item, index) => {
            const { parent_id, title_html,option_str } = item;
            const { options } = JSON.parse(option_str);
            if (parentId !== parent_id) return null;
            const optionArray = options.map(option => {
              const { optionText, iD } = option;
              return {
                label: optionText,
                value: iD,
                iD,
                disabled: hasAnswer
              };
            });
            return (
              <View>
                <View>
                  <AtIcon value="tag" size="20" color="#6190e8" />
                  <Text className="child-tit">{item.title_html}</Text>
                </View>
                <AtCheckbox
                  options={optionArray}
                  selectedList={userSelect[title_html.slice(0, 1)] || []}
                  onChange={(val: string[]) =>
                    handleChange(val, title_html.slice(0, 1))
                  }
                />
              </View>
            );
          })} */}
        <AtButton type="primary" onClick={() => { toNext(2)}}>
            下一题
        </AtButton>
      </View>
    </View>
  );
};

export default Index;
