import fetch from "@/utils/fetch";

const baseUrl = "http://127.0.0.1:7001/english-practice/api/";

function getStemList(type) {
  return fetch({
    url: `${baseUrl}get-stem/?type=${type}`
  }).then(({ data, msg }) => {
    if (msg === "success") {
      return data;
    }
  });
}

function getTranslation() {
  return fetch({
    url: `${baseUrl}spider/translation/`
  }).then(({ data, msg }) => {
    if (msg === "success") {
      return data;
    }
  });
}

export { getStemList, getTranslation };
