// pages/OrderPage/WaitingOrderDetail/WaitingOrderDetail.js
var serverUrl = require('../../../utils/url.js');
import Dialog from '../../../dist/dialog/dialog';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    timer: '',//定时器名字
    countDownNum: '0',//倒计时初始值
    time:'00:00'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId: options.orderId,

    })
    this.loadOrderData();

  },
  loadOrderData: function () {
    let that = this;
    let orderId = that.data.orderId

    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: serverUrl.serverUrl + 'mini/partner/queryOrderDetails',
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      data: {
        token: wx.getStorageSync('token'),
        orderId: orderId
      },
      method: 'POST',
      success: function (res) {
        wx.hideLoading();
        serverUrl.logoutAction(res)

        let data = res.data
        if (data.status == 200) {
          console.log(data)
          that.setData({
            orderInfo: data.data.orderInfo,
            merchantInfo: data.data.merchantInfo,
            productDetails: data.data.productDetails
          })
          var timestamp = Date.parse(new Date());

          if (that.data.orderInfo.status =='已接单')
          {
            clearInterval(that.data.timer);
            wx.navigateTo({
              url: '../DistributionOrderDetail/index?orderId=' + that.data.orderId
            })
          }
          else
          {
            var countDownNum = (timestamp - that.data.orderInfo.timingStart) / 1000;
            var fen = parseInt(countDownNum / 60);
            var miao = parseInt(countDownNum % 60);
            var time = fen + ':' + miao;
            var receiptTimefen = parseInt(that.data.orderInfo.receiptTime / 60);
            var receiptTimemiao = parseInt(that.data.orderInfo.receiptTime % 60);
            var receiptTime = receiptTimefen + ':' + receiptTimemiao;

            that.setData({
              countDownNum: countDownNum,
              time: time,
              receiptTime: receiptTime

            })
            clearInterval(that.data.timer);
            that.countDown();
          }

          
          // var items = [];

          // console.log(data.data.shoppingCartData);
          // for (var i = 0; i < data.data.productDetails.length; i++) {

          //   var item = {};
          //   item.id = data.data.productDetails[i].productId;
          //   item.thumb = data.data.productDetails[i].icon;
          //   item.title = data.data.productDetails[i].productName;
          //   item.detail = data.data.productDetails[i].tradeMaterials;
          //   item.num = data.data.productDetails[i].amount;
          //   item.price = data.data.productDetails[i].totalPrice;
          //   items.push(item);
          //   that.setData({
          //     items: items,
          //     shopname: data.data.productDetails[i].nickName,

          //   })
          // }

        } else {
          wx.showToast({
            title: data.errorMsg,
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

  countDown: function () {
    let that = this;
    let countDownNum = that.data.countDownNum;//获取倒计时初始值
    //如果将定时器设置在外面，那么用户就看不到countDownNum的数值动态变化，所以要把定时器存进data里面
    that.setData({
      timer: setInterval(function () {//这里把setInterval赋值给变量名为timer的变量
        //每隔一秒countDownNum就减一，实现同步
        countDownNum++;
        //然后把countDownNum存进data，好让用户知道时间在倒计着
        var fen = parseInt(countDownNum / 60);
        var miao = parseInt(countDownNum % 60);
        var time = fen + ':' + miao;

   

        that.setData({
          countDownNum: countDownNum,
          time: time

        })
        if (miao%5 == 0) {
          that.loadOrderData();
        }
      }, 1000)
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
    clearInterval(this.data.timer);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.timer);

    wx.reLaunch({
      url: '/pages/OrderPage/index?istype=2',
    })
  },
  canleOrder:function()
  {
    var that = this;
    Dialog.confirm({
      title: '取消订单?',
      message: '是否取消订单'
    }).then(() => {
      let orderId = that.data.orderId
      wx.showLoading({
        title: '正在加载',
      })

      wx.request({
        url: serverUrl.serverUrl + 'mini/partner/refund',
        header: {
          //设置参数内容类型为x-www-form-urlencoded
          'content-type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        data: {
          token: wx.getStorageSync('token'),
          orderId: orderId
        },
        method: 'POST',
        success: function (res) {
          wx.hideLoading();
          let data = res.data
          if (data.status == 200) {
            wx.showToast({
              title: '订单已取消',
              icon: 'none',
            })
            wx.reLaunch({
              url: '/pages/OrderPage/index?istype=2',
            })

          } else {
            wx.showToast({
              title: data.errorMsg,
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
    }).catch(() => {

    });


  
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