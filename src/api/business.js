import axios from './config.js'

export const getRain = ({ url }) => {
  return axios(url)
}

export const getXXX = area => {
  return axios(
    `../data/area/${area}/areacount.json`,
    {
      param1: 'xxx1'
    },
    'get'
  )
}

export const getYYY = area => {
  return axios(
    `../data/area/${area}/areacount.json`,
    {
      param1: 'xxx1'
    },
    'get'
  )
}

export const getPaganationList = ({ url, params }) => {
  return axios(url, params, 'post')
}

export const getAddressPaganationList = ({ url, params }) => {
  url = url
    .replace('#{keyword}', params.keyword)
    .replace('#{lonlat}', params.lonlat)
    .replace('#{radius}', params.radius || 10000)
  return axios(url)
}

export const addMockEa = ({ url, params }) => {
  return axios(url, params, 'post')
}

// export const getAddressPaganationList = ({url,params}) => {
//   url = url.replace("#{keyword}",params.keyword)
//            .replace("#{lonlat}",params.lonlat)
//            .replace("#{radius}",params.radius)
//   return axios(url)
// }

export const getDeptList = () => {
  return axios(`/mock/dept.json`)
}

export const getlocalMarket = ({ url }) => {
  return axios(url)
}

export const geteaItemDetailList = ({ url }) => {
  return axios(url)
}

export const getLiveLineList = ({ url, params }) => {
  return axios(url, params, 'post')
}

export const getCollectionList = ({ url, params }) => {
  return axios(url, params, 'post')
}

export const getDisasterStatisticsList = ({ url }) => {
  return axios(url)
}

export const getDeptUserList = ({ url, params }) => {
  return axios(url, params, 'post')
}

export const delDept = ({ url, params }) => {
  return axios(url, params)
}

/**
 * 部门字典
 * @param {*} param0
 */
export const DeptDic = ({ url }) => {
  return axios(url, {}, 'post')
}

export const getUserList = ({ url, params }) => {
  return axios(url, params, 'post')
}

export const getSysUserList = ({ url, params }) => {
  return axios(url, params, 'post')
}

export const addDept = ({ url, params }) => {
  return axios(url, params, 'post')
}

export const editDept = ({ url, params }) => {
  return axios(url, params, 'post')
}

export const addUser = ({ url, params }) => {
  return axios(url, params, 'post')
}

export const editUser = ({ url, params }) => {
  return axios(url, params, 'post')
}

export const delUser = ({ url, params }) => {
  return axios(url, params)
}

export const tiandituApi = ({ url, params }) => {
  return axios(url.replace('#{lat}', params.lat).replace('#{lon}', params.lon))
}

export const changePwd = ({ url, params }) => {
  return axios(url, params, 'post', true)
}

export const callphone = ({ url, params }) => {
  return axios(url, params, 'post')
}
