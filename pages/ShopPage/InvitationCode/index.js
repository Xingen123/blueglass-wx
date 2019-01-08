var url = require('../../../utils/url.js')

Page({
  /** 
   * 页面的初始数据 
   */
  data: {
    // Length: 5, //输入框个数 
    isFocus: true, //聚焦 
    Value: "", //输入的内容 
    // ispassword: false, //是否密文显示 true为密文， false为明文。
    showTips: '下一步',
    path:"",
    bottom:0,
    color:"rgba(155,155,155,1)"
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
    console.log(e.detail.value);
    var inputValue = e.detail.value;
    if (inputValue){
      this.setData({
        Value: inputValue,
        color: "rgba(0,160,232,1)"
      })
    }else{
      this.setData({
        Value: inputValue,
        color: "rgba(155,155,155,1)"
      })
    }
   
  },
  keyboard(e){
    let keyHeight = e.detail.height
    this.setData({
      bottom: keyHeight 
    })
  },
  keyboardOff(){
    this.setData({
      bottom: 0
    })
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
    if (that.data.Value){
      console.log(that.data.Value)
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
        success: function (res) {
          var data = res.data
          if (data.status == "200") {
            wx.navigateTo({
              url: '../myapplyView/index?value=' + that.data.Value,
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
    }else{
      wx.showToast({
        title: "请填写开店码",
        icon: 'none',
        duration: 2000
      })
    }
  
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