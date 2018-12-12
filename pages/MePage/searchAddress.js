// pages/MePage/searchAddress.js
var bmap = require('../../utils/bmap-wx.min.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ak: "cUziqvRVLtCD9yzmPg3sGZohKWBYHOas",
    addressArray:[]
  },

  backAction:function(e){
    console.log(e)
    var pages = getCurrentPages(); //  获取页面栈
    var currPage = pages[pages.length - 1]; // 当前页面
    var prevPage = pages[pages.length - 2]; // 上一个页面
    prevPage.setData({
      address: e.currentTarget.dataset.address.name,
      lat: e.currentTarget.dataset.address.location.lat,
      lng: e.currentTarget.dataset.address.location.lng,
      city: e.currentTarget.dataset.address.city,
    })
    wx.navigateBack({
      delta: 1
    })
  },
  bindKeyInput: function (e){
    var that = this;
    // 新建百度地图对象 
    var BMap = new bmap.BMapWX({
      ak: that.data.ak
    });
    var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
      var sugData = '';
      console.log(data)
      that.setData({
        addressArray: data.result
      });
    }
    // 发起suggestion检索请求 
    BMap.suggestion({
      query: e.detail.value,
      region: '北京',
      city_limit: true,
      fail: fail,
      success: success
    }); 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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