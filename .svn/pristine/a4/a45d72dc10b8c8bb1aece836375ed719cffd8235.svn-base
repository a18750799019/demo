import axios from 'axios';
import qs from "qs";
var instance = axios.create({
  baseURL:"",
  //timeout: 6000
})

instance.interceptors.request.use(function (config) {
    return config;
}, function (error) {  
return Promise.reject(error);
});

instance.interceptors.response.use(function (response) {
    return response.data;
}, function (error) {
    return Promise.reject(error);
});

export default async function(url,params,method,useRes, isFormData) {
    method = method == undefined ? 'get' : method;
    var _localParam = { v: new Date().getTime() }; 
    if(!isFormData) {
      params = params ? Object.assign(_localParam, params) : _localParam;
    }
    method = method.toLowerCase();
    if (['get','delete'].indexOf(method)>-1) {
      var res = await instance[method]( url, { params: params }) ;
      if(useRes){
        return res;
      }
      return res.data ? res.data : res;
    } else if (['post','put'].indexOf(method)>-1) {
      var res =  await instance[method]( url, isFormData ? params:qs.stringify(params),{headers: params.headers});
      if(useRes){
        return res;
      }
      return res.data ? res.data : res;
    } else{
      console.error('unknown method:'+method);
      return false
    }
}

