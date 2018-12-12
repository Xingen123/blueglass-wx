// pages/RecomandPage/submitOrder/index.js
var serverUrl = require('../../../utils/url.js');
import Dialog from '../../../dist/dialog/dialog';
var app = getApp()
var timer;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // isIphoneX: app.globalData.isIphoneX ? true : false,
    token: wx.getStorageSync('token'),
    active: 1,
    nickName: "默认姓名",
    icon: "",
    mychooseProudct: [],
    ALLpresonAddList: [],
    shopname: "Blueglass酸奶店 >",
    items: [],
    order_total_price: "",
    multiTradeId:''
  },

  Countdown: function() {
    var that = this;
    timer = setInterval(function() {
      wx.request({
        url: serverUrl.serverUrl + 'mini/partner/multiTradeCartInfos',
        method: 'GET',
        data: {
          token: wx.getStorageSync('token'),
          multiTradeId: that.data.multiTradeId
        },
        success: function(res) {
          console.log(res)
          // serverUrl.logoutAction(remultiTradeIds)
          serverUrl.logoutAction(res)

          if (res.data.status == 200) {
            that.setData({
              order_total_price: res.data.data.totalPrice,
              shipmentMessage: res.data.data.shipmentMessage,
              //mychooseProudct: res.data.data.participantInfos[0].participantUserProducts,
            })
            if (res.data.data.address && !that.data.addressInfodetail) {

              var ALLpresonAddList = [];
              if (res.data.data.participantInfos) {
                for (var i = 1; i < res.data.data.participantInfos.length; i++) {
                  ALLpresonAddList.push(res.data.data.participantInfos[i]);
                  addressInfodetail: res.data.data.address
                }
                that.setData({
                  ALLpresonAddList: ALLpresonAddList
                })
              }

            } else {
              var ALLpresonAddList = [];
              if (res.data.data.participantInfos) {
                for (var i = 1; i < res.data.data.participantInfos.length; i++) {
                  ALLpresonAddList.push(res.data.data.participantInfos[i]);

                }
                that.setData({
                  ALLpresonAddList: ALLpresonAddList
                })
              }
            }
            console.log(that.data.ALLpresonAddList);
          } else {
            clearInterval(timer)

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
    }, 3000);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    console.log(options)
    this.setData({
      nickName: options.nickName,
      icon: options.icon,
      partnerId: options.partnerId,
      multiTradeId: options.multiTradeId,
      shareiv: options.shareiv
    })
    this.startMultiTrade(options)
    wx.request({
      url: serverUrl.serverUrl + 'mini/partner/addressList',
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
        var data = res.data
        if (data.status == "200") {

          if (data.data.myAddressInfos) {
            wx.showLoading({
              title: '正在加载',
            })
            wx.request({
              url: serverUrl.serverUrl + 'mini/partner/checkExpress',
              method: 'POST',
              header: {
                //设置参数内容类型为x-www-form-urlencoded
                'content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
              },
              data: {
                token: wx.getStorageSync('token'),
                address: data.data.myAddressInfos[0].addressId
              },
              success: function(myres) {
                wx.hideLoading();

                var mydata = myres.data
                if (mydata.status == "200") {
                  that.setData({
                    addressInfodetail: data.data.myAddressInfos[0]
                  });
                } else {
                  wx.hideLoading();
                  wx.showToast({
                    title: myres.data.errorMsg,
                    icon: 'none',
                    duration: 2000
                  })
                }
              }
            })



          }

        } else {
          wx.showToast({
            title: res.data.errorMsg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  startMultiTrade(options) {
    let that = this
    wx.request({
      url: serverUrl.serverUrl + 'mini/partner/startMultiTrade',
      method: 'GET',
      data: {
        token: wx.getStorageSync('token'),
        partnerId: options.partnerId,
        multiTradeId: that.data.multiTradeId
      },
      success: function(res) {
        console.log(res)
        serverUrl.logoutAction(res)

        if (res.data.status == 200) {
          if (res.data.data.startMultiTradeInfo.address) {
            that.setData({
              initiatorUser: res.data.data.startMultiTradeInfo.initiatorUser,
              // addressInfodetail: res.data.data.startMultiTradeInfo.address,
              multiTradeId: res.data.data.startMultiTradeInfo.multiTradeId
            })
          } else {
            that.setData({
              initiatorUser: res.data.data.startMultiTradeInfo.initiatorUser,
              multiTradeId: res.data.data.startMultiTradeInfo.multiTradeId
            })
          }
          if (res.data.data.startMultiTradeInfo.participantInfos) {
            if (res.data.data.startMultiTradeInfo.participantInfos.length > 0) {
              var produncts = res.data.data.startMultiTradeInfo.participantInfos[0].participantUserProducts;
              var newproductList = [];
              var myallPrice = 0;
              for (var i = 0; i < produncts.length; i++) {
                var tempProdunctDic = {};
                tempProdunctDic.id = produncts[i].id;
                tempProdunctDic.numbers = produncts[i].amount;
                tempProdunctDic.name = produncts[i].name;
                tempProdunctDic.salePrice = produncts[i].price / produncts[i].amount;
                newproductList.push(tempProdunctDic);
              }
              that.setData({
                mychooseProudct: newproductList,
                totalPrice: res.data.data.startMultiTradeInfo.participantInfos[0].participantTotalPrice
              })



            }
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
    var mychooseProudct = this.data.mychooseProudct;

    var productListJson = JSON.stringify(mychooseProudct);
    var initiatorUserId = this.data.initiatorUser.id;
    var partnerId = this.data.partnerId;
    var multiTradeId = this.data.multiTradeId;

    wx.navigateTo({
      url: '../RecommendedOrders/index?productListJson=' + productListJson + '&partnerId=' + partnerId + '&initiatorUserId=' + initiatorUserId + '&multiTradeId=' + multiTradeId,
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
    var produncts = this.data.mychooseProudct;
    var newproductList = [];
    var amount = event.detail;
    if (amount == '') {
      amount = 0;
    }
    var myallPrice = 0;
    for (var i = 0; i < produncts.length; i++) {
      var tempProdunctDic = produncts[i];
      if (tempProdunctDic.id == product.id) {

        tempProdunctDic.numbers = amount;
        myallPrice = myallPrice + parseFloat(tempProdunctDic.salePrice) * parseInt(tempProdunctDic.numbers);
        // if (event.detail != 0) {
        newproductList.push(tempProdunctDic);

        // }
      } else {
        newproductList.push(tempProdunctDic);

      }


    }
    console.log(newproductList);
    var totalPrice = 0.0
    var productInfos = [];
    for (var i = 0; i < newproductList.length; i++) {
      var temp = newproductList[i];
      var newDic = {};
      newDic.id = newproductList[i].id;
      newDic.amount = newproductList[i].numbers;
      productInfos.push(newDic);
      totalPrice += parseFloat(temp.salePrice) * parseInt(temp.numbers);
    }
    that.setData({
      totalPrice: totalPrice
    })
    var productInfosJson = JSON.stringify(productInfos);
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: serverUrl.serverUrl + 'mini/partner/submitMultiTrade',
      data: {
        token: wx.getStorageSync('token'),
        initiatorUserId: that.data.initiatorUser.id,
        partnerId: that.data.partnerId,
        productInfos: productInfosJson,
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

        if (res.data.status == '200') {
          that.setData({
            mychooseProudct: newproductList
          })
        } else {
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
  },
  addAddressAction: function() {
    wx.navigateTo({
      url: '../../MePage/editAddress?isChoose=1',
    })
  },

  onClickButton: function() {

    var that = this;

    if (!that.data.addressInfodetail) {
      console.log(that.data.addressInfodetail)
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none',
      })
      return;
    }

    if (that.data.mychooseProudct.length == 0) {
      console.log(that.data.mychooseProudct)

      wx.showToast({
        title: '请选择产品',
        icon: 'none',
      })
      return;
    }
      wx.showModal({
        title: '确认提交订单',
        content: '提交后其他蓝盆友将不能继续点单',
        confirmColor:"#01a0eb",
        success(res) {
          if (res.confirm) {

            wx.showLoading({
              title: '正在加载',
            })
            wx.request({
              url: serverUrl.serverUrl + '/mini/partner/goSettlement',
              data: {
                token: wx.getStorageSync('token'),
                multiTradeId: that.data.multiTradeId,
                partnerId: that.data.partnerId,
                addressId: that.data.addressInfodetail.addressId,
              },
              header: {
                //设置参数内容类型为x-www-form-urlencoded
                'content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
              },
              method: 'POST',
              success: function (res) {
                wx.hideLoading();
                if (res.data.status == 200) {
                  var productListData = JSON.stringify(res.data.data);
                  var multiTradeId = that.data.multiTradeId;

                  wx.navigateTo({
                    url: '../MorePersonSubmitOrder/index?productListData=' + productListData + '&multiTradeId=' + multiTradeId + '&partnerId=' + that.data.partnerId + '&addressId=' + that.data.addressInfodetail.addressId,
                  })
                } else {
                  wx.showToast({
                    title: res.data.errorMsg,
                    icon: 'none',
                    duration: 2000
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



          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })


  },
  quitCloseAction: function() {
    var that = this;

    Dialog.confirm({
      title: '确认退出多人点单',
      message: '您退出后，所添加的商品将被删除',
    }).then(() => {
      wx.request({
        url: serverUrl.serverUrl + 'mini/partner/closeMultiTrade',
        data: {
          token: wx.getStorageSync('token'),
          multiTradeId: that.data.multiTradeId,
          // initiatorUserId: that.data.initiatorUser.id,
          partnerId: that.data.partnerId,
        },
        header: {
          //设置参数内容类型为x-www-form-urlencoded
          'content-type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        method: 'POST',
        success: function(res) {
          if (res.data.status == 200) {
            wx.navigateBack();
          } else {
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
  tichuAction: function(event) {
    var that = this;
    wx.request({
      url: serverUrl.serverUrl + 'mini/partner/initiatorWithdrawParticipant',
      data: {
        token: wx.getStorageSync('token'),
        partnerId: that.data.partnerId,
        participantUserId: event.currentTarget.dataset.participantuserid,
        multiTradeId: that.data.multiTradeId
      },
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      method: 'POST',
      success: function(res) {
        var data = res.data
        if (data.status == "200") {
          clearInterval(timer)
          that.Countdown();
        } else {
          wx.hideLoading();
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
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(options) {
    console.log(options)
    clearInterval(timer)
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
  onShareAppMessage: function(res) {
    var that = this;
    console.log(res)
    // if (res.target.id == 1) {
      return {
        title: that.data.initiatorUser.nickName +'：来啊！只有一起点的酸奶才更销魂～',
        path: 'pages/RecomandPage/shareMorePerson/index?multiTradeId=' + that.data.multiTradeId + '&partnerId=' + that.data.partnerId + '&shareiv=' + that.data.shareiv,
        desc: '',
        imageUrl: that.data.shareiv,
        success: function(res) {

        }
      };
    // }else{

    // }
  }
})