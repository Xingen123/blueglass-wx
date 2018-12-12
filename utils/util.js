
var serverUrl = require('url.js');

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function wxPay(token, merchantId, addressId, payableAmount, tradeInfos, isPickup ,callback) {
  wx.showLoading({
    title: '正在加载',
  })
  console.log(merchantId)
  wx.request({
    url: serverUrl.serverUrl + "mini/partner/submitOrder", 
    data: {
      token:token,
      merchantId:merchantId,
      addressId:addressId,
      payableAmount:payableAmount,
      tradeInfos: tradeInfos,
      isPickup: isPickup,
    },
    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
    // header: {}, // 设置请求的 header  
    header: {
      //设置参数内容类型为x-www-form-urlencoded
      'content-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },

    success: function (res) {
      console.log(res)
      if (res.data.status == '200') {
        var appid = res.data.data.paymentInfo.appId;
        wx.requestPayment({
          'timeStamp': res.data.data.paymentInfo.timeStamp,
          'nonceStr': res.data.data.paymentInfo.nonceStr,
          'package': res.data.data.paymentInfo.exPackage,
          'signType': 'MD5',
          'paySign': res.data.data.paymentInfo.paySign,
          'success': function (succeres) {
            // wx.navigateTo({
            //   url: '../pages/uclickSecTab/uclickOrder/index'

            // })
            succeres.orderId = res.data.data.paymentInfo.orderId;
            console.log(succeres);

            callback(succeres);
          },
          'fail': function (res) {
            // console.log('支付失败' + res)
          }
        })

      } else {
        wx.showToast({
          title: res.data.errorMsg,
          icon: 'none',
        })
      }
      wx.hideLoading();

    },
    fail: function (res) {
      wx.hideLoading();
      wx.showToast({
        title: '网络错误，请稍后重试',
        icon: 'none',
      })
    }
  });
}



function wxNewPay(token, orderId, callback,fail) {
  wx.showLoading({
    title: '正在加载',
  })
  wx.request({
    url: serverUrl.serverUrl + "mini/partner/submitPayment",
    data: {
      token: token,
      orderId: orderId,
    },
    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
    // header: {}, // 设置请求的 header  
    header: {
      //设置参数内容类型为x-www-form-urlencoded
      'content-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },

    success: function (res) {

      console.log('paypay');
      console.log(res)
      if (res.data.status == '200') {
        if (res.data.data.paymentInfo)
        {
          var appid = res.data.data.paymentInfo.appId;
          wx.requestPayment({
            'timeStamp': res.data.data.paymentInfo.timeStamp,
            'nonceStr': res.data.data.paymentInfo.nonceStr,
            'package': res.data.data.paymentInfo.exPackage,
            'signType': 'MD5',
            'paySign': res.data.data.paymentInfo.paySign,
            'success': function (succeres) {
              // wx.navigateTo({
              //   url: '../pages/uclickSecTab/uclickOrder/index'

              // })
              succeres.orderId = res.data.data.paymentInfo.orderId;
              console.log(succeres);

              callback(succeres);
            },
            'fail': function (failres) {

              fail(failres);
            }
          })
        }
        else
        {
          wx.showToast({
            title: '未返回支付信息',
            icon: 'none',
          })
        }


      } else {
        wx.showToast({
          title: res.data.errorMsg,
          icon: 'none',
        })
      }
      wx.hideLoading();

    },
    fail: function (res) {
      wx.hideLoading();
      wx.showToast({
        title: '网络错误，请稍后重试',
        icon: 'none',
      })
    }
  });
}

module.exports = {
  formatTime: formatTime,
  wxPay: wxPay,
  wxNewPay: wxNewPay,
}



