import axios from './config.js'

export const getLogin = (userName, password) => {
  return axios("./mock/user.json",{
    userName,
    password
  },"post");
}

export const loginValid = ({url,params}) => {
  return axios(url,params,"post",true);
}

export const loginOut = ({url,params}) => {
  return axios(url,params,"post");
}