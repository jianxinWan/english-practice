import fetch from "@/utils/fetch";

const baseUrl = "http://127.0.0.1:7001/english-practice/api/";

/**
 * 根据题型type获取题目列表
 * @param type 题型 1:完形 2:阅读 5:写作 4: 翻译
 */
function getStemList(type) {
  return fetch({
    url: `${baseUrl}get-stem/?type=${type}`
  }).then(({ data, msg }) => {
    if (msg === "success") {
      return data;
    }
  });
}

/**
 * 获取翻译列表
 */
function getTranslation() {
  return fetch({
    url: `${baseUrl}spider/translation/`
  }).then(({ data }) => {
    return data;
  });
}

/**
 * 获取翻译详情信息
 * @param id
 * @param uid
 */

function getTranslationDetail(id, uid) {
  return fetch({
    url: `${baseUrl}spider/translation/detail/?show_type_id=${id}&uid=${uid}`
  }).then((res) => {
    console.log("res", res);
    return res;
  });
}

/**
 * 获取题目的相信信息
 * @param stem_id 单个题目的id
 * @param uid 用户id
 */
function getStemDetail(stem_id, uid) {
  return fetch({
    url: `${baseUrl}get-stem/detail/?stem_id=${stem_id}&uid=${uid}`
  }).then(({ data, msg }) => {
    if (msg === "success") {
      return data;
    }
  });
}

/**
 * 提交答题信息
 * @param data 要提交的参数
 */
function submitAnswer(params) {
  return fetch({
    url: `${baseUrl}answer/submit/`,
    method: "POST",
    params
  }).then((res) => {
    return res;
  });
}

/**
 * 获取套题列表
 * @param type
 */
function getExerciseList(type) {
  return fetch({
    url: `${baseUrl}exercise/list/?type=${type}`
  }).then(({ data, msg }) => {
    if (msg === "success") {
      return data;
    }
  });
}

export {
  getStemList,
  getTranslation,
  getStemDetail,
  submitAnswer,
  getTranslationDetail,
  getExerciseList
};
