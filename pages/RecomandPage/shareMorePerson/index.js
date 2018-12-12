// pages/RecomandPage/submitOrder/index.js
var serverUrl = require('../../../utils/url.js');
import Dialog from '../../../dist/dialog/dialog';
var timer;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: wx.getStorageSync('token'),
    active: 1,
    nickName: "默认姓名",
    icon: "",
    mychooseProudct: [],
    ALLpresonAddList: [],
    multiTradeId: "",
    shopname: "Blueglass酸奶店 >",
    items: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('options' + options)
    this.setData({
      isFinish: 0,
      partnerId: options.partnerId,
      shareiv: options.shareiv,
      multiTradeId: options.multiTradeId
    })
  },
  Countdown: function () {
    var that = this;
    timer = setInterval(function () {
      wx.request({
        url: serverUrl.serverUrl + 'mini/partner/multiTradeCartInfos',
        method: 'GET',
        data: {
          token: wx.getStorageSync('token'),
          multiTradeId: that.data.multiTradeId
        },
        success: function (res) {
          console.log(res)
          serverUrl.logoutAction(res)
          that.startMultiTrade()

          if (res.data.status == 200) {
            
          } else {
            wx.showToast({
              title: res.data.errorMsg,
              icon: 'none',
              duration: 2000
            })
          }
          // that.setData({
          //   chooseproducts: newproductList
          // })
        },
        fail: function (res) {
          wx.hideLoading();
          wx.showToast({
            title: '网络错误，请稍后重试',
            icon: 'none',
            duration: 2000
          })
        }
      });
    }, 3000);
  },
  startMultiTrade() {
    let that = this

    wx.request({
      url: serverUrl.serverUrl + 'mini/partner/multiTradeCartInfos',
      method: 'GET',
      data: {
        token: wx.getStorageSync('token'),
        multiTradeId: that.data.multiTradeId
        // multiTradeId:'EE22C45A0F6040A38AE02D569299A2CE'
      },
      success: function(res) {
        console.log(res)
        serverUrl.logoutAction(res)
        if (res.data.data.status == 301){
          wx.showToast({
            title: res.data.data.message,
            icon: 'none',
            duration: 2000,
            success(){
              wx.hideLoading();

              wx.reLaunch({
                url: '../RecomandIndex/index'
              })
            }
          })
         
        }
        if (res.data.status == 200) {

          if (res.data.data.participantInfos[0].myself == "1"){
            wx.reLaunch({
              url: '../ShopCartMorePerson/index?partnerId=' + that.data.partnerId,
            })
            return
          }
          if (res.data.data.address) {
            var ALLpresonAddList = [];
            var currentInfoProducts = [];
            for (var i = 1; i < res.data.data.participantInfos.length; i++) {
              if (res.data.data.participantInfos[i].myself == '1') {
                currentInfoProducts = res.data.data.participantInfos[i].participantUserProducts;
                if (res.data.data.participantInfos[i].participantUser.lock) {
                  that.setData({
                    isFinish: 1,

                  })
                } else {
                  that.setData({
                    isFinish: 0,

                  })
                }

              }
              ALLpresonAddList.push(res.data.data.participantInfos[i]);
            }
            that.setData({
              initiatorUser: res.data.data.initiatorUser,
              address: res.data.data.address,
              totalPrice: parseFloat(res.data.data.totalPrice) * 100,
              mychooseProudct: res.data.data.participantInfos[0].participantUserProducts,
              myparticipantTotalPrice: res.data.data.participantInfos[0].participantTotalPrice,

              ALLpresonAddList: ALLpresonAddList,
              currentInfoProducts: currentInfoProducts
            })
          } else {
            that.setData({
              initiatorUser: res.data.data.initiatorUser,
              mychooseProudct: res.data.data.participantInfos[0].participantUserProducts,
              ALLpresonAddList: ALLpresonAddList

            })
          }
          console.log(that.data);
        } else {
          wx.showToast({
            title: res.data.errorMsg,
            icon: 'none',
            duration: 2000
          })
        }
        // that.setData({
        //   chooseproducts: newproductList
        // })
      },
      fail: function(res) {
        wx.hideLoading();
        wx.showToast({
          title: '网络错误，请稍后重试',
          icon: 'none',
          duration: 2000
        })
      }
    });

  },
  diananAction: function() {

    var mychooseProudct = this.data.currentInfoProducts;

    var productListJson = JSON.stringify(mychooseProudct);
    var initiatorUserId = this.data.initiatorUser.id;
    var partnerId = this.data.partnerId;
    var multiTradeId = this.data.multiTradeId;
    console.log(mychooseProudct);

    wx.navigateTo({
      url: '../RecommendedOrders/index?isCanyu=1&productListJson=' + productListJson + '&partnerId=' + partnerId + '&initiatorUserId=' + initiatorUserId + '&multiTradeId=' + multiTradeId,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  onChange: function(event) {

    var that = this;
    var product = event.currentTarget.dataset.product;
    var produncts = this.data.currentInfoProducts;
    var newproductList = [];
    var amount = event.detail;
    if(amount=='')
    {
      amount = 0;
    }
    console.log(produncts);
    for (var i = 0; i < produncts.length; i++) {
      var tempProdunctDic = produncts[i];
      if (tempProdunctDic.id == product.id) {

        tempProdunctDic.numbers = amount;
        // if (event.detail != 0) {
          newproductList.push(tempProdunctDic);

        // }
      } else {
        if (tempProdunctDic.amount)
        {
          tempProdunctDic.numbers = tempProdunctDic.amount;

        }
        newproductList.push(tempProdunctDic);

      }


    }
    console.log(newproductList);

    var productInfos = [];
    for (var i = 0; i < newproductList.length; i++) {
      var newDic = {};
      newDic.id = newproductList[i].id;
      newDic.amount = newproductList[i].numbers;
      productInfos.push(newDic);
    }
    var productInfosJson = JSON.stringify(productInfos);
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: serverUrl.serverUrl + 'mini/partner/submitMultiTrade',
      data: {
        token: wx.getStorageSync('token'),
        initiatorUserId: that.data.initiatorUser.id,
        multiTradeId: that.data.multiTradeId,
        partnerId: that.data.partnerId,
        productInfos: productInfosJson
      },
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      method: 'POST',
      success: function(res) {
        console.log(res)
        wx.hideLoading();
        if (res.data.status == 200) {

          if (res.data.data.multiTradeInfos.address) {

            var ALLpresonAddList = [];
            var currentInfoProducts = [];
            for (var i = 1; i < res.data.data.multiTradeInfos.participantInfos.length; i++) {
              if (res.data.data.multiTradeInfos.participantInfos[i].myself == '1') {
                currentInfoProducts = res.data.data.multiTradeInfos.participantInfos[i].participantUserProducts;

                if (res.data.data.multiTradeInfos.participantInfos[i].participantUser.lock) {
                  that.setData({
                    isFinish: 1,

                  })
                } else {
                  that.setData({
                    isFinish: 0,

                  })
                }
              }
              ALLpresonAddList.push(res.data.data.multiTradeInfos.participantInfos[i]);
            }
            that.setData({
              initiatorUser: res.data.data.multiTradeInfos.initiatorUser,
              address: res.data.data.multiTradeInfos.address,
              totalPrice: parseFloat(res.data.data.totalPrice) * 100,
              mychooseProudct: res.data.data.multiTradeInfos.participantInfos[0].participantUserProducts,
              myparticipantTotalPrice: res.data.data.multiTradeInfos.participantInfos[0].participantTotalPrice,

              ALLpresonAddList: ALLpresonAddList,
              currentInfoProducts: currentInfoProducts
            })
          } else {
            that.setData({
              initiatorUser: res.data.data.multiTradeInfos.initiatorUser,
              mychooseProudct: res.data.data.multiTradeInfos.participantInfos[0].participantUserProducts,

              ALLpresonAddList: ALLpresonAddList

            })
          }
          console.log(that.data);
        } else {
          wx.showToast({
            title: res.data.errorMsg,
            icon: 'none',
            duration: 2000
          })
        }
        // that.setData({
        //   chooseproducts: newproductList
        // })
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

  onClickButton: function() {
    var that = this;
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: serverUrl.serverUrl + '/mini/partner/finishMultiTrade',
      data: {
        token: wx.getStorageSync('token'),
        initiatorUserId: that.data.initiatorUser.id,
        multiTradeId: that.data.multiTradeId,
        partnerId: that.data.partnerId,
      },
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      method: 'POST',
      success: function(res) {
        wx.hideLoading();

        console.log(res);
        that.setData({
          isFinish: 1
        })
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
  quitCloseAction: function() {
    var that = this;
    wx.showLoading({
      title: '正在加载',
    })
    Dialog.confirm({
      title: '确认退出多人点单',
      message: '您退出后，其他蓝盆友也将无法继续点单'
    }).then(() => {
      wx.request({
        url: serverUrl.serverUrl + 'mini/partner/participantWithdraw',
        data: {
          token: wx.getStorageSync('token'),
          initiatorUserId: that.data.initiatorUser.id,
          partnerId: that.data.partnerId,
          multiTradeId: that.data.multiTradeId
        },
        header: {
          //设置参数内容类型为x-www-form-urlencoded
          'content-type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        method: 'POST',
        success: function(res) {
          wx.hideLoading();

          if (res.data.status == 200) {
            // wx.navigateBack();
            wx.reLaunch({
              url: '../RecomandIndex/index'
            })
          }else{
            wx.showToast({
              title: res.data.errorMsg,
              icon: 'none',
              duration: 2000
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
    }).catch(() => {

    });


  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(options) {
    clearInterval(timer)
    this.startMultiTrade()
    this.Countdown()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    clearInterval(timer)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearInterval(timer)
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
  onShareAppMessage: function (res) {
     console.log(res+'====wqeqweqeq')
    var that = this;
    if (res.target.id == 1) {
      return {
        title: wx.getStorageSync('nickName') + '：来啊！只有一起点的酸奶才更销魂～',
        path: 'pages/RecomandPage/shareMorePerson/index?multiTradeId=' + that.data.multiTradeId + '&partnerId=' + that.data.partnerId + '&shareiv=' + that.data.shareiv,
        desc: '',
        imageUrl: that.data.shareiv,
        success: function (res) {
          console.log('aaa='+res)
        }
      };
    }
  }
})