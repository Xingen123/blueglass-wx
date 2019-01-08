// pages/MePage/shareMyPacket/index.js
var url = require('../../../utils/url.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    giftTickets:[],
    page:1,
    shareImg: "https://wxmp.clicksdiy.com/makeup/pbag/4.png?" + Math.random(),
  },
  shareParekt() {
    wx.navigateTo({
      url: '../sharePacket',
    })
  },
  onClick(event) {
    // wx.showToast({
    //   title: `点击标签 ${event.detail.index + 1}`,
    //   icon: 'none'
    // });
    console.log(event.detail.index)
    if(event.detail.index==1){
      this.packet("D_EXPIRED")
    }else{
      this.packet("A_ACTIVATED")
    }
  },
  shareHistory(e){
    wx.navigateTo({
      url: 'history'
    })
  },
  goRule(){
    console.log(1)
    wx.navigateTo({
      url: 'rule'
    })
  },
  createRandomId() {
    return (Math.random() * 10000000).toString(16).substr(0, 4) + '-' + (new Date()).getTime() + '-' + Math.random().toString().substr(2, 5);
  },
  packet(status){
    wx.request({
      url: url.serverUrl + 'mini/partner/queryGiftTicketByUser',
      method: 'POST',
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      data: {
        token: wx.getStorageSync('token'),
        pageNum:1,
        status:status
      },
      success:(res)=>{
        console.log(res)
          this.setData({
            giftTickets:res.data.data.giftTickets
          })
      },
      fail:(err)=>{

      }
    })  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.packet("A_ACTIVATED")
  },
  onChange(){
    console.log(this.data.active)
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
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    
    // 页数+1
    this.data.page = this.data.page + 1;
    wx.request({
      url: url.serverUrl + 'mini/partner/queryGiftTicketByUser',
      method: 'POST',
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      data: {
        token: wx.getStorageSync('token'),
        pageNum:this.data.page,
        status:"A_ACTIVATED"
      },
      success: function (res) {
        // 回调函数
        console.log(res.data.data)
        var giftTickets_list = that.data.giftTickets;
 
        for (var i = 0; i < res.data.data.giftTickets.length; i++) {
          giftTickets_list.push(res.data.data.giftTickets[i]);
        }
        // 设置数据
        that.setData({
          giftTickets: that.data.giftTickets
        })
        // 隐藏加载框
        wx.hideLoading();
      },
      fail:()=>{
        wx.hideLoading();
      }
    })
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    console.log(e)
    return {
      title: '送你一张' + e.target.dataset.giftname +',我爱喝的酸奶想与你一起分享',
      path: '/pages/ShopPage/shareMyShop/index?partnerid=' + e.target.dataset.partnerid + "&giftTicketId=" + e.target.dataset.giftticketid + "&keyId=" + this.createRandomId(),
      imageUrl: 'https://wxmp.clicksdiy.com/makeup/pbag/8.png?' + Math.random(),
      success: function (res) {
        console.log(res)
      }
    }
  }
})
