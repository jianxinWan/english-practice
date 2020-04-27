import Taro from "@tarojs/taro";

const defaultMethod = "GET";
const messageToast = title => {
  Taro.showToast({
    title,
    icon: "none",
    duration: 1000
  });
};

export default function fetch(options) {
  const {
    url,
    method = defaultMethod,
    params,
    showErrorToast = true
  } = options;
  return Taro.request({
    url,
    method,
    data: params
  })
    .then(response => {
      const { data } = response;
      return Promise.resolve(data);
    })
    .catch(errors => {
      const { errMsg } = errors;
      console.log(errMsg);
      if (showErrorToast) {
        messageToast(errMsg || "发起请求异常");
      }
      const errMessage = errMsg || "发起请求异常";
      return Promise.reject(errMessage);
    });
}
