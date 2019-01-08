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
    shareImg: "https://wxmp.clicksdiy.com/makeup/pbag/4.png?" + Math.random(),
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
    partnerId: '',
    sendUserId:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (wx.getStorageSync('token')) {
      if (options.giftTicketId) {
        console.log(options.keyId,"这就是keyId！！！！")
        wx.request({
          url: url.serverUrl + 'mini/partner/sendGiftTicket',
          method: 'POST',
          header: {
            //设置参数内容类型为x-www-form-urlencoded
            'content-type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          },
          data: {
            token: wx.getStorageSync('token'),
            ticketId: options.giftTicketId,
            keyId:options.keyId
          },
          success: (res) => {
          
           if(res.data.status == 200){
             wx.showToast({
               title: "领取成功",
               icon:"success",
               duration: 2000
             })
           }else{
             wx.showToast({
               title: "优惠券已被领取",
               icon:"none"
              })
           }
          },
          fail:(err) => {
            console.log(err)
          }
        })
      }
      this.setData({
        partnerId: options.partnerid,
        isNotPatenter: 1,
      })
      if (options.partnerid && options.sendUserId){
       this.setData({
         sendUserId: options.sendUserId
       })
     }
      this.shop(options.sendUserId)
      console.log("有token")
    } else {
      console.log("无token")
      let sendUserId = options.sendUserId ? '../../LogIn/LogIn?sendUserId=' + options.sendUserId : '../../LogIn/LogIn'
      wx.setStorage({
        key: 'partnerid',
        data: options.partnerid,
        success:function() {
          wx.navigateTo({
            url: sendUserId,
          })
        }
      })
     
    }
  },
  shareParekt() {
    wx.navigateTo({
      url: '../../MePage/sharePacket',
    })
  },
  shop(sendUserId){
    console.log(sendUserId)
    wx.request({
      url: url.serverUrl + 'mini/partner/check/isBindPhone',
      method: 'POST',
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      data: {
        token: wx.getStorageSync('token'),
      },
      success: (res)=> {
        if (res.data.data.phone){
          this.myShopInfo()
          console.log("绑定")
        }else{
          console.log("没绑定")
          wx.reLaunch({
            url: '../../RecomandPage/RecomandIndex/index?isPhone=isPhone&sendUserId=' + sendUserId + '&partnerid=' + this.data.partnerid,
          })
        }
      }
      })
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
   
    return {
      title: this.data.randPartnerInfos.shopName + ":酸奶店里走一走,不买不是好朋友!",
      imageUrl: this.data.randPartnerInfos.background,
      success: function () {

      }
    }
  },
  myShopInfo() {
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
        console.log(res)
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
        } 
        else if (data.status == "400"){
          wx.reLaunch({
            url: '../../RecomandPage/RecomandIndex/index',
          })
        }
        else {
          wx.setStorage({
            key: 'partnerid',
            data: that.data.partnerId,
            success: function () {
              wx.reLaunch({
                url: '../../LogIn/LogIn',
              })
            }
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