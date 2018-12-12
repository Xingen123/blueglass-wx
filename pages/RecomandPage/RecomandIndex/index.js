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
    showView:false,
    name: "",
    head: "",
    background:"",
    itemId:"",
    token: wx.getStorageSync('token'),
    randPartnerInfos:[],
    advertisingInfos:[],
    indicatorDots: false,
    autoplay: true,
    autoplay2: false,
    circular:true,
    interval: 2500,
    duration: 1000,
    shopData: [],
    existCollect:"",
    isShowExistCollect:false,
    clientHeight:'',
    isFirstLoad: true,


    //add by jacky for 加载更多
    cur: 0,//改变当前索引
    index: 0//当前的索引
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
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
    // console.log(app)
    // let isIphoneX = app.globalData.isIphoneX;
    // this.setData({
    //   isIphoneX: isIphoneX
    // })
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
  sharePeople(e){
    this.setData({
      showView: true
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
    wx.setStorageSync('productDataset', productDataset)
   
    console.log(wx.getStorageSync('productDataset'))
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
    let source = e.detail.source;
    let count = this.data.randPartnerInfos.length - 1;
    console.log(e)
    let itemId = e.detail.currentItemId;
    let index = e.detail.current;
    let name = this.data.randPartnerInfos[index].shopName;
    let head = this.data.randPartnerInfos[index].icon;
    let background = this.data.randPartnerInfos[index].background;
    that.setData({
      // index: current,
      itemId: itemId,
      name:name,
      head:head,
      background:background
    })
    console.log(this.data.itemId)
    if (current === count)
    {
      //请求更多数据
      that.partnerRecommend()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    this.setData({
      showView: false
    })
    var that = this;
    //  console.log(wx.getStorageSync('productDataset'))
    // console.log(that.data.itemId);
    if (that.data.itemId) {
      return {
        title: that.data.name + ':酸奶店里走一走，不买不是好朋友',
        path: '/pages/ShopPage/shareMyShop/index?partnerid=' + that.data.itemId,
        // desc: '',
        imageUrl: that.data.background,
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
          console.log('xxxxx');

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
      url: '../index?partnerId=' + e.currentTarget.dataset.partnerid + '&shareiv=' + e.currentTarget.dataset.shareiv
      // url: '../index?partnerId=23b4f5247c43463db4d141f2b0df193a'
    })
  },
})