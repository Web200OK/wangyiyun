import config from "./config"
//封装功能函数
export default (url,data,method="GET") => {
    return new Promise((resolve,reject) => {
        wx.request({
            url:config.mobilhost+url,
            data,
            method,
            //设置请求头信息，携带cookie
            header:{
              cookie:wx.getStorageSync('cookie')?wx.getStorageSync('cookie').find(item => item.indexOf('MUSIC_U') !== -1):''
            },
            success: (res) => {
              resolve(res)
            },
            fail: (err) => {
              reject(err)
            }
          })
    })
}