import request from "../utils/request.js"
// page/login/login.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        phone:"",//手机号码
        password:""//登录密码
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    //处理输入数据
    handleInput(event){
        let type = event.currentTarget.id
        this.setData({
            [type]:event.detail.value
        })
    },
    //点击登录按钮进行数据前后端验证
    async login(){
        let {phone,password} = this.data
        if(!phone){
            wx.showToast({
              title: "手机号不能为空",
              icon:"none"
            })
            return
        }
        let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/
        if(!phoneReg.test(phone)){
            wx.showToast({
              title: '手机号格式错误',
              icon:"none"
            })
            return
        }
        if(!password){
            wx.showToast({
              title: '密码不能为空',
              icon:'none'
            })
            return
        }
    let result = await request("/login/cellphone",{phone,password})
    if(result.data.code === 200){
        wx.showToast({
          title: '登录成功',
        })
        //登录成功将cookie存储在本地
        wx.setStorageSync('cookie', result.cookies)
        wx.reLaunch({
          url: '/page/personal/personal',
        })
        wx.setStorageSync('userInfo', JSON.stringify(result.data.profile))
    }else if(result.data.code === 400){
        wx.showToast({
          title: '手机号未注册',
          icon:"none"
        })
    }else if(result.data.code === 502){
        wx.showToast({
          title: '密码错误',
          icon:"none"
        })
    }else{
        wx.showToast({
          title: '登录失败',
        })
    }
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})