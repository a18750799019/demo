import axios from './config.js'

const pagingGet = (url,param) => {
  return axios(url, {
    v: new Date().getTime(),
    ...param
  });
}
const pagingPost = (url,param) => {
  return axios(url, {
    v: new Date().getTime(),
    ...param
  }, "post");
}
const pagingGet4Res = (url,param) => {
  return axios(url, {
    v: new Date().getTime(),
    ...param
  },"get",true);
}
const pagingPost4Res = (url,param) => {
  return axios(url, {
    v: new Date().getTime(),
    ...param
  }, "post", true);
}

export {
  pagingGet,
  pagingPost,
  pagingGet4Res,
  pagingPost4Res 
}