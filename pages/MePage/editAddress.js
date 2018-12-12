// pages/MePage/editAddress.js

var url = require('../../utils/url.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressInfo:[],
    address_index:0
  },

  jumpDetail:function(event){
    let that = this;

    console.log(event.currentTarget,555);
    wx.navigateTo({
      url: 'editAddressDetail?address=' + JSON.stringify(that.data.addressInfo[event.currentTarget.dataset.addressdetailid]),
    })
    
  },
  chooseAddress: function (event) {
    let that = this;

    if(this.data.isChoose)
    {
      wx.showLoading({
        title: '正在加载',
      })
      wx.request({
        url: url.serverUrl + 'mini/partner/checkExpress',
        method: 'POST',
        header: {
          //设置参数内容类型为x-www-form-urlencoded
          'content-type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        data: {
          token: wx.getStorageSync('token'),
          address: that.data.addressInfo[event.currentTarget.dataset.addressdetailid].addressId
        },
        success: function (res) {
          wx.hideLoading();

          var data = res.data
          if (data.status == "200") 
          {
            if (that.data.orderId)
            {
              wx.showLoading({
                title: '正在加载',
              })
              wx.request({
                url: url.serverUrl + 'mini/partner/calculateDeliveryCost',
                method: 'POST',
                header: {
                  //设置参数内容类型为x-www-form-urlencoded
                  'content-type': 'application/x-www-form-urlencoded',
                  'Accept': 'application/json'
                },
                data: {
                  token: wx.getStorageSync('token'),
                  orderId: that.data.orderId,
                  addressId: that.data.addressInfo[event.currentTarget.dataset.addressdetailid].addressId,
             
                },
                success: function (myres) {
                  wx.hideLoading();
                  console.log("2")
                  var mydata = myres.data
                  if (mydata.status == "200") {
                    var pages = getCurrentPages();
                    var prevPage = pages[pages.length - 2]; //上一个页面


                    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
                    prevPage.setData({
                      addressInfodetail: that.data.addressInfo[event.currentTarget.dataset.addressdetailid],
                      price: mydata.data.ordertInfo.totalPrice - mydata.data.ordertInfo.deliveryCost,
                      totalPrice: parseFloat(mydata.data.ordertInfo.totalPrice),
                      deliveryCost: mydata.data.ordertInfo.deliveryCost
                    })
                    console.log('sdfghjkl');
                    console.log(that.data.addressInfo[event.currentTarget.dataset.addressdetailid]);

                    wx.navigateBack();

                  }
                  else {
                    wx.hideLoading();
                    wx.showToast({
                      title: mydata.errorMsg,
                      icon: 'none',
                      duration: 2000
                    })
                  }
                },
                fail:function(err){
                  console.log(1)
                }
              })
            }
            else
            {
              var pages = getCurrentPages();
              var prevPage = pages[pages.length - 2]; //上一个页面


              //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
              prevPage.setData({
                addressInfodetail: that.data.addressInfo[event.currentTarget.dataset.addressdetailid],
              })
              console.log('sdfghjkl');
              console.log(that.data.addressInfo[event.currentTarget.dataset.addressdetailid]);

              wx.navigateBack();
            }

          } 
          else 
          {
            wx.hideLoading();
            wx.showToast({
              title: data.errorMsg,
              icon: 'none',
              duration: 2000
            })
          }
        }
      })


      
    }

  },
  logout: function () {
    wx.navigateTo({
      url: 'editAddressDetail',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    if (options.isChoose)
    {
      this.setData({
        isChoose: options.isChoose
      })
    } 
    if (options.orderId) {
      this.setData({
        orderId: options.orderId
      })
    } 

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
      url: url.serverUrl + 'mini/partner/addressList',
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
        url.logoutAction(res)

        console.log(res.data)
        var data = res.data
        if (data.status == "200") {
          that.setData({
            addressInfo: data.data.myAddressInfos
          });
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
  onShareAppMessage: function () {

  }
})