// pages/MePage/inviteCode.js

var url = require('../../utils/url.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inviteCodeInfos:[],
    inviteRecordInfos:[]
  },

  copyAction:function(e){
    var that = this;
    wx.setClipboardData({
      data: e.currentTarget.dataset.code,
      success:function(){
        var inviteCodeInfos= [];
        for (var i = 0; i <that.data.inviteCodeInfos.length;i++){
          var temp = that.data.inviteCodeInfos[i];
          if (temp.inviteCode == e.currentTarget.dataset.code){
            temp.status = "C_COPY"
          }
          inviteCodeInfos.push(temp)
        }
        that.setData({
          inviteCodeInfos: inviteCodeInfos
        })
        console.log('copy success')
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let that = this;
    wx.request({
      url: url.serverUrl + 'mini/partner/inviteCodeAndRecored',
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
        url.logoutAction(res)

        console.log(res.data)
        var data = res.data
        if (data.status == "200") {
          that.setData({
            inviteCodeInfos: res.data.data.inviteCodeInfos,
            inviteRecordInfos: res.data.data.inviteRecordInfos,
            background: res.data.data.background
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
    return {
      title: 'Blueglass我的酸奶店',
      imageUrl:"../../Images/shop/tohome.png",
      path: 'pages/ShopPage/MyShop/index'
    }
  }
})