// pages/OrderPage/UnpaidOrderDetail/index.js
var serverUrl = require('../../../utils/url.js');

var util = require('../../../utils/util.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopname: "Blueglass酸奶店 >",
    orderInfo:[],
    merchantInfo:{},
    productDetails:[],
    addressInfo:{},
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
  onLoad: function (options) {
    this.loadOrderData(options)
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

  },
  //加载订单数据
  loadOrderData: function (options) {
    let that = this;
    console.log(options)
    let orderId = options.orderId
    that.setData({
      orderId: orderId
    })
    let orderType = options.orderType
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
          var tradeInfos = [];


       
          console.log(data.data.shoppingCartData);
          for (var i = 0; i < data.data.productDetails.length; i++) {
            var tradeInfo = {};
            tradeInfo.id = data.data.productDetails[i].productId;
            tradeInfo.amount = data.data.productDetails[i].amount;
            tradeInfos.push(tradeInfo);
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
          that.setData({
            tradeInfos: JSON.stringify(tradeInfos),
            orderType: orderType

          })

          // for (var i = 0; i < data.data.productDetails.length; i++ ){
          //   var tradeMaterials = data.data.productDetails[i].tradeMaterials;
          //   console.log(tradeMaterials)
          //   for (var j = 0; j < tradeMaterials.length; j++){
          //     that.setData({
          //       items: [
          //         {
          //           "id": data.data.productDetails[i].productId,
          //           "thumb": data.data.productDetails[i].icon,
          //           "title": data.data.productDetails[i].productName,
          //           "desc": data.data.productDetails[i].nickName,
          //           "detail": data.data.productDetails[i].tradeMaterials,
          //           "num": data.data.productDetails[i].amount,
          //           "price": data.data.productDetails[i].totalPrice,
          //         }
          //       ]
          //     });
          //   }
          // }

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
  canleOrder: function () {
    var that = this;
    let orderId = that.data.orderId
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: serverUrl.serverUrl + 'mini/partner/deleteOrder',
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
        let data = res.data
        if (data.status == 200) {
          wx.showToast({
            title: '订单已取消',
            icon: 'none',
          })
          wx.reLaunch({
            url: '/pages/OrderPage/index?istype=1',
          })

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
  onClickButton:function(){
    console.log('立即支付');
    //wxPay(token, merchantId, addressId, payableAmount, tradeInfos, isPickup ,callback)
    // util.wxPay('6000001740059476', this.data.merchantInfo.merchantId, '', this.data.orderInfo.payableAmount, JSON.stringify(this.data.productDetails).replace('productId','id'),false,function(e){

    // });
    var isPickup = 1;
    if (this.data.orderType == '外卖订单') {
      isPickup = 0;
    }
    var that = this;
    let orderId = that.data.orderId
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: serverUrl.serverUrl + 'mini/partner/paymentByOrderId',
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
        console.log('xxxxxxx');
        console.log(res);
        var appid = res.data.data.appId;
        wx.requestPayment({
          'timeStamp': res.data.data.timeStamp,
          'nonceStr': res.data.data.nonceStr,
          'package': res.data.data.exPackage,
          'signType': 'MD5',
          'paySign': res.data.data.paySign,
          'success': function (ressuccess) {
            if (isPickup == 1) {
              wx.navigateTo({
                url: '../../OrderPage/PurchaseOrder/index?orderId=' + res.data.data.orderId,
              })
            }
            else {
              wx.navigateTo({
                url: '../../OrderPage/WaitingOrderDetail/WaitingOrderDetail?orderId=' + res.data.data.orderId,
              })
            }

          },
          'fail': function (res) {
            console.log('支付失败' + res)
          }
        })
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showToast({
          title: '网络错误，请稍后重试',
          icon: 'none',
        })
      }
    });




 




  }
})