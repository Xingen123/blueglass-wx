// pages/RecomandPage/ShopCart/index.js
var url = require('../../../utils/url.js');
var util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopname: "订单详情",
    // items: [
    //   {
    //     "thumb": "../../Images/Order/address.png",
    //     "title": "商品标题1",
    //     "desc": "描述信息",
    //     "detail": "荔枝**1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1",
    //     "num": "2",
    //     "price": "20",
    //   },
    //   {
    //     "thumb": "../../Images/Order/address.png",
    //     "title": "商品标题2",
    //     "desc": "描述信息",
    //     "detail": "荔枝**1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1",
    //     "num": "2",
    //     "price": "20",
    //   }
    // ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    let that = this;

    var productList = JSON.parse(options.productListJson);
    var addressInfodetail = JSON.parse(options.addressInfodetail);

    var partnerId = options.partnerId;
    var merchantId = options.merchantId;
    var isZiqu = options.isZiqu;
    var isPickup = 1;
    var addressId = options.addressId;
    if (isZiqu == 0) {
      isPickup = 1;
    } else {
      isPickup = 0;
    }
    that.setData({
      partnerId: partnerId,
      merchantId: merchantId,
      addressId: options.addressId,
      isPickup: isPickup,
      location: options.location,
      shortName: options.shortName,
      addressInfodetail: addressInfodetail
    })

    wx.request({
      url: url.serverUrl + 'mini/partner/viewShoppingCart?token=' + wx.getStorageSync('token') + '&partnerId=' + partnerId,
      data: {},
      method: 'GET',
      success: function(res) {
        console.log(res.data)
        url.logoutAction(res)

        var data = res.data
        if (data.status == "200") {
          var tradeInfos = [];
          console.log(data.data.shoppingCartData);
          var  items =[];
          for (var i = 0; i < data.data.shoppingCartData.length; i++) {

            var tradeInfo = {};
            var item = {};

            tradeInfo.id = data.data.shoppingCartData[i].id;
            tradeInfo.amount = data.data.shoppingCartData[i].amount;
            tradeInfos.push(tradeInfo);
            item.id = data.data.shoppingCartData[i].productId;
            item.title = data.data.shoppingCartData[i].name;
            item.detail = data.data.shoppingCartData[i].materials;
            item.num = data.data.shoppingCartData[i].amount;
            item.price = data.data.shoppingCartData[i].price;
            item.thumb = data.data.shoppingCartData[i].icon;
            item.isLucky = data.data.shoppingCartData[i].isLucky
            items.push(item);
          }
          that.setData({
            items: items,
            "totalPrice": parseFloat(data.data.totalPrice)
          })


          var payableAmount = data.data.totalPrice;
          that.setData({
            payableAmount: payableAmount,
            tradeInfos: JSON.stringify(tradeInfos),
          })

        } else {
          wx.showToast({
            title: data.errorMsg,
            icon: 'success', 
            duration: 2000
          })
        }
      },
      fail: function(res) {
        wx.hideLoading();
        wx.showToast({
          title: '网络错误，请稍后重试',
          icon: 'none',
        })
      }
    });
  },



  onClickButton: function() {
    var that = this;
    // console.log(that.data);

    // util.wxPay('6000001740059476', that.data.merchantId, that.data.addressId, that.data.payableAmount, that.data.tradeInfos, that.data.isPickup, function (e) {

    // });
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: url.serverUrl + 'mini/partner/submitOrder',
      method: 'POST',
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      data: {
        token: wx.getStorageSync('token'),
        merchantId: that.data.merchantId,
        addressId: that.data.addressId,
        payableAmount: that.data.payableAmount,
        tradeInfos: that.data.tradeInfos,
        isPickup: that.data.isPickup,
        // token:'6000001740059476'
      },
      success: function (res) {
        wx.hideLoading();

        console.log(res.data)
        url.logoutAction(res)
        that.setData({
          orderId: res.data.data.ordertInfo.orderId,
          shoppingCartData: res.data.data.ordertInfo.shoppingCartData,
          deliveryCost: res.data.data.ordertInfo.deliveryCost,
          totalPrice: res.data.data.ordertInfo.totalPrice,
        })
        var data = res.data
        if (data.status == "200") {
          var addressInfodetailJson = JSON.stringify(that.data.addressInfodetail);
          var shoppingCartData = JSON.stringify(that.data.shoppingCartData);
          wx.navigateTo({
            url: '../submitOrder/index?partnerId=' + that.data.partnerId + '&merchantId=' + that.data.merchantId + '&addressId=' + that.data.addressId + '&payableAmount=' + that.data.payableAmount + '&isPickup=' + that.data.isPickup + '&shortName=' + that.data.shortName + '&location=' + that.data.location + "&addressInfodetail=" + addressInfodetailJson + '&orderId=' + that.data.orderId + '&shoppingCartData=' + shoppingCartData + '&totalPrice=' + that.data.totalPrice + '&deliveryCost=' + that.data.deliveryCost,
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