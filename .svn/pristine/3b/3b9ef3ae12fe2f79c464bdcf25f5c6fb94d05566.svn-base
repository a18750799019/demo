//https://www.cnblogs.com/xichji/p/12058802.html

import CryptoJS from 'crypto-js'
const CBCIV = "abcdefgabcdefg12";
/**
 * console.log("原密码：" + 123456);
   let encryptPassword = aes.encrypt("123456");
   console.log("加密后：" + encryptPassword);  //3Y6NRG+LYyfgf4YuVjsCqcmtcX5Hpoi1YZhAzcWEErTXo0kjCIYzXLdP7OpgQXtQ
   let decryptPassword = aes.decrypt(encryptPassword);
   console.log("解密后：" + decryptPassword); //0375d2353d97e8defa58451487faed5b
 * 
 */
export default {
  //加密
  encrypt(data){
      data = CryptoJS.MD5("copyright." + data + "pms@2016").toString();
      let key = CryptoJS.enc.Utf8.parse(CBCIV);
      let secretData = CryptoJS.enc.Utf8.parse(data);
      let encrypted = CryptoJS.AES.encrypt(
          secretData,
          key,
          {
              iv: CryptoJS.enc.Utf8.parse(CBCIV),
              mode:CryptoJS.mode.CBC,
              padding: CryptoJS.pad.Pkcs7
          }
      );
      return encrypted.toString();
  },

  //解密
  decrypt(data){
      let key = CryptoJS.enc.Utf8.parse(CBCIV);
      let decrypt = CryptoJS.AES.decrypt(
          data,
          key,
          {
              iv: CryptoJS.enc.Utf8.parse(CBCIV),
              mode: CryptoJS.mode.CBC,
              padding: CryptoJS.pad.Pkcs7
          });
      return CryptoJS.enc.Utf8.stringify(decrypt).toString();
  }
}