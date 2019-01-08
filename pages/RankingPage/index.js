// pages/RankingPage/index.js
var serverUrl = require('../../utils/url.js');

//月榜单 monthList 年度榜单yearList 单条数据格式。
//this.data.monthList  this.data.yearList
/*
{
  "nickName": "小黑",
  "icon": "https://wx.qlogo.cn/mmopen/vi_32/EuTBcX5hJnTibxrLK1ciaKiauIWJafzpJMOAJ0LaicpHCIFJFNzh1PyHdPP7aicFhvs5MaPVw9GThUI7uwkvNSezxYQ/132",
  "id": "B038BB7CFE214BD6A08D1CF3084AE275",
  "message": "超级棒！继续加油",
  "sales": "185.0"
}
*/

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
    canIUse: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
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
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;

    wx.request({
      url: serverUrl.serverUrl + 'mini/partner/isPartner',
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
        console.log(res.data)
        serverUrl.logoutAction(res)

        var data = res.data
        if (data.status == "200") {
          if (data.data.partnerId) {
            that.setData({
              isNotPatenter: 1
            })
           
          }
          else
          {
            that.setData({
              isNotPatenter: 0
            })
          }
          console.log(that.data.isNotPatenter);
          that.requestNetWork('MONTH');
          that.requestNetWork('YEAR');
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


  jumpShop:function(e){
    console.log(e.currentTarget.dataset.id)

    wx.navigateTo({
      url: '../ShopPage/shareMyShop/index?partnerid=' + e.currentTarget.dataset.id,
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
  onChange: function (event) {
    var that = this;
    if (event.detail.index == 0) {
      var imasge = that.data.imgUrls;
        that.setData({
          currentImages: imasge,

      })
    } else
     {
      var imasge = that.data.imgUrlsYear;

      that.setData({
        currentImages: imasge,
      })
    }
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
  goParenterAction: function (event) {
    console.log(event);

    var partnerid = event.target.dataset.partnerid;
    wx.navigateTo({
      url: '../ShopPage/shareMyShop/index?partnerid=' + partnerid,
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  requestNetWork: function(taptype) {
    let that = this;
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: serverUrl.serverUrl + 'mini/partner/rankingList?token=' + wx.getStorageSync('token') + '&type=' + taptype,
      data: {},
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      method: 'POST',
      success: function(res) {
        wx.hideLoading();
        console.log(taptype)
        let listA = res.data

        if (taptype == 'MONTH') {
         
          that.setData({
            monthList: listA.data.ranking,
            imgUrls: res.data.data.bannerImages,

          });
          var monthList = that.data.monthList;
          for (var i = 0; i<monthList.length;i++)
          {
            monthList[i].myNumber = i;
            if(i==0)
            {
              monthList[i].leixing = 1;
              monthList[i].mynumbIcon = '../../Images/Ranking/ranking_no_1.png';
              monthList[i].numbStr = 'No.1';

            }
            else if (i == 1) {
              monthList[i].leixing = 1;

              monthList[i].mynumbIcon = '../../Images/Ranking/ranking_no_2.png';
              monthList[i].numbStr = 'No.2';

            }
            else if (i == 2) {
              monthList[i].leixing = 1;
              monthList[i].mynumbIcon = '../../Images/Ranking/ranking_no_3.png';
              monthList[i].numbStr = 'No.3';

            }
            else{
              monthList[i].leixing = 2;
              monthList[i].numbStr = (i+1);


            }
          }
          that.setData({
            monthList: monthList,
            currentPartner: res.data.data.currentPartner

          })

        } else {
          that.setData({
            yearList: res.data.data.ranking,
            imgUrlsYear: res.data.data.bannerImages,

          });

          var yearList = that.data.yearList;
          for (var i = 0; i < yearList.length; i++) {
            yearList[i].myNumber = i;
            if (i == 0) {
              yearList[i].leixing = 1;
              yearList[i].mynumbIcon = '../../Images/Ranking/ranking_no_1.png';
              yearList[i].numbStr = 'No.1';

            }
            else if (i == 1) {
              yearList[i].leixing = 1;

              yearList[i].mynumbIcon = '../../Images/Ranking/ranking_no_2.png';
              yearList[i].numbStr = 'No.2';

            }
            else if (i == 2) {
              yearList[i].leixing = 1;
              yearList[i].mynumbIcon = '../../Images/Ranking/ranking_no_3.png';
              yearList[i].numbStr = 'No.3';

            }
            else {
              yearList[i].leixing = 2;
              yearList[i].numbStr = (i + 1);


            }
          }
          that.setData({
            yearList: yearList,
            currentyearPartner: res.data.data.currentPartner

          })
        }
        if (that.data.active == 0) {
          var imasge = that.data.imgUrls;
          that.setData({
            currentImages: imasge,

          })
        } else {
          var imasge = that.data.imgUrlsYear;

          that.setData({
            currentImages: imasge,
          })
        }
        console.log(that.data.monthList)
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
})