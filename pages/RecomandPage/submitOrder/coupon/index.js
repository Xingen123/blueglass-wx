// pages/RecomandPage/submitOrder/coupon/index.js
var url = require('../../../../utils/url.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      money:options.money,
      state: options.state,
      priceOrder: options.priceOrder
    })
    this.coupon(options.orderId)
  },

  goBack(e){
    let priceMoney = parseInt(e.currentTarget.dataset.money); //优惠券金额

    let pages = getCurrentPages(); 
    let currPage = pages[pages.length - 1];
    let prevPage = pages[pages.length - 2]; 
    
    let state = this.data.state
    if (state == "ask") { //自取

      let allPrice = parseInt(this.data.money) - priceMoney;  //总金额 - 优惠券金额

      let money = allPrice >= 0 ? allPrice : 0; //总金额 - 优惠券金额 大于等于零时 price = 总金额 - 优惠券金额  小于零时  price = 0

    

        let priceShow = parseInt(this.data.money) >= priceMoney ? priceMoney : parseInt(this.data.money);
        
        
        // 优惠券金额 大于或等于 总价格 显示 优惠券价格  小于显示总价格
      prevPage.setData({
        coupon: e.currentTarget.dataset.name, // 优惠券名字 
        price: money, //总金额
        couponNum: priceShow,  //优惠减免金额
        couponPrice: priceMoney,    //优惠券金额
        giftTicketId: e.currentTarget.dataset.id,
        totalPrice: parseInt(this.data.money)
      })
    }
    else if(state == "manyOrder"){
      let deliveryPrice = parseInt(this.data.money) - priceMoney  >= 0 ?  priceMoney : parseInt(this.data.money)
     
      let priceOrder = parseInt(this.data.money) - priceMoney + parseInt(this.data.priceOrder) 

      let priceOrderNum = priceOrder > 0 ? priceOrder : parseInt(this.data.priceOrder);

      console.log("商品金额:" + parseInt(this.data.money), "优惠券金额" + priceMoney,"优惠减免"+ deliveryPrice)
      prevPage.setData({
        coupon: e.currentTarget.dataset.name, // 优惠券名字 
        price: priceOrderNum, //总金额
        payAmount:parseFloat(priceOrderNum) *100,
        deliveryPrice:deliveryPrice, //优惠金额
        giftTicketId: e.currentTarget.dataset.id
        // totalPrice: parseInt(this.data.money)
      })
    }
    else { // 外送

      let shopPrice = parseInt(this.data.money) - parseInt(this.data.priceOrder)  // 总金额 - 外送金额 = 商品金额 
      let goShop = shopPrice - priceMoney ;  //商品金额 - 优惠券的钱
      let goMoney = goShop > 0 ? goShop + parseInt(this.data.priceOrder) : parseInt(this.data.priceOrder);
      let priceShow = shopPrice >= priceMoney ? priceMoney : shopPrice;
      prevPage.setData({
        coupon: e.currentTarget.dataset.name, // 优惠券名字 
        totalPrice: goMoney,// 订单页面 外送总金额
        deliveryPrice: priceMoney,  //订单页面  外送的优惠券金额
        couponNum: priceShow,
        giftTicketId: e.currentTarget.dataset.id
      })
    }



    wx.navigateBack({

      delta: 1

    })
  },
  //获取优惠券
  coupon(orderId){
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: url.serverUrl + 'mini/partner/queryTicketByOrderId',
      method: 'POST',
      header: {
      //设置参数内容类型为x-www-form-urlencoded
      'content-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    data: {
      token: wx.getStorageSync('token'),
      orderId:orderId,
    },
    success: (res) => {
      wx.hideLoading()
      console.log(res, orderId)
      this.setData({
        giftTickets: res.data.data.giftTickets
      })
    },
    fail:(err)=>{
      wx.hideLoading()
      wx.showToast({
        title: '服务器繁忙',
        icon: 'none',
        duration: 2000
      })
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

  }
})