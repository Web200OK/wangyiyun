import request from "../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:[],
    recommendList:[],
    topList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    //初始化页面头部
   let bannerListData = await request("/banner",{type:2})
   this.setData({
     bannerList:bannerListData.data.banners
   })
   //初始化推荐区域
   let recommendListData = await request("/personalized",{limit:10})
   this.setData({
    recommendList:recommendListData.data.result
  })
  let index = 0
  let topArr = []
  while(index<5){
    let topListData = await request("/top/list",{idx:index++})
    let topListItem = {name:topListData.data.playlist.name,tracks:topListData.data.playlist.tracks.slice(0,3)}
    topArr.push(topListItem)
    this.setData({
      topList:topArr
    })
  }
  },
  //跳转每日推荐页面
  handleRecommend(){
    wx.navigateTo({
      url: '/page/recommondSong/recommondSong',
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