import axios from "./config";
import * as commonApi from "./common";
import * as businessApi from "./business";
import * as userApi from "./user";

/**
 * 加载静态资源文件[内部方法]
 * @param {*} filename 相对路径
 */
const loadConfig = filename => {
  return axios(filename, {
    v: new Date().getTime()
  });
};

export { 
  commonApi, 
  businessApi, 
  loadConfig,
  userApi 
}

// import {business} from "@/api";
// business.getXXX("")