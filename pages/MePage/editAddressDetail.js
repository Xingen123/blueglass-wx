// pages/MePage/editAddressDetail.js
var url = require('../../utils/url.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:"",
    phone:"",
    address:"",
    addressDetail:"",
    lat:"",
    lng:"",
    addressId:"",
    city:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //"{"address":"朝阳区西大望路一号温特莱中心","addressDetail":"B座1110","mobile":"18510056844","recieveName":"崔崔","addressId":"92BB38340ADF4EF19FA23C7DEABFC55A"}"
    var addressDic = JSON.parse(options.address)
    console.log(addressDic)
    this.setData({
      name: addressDic.recieveName,
      phone: addressDic.mobile,
      address: addressDic.address,
      addressDetail: addressDic.addressDetail,
      lat: addressDic.latitude,
      lng: addressDic.longitude,
      addressId: addressDic.addressId,
      city: addressDic.city
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

  addressInput:function(e){
    console.log(e)
    wx.navigateTo({
      url: 'searchAddress',
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  phoneInput:function(e){
    console.log(e)
    this.setData({
      phone: e.detail.value
    })
  },
  nameInput:function(e){
    this.setData({
      name: e.detail.value
    })
  },
  detailInput:function(e){
    this.setData({
      addressDetail: e.detail.value
    })
  },
  logout: function () {

    //mini/partner/addOrEditAddress
    let that = this;

    wx.showLoading({
      title: '正在加载',
    })

    wx.request({
      url: url.serverUrl + 'mini/partner/addOrEditAddress',
      method: 'POST',
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      data: {
        token: wx.getStorageSync('token'),
        addressId: that.data.addressId,
        city: that.data.city,
        address: that.data.address,
        recieveName: that.data.name,
        addressDetail: that.data.addressDetail,
        mobile:that.data.phone,
        longitude:that.data.lng,
        latitude:that.data.lat
      },
      success: function (res) {
        url.logoutAction(res)
        wx.hideLoading();
        
        console.log(res.data)
        var data = res.data
        if (data.status == "200") {
          wx.navigateBack({
            delta:'1'
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
  }
})