//获取应用实例
const app = getApp()

var url = require('../../utils/url.js')


Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e,132);
    wx.login({
      success: function(res) {
        console.log(res.code,555);
        if (res.code) {
          //TODO
          wx.request({
            url: url.serverUrl + "mini/partner/getUserToken",
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            data: {
              js_code: res.code
            },
            complete: function(res) {
              console.log(res,5556);
              console.log('token ++++++1 ', res);
              wx.setStorageSync('token', res.data.data);
              wx.request({
                url: url.serverUrl + "mini/partner/signIn",
                header: {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST",
                data: {
                  token: res.data.data,
                  signature: e.detail.signature,
                  rawData: e.detail.rawData,
                  encryptedData: e.detail.encryptedData,
                  iv: e.detail.iv
                },
                complete: function(res) {
                  if (res.data.status == 200) {
                    wx.setStorageSync('headImage', res.data.headImgUrl)
                    wx.setStorageSync('nickName', res.data.nickName)
                    wx.setStorageSync('userId', res.data.userId)
                    wx.request({
                      url: url.serverUrl + 'mini/partner/check/isBindPhone',
                      header: {
                        'content-type': 'application/x-www-form-urlencoded',
                        'Accept': 'application/json'
                      },
                      method: "POST",
                      data: {
                        token: wx.getStorageSync('token')
                      },
                      complete: function(res) {
                        if (res.data.data.phone) {
                          // if (wx.getStorageSync('phone')) {
                          wx.reLaunch({
                            url: '../RecomandPage/RecomandIndex/index',
                          })
                          // } 
                        } else {
                          wx.navigateTo({
                            url: '../MePage/editPhone?typecode=1',
                          })
                        }
                      }
                    })

                  }else{
                    wx.showToast({
                      title: data.data.errorMsg,
                      icon: 'none',
                      duration: 2000
                    })
                  }
                }
              })
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})