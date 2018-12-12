// pages/MePage/addwish.js
var url = require('../../utils/url.js')

Page({

  /**
   * 页面的初始数据
   * PARTNER_BACKGROUND("合伙人背景"),
    DEFAULT_BACKGROUND("系统默认背景"),
    PLANTFORM_BANNER("系统推广"),
    DESIRE_BACKGROUND("心愿背景");
   */
  data: {
    name: "",
    targetMoney: "",
    desireId: "",
    image_url: "../../Images/shop/addImage_Icon.png"
    // "../../Images/shop/addImage_Icon.png"
  },

  delet: function(e) {
    let that = this;

    wx.showModal({
      title: '确定删除当前心愿',
      content: '删除后无法恢复呢，为了心愿做的努力就再也看不到咯~',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: url.serverUrl + 'mini/partner/addOREdiORDelDesire',
            method: 'POST',
            header: {
              //设置参数内容类型为x-www-form-urlencoded
              'content-type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json'
            },
            data: {
              token: wx.getStorageSync('token'),
              desireId: that.data.desireId,
              name: that.data.name,
              targetAmount: that.data.targetMoney,
              isDelle: true
            },
            success: function(res) {
              url.logoutAction(res)
              console.log(res.data)
              var data = res.data
              if (data.status == "200") {
                wx.navigateBack({
                  delta: 2
                })
              } else {
                wx.showToast({
                  title: data.errorMsg,
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
        } else if (res.cancel) {

        }
      }
    })
  },

//点击保存或者新建
  logout: function(e) {
    //
    let that = this;
    console.log(that.data)
    wx.request({
      url: url.serverUrl + 'mini/partner/addOREdiORDelDesire',
      method: 'POST',
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      data: {
        token: wx.getStorageSync('token'),
        desireId: that.data.desireId,
        name: that.data.name,
        targetAmount: that.data.targetMoney,
        isDelle: false
      },
      success: function(res) {
        // url.logoutAction(res)
        console.log(that.data.image_url)
        that.uploadimgss(that.data.image_url)
        console.log(res)
        var data = res.data
        if (data.status == "200" ) {
          wx.redirectTo({
            url: `./wallatPage`
          })
          // wx.navigateBack({
          //   delta: '2'
          // })
        } else {
          wx.showToast({
            title: data.errorMsg,
            icon: 'none',
            duration: 2000,
            success:function(){
              wx.redirectTo({
                url: `./wallatPage`
              })
            }
          })
        }
      }
    })
  },

  nameInput: function(e) {
    console.log(e)
    this.setData({
      name: e.detail.value
    })
  },
  phoneInput: function(e) {
    console.log(e)
    this.setData({
      targetMoney: e.detail.value
    })
  },

  addImageAction: function() {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        // const tempFilePaths = res.tempFilePaths;
        var imgsrc = res.tempFilePaths[0];

        wx.navigateTo({
          url: `../Upload/uploadTwo/upload?src=${imgsrc}`
        })
        // that.uploadimgss(imgsrc[0]);


      }
    })
  },
  //上传图片
  uploadimgss: function(data) {
    var that = this
    wx.uploadFile({
      url: url.serverUrl + "mini/partner/uploadMultiFile",
      filePath: data,
      name: 'files', //这里根据自己的实际情况改
      formData: {
        'token': wx.getStorageSync('token'),
        'type': 'DESIRE_BACKGROUND'
      }, //这里是上传图片时一起上传的数据
      success: (resp) => {
        console.log(resp)
        that.setData({
          image_url: data
        })
        //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
      },
      fail: (res) => {

      },
      complete: () => {

      }
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    
    if (options.avatar){
      this.uploadimgss(options.avatar)
    }
    if (options.name) {
      this.setData({
        name: options.name,
        targetMoney: options.targetAmount,
        image_url: options.image_url,
        desireId: options.desireId
      })
    }
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