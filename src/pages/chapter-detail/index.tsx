import "./index.scss";

import {
  AtNoticebar,
  AtList,
  AtDrawer,
  AtListItem,
  AtTabBar,
  AtModal
} from "taro-ui";
import { View,Text } from "@tarojs/components";
import Taro, {
  useCallback,
  useEffect,
  useRouter,
  useState
} from "@tarojs/taro";

import NavBar from "@/components/nav-bar";
import fetch from "@/utils/fetch";
import useCountDown from "../../assets/hooks/useCountDown";

import Type1 from './type1'
import Type2 from './type2'
import Type3 from './type3'
import Type4 from './type4'
import Type5 from './type5'


interface IParentItem {
  chapter_id: number
  id: string
  question_id: number
  stem_id: number
  thinking: number
  title_html: string
}

interface IItemType {
  chapter_id: number
  priority: number
  stem_child_ques_list: string
  stem_desc: string
  stem_id: number
  stem_list_id: number
  stem_name: string
  stem_parent_ques_list: IParentItem[]
}

const Index = () => {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false)
  const [hasPause, setHasPause] = useState(false)
  const [current, setCurrent] = useState(3)
  const [exercise, setExercise] = useState<IItemType[]>([])
  const [currentType, setCurrentType] = useState<IItemType>()
  const [userAnswer, setUserAnswer] = useState({})
  const [confirmSubmit,setConfirmSubmit] = useState(false)
  const countDown = useCountDown(7200, () => {
    console.log('endTimeCallBack');
    setCurrent(2)
  })

  /**
   * 获取考题的具体信息
   */
  const fetchInfo = useCallback(() => {
    fetch({
      url: `http://127.0.0.1:7001/english-practice/api/exercise/detail/?stem_list_id=${router.params.stem_list_id}`
    }).then(({ data, msg }) => {
      if (msg === "success") {
        console.log('data', data)
        setExercise(data)
        setCurrentType(data[0])
      }
    });
  }, []);

  useEffect(() => {
    fetchInfo()
  }, [fetchInfo]);

  const tagClick = (item) => {
    setCurrentType(item)
    setShowMenu(false)
  }

  const tabHandleClick = (index) => {
    if (index === 1) {
      setShowMenu(true)
    }
    if (index === 0) {
      if (!hasPause) {
        countDown.pause()
        setHasPause(true)
        setCurrent(0)
      } else {
        countDown.restart()
        setHasPause(false)
        setCurrent(3)
      }
    }
    if (index === 2) {
      setConfirmSubmit(true)
    }
  }

  const saveUserAnswer = (type, ans) => {
    let newObj = userAnswer
    newObj[type] = ans
    setUserAnswer(newObj)
    console.log(userAnswer)
  }

  const handleNext = (current) => {
    setCurrentType(exercise[current])
  }
  
  useEffect(() => {
    console.log(userAnswer)
  },[userAnswer])

  if(!currentType) return 
  const { priority,stem_name } = currentType
  return (
    <View className="chapter-detail-wrapper">
      <NavBar />
      <AtNoticebar className="question-title">{stem_name}</AtNoticebar>
      <View className="content" style={{paddingBottom: '60px'}}>
        {hasPause &&
          <View className="mask">
            <Text className="tips">休息一会～，点击左下角按钮进行解锁</Text>
          </View>
        }
        {priority === 1 &&
          <Type1
          data={currentType}
          onChange={saveUserAnswer}
          finishCallback={() => { console.log('finish!') }}
          toNext={handleNext}
          />}
        {priority === 2 &&
          <Type2
            data={currentType}
            onChange={saveUserAnswer}
            finishCallback={() => { console.log('finish!') }} 
            toNext={handleNext}
          />
        }
        {priority === 3 &&
          <Type3
            data={currentType}
            onChange={saveUserAnswer}
            finishCallback={() => { console.log('finish!') }} 
            toNext={handleNext}
          />
        }
        {priority === 4 &&
          <Type4
            data={currentType}
            onChange={saveUserAnswer}
            finishCallback={() => { console.log('finish!') }} 
            toNext={handleNext}
          />
        }
        {priority === 5 &&
          <Type5
            data={currentType}
            onChange={saveUserAnswer}
            finishCallback={() => { console.log('finish!') }} 
            toNext={handleNext}
          />
        }
      </View>
      <AtTabBar
        onClick={tabHandleClick}
        fixed
        iconSize={16}
        fontSize={12}
        tabList={[
          { title: "暂停", iconType: "lock" },
          { title: "选题卡", iconType: "align-left" },
          { title: "交卷", iconType: "file-generic" },
          { title: countDown.time, iconType: "clock" }
        ]}
        current={current}
      />
      <AtDrawer
        show={showMenu}
        mask
        width="280px"
        onClose={()=>setShowMenu(false)}
      >
        <AtList className="menu">
          {exercise && !!exercise.length && exercise.map((item,index) => {
            const {stem_name} = item
            return (
              <AtListItem title={stem_name} key={`${index}`} onClick={()=>tagClick(item)} />
            )
          })}
        </AtList>
      </AtDrawer>
      <AtModal
        isOpened={confirmSubmit}
        title="确认提交"
        cancelText="取消"
        confirmText="确认"
        onClose={() => setConfirmSubmit(false)}
        onCancel={() => setConfirmSubmit(false)}
        onConfirm={() => console.log('submit')}
      />
    </View>
  );
};

export default Index;
