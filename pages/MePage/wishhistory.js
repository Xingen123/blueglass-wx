// pages/MePage/wishhistory.js
var url = require('../../utils/url.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyDesireInfo:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.request({
      url: url.serverUrl + 'mini/partner/getDesireDetail',
      method: 'POST',
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      data: {
        token: wx.getStorageSync('token'),
        // token:"6000001740059476",
        desireId: options.desireId
      },
      success: function (res) {
        console.log(res.data)
        url.logoutAction(res)

        var data = res.data
        if (data.status == "200") {
          that.setData({
            historyDesireInfo: res.data.data.historyDesireInfo
          });
          //todo tengyu
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