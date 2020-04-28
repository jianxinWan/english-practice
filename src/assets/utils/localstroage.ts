import Taro from "@tarojs/taro";

const getStorage = (key) => {
  return Taro.getStorage({
    key,
    success: (res) => {
      return res;
    },
    fail: () => {
      return "";
    }
  });
};

const setStorage = (key, data) => {
  return Taro.setStorage({
    key,
    data
  });
};

const removeStorage = (key) => {
  return Taro.removeStorage({
    key,
    success(res) {
      return res;
    },
    fail: () => {
      return "";
    }
  });
};

export { getStorage, setStorage, removeStorage };
