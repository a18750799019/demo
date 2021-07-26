import crypto from 'crypto'
import querystring from 'query-string'
export function getSignature (lng, lat) {
  function signature (urlString, paramsObj) {
    if (!urlString) {
      return
    }
    // debugger
    // obj.query的值暂时固定1
    // const obj = url.URL(urlString, true, true)
    // const params = Object.assign({}, paramsObj, 'weather_hourly_1h')
    // console.log(params)
    const params = paramsObj
    let result = querystring.stringify(params, { encode: false })
    const sig = crypto
      .createHmac('sha1', secret)
      .update(result, 'utf8')
      .digest('base64')

    result += `&sig=${encodeURIComponent(sig)}`

    return result
  }
  const secret = 'S_ceXxx5BTMOjH-dE' // 秘钥
  const publicKey = 'P5dpkelvsdX0AG9qg' // 公钥
  const ts = Math.round(Date.now() / 1000)
  // debugger
  const ttl = 600
  const latitude = lat
  const longitude = lng
  const url = 'https://api.seniverse.com/v4?fields=weather_hourly_1h'
  const query = signature(url, {
    ttl,
    ts,
    public_key: publicKey,
    locations: `${latitude}:${longitude}`,
    fields: 'weather_hourly_1h'
  })
  return query
}
