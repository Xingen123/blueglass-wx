// pages/RecomandPage/submitOrder/index.js
var url = require('../../../utils/url.js');
var util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 1,
    shopname: "Blueglass酸奶店 >",
    price: "",
    totalPrice: '',
    items: [
      // {
      //   "thumb": "../../Images/Order/address.png",
      //   "title": "商品标题1",
      //   "desc": "描述信息",
      //   "detail": "荔枝**1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1",
      //   "num": "2",
      //   "price": "20",
      // },
      // {
      //   "thumb": "../../Images/Order/address.png",
      //   "title": "商品标题2",
      //   "desc": "描述信息",
      //   "detail": "荔枝**1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1",
      //   "num": "2",
      //   "price": "20",
      // }
    ],
    orderId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    console.log("wocao")
    var addressInfodetail = JSON.parse(options.addressInfodetail);
    var shoppingCartData = JSON.parse(options.shoppingCartData);
    var that = this;
    this.setData({
      merchantId: options.merchantId,
      addressId: options.addressId,
      isPickup: options.isPickup,
      shortName: options.shortName,
      location: options.location,
      addressInfodetail: addressInfodetail,
      orderId: options.orderId,
      deliveryCost: options.deliveryCost
    })
    if (options.isPickup == 0) {
      this.setData({
        active: 1
      })
      if (addressInfodetail.addressId) {
        wx.request({
          url: url.serverUrl + 'mini/partner/calculateDeliveryCost',
          method: 'POST',
          header: {
            //设置参数内容类型为x-www-form-urlencoded
            'content-type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          },
          data: {
            token: wx.getStorageSync('token'),
            orderId: that.data.orderId,
            addressId: that.data.addressInfodetail.addressId,
            // type:"GIVE_MYSELF"
          },
          success: function(myres) {
            wx.hideLoading();
          console.log("1")
            var mydata = myres.data
            if (mydata.status == "200") {
              that.setData({
                price: mydata.data.ordertInfo.totalPrice - mydata.data.ordertInfo.deliveryCost,
                totalPrice: parseFloat(mydata.data.ordertInfo.totalPrice),
                deliveryCost: mydata.data.ordertInfo.deliveryCost,
                
              })

            } else {
              wx.hideLoading();
              wx.showToast({
                title: mydata.errorMsg,
                icon: 'none',
                duration: 2000
              })
            }
          },
          fail: function (err) {
            wx.showToast({
              title: '服务器异常',
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    } else {
      this.setData({
        active: 0
      })


    }


    var tradeInfos = [];
    var items = [];
    console.log(shoppingCartData);
    for (var i = 0; i < shoppingCartData.length; i++) {

      var tradeInfo = {};
      tradeInfo.id = shoppingCartData[i].id;
      tradeInfo.amount = shoppingCartData[i].amount;
      tradeInfos.push(tradeInfo);
      var item = {};
      item.id = shoppingCartData[i].productId;
      item.thumb = shoppingCartData[i].icon;
      item.title = shoppingCartData[i].name;
      item.detail = shoppingCartData[i].materials;
      item.num = shoppingCartData[i].amount;
      item.price = shoppingCartData[i].price;
      item.isLucky = shoppingCartData[i].isLucky;
      items.push(item);
      that.setData({
        items: items,
        price: parseFloat(options.totalPrice) - parseFloat(options.deliveryCost),
        totalPrice: parseFloat(options.totalPrice)
      })
    }


    // var payableAmount = totalPrice; ???
    that.setData({
      // payableAmount: payableAmount,???谁加的用不用
      tradeInfos: JSON.stringify(tradeInfos),
    })


  },
  onChange(event) {
    var that = this;
    console.log(event)
    if (event.detail.index == 0) {
      console.log("11")
      this.setData({
        isPickup: 1,

      })
      wx.showLoading({
        title: '正在加载',
      })

        wx.request({
          url: url.serverUrl + 'mini/partner/calculateDeliveryCost',
          method: 'POST',
          header: {
            //设置参数内容类型为x-www-form-urlencoded
            'content-type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          },
          data: {
            token: wx.getStorageSync('token'),
            orderId: that.data.orderId,
            addressId: ''
          },
          success: function (myres) {
            wx.hideLoading();

            var mydata = myres.data
            if (mydata.status == "200") {
              // that.setData({
              //   price: mydata.data.ordertInfo.totalPrice - mydata.data.ordertInfo.deliveryCost,
              //   totalPrice: parseFloat(mydata.data.ordertInfo.totalPrice),
              //   deliveryCost: mydata.data.ordertInfo.deliveryCost
              // })

            } else {
              wx.hideLoading();
              wx.showToast({
                title: mydata.errorMsg,
                icon: 'none',
                duration: 2000
              })
            }
          }
        })


    } else {
      this.setData({
        isPickup: 0,

      })
      wx.showLoading({
        title: '正在加载',
      })
    
      if (that.data.addressInfodetail.addressId) {
        wx.request({
          url: url.serverUrl + 'mini/partner/calculateDeliveryCost',
          method: 'POST',
          header: {
            //设置参数内容类型为x-www-form-urlencoded
            'content-type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          },
          data: {
            token: wx.getStorageSync('token'),
            orderId: that.data.orderId,
            addressId: that.data.addressInfodetail.addressId
          },
          success: function(myres) {
            wx.hideLoading();
            console.log(myres)
            var mydata = myres.data
            if (mydata.status == "200") {
              that.setData({
                price: mydata.data.ordertInfo.totalPrice - mydata.data.ordertInfo.deliveryCost,
                totalPrice: parseFloat(mydata.data.ordertInfo.totalPrice),
                deliveryCost: mydata.data.ordertInfo.deliveryCost
              })

            } else {
              wx.hideLoading();
              wx.showToast({
                title: mydata.errorMsg,
                icon: 'none',
                duration: 2000
              })
            }
          },
          fail:function(err){
            console.log(888)
          }
        })
      }else{
        wx.hideLoading();
        wx.showToast({
          title: "请选择地址",
          icon: 'none',
          duration: 2000
        })
      }


    }
  },
  onClickButton: function() {
    var that = this;
    console.log(that.data);

    if (!that.data.addressInfodetail.addressId && that.data.isPickup != 1) {
      wx.showToast({
        title: '请选择地址',
        icon: 'none',
      })
      return;
    }
    var addressId;
    if (that.data.isPickup == 1) {
      addressId = '';
    } else {
      addressId = that.data.addressInfodetail.addressId;
    }


    util.wxNewPay(wx.getStorageSync('token'), that.data.orderId, function(e) {
      // wx.navigateBack({
      //   delta: 10
      // })
      console.log(e);
      if (that.data.isPickup == 1) {
        wx.navigateTo({
          url: '../../OrderPage/PurchaseOrder/index?orderId=' + e.orderId,
        })
      } else {
        wx.navigateTo({
          url: '../../OrderPage/DistributionOrderDetail/index?orderId=' + e.orderId,
        })
      }
      // wx.switchTab({
      //   url: '../../../pages/OrderPage/index'
      // })
    }, function(fialres) {
      console.log('fialres');
      console.log(fialres);
      wx.switchTab({
        url: '/pages/OrderPage/index?istype=1'
      })
    });
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
    console.log('onUnload');

    wx.reLaunch({
      url: '/pages/OrderPage/index?istype=1',
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },
  chooseAddress: function() {
    wx.navigateTo({
      url: '../../MePage/editAddress?isChoose=1&orderId=' + this.data.orderId,
    })
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