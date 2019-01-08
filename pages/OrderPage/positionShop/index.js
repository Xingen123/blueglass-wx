// pages/OrderPage/positionShop/index.js
var bmap = require('../../../utils/bmap-wx.min.js');
var serverUrl = require('../../../utils/url.js');
var wxMarkerData = [];
var BMap;
Page({
  data: {
    ak: "cUziqvRVLtCD9yzmPg3sGZohKWBYHOas",
    markers: [],
    latitude: '',
    longitude: '',
    placeData: {},
    merchantAddress: []
  },
  makertap: function (e) {
    var that = this;
    var id = e.markerId;
    console.log(e)
    that.showSearchInfo(that.data.merchantAddress, id);
    //that.changeMarkerColor(wxMarkerData, id);
  },
  onLoad: function (options) {
    var that = this;
    console.log(options)
    that.merchantAddress(options)
    that.getLocation();
    // 新建百度地图对象 
    BMap = new bmap.BMapWX({
      ak: that.data.ak
    });
  },
  showSearchInfo: function (data, i) {
    var that = this;
    // console.log(data[i])
    console.log(data)
    console.log(i)
    data.forEach((j, index)=>{
      console.log(j)
      if(i == index){
        wx.setStorageSync('merchantInfo', j);
        that.setData({
          placeData: {
            shopname: j.businessName,
            hours: j.hours,
            businessAddress: j.businessAddress,
            contactNumber: j.contactNumber,
          }
        });
      }
    })
   
  },
  changeMarkerColor: function (data, i) {
    var that = this;
    var markers = [];
    console.log(data)
    for (var j = 0; j < data.length; j++) {
      if (j == i) {
        // 此处需要在相应路径放置图片文件 
        data[j].iconPath = "../../../Images/Me/marker_yellow.png";
      } else {
        // 此处需要在相应路径放置图片文件 
        data[j].iconPath = "../../../Images/Me/marker_red.png";
      }
      markers[j](data[j]);
    }
    that.setData({
      markers: markers
    });
  },

  getLocation: function () {
    var that = this;
    // 获取地理位置
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        console.log(res)
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        // console.log(that.data.markers)
        // wx.setStorageSync('latitude', res.latitude);
        // wx.setStorageSync('longitude', res.longitude);
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        //that.nearbyRecommends();
      },
      fail: function (res) {
        console.log('拒绝授权')

      }
    })
  },
  merchantAddress: function (options) {
    var that = this;

    wx.showLoading({
      title: '正在加载',
    })
    // "&latitude=" + options.latitude + "&longitude=" + options.longitude,
    wx.request({
      url: serverUrl.serverUrl + 'mini/partner/merchantAddress?token=' + wx.getStorageSync('token') + "&merchantId="+options.id,
      data: {},
      method: 'GET',
      success: function (res) {
        wx.hideLoading();
        serverUrl.logoutAction(res)
        console.log('--------------')
        console.log(res)
        if (res.data.status == 200) {
          that.setData({
            merchantAddress: res.data.data.merchantAddress
          })
          var wxMarkerData = res.data.data.merchantAddress
          // 发起POI检索请求 
          that.setData({
            placeData: {
              shopname: wxMarkerData[0].shortName,
              hours: wxMarkerData[0].hours,
              businessAddress: wxMarkerData[0].businessAddress,
              contactNumber: wxMarkerData[0].contactNumber,
            }
          });
          var newMarkers = [];
          for (var i = 0; i < wxMarkerData.length; i++) {
            var maskerObj = {};
            var callout = {};
            maskerObj.id = i;
            maskerObj.iconPath = "../../../Images/Me/marker_red.png";
            maskerObj.latitude = wxMarkerData[i].latitude;
            maskerObj.longitude = wxMarkerData[i].longitude;
            callout.content = wxMarkerData[i].shortName;
            callout.fontSize = 14,
            maskerObj.display = "ALWAYS";
            maskerObj.callout = callout;
            
            newMarkers.push(maskerObj);
            that.setData({
              markers: newMarkers,
              // address: res.data.data[i].addressDetail,
              iconPath: "../../../Images/Me/marker_red.png",
              // newlatitude: res.data.data[i].addressLat,
              // newlongitude: res.data.data[i].adressLng,
              // id: res.data.data[i].recommendId,
            });
            console.log(that.data.markers)
            wx.hideLoading();
          }


          // console.log(res.data.data.merchantAddress[0].latitude
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
  makePhoneCall(e){
    console.log(e)
    phoneNumber: e.currentTarget.dataset.contactNumber
  }
})