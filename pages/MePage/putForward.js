// pages/MePage/putForward.js
var url = require('../../utils/url.js')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    total_money:'',
    forward_money:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      total_money:options.total_money
    })
  },

  phoneInput:function(e){
    const that = this;
    that.setData({
      forward_money: e.detail.value,
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
    wx.showModal({
      title: '提示',
      content: '您的提现金额为：' + that.data.forward_money + '元',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '',
          })
          wx.request({
            url: url.serverUrl + 'mini/partner/withdrawDeposit',
            method: 'POST',
            header: {
              //设置参数内容类型为x-www-form-urlencoded
              'content-type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json'
            },
            data: {
              token: wx.getStorageSync('token'),
              amount: that.data.forward_money
            },
            success: function (res) {
              wx.hideLoading();
              console.log(res.data)
              url.logoutAction(res)

              var data = res.data
              if (data.status == "200") {
                wx.showToast({
                  title: '提现成功',
                  icon: 'success',
                  duration: 2000
                })
                wx.navigateBack({
                  delta: '1'
                })
              } else {
                wx.hideLoading();
                wx.showToast({
                  title: data.errorMsg,
                  icon: 'fail',
                  duration: 2000
                })
              }
            }
          })
        } else if (res.cancel) {

        }
      }
    })
  }
})

/*
    
*/