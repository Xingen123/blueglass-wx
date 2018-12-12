// pages/MePage/index.js
var url = require('../../utils/url.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [

    ],
    indicatorDots: true,
    indicatorColor: '#D8D8D8',
    indicatorActiveColor: '#9B9B9B',
    circular: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    previousMargin: "0",
    nextMargin: "0",
    ak: "3cmQZvu49EvgdePdyf6oZ0n335aHQCOU",
    expNum: '',
    ldata: false,
    defaultScrollImg: "../../images/default/690-460.png", //默认图片
    typeBgDefaultImg: "../../images/default/180-120.png", //默认图片
    canIUse: false,
    routers: [{
        name: '浏览记录',
        url: 'browseRecords',
        icon: '../../Images/Me/liulan.png',
        code: '10'
      },
      // {
      //   name: '优惠券',
      //   url: 'coupo',
      //   icon: '../../Images/Me/youhuiquan.png',
      //   code: '11'
      // },
      {
        name: '联系客服',
        url: '/pages/Course/course',
        icon: '../../Images/Me/lianxikefu.png',
        code: '10'
      },
      {
        name: '邀请开店',
        icon: '../../Images/Me/yaoqing.png',
        code: '11',
        url: 'inviteCode'
      },
      {
        name: '我的钱包',
        url: 'wallatPage',
        icon: '../../Images/Me/qianbao.png',
        code: '10'
      },

      {
        name: '白皮书',
        url: 'baipishu',
        icon: '../../Images/Me/baipishu.png',
        code: '10'
      },
      {
        name: '店铺等级',
        icon: '../../Images/Me/level.png',
        url: 'shopLevel',
        code: '11'
      }
    ],
    isPartner: false,
    myinfo: {}
  },
  jumpDetail: function(event) {
    var url = event.currentTarget.dataset.url;

    wx.navigateTo({
      url: url,
    })
  },

  editAction: function(options) {
    let that = this;

    console.log(that.data.myinfo, "mydata"),
    wx.setStorage({
      key: "myInfo",
      data: {
        myInfo: that.data.myinfo
      },
      success: function() {
        wx.navigateTo({
          url: 'edit',
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        });
      }
    })
  },
  //点击跳公众号文章
  advertisingInfosClick(e) {
    var that = this;
    let redirecttarget = e.currentTarget.dataset.redirecttarget
    if(redirecttarget){
        wx.setStorageSync('redirecttarget', redirecttarget)
        wx.navigateTo({
            url: '../ShopPage/articlWebView/index',
        })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    let that = this;
    wx.request({
      url: url.serverUrl + 'mini/partner/myIndexInfo',
      method: 'POST',
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      data: {
        token: wx.getStorageSync('token')
      },
      success: function(res) {
        console.log(res.data.data.bannerImageInfos)
        url.logoutAction(res)

        var data = res.data
        if (data.status == "200") {
          that.setData({
            isPartner: res.data.data.isPartner,
            myinfo: res.data.data,
            imgUrls: res.data.data.bannerImageInfos
          });

          if (that.data.isPartner == false) {
            that.setData({
              routers: [{
                  name: '浏览记录',
                  url: 'browseRecords',
                  icon: '../../Images/Me/liulan.png',
                  code: '10'
                },
                // {
                //   name: '优惠券',
                //   url: 'coupo',
                //   icon: '../../Images/Me/youhuiquan.png',
                //   code: '11'
                // },
                {
                  name: '联系客服',
                  url: '/pages/Course/course',
                  icon: '../../Images/Me/lianxikefu.png',
                  code: '10'
                },
              ]
            });
          } else {
            that.setData({
              partnerId: res.data.data.partnerId,
              routers: [{
                  name: '浏览记录',
                  url: 'browseRecords',
                  icon: '../../Images/Me/liulan.png',
                  code: '10'
                },
                // {
                //   name: '优惠券',
                //   url: 'coupo',
                //   icon: '../../Images/Me/youhuiquan.png',
                //   code: '11'
                // },
                {
                  name: '联系客服',
                  url: '/pages/Course/course',
                  icon: '../../Images/Me/lianxikefu.png',
                  code: '10'
                },
                {
                  name: '邀请开店',
                  icon: '../../Images/Me/yaoqing.png',
                  code: '11',
                  url: 'inviteCode'
                },
                {
                  name: '白皮书',
                  url: 'baipishu',
                  icon: '../../Images/Me/baipishu.png',
                  code: '10'
                },
                {
                  name: '我的钱包',
                  url: 'wallatPage',
                  icon: '../../Images/Me/qianbao.png',
                  code: '10'
                },
                {
                  name: '店铺等级',
                  icon: '../../Images/Me/level.png',
                  url: 'shopLevel',
                  code: '11'
                }
              ]
            });
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