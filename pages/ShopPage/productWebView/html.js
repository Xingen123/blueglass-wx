// pages/ShopPage/MyShop/html.js


Page({

  /**
   * 页面的初始数据
   */
  data: {
    htmlUrl: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var token = options.token
    var glassType = options.glassType
    var ProductDIYId = options.ProductDIYId
    var minPrice = options.minPrice
    var url = "https://wxmp.clicksdiy.com/makeup/diy/index.html?token=" + token + "&ProductDIYId=" + ProductDIYId + "&glassType=" + glassType + "&minPrice=" + minPrice
    this.setData({
      htmlUrl: url
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