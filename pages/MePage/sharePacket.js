// pages/MePage/inviteCode.js

var url = require('../../utils/url.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inviteCodeInfos: [],
    inviteRecordInfos: [],
    imgUrls: [],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    sendUserId:"",
    partnerid:""
  },

  
  detailed() {
    wx.navigateTo({
      url: './detailed',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!wx.getStorageSync("token")){
      wx.navigateTo({
        url: '../LogIn/LogIn?sendUserId=' + this.data.sendUserId,
      })
    }else{
      this.yzPhone()
    }
  },
  goSharePacket() {
    wx.navigateTo({
      url: 'shareMyPacket/index',
    })
  },
  queryNum(){
    let that = this;
    wx.request({
      url: url.serverUrl + 'mini/partner/queryGiftRecords',
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
        console.log(res.data)
        var data = res.data
        if (data.status == "200") {
          that.setData({
            inviteRecordInfos: res.data.data.oldAndYoung.records,
            background: res.data.data.oldAndYoung.backGround,
            giftValue: res.data.data.oldAndYoung.giftValue,
            successAmount: res.data.data.oldAndYoung.person,
            myIcon: res.data.data.oldAndYoung.myIcon,
            myName: res.data.data.oldAndYoung.myName,
            partnerid: res.data.data.oldAndYoung.partnerId,
            sendUserId: res.data.data.oldAndYoung.sendUserId
          });
        } else {
          wx.showToast({
            title: data.errorMsg,
            icon: 'none',
            duration: 2000
          })
          wx.navigateTo({
            url: '../LogIn/LogIn?sendUserId=' + options.sendUserId,
          })
        }
      }
    })
  },
  sharePeople() {
    let old = `/pages/ShopPage/shareMyShop/index` //合伙人
    // let young = `/pages/MePage/sharePacket?sendUserId=${this.data.sendUserId}` //用户
    // let path = this.data.partnerid ? old : young;  //有partnerid分享出去落地页的是店铺页  没有分享出去的落地页是红包领取
    console.log(old, this.data.sendUserId, this.data.partnerid)
    //获取二维码图片
    wx.request({
      url: url.serverUrl + 'mini/partner/getPathQRcode',
      data: {
        path: old,
        sendUserId: this.data.sendUserId,
        partnerid: this.data.partnerid
      },
      method: 'GET',
      success:(res)=> {
        let qrCodeUrl = res.data.data.qrCodeUrl
        wx.setStorageSync('qrCodeUrl', qrCodeUrl)
        let productDataset = {
          head: this.data.myIcon,
          name: {
            background: "https://wxmp.clicksdiy.com/makeup/pbag/5.png?" + Math.random(),
            partnerid: this.data.partnerid,
            shopname: this.data.myName
          },
          text: "这份时间的礼物，接住！",
          wxIcon: this.data.myIcon,
          width: "1"
        }
        console.log(qrCodeUrl)
        wx.setStorageSync('productDataset', productDataset)
        wx.navigateTo({
          url: '../ShopPage/MyShop/MyshopShare/index',
        })
        

      }
    })
  },
  yzPhone(){
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
        success: (res) => {
          if (!res.data.data.phone) {
            wx.reLaunch({
              url: '../LogIn/LogIn'
            })
          }
          else{
            this.queryNum()
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
    let old = `/pages/ShopPage/shareMyShop/index?sendUserId=${this.data.sendUserId}&partnerid=${this.data.partnerid}` //合伙人
    // let young = `/pages/MePage/sharePacket?sendUserId=${this.data.sendUserId}` //用户
    // let path = this.data.partnerid ? old : young;  //有partnerid分享出去落地页的是店铺页  没有分享出去的落地页是红包领取
    console.log(old)
    return {
      title: '我要发红包！谁都拦不住！100元拿去花！',
      imageUrl: "https://wxmp.clicksdiy.com/makeup/pbag/3.png?" + Math.random(),
      path: old
    }
  }
})