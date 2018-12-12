// pages/ShopPage/PartnerShop/idnex.js
var url = require('../../../utils/url.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: wx.getStorageSync('token'),
    randPartnerInfos: {},
    advertisingInfos: [],
    indicatorDots: false,
    autoplay: true,
    circular: true,
    interval: 2000,
    duration: 1000,
    showView0: false, //是否显示我的店铺开场动画
    showView1: false, //是否显示我的店铺开场动画
    showView2: false, //是否显示我的店铺开场动画
    showView3: false, //是否显示我的店铺开场动画
    curindex: 0,
    isNotPatenter: 0,
    // partnerId: '',
    partnerId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options,"options5")
    if (wx.getStorageSync('token')) {
      console.log(options)
      this.setData({
        partnerId: options.partnerid,
        isNotPatenter: 1,
      })
      this.myShopInfo()
      // this.myShopInfo()
    } else {
      wx.reLaunch({
        url: '../../LogIn/LogIn',
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  addMyCollect(e) {
    console.log(e)
    let that = this;
    wx.request({
      url: url.serverUrl + 'mini/partner/addMyCollect',
      method: 'POST',
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      data: {
        token: wx.getStorageSync('token'),
        partnerId: that.data.partnerId
      },
      success: function(res) {
        url.logoutAction(res)
        console.log(res.data)
        var data = res.data
        if (data.status == "200") {
          if (that.data.existCollect == "收藏店铺") {
            wx.showToast({
              title: "收藏成功",
              icon: 'success',
              duration: 2000,
              success() {
                that.setData({
                  existCollect: "已收藏"
                })
              }
            })
          } else {
            wx.showToast({
              title: "取消收藏",
              icon: 'success',
              duration: 2000,
              success() {
                that.setData({
                  existCollect: "收藏店铺"
                })
              }
            })
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
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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

  },


  isPartner() {
    let that = this;
    wx.request({
      url: url.serverUrl + 'mini/partner/isPartner',
      method: 'POST',
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      data: {
        token: wx.getStorageSync('token'),
      },
      success: function(res) {
        console.log(res.data,"isPartner :res.data")
        url.logoutAction(res)

        var data = res.data
        if (data.status == "200") {
          if (data.data.partnerId) {
            that.setData({
              isNotPatenter: 1
            })
            console.log("跳转")
            that.myShopInfo()
          }
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
  myShopInfo() {
    console.log("myShopInfo被调用")
    let that = this;
    wx.request({
      url: url.serverUrl + 'mini/partner/getPartnerShopInfo?',
      method: 'POST',
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      data: {
        token: wx.getStorageSync('token'),
        partnerId: that.data.partnerId
      },
      success: function(res) {
        console.log("myShopInfo被调用后的返回", res)
        var data = res.data
        if (data.status == "200") {
          if (data.data.existCollect) {
            that.setData({
              existCollect: "已收藏"
            })
          } else {
            that.setData({
              existCollect: "收藏店铺"
            })
          }
          that.setData({
            randPartnerInfos: data.data,
          })

          console.log(that.data.randPartnerInfos, "成功成功成功成功成功成功")
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
  advertisingInfosClick(e) {
    console.log(e)
    let redirecttarget = e.currentTarget.dataset.redirecttarget
    if(redirecttarget){
        wx.setStorageSync('redirecttarget', redirecttarget)
        wx.navigateTo({
            url: '../articlWebView/index',
        })
    }
  },
  //点击记录
  recordClick() {
    wx.navigateTo({
      url: '../MyRecords/index',
    })
  },
  home(e) {
    wx.reLaunch({
      url: '../../RecomandPage/RecomandIndex/index',
    })
  },
  DIYAction(e) {
    console.log(e)
    wx.navigateTo({
      url: '../../RecomandPage/index?partnerId=' + this.data.partnerId
    })
  }
})