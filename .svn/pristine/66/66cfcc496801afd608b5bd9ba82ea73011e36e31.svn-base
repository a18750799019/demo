
// import isdev from "@/util/ds.is-dev";
import { loadConfig } from "@/api";
import differenceInHours from 'date-fns/differenceInHours'
import format from 'date-fns/format'
import aes from "./ds.aes"

const loadInitConf = function(type) {
  return loadConfig(`./config/${type}.json`);
};

const localStorageSetting = function(key, value) {
  let res = null;
  if(value=="remove"){
    localStorage.removeItem(key);
    return;
  }
  if(value) {
    res = localStorage.setItem(key, JSON.stringify(value));
  } else {
    res = localStorage.getItem(key);
    try {
      res = JSON.parse(res);
    } catch (error) {
      /** ignore */
    }
  }
  return res;
}

const setMapPointStyle = function(time, level){
  let _color = "#FF0000";
  let _diameter = 10;
  let _pixelOffset = [-10,18];
  let _currDate = new Date();
  let _monthDays = new Date(_currDate.getFullYear(),_currDate.getMonth()+1,0);
  let num = differenceInHours( _currDate,new Date(time));
  if (num<24){
    _color = "#FF0000";
  } else if(num >= 24 && num< 168)  {
    _color = "#CC6633";
  } else if(num >= 168 && num< 24* _monthDays.getDate())  {
    _color = "#CC6633";
  }  else if(num >= 24* _monthDays.getDate()) {
    _color = "#0FABF9";
  }
  if(level<3){
    _diameter = 7;
  } else if(level <5) {
    _diameter = 9
  } else if(level <7) {
    _diameter = 13
  } else if(level <10) {
    _diameter = 17;
    _pixelOffset = [-10,23];
  } else {
    _diameter = 25
    _pixelOffset = [-13,26];
  }
  return {
    color: _color,
    diameter: _diameter,
    pixelOffset:_pixelOffset
  }
}

const filterAreacode = (_areacode,vm)=>{
  let PAreacode = vm.$areacode.province[0];
      
    if(_areacode.endsWith("0000")){
      let {areacode, name, center, height} = PAreacode;
      return {areacode,name, center, height};
    } else if(_areacode.endsWith("00")){
      for (let i = 0; i < PAreacode.city.length; i++) {
        if(PAreacode.city[i].areacode == _areacode){
          let {areacode, name , center, height} = PAreacode.city[i];
          return {areacode,name, center, height};
        }
      }
    } else {
      for (let i = 0; i < PAreacode.city.length; i++) {
        for (let j = 0; j < PAreacode.city[i].county.length; j++) {
          const element = PAreacode.city[i].county[j];
          if(element.areacode == _areacode){
            let {areacode, name, center, height } = element;
            return {areacode,name,center, height};
          }
          
        }
      }
    }
      
}

const getLevel = (height) => {
  if (height > 48000000) {
    return 0;
  } else if (height > 24000000) {
    return 1;
  } else if (height > 12000000) {
    return 2;
  } else if (height > 6000000) {
    return 3;
  } else if (height > 3000000) {
    return 4;
  } else if (height > 1500000) {
    return 5;
  } else if (height > 750000) {
    return 6;
  } else if (height > 375000) {
    return 7;
  } else if (height > 187500) {
    return 8;
  } else if (height > 93750) {
    return 9;
  } else if (height > 46875) {
    return 10;
  } else if (height > 23437.5) {
    return 11;
  } else if (height > 11718.75) {
    return 12;
  } else if (height > 5859.38) {
    return 13;
  } else if (height > 2929.69) {
    return 14;
  } else if (height > 1464.84) {
    return 15;
  } else if (height > 732.42) {
    return 16;
  } else if (height > 366.21) {
    return 17;
  } else {
    return 18;
  }
}
/**
 * 密码加密
 * @param {*} pwd 
 */
const pwdEncrypt = (pwd,oldPwd)=>{
  if(pwd.length==18){
    return oldPwd
  }
  let encryptPassword = aes.encrypt(pwd);
  let decryptPassword = aes.decrypt(encryptPassword);
  return decryptPassword;
}
export {
  loadInitConf,
  localStorageSetting,
  setMapPointStyle,
  filterAreacode,
  getLevel,
  pwdEncrypt
}