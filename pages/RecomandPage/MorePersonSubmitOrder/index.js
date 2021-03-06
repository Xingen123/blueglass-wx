// pages/RecomandPage/submitOrder/index.js
var serverUrl = require('../../../utils/url.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:1,
    heardPath: "../../Images/Order/phone.png",
    personName: "张三",
    items: [
      
    ],
    coupon:"点击添加优惠券",
    deliveryPrice:0,
    giftTicketId:"",
    orderMoney:0
  },
  goCoupon(e){
   console.log("商品金额"+parseInt(this.data.orderAmount) ,"优惠券金额 "+parseInt(this.data.deliveryPrice) )

    let delivery = parseInt(this.data.orderAmount) //商品金额  + 优惠券金额 


    let priceOrder = parseInt(this.data.fareAmount) - parseInt(this.data.derateCost) //配送金额  

    console.log('配送金额'+priceOrder)

      wx.navigateTo({
        url: '../submitOrder/coupon/index?orderId=' + this.data.orderId + '&money=' + delivery + "&state=" + e.currentTarget.dataset.state + "&priceOrder=" + priceOrder,
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var productListData = JSON.parse(options.productListData);
    
    let payMoney = options.derateCost > 0 ? options.derateCost : productListData.sendPrice;
    let priceOrderMoney = productListData.orderAmount + productListData.sendPrice - productListData.derateCost;
    console.log("实际支付" + productListData);

    this.setData(
      {
        address: productListData.addressInfo,
        initiatorUser: productListData.initiatorUser,
        multiTradeId: options.multiTradeId,
        participantInfos: productListData.participantInfos,
        payAmount: parseFloat(priceOrderMoney) *100,
        orderAmount: productListData.orderAmount,
        shipment: productListData.shipment,
        deliveryCost: options.deliveryCost,
        fareAmount: productListData.sendPrice,

        derateCost: options.derateCost,
        orderId: productListData.orderId,
        partnerId: options.partnerId,
        addressId: options.addressId,
        price: priceOrderMoney 
      })
    var persons = [];
    for (var i = 0; i < this.data.participantInfos.length; i++) {

      var person = {};
      person.heardPath = this.data.participantInfos[i].participantUser.icon;
        person.personName = this.data.participantInfos[i].participantUser.nickName;
      console.log(this.data.participantInfos[i].participantUser.nickName);
      console.log(this.data.participantInfos[i].participantUserProducts);

      var items = [];
      for (var j = 0; j < this.data.participantInfos[i].participantUserProducts.length; j++)
      
       {
        var item = {};
        item.id = this.data.participantInfos[i].participantUserProducts[j].id;
        item.title = this.data.participantInfos[i].participantUserProducts[j].name;
        item.thumb = this.data.participantInfos[i].participantUserProducts[j].icon
        item.detail = this.data.participantInfos[i].participantUserProducts[j].comment;
        item.num = this.data.participantInfos[i].participantUserProducts[j].amount;
        item.price = this.data.participantInfos[i].participantUserProducts[j].price / this.data.participantInfos[i].participantUserProducts[j].amount;
        item.isLucky = 'false'
        items.push(item);
      }
      person.items = items;
      persons.push(person);


    }
    console.log(persons);
    this.setData(
      {
        persons: persons
      })

    

    console.log(productListData,666);
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
  onClickButton:function()
  {
    var that = this;
    wx.request({
      url: serverUrl.serverUrl + "mini/partner/goMultiPayment",
      data: {
        token: wx.getStorageSync('token'),
        multiTradeId: that.data.multiTradeId,
        addressId: that.data.addressId,
        partnerId: that.data.partnerId,
        orderId: that.data.orderId,
        giftTicketId:that.data.giftTicketId
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
      // header: {}, // 设置请求的 header  
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },

      success: function (res) {
        console.log(res)
        wx.hideLoading();

        if (res.data.status == 200) {
          var appid = res.data.data.paymentInfo.appId;
          wx.requestPayment({
            'timeStamp': res.data.data.paymentInfo.timeStamp,
            'nonceStr': res.data.data.paymentInfo.nonceStr,
            'package': res.data.data.paymentInfo.exPackage,
            'signType': 'MD5',
            'paySign': res.data.data.paymentInfo.paySign,
            'success': function (ressuccess) {
              // wx.navigateTo({
              //   url: '../../OrderPage/WaitingOrderDetail/WaitingOrderDetail?orderId=' + res.data.data.paymentInfo.orderId,
              // })
              wx.navigateTo({
                url: '../../OrderPage/DistributionOrderDetail/index?orderId=' + res.data.data.paymentInfo.orderId,
              })
              
                          },
            'fail': function (res) {
               wx.switchTab({
                url: '/pages/OrderPage/index?istype=1'
              })
            }
          })

        } else {
          wx.showToast({
            title: res.data.errorMsg,
            icon: 'none',
            duration: 2000
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

  }
})