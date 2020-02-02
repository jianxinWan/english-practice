import Taro, { useEffect, useRouter, useState, useCallback } from '@tarojs/taro'
import { View, RichText, Block, ScrollView, Text, Button } from '@tarojs/components'
import {
  AtRadio,
  AtIcon,
  AtButton,
  AtProgress,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
  AtMessage,
  AtCard,
  AtAccordion,
} from 'taro-ui'
import NavBar from '@/components/nav-bar'
import './index.less'

interface IExerciseInfo {
  thinking: string
  title_html: string
}
interface IOptionInfoItem {
  stem_id: number
  chapter_id: number
  question_id: number
  option_str: string
  priority: string
}

interface IAnswerItem {
  priority: number
  value: string,
  iD: string
}

interface IAnswerCollect {
  rightArray: number[],
  errorArray: number[]
}

let dial = 0 //每道题的占比

const baseInfo = {
  stem_id: 0,
  chapter_id: 0,
  question_id: 0,
}

const initAnswerCollect = {
  rightArray: [],
  errorArray: []
}

const Index = () => {
  const router = useRouter()
  const [exerciseInfo, setExerciseInfo] = useState<IExerciseInfo>()
  const [optionInfo, setOptionInfo] = useState<IOptionInfoItem[]>([])
  const [answer, setAnswer] = useState<IAnswerItem[]>([])
  const [finishPercent, setFinishPercent] = useState<number>(0)
  const [showModal, setShowModel] = useState<boolean>(false)
  const [hasAnswer, setHasAnswer] = useState<boolean>(false)
  const [showThinking, setShowThinking] = useState<boolean>(false)

  const [answerCollect, setAnswerCollect] = useState<IAnswerCollect>(initAnswerCollect)

  const fetchInfo = useCallback(() => {
    const { stem_id } = router.params
    if (!stem_id) return
    setAnswerCollect({
      rightArray: [],
      errorArray: []
    })
    window.fetch(`http://127.0.0.1:7001/english-practice/api/get-stem/detail/?stem_id=${stem_id}&uid=567876767`)
      .then(res => res.json())
      .then(({ data, msg }) => {
        if (msg !== 'success') {
          return;
        }
        const { stem_parent_questions, stem_child_questions, user_answer_info } = data
        if (!stem_parent_questions.length || !stem_child_questions.length) return
        const initAnswer: IAnswerItem[] = []
        for (let i = 0; i < stem_child_questions.length; i++) {
          const item = {
            priority: i + 1,
            value: '',
            iD: '',
          }
          initAnswer[i] = item
        }
        dial = 100 / stem_child_questions.length
        const { chapter_id, question_id } = stem_parent_questions[0]
        baseInfo.stem_id = parseInt(stem_id, 10)
        baseInfo.chapter_id = chapter_id
        baseInfo.question_id = question_id
        setAnswer(initAnswer)
        setExerciseInfo(stem_parent_questions[0])
        setOptionInfo(stem_child_questions)
        if (user_answer_info) {
          const { answer_array } = user_answer_info
          setAnswer(JSON.parse(answer_array))
          setHasAnswer(true)
        }
      })
  }, [router.params])

  // 统计成绩
  const calculateScore = useCallback(() => {
    if (!hasAnswer) return
    optionInfo.map((item, index) => {
      const { option_str } = item
      const { answerID } = JSON.parse(option_str)
      let { rightArray, errorArray } = answerCollect
      if (answerID === answer[index].iD) {
        rightArray.push(index + 1)
      } else {
        errorArray.push(index + 1)
      }
      setAnswerCollect({
        rightArray,
        errorArray
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answer, hasAnswer, optionInfo])

  useEffect(() => {
    calculateScore()
  }, [calculateScore])

  /**
   * 选项点击
   */

  const handleOptionClick = useCallback((optionValue, index, item) => {
    const { iD } = item
    const temp: IAnswerItem = {
      priority: index,
      value: optionValue,
      iD: iD
    }
    setFinishPercent(finishPercent + dial)
    // 取消选中
    if (optionValue === answer[index].value) {
      temp.value = ''
      setFinishPercent(finishPercent - dial)
    }
    setAnswer([...answer.slice(0, index), temp, ...answer.slice(index + 1)])

  }, [answer, finishPercent])

  /**
   * 提交答题信息
   */
  const handleSubmit = useCallback(() => {
    window.fetch('http://127.0.0.1:7001/english-practice/api/answer/submit/', {
      method: 'POST',
      // credentials: 'include',
      body: JSON.stringify({
        uid: '567876767',
        answer_array: answer,
        ...baseInfo
      }),
      headers: {
        'content-type': 'application/json'
      },
    })
      .then(res => res.json())
      .then(({ msg, prompt }) => {
        fetchInfo()
        Taro.atMessage({
          'message': prompt,
          'type': msg,
        })
      })
    setShowModel(false)
  }, [answer, fetchInfo])

  useEffect(() => {
    fetchInfo()
  }, [fetchInfo])

  if (!exerciseInfo) return
  const { title_html, thinking } = exerciseInfo;

  return (
    <View className='cloze-detail-wrapper'>
      <AtMessage />
      <View className='nav-bar'>
        <NavBar title='' />
      </View>

      <ScrollView className='cloze-content'>
        {title_html && (
          <RichText className='at-article__p exercise-wrapper' nodes={title_html} />
        )}
        {hasAnswer &&
          <Block>
            <AtCard
              title='答题结果分析'
              extra='满分：100'
            >
              <View className='score-ratio'>
                成绩占比：
            </View>
              <View>
                成绩：{answerCollect.rightArray.length * (100 / optionInfo.length)}分
            </View>
              <View>
                答对题目数：{answerCollect.rightArray.length}
              </View>
              <View>
                正确题目：{answerCollect.rightArray.join(',')}
              </View>
              <View>
                错误题目：{answerCollect.errorArray.join(',')}
              </View>

            </AtCard>
            <AtAccordion
              title='查看解析：'
              open={showThinking}
              onClick={(value: any) => setShowThinking(value)}
            >
              <RichText className='at-article__p' nodes={thinking} />
            </AtAccordion>
          </Block>
        }
        {optionInfo && optionInfo.length && optionInfo.map((item, index: number) => {
          const { option_str } = item
          const { options, answerID } = JSON.parse(option_str)
          let answerValue = ''
          const optionArray = options.map((option) => {
            const { optionText, iD } = option
            if (answerID === iD) {
              answerValue = optionText
            }
            return {
              label: optionText,
              value: optionText,
              iD,
              disabled: hasAnswer,
            }
          })
          return (
            <View
              key={index}
            >
              <View className='top-card'>
                <View className='left'>
                  <AtIcon value='tag' size='20' color='#6190e8' />
                  <Text className='card-text'>option:{index + 1}</Text>
                  {hasAnswer && answerID === answer[index].iD && <View className='answer-type' style={{ borderColor: '#13CE66' }}>
                    <AtIcon value='check' size='12' color='#13CE66'></AtIcon>
                  </View>}
                  {hasAnswer && answerID !== answer[index].iD && <View className='answer-type' style={{ borderColor: '#FF4949' }}>
                    <AtIcon value='close' size='12' color='#FF4949'></AtIcon>
                  </View>}
                </View>
                {hasAnswer && (
                  <Text>
                    正确答案: {answerValue}
                  </Text>
                )}
              </View>
              <AtRadio
                options={optionArray}
                value={answer[index].value}
                onClick={(optionValue: string, optionItem: any) => handleOptionClick(optionValue, index, optionItem)}
              />
            </View>
          )
        })}
        {!hasAnswer && (
          <Block>
            <View className='finish-progress'>
              <Text className='finish-label'>完成度:</Text>
              <AtProgress percent={finishPercent} color={finishPercent < 30 ? '#FF4949' : (finishPercent < 60 && finishPercent > 30) ? '#FFC82C' : '#13CE66'} />
            </View>
            <AtModal
              isOpened={showModal}
            >
              <AtModalHeader>提交</AtModalHeader>
              <AtModalContent>
                {finishPercent > 99 && '题目已全部作答，确认提交？'}
                {finishPercent < 99 && `当前你的完成度为${finishPercent}%，确认提交？`}
              </AtModalContent>
              <AtModalAction>
                <Button onClick={() => setShowModel(false)}>取消</Button>
                <Button onClick={handleSubmit}>确定</Button>
              </AtModalAction>
            </AtModal>
            <AtButton type='primary' onClick={() => setShowModel(true)} >提交</AtButton>
          </Block>
        )}
      </ScrollView>
    </View>
  )
}

export default Index