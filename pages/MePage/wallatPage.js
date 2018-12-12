// pages/MePage/wallatPage.js
var url = require('../../utils/url.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    walletInfo:{},
    desireInfo:{},
    hasXinyuan:false,
    desirePercent:0
  },

  addwish:function(e){
    wx.navigateTo({
      url: '../ShopPage/XinyuanStep/index',
    })
  },

  wishhistory:function(){
    wx.navigateTo({
      url: 'wishhistory',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //mini/partner/getMyWallet

  },

  wishdetail:function(){
    wx.navigateTo({
      url: 'wishdetail?desireId=' + this.data.desireInfo.desireId
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
    let that = this;
    wx.request({
      url: url.serverUrl + 'mini/partner/getMyWallet',
      method: 'POST',
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      data: {
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        console.log(res.data)
        url.logoutAction(res)

        var data = res.data
        if (data.status == "200") {
          that.setData({
            walletInfo: res.data.data.walletInfo,
            desireInfo: res.data.data.desireInfo,
          });
          //todo tengyu
          if (res.data.data.desireInfo) {
            that.setData({
              hasXinyuan: true
            });
          }
          else
          {
            that.setData({
              hasXinyuan: false
            });
          }
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.reLaunch({
      url: './index'
    })
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

  jumpPutForward:function(){
    wx.navigateTo({
      url: 'putForward?total_money=' + this.data.walletInfo.currentBalance,
    })
  },

  clickAsk: function () {
    wx.navigateTo({
      url: './withDraw'
    })
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  jumpDetail:function(){
    if(this.data.desireInfo){
      wx.navigateTo({
        url: 'wallatDetail?desireId=' + this.data.desireInfo.desireId,
      })
    }
    else
    {
      wx.navigateTo({
        url: 'wallatDetail',
      })
    }
  }
})