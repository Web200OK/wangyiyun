let startY = 0
let moveY = 0
let moveDistance = 0
import request from "../utils/request"
// page/personal/personal.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        coverTransform:"translteY(0)",//下拉位移
        coverTransition:"",//回弹过渡
        userInfo:{},//用户信息
        // recentPlayList:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //登陆成功读取本地存储数据
        let userInfo = wx.getStorageSync('userInfo')
        if(userInfo){
            this.setData({
                userInfo:JSON.parse(userInfo)
            })
            this.getRecentPlayList(this.data.userInfo.userId)
        }
    },
    //更新最近播放列表
    async getRecentPlayList(uid){
        let recentPlayListData = await request("/user/record",{uid:uid,type:0}) 
        let index = 0
        let recentPlayList = recentPlayListData.data.allData.splice(0,10).map(item => {
            item.id = index++
            return item
        })
        this.setData({
            recentPlayList
        })
    },
    //跳转到登录页
    toLogin(){
        wx.navigateTo({
            url:"/page/login/login"
        })
    },
    //下拉
    touchStart(event){
        this.setData({
            coverTransition:''
        })
        startY = event.touches[0].clientY
    },
    touchMove(event){
        moveY = event.touches[0].clientY
        moveDistance = moveY - startY
        if(moveDistance<0){
            return
        }
        if(moveDistance>80){
            moveDistance = 80
        }
        this.setData({
            coverTransform:`translateY(${moveDistance}rpx)`
        })
    },
    touchEnd(){
        this.setData({
             coverTransform:`translateY(0rpx)`
,            coverTransition:`transform 1s linear`
        })
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