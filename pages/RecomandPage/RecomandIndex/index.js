// pages/ShopPage/PartnerShop/idnex.js
var url = require('../../../utils/url.js')
const app = getApp()
//获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // isIphoneX:"",
    shareImg: "https://wxmp.clicksdiy.com/makeup/pbag/4.png?" + Math.random(),
    shareIma: "https://wxmp.clicksdiy.com/makeup/pbag/1.png?" + Math.random(),
    shareImb: "https://wxmp.clicksdiy.com/makeup/pbag/2.png?" + Math.random(),
    sendUserId:"",
    showView:false,
    name: "",
    head: "",
    background:"",
    itemId:"",
    current:0,
    token: wx.getStorageSync('token'),
    randPartnerInfos:[],
    advertisingInfos:[],
    indicatorDots: false,
    autoplay: true,
    autoplay2: false,
    circular:true,
    interval: 2500,
    duration: 500,
    shopData: [],
    existCollect:"",
    isBindPhoneId:"",
    isShowExistCollect:false,
    clientHeight:'',
    isFirstLoad: true,
    box: false,
    succseBox:false,
    isBindPhone:false,
    cur: 0,//改变当前索引
    index: 0//当前的索引
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  bgBlack(){
    this.setData({
      succseBox:false
    })
    if (this.data.isBindPhoneId){
    console.log(this.data.isBindPhoneId)
      wx.navigateTo({
        url: '../../ShopPage/shareMyShop/index?partnerid=' + this.data.isBindPhoneId
      })
    }
  },
  changeGoodsSwip: function (detail) {
    if (detail.detail.source == "touch") {
      //当页面卡死的时候，current的值会变成0 
      if (detail.detail.current == 0) {
        //有时候这算是正常情况，所以暂定连续出现3次就是卡了
        let swiperError = this.data.swiperError
        swiperError += 1
        this.setData({ swiperError: swiperError })
        if (swiperError >= 3) { //在开关被触发3次以上
          console.error(this.data.swiperError)
          this.setData({ current: this.data.preIndex });//，重置current为正确索引
          this.setData({ swiperError: 0 })
        }
      } else {//正常轮播时，记录正确页码索引
        this.setData({ preIndex: detail.detail.current });
        //将开关重置为0
        this.setData({ swiperError: 0 })
      }
    }
  },

  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  DIYAction() {
    wx.navigateTo({
      url: '../../RankingPage/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let aaa = wx.getStorageSync("newApp")
    // if (aaa == "show") {
    //   this.setData({
    //     box: true
    //   })
    //   wx.setStorageSync("newApp", "1")
    //   let bbb = wx.getStorageSync("newApp")
    // }

    //没有授权手机号显示
   
    if (options.isPhone == "isPhone"){
      this.setData({
        isBindPhone:true
      })
      if (options.partnerid){
        this.setData({
          isBindPhoneId: options.partnerid
        })
      }
    } 
    else if (options.isPhone == "isPhoneYzm"){
      this.setData({
        succseBox: true,
        isBindPhone:false
      })
    }

    if (options.sendUserId){
      this.setData({
        sendUserId: options.sendUserId
      })
    }
    console.log(options.sendUserId,137)
    
    // 用户版本更新
    if (wx.canIUse("getUpdateManager")) {
      let updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate((res) => {
        // 请求完新版本信息的回调
        console.log(res.hasUpdate,12);
       
      })
      updateManager.onUpdateReady(() => {
        wx.showModal({
          title: '又又又升级啦！',
          content: '升级后的它更快、更顺、更全面！体验一下？',
          success: (res) => {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate();
              // wx.setStorageSync("newApp", "show")
            } else if (res.cancel) {
              return false;
            }
          }
        })
      })
      updateManager.onUpdateFailed(() => {
        // 新的版本下载失败
        wx.hideLoading();
        wx.showModal({
          title: '升级失败',
          content: '新版本下载失败，请检查网络！',
          showCancel: false
        });
      });
    }
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          //计算相关宽度
          // clientHeight: res.windowHeight,
          clientHeight: res.windowHeight,
        });
      }
    });
    if (wx.getStorageSync('token')) {
      that.partnerRecommend()
    }
    else {
      wx.reLaunch({
        url: '../../LogIn/LogIn',
      })
    }
    console.log(this.data.itemId)
    // this.fenXiang(partnerid)
  },
  play(){
    this.setData({
      box:false
    })
  },
  bindgetphonenumber(e){

    let encryptedData = e.detail.encryptedData;
    let iv = e.detail.iv;
    if (encryptedData) {
      this.bindSuccse(encryptedData, iv)
    } else {
      wx.navigateTo({
        url: '../../MePage/editPhone?typecode=1&sendUserId' + this.data.sendUserId,
      })
    }
  },
  bindSuccse(encryptedData,iv){
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: url.serverUrl + 'mini/partner/decryptMobile',
      method: 'POST',
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      data: {
        token: wx.getStorageSync('token'),
        encryptedData: encryptedData,
        iv:iv
      },
      success: (res)=> {
        wx.hideLoading()
        if (res.data.status == 200 ){
          this.receiveGiftTicket(res.data.data.mobile)
          this.setData({
            isBindPhone:false
          })
        }
      }
    })  
  },
  shareParekt(){
    wx.navigateTo({
      url: '../../MePage/sharePacket',
    })
  },
  receiveGiftTicket(phone){
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: url.serverUrl + 'mini/partner/receiveGiftTicket',
      method: 'POST',
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      data: {
        token: wx.getStorageSync('token'),
        phone: phone,
        sendUserId:this.data.sendUserId
      },
      success: (res) => {
        wx.hideLoading()
        if (res.data.status == 200) {
          this.setData({
            succseBox: true
          })
        }
      },
      fail:(err)=> {
        wx.hideLoading()
        wx.showModal({
          title: err.data,
        })
      }
    })  
  },
  sharePeople(e){

    this.setData({
      showView: true,
      current:e.currentTarget.dataset.current
    })
    this.fenXiang(e.currentTarget.dataset.partnerid)
    console.log(e.currentTarget.dataset)
    let dataset = e.currentTarget.dataset
    let productDataset = {
      head: e.currentTarget.dataset.head,
        name:{
          background: e.currentTarget.dataset.background,
          partnerid: e.currentTarget.dataset.partnerid,
          shopname: e.currentTarget.dataset.shopname
        },
        text:"酸奶店里走一走，不买不是好朋友!",
      wxIcon: e.currentTarget.dataset.head
    }
    console.log(productDataset)
    wx.setStorageSync('productDataset', productDataset)
   
    
  },
  fenXiang(partnerid) {
    console.log(partnerid)
    wx.request({
      url: url.serverUrl + 'mini/partner/getPartnerQRcodeById?partnerId=' + partnerid,
      data: {},
      method: 'GET',
      success: function (res) {
        console.log(res)
        let qrCodeUrl = res.data.data.qrCodeUrl
        wx.setStorageSync('qrCodeUrl', qrCodeUrl);
      }
    })
  },
  // 分享海报
  sharePoster(){
    this.setData({
      showView: false
    })
    let qrCodeUrl = this.data.itemId
 
    
    wx.navigateTo({
      url: '../../ShopPage/MyShop/MyshopShare/index'
    })
  },
  mark_dialog(){
    this.setData({
      showView: false
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
  onReachBottom: function (e) {
   
  },

  swiperChange(e) {
    var that = this;
    let current = e.detail.current;
    let count = this.data.randPartnerInfos.length - 1;
    this.setData({
      current:current
    })
    if (current === count)
    {
      //请求更多数据
      that.allSwiper()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    let current = this.data.current;
    let itemId = this.data.randPartnerInfos[current].partnerId;
    let name = this.data.randPartnerInfos[current].shopName;
    let background = this.data.randPartnerInfos[current].background;

    this.setData({
      showView: false
    })
    if (itemId) {
      return {
        title: name + ':酸奶店里走一走，不买不是好朋友',
        path: '/pages/ShopPage/shareMyShop/index?partnerid=' + itemId,
        // desc: '',
        imageUrl: background,
        success: function (res) {
          console.log(res)
        }
      }
    }
  },
  addMyCollect(e){
    console.log(e)
    let that = this;
    wx.request({
      url: url.serverUrl + 'mini/partner/addMyCollect',
      method: 'POST',
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      data: {
        token: wx.getStorageSync('token'),
        partnerId: e.currentTarget.dataset.partnerid
      },
      success: function (res) {
        url.logoutAction(res)
        console.log(res.data)
        var data = res.data
        if (data.status == "200") {
          // let existcollect = e.currentTarget.dataset.existcollect
          let partnerId = e.currentTarget.dataset.item.partnerId
          console.log(partnerId)
          // that.setData({
          //   existcollect: !e.currentTarget.dataset.existcollect
          // })
          var randPartnerInfos = that.data.randPartnerInfos;
          randPartnerInfos.forEach(i => {
            // debugger
            if (partnerId == i.partnerId){
              console.log(partnerId == i.partnerId)
              i.existCollect = !i.existCollect;
           
            }
          })
          that.setData({
            randPartnerInfos: randPartnerInfos
          })
         

            // e.currentTarget.dataset.existcollect = !e.currentTarget.dataset.existcollect
          if (!e.currentTarget.dataset.item.existCollect ) {
            wx.showToast({
              title: "收藏成功",
              icon: 'success',
              duration: 2000,
              success() {
           
              }
            })
          } else {
            wx.showToast({
              title: "取消收藏成功",
              icon: 'none',
              duration: 2000,
              success() {
              
              }
            })
          }
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
allSwiper(){
  wx.showLoading({
    title: '加载中...',
  })
  wx.request({
    url: url.serverUrl + 'mini/partner/partnerRecommend',
    method: 'POST',
    header: {
      //设置参数内容类型为x-www-form-urlencoded
      'content-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    data: {
      token: wx.getStorageSync('token')
    },
    success: (res) => {
      wx.hideLoading()
        let randPartnerInfos = this.data.randPartnerInfos
        this.setData({
          randPartnerInfos: [...randPartnerInfos, ...res.data.data.randPartnerInfos]
          // this.data.randPartnerInfos.concat(res.data.data.randPartnerInfos)
        })
        console.log(this.data.randPartnerInfos)
    },
    fail:(err)=>{
      wx.hideLoading()
      wx.showToast({
        title: data.errorMsg,
        icon: 'none', 
        duration: 2000
      })
    }
  })
},

  partnerRecommend(){
    let that = this;
    wx.request({
      url: url.serverUrl + 'mini/partner/partnerRecommend',
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
        if (res.data.status == 401) {
          wx.reLaunch({
            url: '/pages/LogIn/LogIn',
          })
          return;
        }        
        console.log(res.data)
        var data = res.data
        if (data.status == "200") {
          // for (var i = 0; i < data.data.randPartnerInfos.length;i++){
          //   if (data.data.randPartnerInfos[i].existCollect){
          //     that.setData({
          //       existCollect: "已收藏"
          //     })
          //   }else{
          //     that.setData({
          //       existCollect: "收藏店铺"
          //     })
          //   }
            
          // }
          that.setData({
            isShowExistCollect:true,
            randPartnerInfos: that.data.randPartnerInfos.concat(data.data.randPartnerInfos),
            advertisingInfos: data.data.advertisingInfos,
            itemId: that.data.randPartnerInfos.concat(data.data.randPartnerInfos)[0].partnerId,
            name: that.data.randPartnerInfos.concat(data.data.randPartnerInfos)[0].shopName,
            head: that.data.randPartnerInfos.concat(data.data.randPartnerInfos)[0].icon,
            background: that.data.randPartnerInfos.concat(data.data.randPartnerInfos)[0].background,
          })
          let partnerIdIcon = that.data.randPartnerInfos.concat(data.data.randPartnerInfos)[0].partnerId
          console.log(partnerIdIcon)
          that.fenXiang(partnerIdIcon)
          //初次调用 以后再不调用了
          if (that.data.isFirstLoad)
          {
            that.setData({
              isFirstLoad: false
            })

            var query = wx.createSelectorQuery();
            query.select('.recon_con').boundingClientRect();
            query.exec(function (res) {
              //res就是 所有标签为mjltest的元素的信息 的数组
              console.log(res);
              //取高度
              if (!res[0]) {
                that.setData({
                  clientHeight: 400
                })
              } else {
                that.setData({
                  clientHeight: res[0].height + 80
                })
              }
            })
          }
          else
          {
          }
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
  advertisingInfosClick(e){
    var that = this;
      let redirecttarget = e.currentTarget.dataset.redirecttarget
      if(redirecttarget){
          wx.setStorageSync('redirecttarget', redirecttarget)
          wx.navigateTo({
              url: '../../ShopPage/articlWebView/index',
          })
      }
  },
  qbscAction(){
    wx.navigateTo({
      url: '../MyCollection/index',
    })
  },
  ddAction(e) {
    console.log(e)
    wx.navigateTo({
      url: '../index?partnerId=' + e.currentTarget.dataset.partnerid + '&shareiv=' + e.currentTarget.dataset.shareiv + '&shopName=' + e.currentTarget.dataset.shopname
      // url: '../index?partnerId=23b4f5247c43463db4d141f2b0df193a'
    })
  },
})