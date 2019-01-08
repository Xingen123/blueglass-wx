import WeCropper from '../we-cropper/we-cropper.min.js'
var serverUrl = require('../../../utils/url.js');

const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 50

Page({
  data: {
    cropperOpt: {
      id: 'cropper',
      width,
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x:0,
        y: (height - 400) / 2,
        width: width,
        height: width,
      }
    }
  },
  touchStart (e) {
    this.wecropper.touchStart(e)
  },
  touchMove (e) {
    this.wecropper.touchMove(e)
  },
  touchEnd (e) {
    this.wecropper.touchEnd(e)
  },
  getCropperImage () {
    this.wecropper.getCropperImage((avatar) => {
      if (avatar) {
        //  获取到裁剪后的图片
        this.uploadMiniFile(avatar)
        // wx.redirectTo({
        //   url: `../../ShopPage/MyProductlibrary/modification/index?avatar=${}`
        // })
        // console.log('1')
        // let pages = getCurrentPages();//当前页面
        // let prevPage = pages[pages.length - 1];//上一页面
        // prevPage.setData({//直接给上移页面赋值
        //   icon: avatar
        // });
        // wx.navigateBack({
        //   delta: 1
        // })
      } else {
        console.log('获取图片失败，请稍后重试')
      }
    })
  },
  uploadMiniFile(url){
    wx.showLoading({
      title: '加载中',
    })
    
    console.log(serverUrl.serverUrl + 'mini/partner/uploadMiniFile',url,wx.getStorageSync('token'))
    wx.uploadFile({
      url: serverUrl.serverUrl + 'mini/partner/uploadMiniFile',// 仅为示例，非真实的接口地址
      filePath:url,
      name: 'files',
      formData: {
        'token': wx.getStorageSync('token')
        // 'files': url[0].path
      },
      success:(res) => {
        const data = JSON.parse(res.data)
        wx.hideLoading();

       if (data.status == 200) {
        let pages = getCurrentPages();//当前页面
        let prevPage = pages[pages.length - 2];//上一页面

        prevPage.setData({//直接给上移页面赋值
          icon: data.data.icon
        });
        wx.navigateBack({
          delta: 1
        })
          // this.setData({
          //   icon:data.data.icon
          // })
        }else{
              wx.showToast({
                title: data.data.errorMsg,
                icon: 'none',
              })
            }
        console.log(data.data.icon)
      },
      fail: (err) => {
        wx.hideLoading();
        wx.showToast({
          title: '网络错误，请稍后重试',
          icon: 'none',
        })
      }
    })
  },
  uploadTap () {
    const self = this

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success (res) {
        const src = res.tempFilePaths[0]
        //  获取裁剪图片资源后，给data添加src属性及其值

        self.wecropper.pushOrign(src)
      }
    })
  },
  onLoad (option) {
    const { cropperOpt } = this.data
    console.log(option)

    if (option.src) {
      cropperOpt.src = option.src
      new WeCropper(cropperOpt)
        .on('ready', (ctx) => {
          console.log(`wecropper is ready for work!`)
        })
        .on('beforeImageLoad', (ctx) => {
          console.log(`before picture loaded, i can do something`)
          console.log(`current canvas context:`, ctx)
          wx.showToast({
            title: '上传中',
            icon: 'loading',
            duration: 20000
          })
        })
        .on('imageLoad', (ctx) => {
          console.log(`picture loaded`)
          console.log(`current canvas context:`, ctx)
          wx.hideToast()
        })
        .on('beforeDraw', (ctx, instance) => {
          console.log(`before canvas draw,i can do something`)
          console.log(`current canvas context:`, ctx)
        })
        .updateCanvas()
    }
  }
})
