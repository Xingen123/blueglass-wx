// pages/ShopPage/PartnerShop/idnex.js
var url = require('../../../utils/url.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: wx.getStorageSync('token'),
    randPartnerInfos:{},
    advertisingInfos:[],
    indicatorDots: false,
    autoplay: true,
    circular: true,
    interval: 2500,
    duration: 1000,
    showView0: false, //是否显示我的店铺开场动画
    showView1: false, //是否显示我的店铺开场动画
    showView2: false, //是否显示我的店铺开场动画
    showView3: false, //是否显示我的店铺开场动画
    curindex:0,
    isNotPatenter:0,
    index:1,
    jumpaddwish:false,
    showView:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.fenXiang()
    showView0: (options.showView == "true" ? true : false)
    showView1: (options.showView == "true" ? true : false)
    showView2: (options.showView == "true" ? true : false)
    showView3: (options.showView == "true" ? true : false)
    if (options.from){
      this.setData({
        showView1: (!this.data.showView),
        showTips:true
      })
    }
  },
  sharePoster(){
    this.setData({
      showView: false
    })
    wx.navigateTo({
      url: './MyshopShare/index'
    })
  },
  mark_dialog(){
    this.setData({
      showView: false
    })
  },
  isPartner(){
    // wx.request({
    //   url: url.serverUrl + 'mini/partner/isPartner',
    //   method: 'POST',
    //   header: {
    //     //设置参数内容类型为x-www-form-urlencoded
    //     'content-type': 'application/x-www-form-urlencoded',
    //     'Accept': 'application/json'
    //   },
    //   data: {
    //     token: wx.getStorageSync('token'),

    //   },
    //   success: function (res) {
    //     console.log(res.data)
    //     var data = res.data
    //     if (data.status == "200") {
    //       if (data.data.partnerId) {
    //         that.setData({
    //           isNotPatenter: 1
    //         })
    //         that.myShopInfo()
    //       }
    //       //todo tengyu
    //     } else {
    //       wx.showToast({
    //         title: data.message,
    //         icon: 'none', 
    //         duration: 2000
    //       })
    //     }
    //   }
    // })
  },
  fenXiang(){
    wx.request({
      url: url.serverUrl + 'mini/partner/getPartnerQRcode?token=' + wx.getStorageSync('token'),
      data: {},
      method: 'GET',
      success: function (res) {
        console.log(res)
        let qrCodeUrl = res.data.data.qrCodeUrl
        wx.setStorageSync('qrCodeUrl', qrCodeUrl);
      }
    })
  },
  jumphzhtml:function(){
    wx.navigateTo({
      url: '../Html/html?token=' + wx.getStorageSync('token'),
    })
  },
  goShare(e){
    this.setData({
      showView: (!this.data.showView),
    })
    let that = this

  let productDataset =  {
   name: e.currentTarget.dataset,
   head: that.data.randPartnerInfos.icon,
    text:"酸奶店里走一走，不买不是好朋友!",
   wxIcon: that.data.randPartnerInfos.icon,

  }
  console.log(productDataset)
  wx.setStorageSync('productDataset', productDataset);
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
    let that = this;
    wx.request({
      url: url.serverUrl + 'mini/partner/isPartner',
      method: 'POST',
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      data: {
        token: wx.getStorageSync('token'),
      },
      success: function (res) {
        console.log(res.data, "我的店铺")
        url.logoutAction(res)
        var data = res.data
        if (data.status == "200") {
          if (data.data.partnerId)
          {
            that.setData({
              isNotPatenter: 1,
            })
            that.myShopInfo()
          }
          else
          {
            that.setData({
              isNotPatenter: 0,
              background:data.data.background
            })
          }
          //todo tengyu
        } else {
          wx.showToast({
            title: data.errorMsg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
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
  onShareAppMessage: function (res) {
    var that = this;
    console.log(res)
    console.log(that.data.randPartnerInfos, "asdfsadfasdfasfd");
    if (that.data.randPartnerInfos.partnerId) {
           return {
        title: that.data.randPartnerInfos.shopName +'：酸奶店里走一走，不买不是好朋友',
        path: '/pages/ShopPage/shareMyShop/index?partnerid=' + that.data.randPartnerInfos.partnerId ,
        desc: '',
        imageUrl: that.data.randPartnerInfos.background,
        success: function (res) {
          console.log(res)
        }
      };
    }
    // }
    // {
      
    //   return {
    //     title: that.data.randPartnerInfos.shopName +'：酸奶店里走一走，不买不是好朋友',
    //     path: '/pages/ShopPage/shareMyShop/index?partnerid=' + that.data.randPartnerInfos.partnerId ,
    //     desc: '',
    //     imageUrl: that.data.randPartnerInfos.background,
    //     success: function (res) {
    //       console.log(res)
    //     }
    //   };
    // }
  },
  /**
  * 点击开场动画s
  */
  openanimate(e) {
    console.log(e)
    this.setData({
      showView1: (!this.data.showView),
    })
  },
  mark_first(){
    this.setData({
      showView1: false,
      showView2: (!this.data.showView),
    })
  },
  mark_second() {
    this.setData({
      showView1: false,
      showView2: false,
      showView3: (!this.data.showView),
    })
  },
  mark_third() {
    this.setData({
      showView1: false,
      showView2: false,
      showView3: false,
    })
    if(this.data.showTips)
    {
      this.setData({
        showTips:false
      })
      wx.navigateTo({
        url: '../XinyuanStep/index',
      })
    }
  },
  myShopInfo() {
    let that = this;
    wx.request({
      url: url.serverUrl + 'mini/partner/myShopInfo',
      method: 'POST',
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      data: {
        token: wx.getStorageSync('token')
      },
      success: function (res) {
       
        var data = res.data
        console.log(res,6665)
        if (data.status == "200") {
          that.setData({
            randPartnerInfos: data.data,
            advertisingInfos: data.data.advertisingInfos,
          })
        } else {
          wx.showToast({
            title: data.errorMsg,
            icon: 'none', 
            duration: 2000
          })
        }
      }
    })
  },
  advertisingInfosClick(e) {
    console.log(e)
      let redirecttarget = e.currentTarget.dataset.redirecttarget
      if(redirecttarget){
          wx.setStorageSync('redirecttarget', redirecttarget)
          wx.navigateTo({
              url: '../articlWebView/index',
          })
      }
  },
  //点击记录
  recordClick(){
    wx.navigateTo({
      url: '../MyRecords/index',
    })
  },
  DIYAction:function()
  {
    wx.navigateTo({

      url: '../MyShopHome/index',
    })
  },
  addaction:function()
    {
      wx.navigateTo({

    url: '../InvitationCode/index',
      })
    },
  imageLoad: function (e) {
    console.log(e)
    var $width = e.detail.width, //获取图片真实宽度
      $height = e.detail.height,
      ratio = $width // $height; //图片的真实宽高比例
    var viewWidth = 100, //设置图片显示宽度，左右留有16rpx边距
      viewHeight = 100 // ratio; //计算的高度值
    var image = this.data.images;
    //将图片的datadata-index作为image对象的key,然后存储图片的宽高值
    image[e.target.dataset.index] = {
      width: viewWidth,
      height: viewHeight
    }
    this.setData({
      images: image
    })
  },
})