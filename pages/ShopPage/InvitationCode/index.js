var url = require('../../../utils/url.js')

Page({
  /** 
   * 页面的初始数据 
   */
  data: {
    Length: 5, //输入框个数 
    isFocus: true, //聚焦 
    Value: "", //输入的内容 
    ispassword: false, //是否密文显示 true为密文， false为明文。
    showTips: '下一步',
    path:""
  },
  pathUclick() {
      wx.navigateTo({
        url: './uclickPage/uclickBecomePage',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      });
  },
  Focus(e) {
    var that = this;
    that.setData({
      showTips: '下一步'
    })
    console.log(e.detail.value);
    var inputValue = e.detail.value;
    that.setData({
      Value: inputValue,
    })
    // if(e.detail.value.length==5)
    // {



    // }

  },
  Tap() {
    var that = this;
    that.setData({
      isFocus: true,
    })
  },
  formSubmit(e) {
    console.log(e.detail.value.password);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  xiayibu: function() {
    let that = this;
    wx.request({
      url: url.serverUrl + 'mini/partner/joinPartnerByInviteCode',
      method: 'POST',
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      data: {
        token: wx.getStorageSync('token'),
        inviteCode: that.data.Value
        // token:"6000001740059476",
      },
      success: function(res) {
        console.log(res.data)
        var data = res.data
        if (data.status == "200") {
          wx.navigateTo({
            url: '../myapplyView/index?value=' + that.data.Value,
          })
          //todo tengyu
        } else {
          that.setData({
            showTips: data.errorMsg,
          })
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
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})