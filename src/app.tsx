/* eslint-disable no-unused-vars */
import "@tarojs/async-await";
import "taro-ui/dist/style/index.scss"; // 全局样式
import "@/style/custom-theme.scss";
import "./app.scss";
import "./assets/style/taro-ui.css";

import Taro, { Component, Config } from "@tarojs/taro";
import Index from "./pages/index";
import { Provider } from "@tarojs/redux";
import configStore from "./store";

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = configStore();

class App extends Component {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  // eslint-disable-next-line react/sort-comp
  config: Config = {
    pages: [
      "pages/index/index",
      "pages/cloze-list/index",
      "pages/cloze-detail/index",
      "pages/read-list/index",
      "pages/read-detail/index",
      "pages/writing-list/index",
      "pages/writing-detail/index",
      "pages/translation-detail/index",
      "pages/translation-list/index",
      "pages/chapter-list/index",
      "pages/chapter-detail/index",
      "pages/exam-list/index"
    ],
    window: {
      backgroundTextStyle: "light",
      navigationBarBackgroundColor: "#fff",
      navigationBarTitleText: "WeChat",
      navigationBarTextStyle: "black"
    }
  };

  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    );
  }
}

Taro.render(<App />, document.getElementById("app"));
