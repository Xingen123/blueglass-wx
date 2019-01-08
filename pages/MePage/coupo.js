// pages/MePage/coupo.js
var url = require('../../utils/url.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tenGiftTicket:{},
    giftTicketInfos:[],
    percent:0
  },

  ruleAction:function(e){
    wx.navigateTo({
      url: 'coupoRule',
    })
  },
  copy:function(e){
    wx.setClipboardData({
      data: e.currentTarget.dataset.code,
      success: function () {
        console.log('copy success')
      }
    })
  },
  goSharePacket(){
    wx.navigateTo({
      url: 'shareMyPacket/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //mini/partner/myGiftTicket
    let that = this;
    wx.request({
      url: url.serverUrl + 'mini/partner/myGiftTicket',
      method: 'POST',
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      data: {
        token: wx.getStorageSync('token'),
        pageNum:1
      },
      success: function (res) {
        url.logoutAction(res)
        console.log(res.data)
        var data = res.data
        if (data.status == "200") {
          that.setData({
            tenGiftTicket: data.data.tenGiftTicket,
            giftTicketInfos: data.data.giftTicketInfos,
            percent: data.data.tenGiftTicket.buyAmount * 100 / data.data.tenGiftTicket.targertAmount
          });
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