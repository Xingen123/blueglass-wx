// pages/ShopPage/MyProductlibrary/modification/index.js
var serverUrl = require('../../../../utils/url.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:"",
    icon:"",
    materials:""
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    this.setData({
      productId:options.productId
    })
    this.product(options.productId)
  },
  fileImage(){
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success:(res)=> {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFiles
       console.log(res)
        wx.navigateTo({
          url: `../../../Upload/uploadThree/upload?src=${tempFilePaths[0].path}`
        })
      //  this.uploadMiniFile(tempFilePaths)

      }
    })
  },
  focus(e){
    console.log(e.detail.value)
    this.setData({
      name:e.detail.value
    })
  },
  product(productid){
    console.log(productid)
    wx.showLoading({
      title: '加载中...'
    })
    wx.request({
      url: serverUrl.serverUrl + 'mini/partner/queryProduct',
      data: {
        token: wx.getStorageSync('token'),
        productId: productid,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      method: 'POST',
      success: (res) =>{
        wx.hideLoading();
        if (res.data.status == 200) {
          this.setData({
            name:res.data.data.name,
            icon:res.data.data.icon,
            materials:res.data.data.materials
          })
          console.log(res)
        }
        else
        {
          wx.showToast({
            title: res.data.errorMsg,
            icon: 'none',
          })
        }
      },
      fail: function (res) {
       
        wx.showToast({
          title: '网络错误，请稍后重试',
          icon: 'none',
        })
      }
    });
  },
  submit(){
    wx.showLoading({
      title: '加载中...'
    })
    console.log(this.data.productId)
    wx.request({
      url: serverUrl.serverUrl + 'mini/partner/updateProduct',
      data: {
        token: wx.getStorageSync('token'),
        productId:this.data.productId,
        name: this.data.name,
        icon:this.data.icon
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      method: 'POST',
      success: (res) =>{
        wx.hideLoading();
        if (res.data.status == 200) {
          var pages = getCurrentPages();
          if (pages.length > 1) {
            //上一个页面实例对象
            var prePage = pages[pages.length - 2];
            //关键在这里

            prePage.onLoad()
            wx.navigateBack({ 
              delta: 1, 
            });
          } 
          console.log(res)
        }
        else
        {
          wx.showToast({
            title: res.data.errorMsg,
            icon: 'none',
          })
        }
      },
      fail: function (res) {
       
        wx.showToast({
          title: '网络错误，请稍后重试',
          icon: 'none',
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