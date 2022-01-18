import request from "../utils/request"
let isSend = null
// page/research/research.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        placeholderContent:"",
        hotList:[],
        input:"",
        researchList:[],
        historyList:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getPlaceholder()
        let historyList = wx.getStorageSync('historyList')
        if(historyList.length) {
            this.setData({
                historyList
            })
        }
    },
    //获取搜索栏内容
    async getPlaceholder(){
        let placeholderData = await request("/search/default")
        let hotListData = await request("/search/hot/detail")
        let placeholderContent = placeholderData.data.data.showKeyword
        let hotList = hotListData.data.data
        this.setData({
            placeholderContent,
            hotList
        })
    },
    //处理输入的函数
    handleInputChange(event){
        let input = event.detail.value
        //防抖函数实现搜索
        if(isSend) clearTimeout(isSend)
        let historyList = this.data.historyList
        isSend = setTimeout(() => {
            if(historyList.indexOf(input) !== -1) {
                historyList.splice(historyList.indexOf(input),1)
                historyList.unshift(input)
            }
            else if(input){
                historyList.unshift(input)
            }
            wx.setStorageSync('historyList', historyList)
            this.setData({
                    input,
                    historyList
                })
            this.handleRequest()
        },1000)
    },
    //处理发送请求的函数
    async handleRequest(){
        console.log(this.data.input)
        if(!this.data.input){
            this.setData({
                researchList:[]
            })
            return
        }
        let researchListData = await request("/search",{keywords:this.data.input,limit:10})
        this.setData({
            researchList:researchListData.data.result.songs
        })
    },
    //点击去除输入数据函数
    clearSearchContent(){
        this.setData({
            input:"",
            researchList:[]
        })
    },
    //点击清空记录函数
    deleteSearchHistory(){
        wx.showModal({
          content:"确定清除历史记录吗？",
          success:(res) => {
            if(res.confirm){
                this.setData({
                    historyList:[]
                })
                wx.clearStorageSync("historyList")
            }
          }
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