var url = require('../../../utils/url.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    myIconImage: "../../../Images/shop/cur.png",
    isSelcect: 1,
    partnerId:"",
    value:""
  },
  addaction: function () {
    var that = this;
    if(that.data.isSelcect==0)
    {
      that.setData(
        {
          myIconImage: "../../../Images/shop/cur.png",
          isSelcect: 1,

        }
      )

    }
    else
    {
      that.setData(
        {
          myIconImage: "../../../Images/shop/nocur.png",
          isSelcect: 0,

        }
      )

    }
  },
  goKaiDian:function()
  {

    let that = this;
    if (that.data.isSelcect==0)
    {
      wx.showToast({
        title: '',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    wx.request({
      url: url.serverUrl + 'mini/partner/agreementArticles',
      method: 'POST',
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      data: {
        token: wx.getStorageSync('token'),
        // partnerId: that.data.partnerId,
        inviteCode: that.data.value
        // token:"6000001740059476",
      },
      success: function (res) {
        console.log(res.data)
        url.logoutAction(res)

        var data = res.data
        if (data.status == "200") {
          wx.navigateTo({
            url: '../FinishShenHe/index?sequence=' + data.data.sequence,
          })

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
  showtips:function()
  {
    
    wx.navigateTo({

      url: '../BLueglassTiaokuan/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      partnerId: options.partnerId,
      value : options.value
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