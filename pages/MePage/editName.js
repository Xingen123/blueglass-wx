// pages/MePage/editName.js

var url = require('../../utils/url.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:""
  },

  /**
   * 生命周期函数--监听页面加载
   */

  phoneInput: function (e) {
    const that = this;
    that.setData({
      name: e.detail.value,
    })
  },

  onLoad: function (options) {
    console.log(options,111)
    this.setData({
      name: wx.getStorageSync('nickName'),
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
  logout:function(){
    let that = this;
    wx.request({
      url: url.serverUrl + 'mini/partner/editNickName',
      method: 'POST',
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      data: {
        token: wx.getStorageSync('token'),
        nickName: that.data.name,
      },
      success: function (res) {


        console.log(that.data.name)
        var data = res.data
        if (data.status == "200") {
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];
          prevPage.setData({
            name: that.data.name
          })
                wx.navigateBack({
                  delta: '1'
                });   //返回上一个页面
        } else {
          wx.showToast({
            title: data.errorMsg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })

    // wx.navigateBack({
    //   delta:'1'
    // })
  }
})