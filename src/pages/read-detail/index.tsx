import './index.less'

import {
  AtButton,
  AtCard,
  AtCheckbox,
  AtIcon,
  AtMessage,
  AtModal
} from 'taro-ui'
import { RichText, ScrollView, Text, View } from '@tarojs/components'
import Taro, { useCallback, useEffect, useRouter, useState } from '@tarojs/taro'

import NavBar from '@/components/nav-bar'

interface IExerciseInfo {
  thinking: string
  title_html: string
}

interface IOptionsArr {
  parent_id: string
  option_str: string
  title_html: string
  stem_id: number
  chapter_id: number
  question_id: number
  priority: number
  order_num: number
}

interface IUserSelect {
  [key:string]:string[]
}

const baseInfo = {
  stem_id: 0,
  chapter_id: 0,
  question_id: 0,
}

const Index = () => {
  const router = useRouter()
  const [exerciseInfo, setExerciseInfo] = useState<IExerciseInfo>()
  const [hasAnswer, setHasAnswer] = useState<boolean>(false)
  const [confirmSubmit, setConfirmSubmit] = useState<boolean>(false)
  const [optionsArr,setOptionArr] = useState<IOptionsArr[]>([])
  const [parentId,setParentId] = useState<string>("")
  const [showThinking,setShowThinking] = useState<boolean>(false)
  const [userSelect,setUserSelect] = useState<IUserSelect>({})
  const [score,setScore] = useState<number>()
  const [rightQues,setRightQues] = useState<string[]>([])
  const [wrongQues,setWrongQues] = useState<string[]>([])

  const fetchInfo = useCallback(() => {
    const { stem_id } = router.params
    if (!stem_id) return

    window.fetch(`http://127.0.0.1:7001/english-practice/api/get-stem/detail/?stem_id=${stem_id}&uid=567876767`)
      .then(res => res.json())
      .then(({ data, msg }) => {
        if (msg !== 'success') {
          return;
        }
        const { stem_parent_questions, stem_child_questions, user_answer_info } = data
        if (!stem_parent_questions.length || !stem_child_questions.length) return
        // 处理选项数组
        setOptionArr(stem_child_questions);
        // 父选项
        const { chapter_id,id, question_id } = stem_parent_questions[0]
        baseInfo.stem_id = parseInt(stem_id, 10)
        baseInfo.chapter_id = chapter_id
        baseInfo.question_id = question_id
        setParentId(id)
        setExerciseInfo(stem_parent_questions[0])
        if (user_answer_info) {
          const {answer_array} = user_answer_info
          console.log('4')
          setHasAnswer(true)
          setUserSelect(JSON.parse(answer_array))
          countScore(stem_child_questions,id)
        }
      })
  }, [])

  /**
   * 提交答题信息
   */
  const handleSubmit = useCallback(() => {
    window.fetch('http://127.0.0.1:7001/english-practice/api/answer/submit/', {
      method: 'POST',
      // credentials: 'include',
      body: JSON.stringify({
        uid: '567876767',
        answer_array: userSelect,
        ...baseInfo
      }),
      headers: {
        'content-type': 'application/json'
      },
    })
      .then(res => res.json())
      .then(({ msg, prompt }) => {
        fetchInfo()
        setConfirmSubmit(false)
        Taro.atMessage({
          'message': prompt,
          'type': msg,
        })
      })
  }, [fetchInfo])

  useEffect(() => {
    fetchInfo()
  }, [fetchInfo])

  /** 统计成绩 */

  const countScore = (option,id) =>{
    let score = 0;
    const rightArr:string[] = [];
    const wrongArr:string[] = [];
    const arr = option.filter((item)=>{
      const {parent_id} = item
      if(parent_id !== id){
        return false
      }else{
        return true
      }
    })
    arr.forEach(item => {
      const {option_str,title_html} = item
      const {answerID} = JSON.parse(option_str)
      const index = title_html.slice(0,1)

      console.log(index)
      if(typeof answerID === "string"){
        if(userSelect[index] && (answerID === userSelect[index][0])){
          rightArr.push[index]
          score++
        }else{
          wrongArr.push(index)
        }
      }
    });
    // 设置成绩
    setWrongQues(wrongArr)
    setRightQues(rightArr)
    setScore(score*(100/arr.length))
  }

  const handleChange = (item:string[],index:string) => {
    const temp = userSelect
    temp[index] = item
    setUserSelect(temp)
  }

  const handleShowThinkingClick = () => {
    setShowThinking(!showThinking)
  }

  if (!exerciseInfo) return
  const { title_html, thinking } = exerciseInfo;


  return (
    <View className='writing-detail-wrapper '>
      <AtMessage />
      <View className='nav-bar'>
        <NavBar title='' />
      </View>
      <ScrollView className='writing-content'>
        {title_html && (
          <RichText className='at-article__p exercise-wrapper' nodes={title_html} />
        )}
        {hasAnswer && (
          <View>
            <AtCard
              title='答题结果分析'
              extra='满分：100'
            >
              <View className='score-ratio'>
                成绩占比：
            </View>
              <View>
                成绩：{score}分
            </View>
              <View>
                答对题目数：{rightQues.length}
              </View>
              <View>
                正确题目：{rightQues.join(',')}
              </View>
              <View>
                错误题目：{wrongQues.join(',')}
              </View>

            </AtCard>
            <AtButton type='primary' size='small' onClick={handleShowThinkingClick}>查看解析</AtButton>
            {showThinking && <RichText className='at-article__p exercise-wrapper' nodes={thinking} />}
          </View>
        )}
        {optionsArr && optionsArr.length && optionsArr.map((item,index)=>{
          const {parent_id,title_html,option_str} = item
          const { options } = JSON.parse(option_str)
          if(parentId !== parent_id) return ;
          const optionArray = options.map((option) => {
            const { optionText, iD } = option
            return {
              label: optionText,
              value: iD,
              iD,
              disabled: hasAnswer,
            }
          })
          return (
            <View>
              <View>
                <AtIcon value='tag' size='20' color='#6190e8' />
                <Text className="child-tit">{title_html}</Text>
              </View>
              <AtCheckbox
                options={optionArray}
                selectedList={userSelect[title_html.slice(0,1)] || []}
                onChange={(val:string[])=>handleChange(val,title_html.slice(0,1))}
              />
             </View>
          )
        })}
        {!hasAnswer && <AtButton
          type='primary'
          onClick={() => setConfirmSubmit(true)}>
          提交答案
        </AtButton>}
      </ScrollView>
      <AtModal
        isOpened={confirmSubmit}
        title='确认提交'
        cancelText='取消'
        confirmText='确认'
        onClose={() => setConfirmSubmit(false)}
        onCancel={() => setConfirmSubmit(false)}
        onConfirm={() => handleSubmit()}
      />
    </View>
  )
}

export default Index