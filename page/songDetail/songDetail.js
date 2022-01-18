import PubSub from "pubsub-js"
import request from "../utils/request"
import moment from "moment"
// page/songDetail/songDetail.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        isPlay:true,
        songDetail:{},
        id:"",
        musicLink:"",
        currentTime:"00:00",
        durationTime:"",
        currentWidth:0
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let id = options.id
        this.BackgroundAudioManager = wx.getBackgroundAudioManager()
        this.setData({
            id
        })
        this.getSongDetail(id)
        this.controlMusic(this.data.isPlay,this.data.id)
        //监听音乐播放/暂停/结束
        this.BackgroundAudioManager.onPlay(() => {
            this.changePlayState(true)
        })
        this.BackgroundAudioManager.onPause(() => {
            this.changePlayState(false)
        })
        this.BackgroundAudioManager.onStop(() => {
            this.changePlayState(false)
        })
        //监听音乐结束
        this.BackgroundAudioManager.onEnded(() => {
            PubSub.publish("getType","next")
            PubSub.subscribe("getId",(msg,musicId) => {
                this.getSongDetail(musicId)
                this.setData({
                    id:musicId
                })
                this.controlMusic(true,musicId)
                PubSub.unsubscribe("getId")
            })
            this.setData({
                currentTime:"00:00",
                currentWidth:0
            })
        })
        //监听音乐播放进度
        this.BackgroundAudioManager.onTimeUpdate(() => {
            let currentTime = moment(this.BackgroundAudioManager.currentTime * 1000).format("mm:ss")
            let currentWidth = this.BackgroundAudioManager.currentTime / this.BackgroundAudioManager.duration * 450
            this.setData({
                currentTime,
                currentWidth
            })
        })
    },
    changePlayState(isPlay){
            this.setData({
                isPlay
            })
    },
    //获取歌曲详情
    async getSongDetail(id){
        let {data:res} = await request("/song/detail",{ids:id})
        let songDetail = res.songs[0]
        let durationTime = moment(songDetail.dt).format("mm:ss");     
        this.setData({
            songDetail,
            durationTime
        })
        wx.setNavigationBarTitle({
            title:this.data.songDetail.name + "(" + this.data.songDetail.ar[0].name + ")"
        })
    },
    //点击控制播放
    handleMusicPlay(){
        let isPlay = !this.data.isPlay
        this.controlMusic(isPlay,this.data.id,this.data.musicLink)
    },
    //创建背景音乐实例播放音乐
    async controlMusic(isPlay,id,musicLink){
        if(isPlay){
            if(!musicLink){
                let {data:musicUrl} = await request("/song/url",{id:id})
                let musicLink = musicUrl.data[0].url
                this.setData({
                    musicLink
                })
                this.BackgroundAudioManager.src = this.data.musicLink
                this.BackgroundAudioManager.title = this.data.songDetail.name
            }
            this.BackgroundAudioManager.play()
        }else{ 
            this.BackgroundAudioManager.pause()
        }
    },
    //处理切换歌曲函数
    handleSwitch(event){
        let type = event.currentTarget.id
        this.BackgroundAudioManager.stop()
        PubSub.subscribe("getId",(msg,musicId) => {
            this.getSongDetail(musicId)
            this.setData({
                id:musicId
            })
            this.controlMusic(true,musicId)
            PubSub.unsubscribe("getId")
        })
        PubSub.publish("getType",type)
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