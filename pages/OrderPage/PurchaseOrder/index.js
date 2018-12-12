// pages/OrderPage/DistributionOrderDetail/index.js
var serverUrl = require('../../../utils/url.js');
import drawQrcode from '../../../utils/weapp.qrcode.js' 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopname: "",
    items: [
    ],
    steps: [
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadOrderData(options);
  },
  merchantInfo(e){
    console.log(e)
    wx.navigateTo({
      url: '../positionShop/index?id=' + e.currentTarget.dataset.merchantid,
    })
  },
  loadOrderData: function (options) {
    let that = this;
    console.log(options)
    let orderId = options.orderId
    console.log("orderId");
    that.draw(orderId);
    console.log(orderId);
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: serverUrl.serverUrl + 'mini/partner/queryOrderDetails',
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      data: {
        token: wx.getStorageSync('token'),
        orderId: orderId
      },
      method: 'POST',
      success: function (res) {
        wx.hideLoading();
        serverUrl.logoutAction(res)

        let data = res.data
        if (data.status == 200) {
          console.log(data)
          that.setData({
            orderInfo: data.data.orderInfo,
            merchantInfo: data.data.merchantInfo,
            productDetails: data.data.productDetails
          })

          var items = [];

          console.log(data.data.shoppingCartData);
          for (var i = 0; i < data.data.productDetails.length; i++) {

            var item = {};
            item.id = data.data.productDetails[i].productId;
            item.thumb = data.data.productDetails[i].icon;
            item.title = data.data.productDetails[i].productName;
            item.detail = data.data.productDetails[i].tradeMaterials;
            item.num = data.data.productDetails[i].amount;
            item.price = data.data.productDetails[i].totalPrice;
            item.isLucky = 'false'
            items.push(item);
            that.setData({
              items: items,
              shopname: data.data.productDetails[i].nickName,

            })
          }

        } else {
          wx.showToast({
            title: data.errorMsg,
            icon: 'none',
          })
        }

      },
      fail: function (res) {
        wx.hideLoading();
        wx.showToast({
          title: '网络错误，请稍后重试',
          icon: 'none',
        })
      }
    });
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

  draw:function(orderId) {
    drawQrcode({
      width: 150, //二维码宽高,宽高要与canvas标签宽高一致
      height: 150,
      canvasId: 'myQrcode',
      text: orderId //二维码内容
    })
  },


  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.reLaunch({
      url: '/pages/OrderPage/index?istype=2',
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

  }
})