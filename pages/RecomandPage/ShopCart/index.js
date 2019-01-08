// pages/RecomandPage/ShopCart/index.js
var url = require('../../../utils/url.js');
var util = require('../../../utils/util.js');
import Dialog from '../../../dist/dialog/dialog';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopname: "订单详情",
    isBindPhone:false,
    messageAlign:"right"
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.yzPhone()
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
  yzPhone() {
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
        console.log(Dialog)
        if (!res.data.data.phone) {
          Dialog.alert({
            message: '绑定手机号，喝杯大师酸奶',
            confirmButtonText: "绑定",
            messageAlign: "center",
            confirmButtonOpenType: 'getPhoneNumber',
          }).then((succss) => {
            console.log(succss)
          });
        }
        else {
          
        }
      }
    })
  },

  receiveGiftTicket(phone) {
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
        wx.hideLoading()
        if (res.data.status == 200) {
          wx.showToast({
            title: '绑定成功',
            icon: 'success',
            duration: 1000
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
  bindgetphonenumber(e) {
    let encryptedData = e.detail.encryptedData;
    let iv = e.detail.iv;
    if (encryptedData) {
      this.bindSuccse(encryptedData, iv)
    } else {
      // wx.navigateTo({
      //   url: '../../MePage/editPhone?typecode=1&sendUserId' + this.data.sendUserId,
      // })
      wx.showToast({
        title: '请绑定完成下单',
        icon:"none",
        duration: 1000
      })
      Dialog.alert({
        message: '绑定手机号，喝杯大师酸奶',
        confirmButtonText: "绑定",
        messageAlign: "center",
        confirmButtonOpenType: 'getPhoneNumber',
      }).then((succss) => {
        console.log(succss)
      });
    }
  },
  bindSuccse(encryptedData, iv) {
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: url.serverUrl + 'mini/partner/decryptMobile',
      method: 'POST',
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      data: {
        token: wx.getStorageSync('token'),
        encryptedData: encryptedData,
        iv: iv
      },
      success: (res) => {
        wx.hideLoading()
        if (res.data.status == 200) {
          // this.setData({
          //   isBindPhone: false
          // })
          this.receiveGiftTicket(res.data.data.mobile)
        }
      }
    })
  },
  onClickButton: function() {
    var that = this;

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