import request from "../utils/request"
// page/video/video.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navList:[],//部分导航栏
        navId:"",//选中导航栏Id
        videoList:[],//视频列表
        videoId:"",//视频id
        videoTimeUpdate:[],//视频更新时间
        isRefresher:false,//顶部下拉刷新状态
        newData:{},//底部上拉刷新的视频列表
        datas:[],//所有的导航栏
        index:9,//上拉刷新第一次选中的导航栏下标(刷新一次更新一次)
        newIdIndex:9//上拉刷新为新的视频加上的id(刷新一次更新一次)
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getNav()
        wx.showShareMenu({
          menus: [],
        })
    },
    //获取导航栏列表
    async getNav(){
        let navData = await request("/video/group/list")
        this.setData({
            datas:navData.data.data,
            navList:navData.data.data.slice(0,10),
            navId:navData.data.data[0].id
        })
        this.getVideoList(this.data.navId)
    },
    //获取导航栏ID
    getNavId(event){
        let navId = event.currentTarget.dataset.id
        this.setData({
            navId:navId,
            videoList:[]
        })
        this.getVideoList(navId)
    },
    //获取video数据
    async getVideoList(id){
        let videoListData = await request("/video/group",{id})
        let index = 0
        let videoList = videoListData.data.datas.map(item => {
            item.id = index++
            return item
        })
        this.setData({
           videoList,
           isRefresher:false
        })
    },

    //处理播放，image替换video性能优化
    handlePlay(event){
        let {videoTimeUpdate} = this.data
        this.setData({
            videoId:event.currentTarget.id
        })
        this.videoContext = wx.createVideoContext(event.currentTarget.id)
        let videoItem = videoTimeUpdate.find(item => item.vid === event.currentTarget.id)
        if(videoItem){
            this.videoContext.seek(videoItem.currentTime)
        } else{
            this.videoContext.play()
        }
    },
    //处理视频进度回调
    handleTimeUpdate(event){
        let {videoTimeUpdate} = this.data
        let videoItem = videoTimeUpdate.find(item => item.vid === event.currentTarget.id)
        if(videoItem){
            videoItem.currentTime = event.detail.currentTime
        }
        else{
            videoItem = {vid:event.currentTarget.id,currentTime:event.detail.currentTime}
            videoTimeUpdate.push(videoItem)
        }
       this.setData({
           videoTimeUpdate
       })
    },
    //处理跳转搜索音乐
    handleToResearch(){
        wx.navigateTo({
          url: '/page/research/research',
        })
    },
    //上拉刷新
    handleRefresh(){
        this.getVideoList(this.data.navId)
    },
    async getNewData(id){
        let newDatas = await request("/video/group",{id})
        let newIdIndex = this.data.newIdIndex
        let newData = newDatas.data.datas.map(item => {
            item.id = newIdIndex++
            this.setData({
                newIdIndex
            })
            return item
        })
        let videoList = this.data.videoList
        videoList.push(...newData)
        this.setData({
            videoList
        })
    },
    //下拉加载
    handleTolower(){
        let index = this.data.index
        let datas = this.data.datas 
        this.getNewData(datas[index++].id)
        this.setData({
            index
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

    },
    onShareAppMessage: function ({from}) {
        console.log(from);
        if(from === 'button'){
          return {
            title: '来自button的转发',
            page: '/pages/video/video',
            imageUrl: '/static/images/nvsheng.jpg'
          }
        }else {
          return {
            title: '来自menu的转发',
            page: '/pages/video/video',
            imageUrl: '/static/images/nvsheng.jpg'
          }
        }
        
      }
})