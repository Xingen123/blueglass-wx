// pages/MePage/wishdetail.js

var url = require('../../utils/url.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    desireId:"",
    desireInfo:{},
    desirePercent:0
  },

  changewish:function(){
    console.log(this.data.desireInfo)
    wx.navigateTo({
      url: 'addwish?name=' + this.data.desireInfo.name + "&targetAmount=" + this.data.desireInfo.targetAmount + "&image_url=" + this.data.desireInfo.background + "&desireId=" + this.data.desireInfo.desireId,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.desireId;
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
        desireId: id
      },
      success: function (res) {
        console.log(res.data)
        url.logoutAction(res)

        var data = res.data
        if (data.status == "200") {
          that.setData({
            desireInfo: res.data.data.desireInfo,
            desirePercent: res.data.data.desireInfo.desirePercent.replace(/%/g, '')
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
  jumpdetail:function(){
    wx.navigateTo({
      url: 'wishhistory?desireId=' + this.data.desireInfo.desireId,
    })
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