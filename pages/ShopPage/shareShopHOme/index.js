// pages/ShopPage/shareShopHOme/index.js
var serverUrl = require('../../../utils/url.js');
// import drawQrcode from '../../../utils/weapp.qrcode.js' 
// import download from "../../../utils/download.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    indicatorColor: '#D8D8D8',
    indicatorActiveColor: '#9B9B9B',
    circular: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    canvasHidden: true, //设置画板的显示与隐藏，画板不隐藏会影响页面正常显示
    avatarUrl: '', //用户头像
    nickName: '', //用户昵称
    wxappName: '', //小程序名称
    shareImgPath: '',
    screenWidth: '', //设备屏幕宽度
    name: '',
    icon: '',
    salesAmount: '',
    shareicon:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    let that = this
    let productSession = wx.getStorageSync('productSession')
    console.log(productSession)
    that.setData({
      productSession: productSession,
      partnerId: productSession.partnerId,
      name: productSession.name,
      salesAmount: productSession.salesAmount,
      headpath: productSession.headpath,
      nickname: productSession.nickname,
      name: productSession.name,
      // shareicon: options.glassIcon,
      // backgournd: options.backgournd
    })
    that.getPosterStyles(productSession)
    // that.draw(options.ewmurl + '?partnerId='+options.partnerId)
    //获取用户设备信息，屏幕宽度
    wx.getSystemInfo({
      success: res => {
        that.setData({
          screenWidth: res.screenWidth
        })
     
        that.getPartnerQRcode(productSession)
        // that.sharePoster(options)
        console.log(that.data.screenWidth)
      }
    })
  },
  promise1(url) {
    let promiseFun = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: url,
        success: function (res) {
          resolve(res);
        },
        fail:function(err){
          reject(err)
          wx.showToast({
            title: '网络错误，请稍后重试',
            icon: 'none',
          })
        }
      })
    })
    return promiseFun
  },
  getPartnerQRcode(options){
    let that = this;
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: serverUrl.serverUrl + 'mini/partner/getPartnerQRcode?token=' + wx.getStorageSync('token'),
      data: {},
      method: 'GET',
      success: function (res) {
        console.log(res)
        wx.hideLoading();
        if (res.data.status == 200) {
          that.setData({
            qrCodeUrl: res.data.data.qrCodeUrl,
          })
 
          let url1 = res.data.data.qrCodeUrl
          let url2 = options.glassIcon
          let url3 = options.backgournd
          let url4 = options.headpath


          Promise.all([
            that.promise1(url1), that.promise1(url2), that.promise1(url3),that.promise1(url4)
          ]).then(res => {
            console.log(res)
            that.setData({
              qrCodeUrl: res[0].path,
              shareicon: res[1].path,
              backgournd: res[2].path,
            })
            that.sharePoster(options, res[3].path,)
          })

        } else {
          wx.showToast({
            title: res.data.errorMsg,
            icon: 'none',
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
  // 分享海报
  sharePoster(options,headPath) {
    console.log(headPath)
    console.log(options)
    var that = this;
    //设置画板显示，才能开始绘图
    that.setData({
      canvasHidden: false,
    })
    var unit = that.data.screenWidth / 375
    var height = that.data.screenHeight/ 1148

    var context = wx.createCanvasContext('share')
    context.setFillStyle('white')
    context.fillRect(0, 0, unit * 350, unit * 100)
    context.font = 'normal bold 20px sans-serif';
    context.setFillStyle("#000")
    context.fillText(that.data.name, unit * 20, unit * 50)

    context.font = 'normal 14px sans-serif';
    context.fillText("销售:", unit * 20, unit * 75)
    
    context.font = 'normal bold 14px sans-serif';
    context.fillText(that.data.salesAmount + "份", unit * 70, unit * 75)

    context.rect(unit * 25, unit * 90, unit * 325, unit * 250)//画矩形

    context.drawImage(that.data.shareicon, 0, unit * 90, unit * 350, unit * 350)//背景图片

    context.drawImage(that.data.backgournd, unit * 45, unit * 110, unit * 255, unit * 228)//酸奶图片

  

    context.drawImage(that.data.qrCodeUrl, unit * 250, unit * 345, unit * 66, unit * 66)  //二维码

         context.save()
      context.beginPath()
    context.arc(unit * 45, unit * 375, unit * 25, 0, 2 * Math.PI)
      context.clip()
    context.drawImage(headPath, unit * 20, unit * 350, unit * 50, unit * 50);//头像图片
     context.restore();

    

    context.setFontSize(15)
    context.setFillStyle("#000")
    context.fillText(that.data.nickname, unit * 90, unit * 380)

    setTimeout(() => {
      context.draw()
    },10)
  },
  // 切换背景图
  changeImg(e) {
    let that =this
    let url1 = e.currentTarget.dataset.imgsrc
    let headpath = that.data.productSession.headpath
    console.log(headpath)
    Promise.all([
      that.promise1(url1), that.promise1(headpath)
    ]).then(res => {
      console.log(res)
      that.setData({
        shareicon: res[0].path
      })
      let headUrl = res[1].path
      that.sharePoster(that.data.productSession, headUrl)
    })
  },
  // 获取切换的背景图
  getPosterStyles(options) {
    var that = this;
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: serverUrl.serverUrl + 'mini/partner/getPosterStyles?token=' + wx.getStorageSync('token') + "&glassType=" + options.glassType,
      data: {},
      method: 'GET',
      success: function(res) {
        wx.hideLoading();
        if (res.data.status == 200) {
          if (res.data.data.posterStyles.length>0){
            that.setData({
              posterStyles: res.data.data.posterStyles,
            })
          }else{
            wx.showToast({
              title: "暂无背景图",
              icon: 'none',
            })
          }
        } else {
          wx.showToast({
            title: res.data.errorMsg,
            icon: 'none',
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
  // 保存图片
  savaImg() {
    let that = this
    var unit = that.data.screenWidth / 375
  
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      // width: unit * 750,
      // height: unit * 926,
      // destWidth: unit * 750,
      // destHeight: unit * 926,
      canvasId: 'share',
      fileType: 'jpg',
      success: function(res) {
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
              success(){
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