// pages/MePage/edit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:"",
    phone:"",
    headUrl:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,1)
    let that = this
    wx.getStorage({
      key: 'myInfo',
      success: function (res) {
        that.setData({
          name: res.data.myInfo.nickName,
          headUrl: res.data.myInfo.wechatIcon,
          phone: res.data.myInfo.mobile
        })
      }
    })

    console.log(that.data.headUrl, "headUrl")

    wx.getStorage({
      key: 'phone',
      success: function (res) {
        console.log(res, 666)
        that.setData({
          phone: res.data
        })
      }
    })
 
    // }else{
    //   this.setData({
    //     name:options.sss
    //   })
    // }
   
  },

  logout:function(){

    wx.showModal({
      title: '提示',
      content: '确定退出吗',
      success: function (res) {
        if (res.confirm) {
          wx.clearStorageSync();
          wx.reLaunch({
            url: '/pages/LogIn/LogIn',
          })
        } else if (res.cancel) {

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