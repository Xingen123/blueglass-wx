// pages/RecomandPage/submitOrder/index.js
var url = require('../../../utils/url.js');
var util = require('../../../utils/util.js');
import Dialog from '../../../dist/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 1,
    couponPrice:0,
    deliveryPrice:0,
    couponNum:0,
    giftTicketId:"",
    shopname: "Blueglass酸奶店 >",
    price: "",
    totalPrice: '',
    bgLoading:false,
    coupon:"点击添加优惠券",
    shareImg: "https://wxmp.clicksdiy.com/makeup/pbag/4.png?" + Math.random(),
    deliveryCost:"", //配送金额
    items: [
    ],
    orderId: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
        this.setData({
          bgLoading: true
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
            addressId: that.data.addressInfodetail.addressId,
            // type:"GIVE_MYSELF"
          },
          success: function(myres) {
            wx.hideLoading();

            var mydata = myres.data
            if (mydata.status == "200") {
              that.setData({
                price: mydata.data.ordertInfo.totalPrice - mydata.data.ordertInfo.deliveryCost,
                totalPrice: parseFloat(mydata.data.ordertInfo.totalPrice),
                deliveryCost: mydata.data.ordertInfo.deliveryCost,
                bgLoading:false
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
       let even = {
        detail:{
          index:1
        }
      }
      this.onChange(even)
    } else {
      this.setData({
        active: 0
      })
      console.log(555)
  

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
  shareParekt() {
    wx.navigateTo({
      url: '../../MePage/sharePacket',
    })
  },
  goCoupon(e){
   
    let price = parseInt(this.data.price)  > 0 ? parseInt(this.data.price) + parseInt(this.data.couponPrice) : parseInt(this.data.totalPrice)//自取总金额

 


    let delivery = parseInt(this.data.totalPrice) + parseInt(this.data.deliveryPrice) //配送总金额  

    let state = e.currentTarget.dataset.state == "ask" ? price : delivery  

    let priceOrder = parseInt(this.data.deliveryCost) + parseInt(this.data.derateCost) 

    console.log(parseInt(this.data.price),parseInt(this.data.couponPrice))

      wx.navigateTo({
        url: './coupon/index?orderId=' + this.data.orderId + '&money=' + state + "&state=" + e.currentTarget.dataset.state + "&priceOrder=" + priceOrder,
      })
  },
  onChange(event) {
    var that = this;
    console.log(event.detail)
    if (event.detail.index == 0) {
      this.setData({
        isPickup: 1,
        coupon: "点击添加优惠券",
        couponPrice:0,
        couponNum:0,
        giftTicketId: "",
        bgLoading: true
        
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
            console.log(that.data.addressInfodetail.addressId)
            var mydata = myres.data
            console.log(mydata)

            if (mydata.status == "200") {
              that.setData({
                price: mydata.data.ordertInfo.totalPrice, 
                totalPrice: mydata.data.ordertInfo.totalPrice ,
                bgLoading: false
              })

            } else {
              wx.hideLoading();
              that.setData({
                bgLoading: false
              })
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
        coupon: "点击添加优惠券",
        deliveryPrice:0,
        couponNum: 0,
        giftTicketId: "",
        bgLoading: true
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
                deliveryCost: mydata.data.ordertInfo.sendPrice,
                derateCost: mydata.data.ordertInfo.derateCost,
                bgLoading: false
              })

            } else if (mydata.status == "400") {
              console.log(that.data.addressInfodetail.addressId)
              wx.showToast({
                title: mydata.errorMsg,
                icon: 'none',
                duration: 2000
              })
              let eventt = {
                detail: {
                  index: 0
                }
              }
              that.setData({
                bgLoading: false,
                active:0
              })

              that.onChange(eventt)
            }
             else {
              wx.hideLoading();
              that.setData({
                bgLoading: false
              })
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
        that.setData({
          bgLoading: false
        })
        wx.showToast({
          title: "请选择地址",
          icon: 'none',
          duration: 2000
        })
      }


    }
  },
  onClickButtonAlert(e){
    console.log(e)
    Dialog.confirm({
      title: e.target.dataset.state,
      message: '确认后订单将不能更改'
    }).then(() => {
      this.onClickButton()
    }).catch(() => {
      // on cancel
    });
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


    util.wxNewPay(that.data.giftTicketId,wx.getStorageSync('token'), that.data.orderId, function(e) {
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
    let allPrice = this.data.totalPrice + this.data.couponNum
    this.setData({
      coupon: "点击添加优惠券",
      totalPrice: allPrice,
      couponPrice: 0,
      couponNum: 0,
      deliveryPrice:0,
      giftTicketId: ""
    })
    wx.navigateTo({
      url: '../../MePage/editAddress?isChoose=1&orderId=' + this.data.orderId + '&allPrice=' + allPrice,
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