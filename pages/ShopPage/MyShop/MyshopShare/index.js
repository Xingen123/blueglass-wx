// pages/ShopPage/MyShop/MyshopShare/index.js
// var serverUrl = require('../../../../utils/url.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenWidth:0,//屏幕宽度
    shareImgPath:"",
    canvasHidden:true,
    backGround:"",
    localQrCodeUrl:"",
    widthCanvas:"750",
    height:"1250rpx"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let backGround = wx.getStorageSync('productDataset').name.background
    console.log(wx.getStorageSync('productDataset'))
    this.setData({
      backGround: backGround,
      canvasHidden:false
    })
    wx.getSystemInfo({
      success: res => {
          this.setData({
            screenWidth: res.screenWidth
          })
      }
    })
  },
  // 保存图片
  savaImg() {
    let that = this
    var unit = this.data.screenWidth / 375 ;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      // width: unit * 750,
      // height: unit * 956,
      // destWidth: unit * 750,
      // destHeight: unit * 956,
      canvasId: 'firstCanvas',
      fileType: 'jpg',
      success: function (res) {
        that.setData({
          shareImgPath: res.tempFilePath
        })
        if (!res.tempFilePath) {
          wx.showModal({
            title: '提示',
            content: '图片绘制中，请稍后重试',
            showCancel: false
          })
        }
        console.log(that.data.shareImgPath)
        //画板路径保存成功后，调用方法吧图片保存到用户相册
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          //保存成功失败之后，都要隐藏画板，否则影响界面显示。
          success: (res) => {
            console.log(res)
            wx.hideLoading()
            that.setData({
              canvasHidden: false
            })
            wx.showToast({
              title: "保存图片成功",
              icon: 'success',
              duration: 2000,
              success() {
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          },
          fail: (err) => {
            console.log(err)
            wx.hideLoading()
            wx.showToast({
              title: "保存图片失败",
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {
    let that = this
    let productDataset = wx.getStorageSync('productDataset')
    let qrCodeUrl = wx.getStorageSync('qrCodeUrl')
    // 使用 wx.createContext 获取绘图上下文 context
    var context = wx.createCanvasContext('firstCanvas')
    let promise1 =(url) => {
      console.log(url)
      return new Promise(function (resolve, reject) {
        wx.showLoading({
          title: '加载中',
        })
        wx.getImageInfo({
          src: url,
          success: function (res) {
           
            resolve(res);
          },
          fail:function(err){
            reject(err)
            console.log("getImageInfo失败")
          }
        })
      })
    } 
    
    console.log(qrCodeUrl)
    Promise.all([
      promise1(productDataset.name.background), promise1(productDataset.head), promise1(qrCodeUrl), 
    ]).then(res => {
      let rpx = that.data.screenWidth / 375
      that.conPhoto(context, res[0].path, res[1].path,res[2].path,rpx)
    })
  },

  //画画
  conPhoto(context, url1, url2,url3,rpx){

  try {
    
    let productDataset = wx.getStorageSync('productDataset')
    console.log(rpx,url1, url2)
    wx.hideLoading()
    if (productDataset) {
      context.setFillStyle('white')
      context.fillRect(0, 0, rpx * 350, rpx * 100)
      context.setFillStyle('black')
      if (productDataset.width){
        context.drawImage(url1, 0, rpx * 90, rpx * 340, rpx * 340)
        this.setData({
          height: "770rpx"
        })
      }else{
        context.drawImage(url1, 0, rpx * 90, rpx * 340, rpx * 548)
      }
    //二维码
      context.drawImage(url3, rpx * 270, rpx * 15, rpx * 50, rpx * 50)
    
    //头像
     context.save()
      context.beginPath()
      context.arc(rpx * 33, rpx * 40, rpx * 18, 0, 2 * Math.PI)
      context.clip()
      context.drawImage(url2, rpx * 15, rpx * 22, rpx * 36, rpx * 36)
     context.restore();
      
    
     
    
      //名字
      context.font = 'normal bold 14px sans-serif';
      context.fillText(productDataset.name.shopname, rpx * 72, rpx * 35)
      //我的标语
      context.font = 'normal 12px sans-serif';
      context.fillText(productDataset.text, rpx * 72, rpx * 55)
      context.draw()

      

    }
  } catch (e) {
   console.log(e)
  }

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