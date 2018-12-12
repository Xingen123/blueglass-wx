// pages/ShopPage/addProSuccess/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopname:"产品详情",
    items: [{
      "thumb": "../../Images/Order/address.png",
      "title": "商品标题1",
      "desc": "描述信息",
      "detail": "荔枝**1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1",
      "num": "2",
      "price": "20",
    },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  // 提交合伙人选定的装饰材料
  submitMyDecoration() {
    let _self = this;
    wx.showLoading({
      title: '正在加载',
    })
    _self.data.materials.push(_self.data.firstMaterials)
    let c = _self.data.materials.concat(_self.data.secondMaterials)
    console.log(c)

    wx.request({
      url: serverUrl.serverUrl + 'mini/partner/submitDIYProduct',
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      data: {
        token: _self.data.token,
        name: "MY-PRODUCT",
        totalPrice: _self.data.options.allPrice,
        type: "fudai",
        productDIYId: "31757F8169BD40BBA9D5BDD9A553C917",
        materials: c
      },
      method: 'GET',
      success: function (res) {
        serverUrl.logoutAction(res)

        wx.hideLoading();
        let data = res.data
        if (data.status == 200) {
          console.log(data)
          wx.navigateTo({
            url: '../addProSuccess/index',
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
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  submit(e){
    console.log(e)
    // wx.navigateBack({
    //   delta: 2
    // })
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