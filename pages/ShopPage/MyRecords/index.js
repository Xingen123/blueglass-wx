// pages/MePage/browseRecords.js

var url = require('../../../utils/url.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    purchaseRecordInfos:[],
    bgcolor: "#01a0eb" ,
    page: 1,
    pages: 0,
    articles: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchArticleList(1)
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
    //
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
    this.fetchArticleList(this.data.page + 1)
  },
  fetchArticleList(pageNo) {
    let that = this;
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: url.serverUrl + 'mini/partner/myPurchaseRecord',
      method: 'POST',
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      data: {
        token: wx.getStorageSync('token'),
        pageNum: pageNo
      },
      success: function (res) {
        console.log(res.data.data.purchaseRecordInfos)
        url.logoutAction(res)

        wx.hideLoading();
        var data = res.data
        let purc = res.data.data.purchaseRecordInfos
        if (data.status == "200") {
            that.setData({
              purchaseRecordInfos: res.data.data.purchaseRecordInfos
            })
        } else {
          wx.showToast({
            title: data.errorMsg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})