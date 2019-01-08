// pages/MePage/editPhone.js
var url = require('../../utils/url.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '请选择日期',
    fun_id: 2,
    time: '获取验证码', //倒计时 
    currentTime: 61,
    phone: null,
    code: null,
    typecode:"",
    sendUserId:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.sendUserId){
      this.setData({
        sendUserId: options.sendUserId
      })
    }
    this.setData({
      typecode : options.typecode
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  
  phoneInput: function (e) {
    const that = this;
    that.setData({
      phone: e.detail.value,
    })
  },
  codeInput: function (e) {
    const that = this;
    that.setData({
      code: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  logout:function(){
    let that = this;
    wx.request({
      url: url.serverUrl + 'mini/partner/bindPhone',
      method: 'POST',
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      data: {
        token: wx.getStorageSync('token'),
        phone: that.data.phone,
        verifyCode:that.data.code
      },
      success: function (res) {
        url.logoutAction(res)

        console.log(res.data)
        var data = res.data
        if (data.status == "200") {
          let partnerid = wx.getStorageSync('partnerid');
          if (partnerid){

            wx.navigateTo({
              url: '../ShopPage/shareMyShop/index?partnerid='+partnerid,
            })      
          }else{
            wx.setStorageSync('phone', that.data.phone)
            if (that.data.typecode == "1") {
                console.log(5555)
              that.receiveGiftTicket(that.data.phone)
              // wx.reLaunch({
              //   url: '../RecomandPage/RecomandIndex/index?isPhone=isPhoneYzm&sendUserId=' + that.data.sendUserId,
              // })
            }
            else {
              wx.navigateBack({
                delta: "1"
              })
            }
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
  receiveGiftTicket(phone) {
    console.log(phone, this.data.sendUserId)
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: url.serverUrl + 'mini/partner/receiveGiftTicket',
      method: 'POST',
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      data: {
        token: wx.getStorageSync('token'),
        phone: phone,
        sendUserId: this.data.sendUserId
      },
      success: (res) => {
        console.log(res, 9999)
        wx.hideLoading()
        if (res.data.status == 200) {
           wx.reLaunch({
             url: '../RecomandPage/RecomandIndex/index?isPhone=isPhoneYzm&sendUserId=' + this.data.sendUserId,
           })
        }
      },
      fail: (err) => {
        wx.hideLoading()
        wx.showModal({
          title: err.data,
        })
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

  },
  getBindCode: function (res) {
    var that = this

    if (this.data.phone) {
      that.setData({
        disabled: true
      })
      wx.showToast({
        title: '获取验证码',
      })

      wx.request({
        url: url.serverUrl + 'mini/partner/sendSMS',
        method: 'POST',
        header: {
          //设置参数内容类型为x-www-form-urlencoded
          'content-type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        data: {
          token: wx.getStorageSync('token'),
          mobile:that.data.phone
        },
        success: function (res) {
          console.log(res.data)
          var data = res.data
          if (data.status == "200") {


          } else {
            wx.showToast({
              title: data.errorMsg,
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    }
    else {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
      })
    }
  },
})