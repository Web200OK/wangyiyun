import PubSub from "pubsub-js"
// page/recommondSong/recommondSong.js
import request from "../utils/request.js"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        month:"",
        day:"",
        recommendList:[],
        index:0, //点击播放歌曲的index
        musicId:"" //切换歌曲的id
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let userInfo = wx.getStorageInfoSync("userInfo")
        let cookie = wx.getStorageInfoSync("cookie")
        if(!userInfo){
            wx.showToast({
              title: '请先登录',
              icon:"none",
              success: () => {
                wx.reLaunch({
                    url: '/page/login/login',
                  })
              }
            })
        }
        this.setData({
            day:new Date().getDate(),
            month:new Date().getMonth() + 1
        })
        this.getRecommendList()
        //发布订阅获取type
        PubSub.subscribe("getType",(msg,type) => {
            let {recommendList,musicId,index} = this.data
            if(type === "pre"){
                (index === 0) && (index = recommendList.length)
                index--
                musicId = recommendList[index].id
            }
            else{
                index++
                (index === recommendList.length) && (index = 0)
                musicId = recommendList[index].id
            }
            this.setData({
                musicId,
                index
            })
            PubSub.publish("getId",this.data.musicId)
        })

    },
    //获取推荐歌单
    async getRecommendList(){
        let RecommendListData = await request("/recommend/songs")
        let recommendList = RecommendListData.data.recommend
        this.setData({
            recommendList
        })
    },
    handleSongDetail(event){
        let id = event.currentTarget.dataset.song.id
        let index = event.currentTarget.dataset.index
        this.setData({
            index
        })
        wx.navigateTo({
          url: '/page/songDetail/songDetail?id=' + id,
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