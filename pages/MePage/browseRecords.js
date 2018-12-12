// pages/MePage/browseRecords.js

var url = require('../../utils/url.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    browseRecordInfos:[],
    bgcolor: "#01a0eb" 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  shopClick(e){
    console.log(e)
    wx.navigateTo({
      url: '../ShopPage/shareMyShop/index?partnerid=' + e.currentTarget.dataset.partnerid,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //
    let that = this;
    wx.request({
      url: url.serverUrl + 'mini/partner/myBrowseRecord',
      method: 'POST',
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      data: {
        token: wx.getStorageSync('token'),
      },
      success: function (res) {
        url.logoutAction(res)

        console.log(res.data)
        var data = res.data
        if (data.status == "200") {
          that.setData({
            browseRecordInfos: res.data.data.browseRecordInfos
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