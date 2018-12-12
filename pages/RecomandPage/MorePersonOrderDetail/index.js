// pages/RecomandPage/submitOrder/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    active: 2,
    steps: [{
        iconSrc: '../../Images/Recomand/dfk.png',
        text: '待付款',
        desc: '12:30:29'
      },
      {
        iconSrc: '../../Images/Recomand/ddjd.png',
        text: '等待接单',
        desc: '12:30:29'
      },
      {
        iconSrc: '../../Images/Recomand/psz.png',
        // iconSrc: '../../Images/Recomand/psz_cur.png',
        text: '配送中',
        desc: '12:30:29'
      },
      {
        iconSrc: '../../Images/Recomand/ywc.png',
        text: '已完成',
        desc: '12:30:29'
      }
    ],
    heardPath: "../../../Images/Order/phone.png",
    personName: "张三",
    items: [{
        "thumb": "../../Images/Order/address.png",
        "title": "商品标题1",
        "desc": "描述信息",
        "detail": "荔枝**1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1荔枝*1",
        "num": "2",
        "price": "20",
      },
      {
        "thumb": "../../Images/Order/address.png",
        "title": "商品标题2",
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
  onLoad: function(options) {


    var _self = this;
    console.log(_self.data)
    if (_self.data.active == "0") {
      _self.setData({
        "steps[0].iconSrc": "../../Images/Recomand/dfk_cur.png"
      })
    } else if (_self.data.active == "1") {
      _self.setData({
        "steps[1].iconSrc": "../../Images/Recomand/ddjd_Cur.png"
      })
    } else if (_self.data.active == "2") {
      _self.setData({
        "steps[2].iconSrc": "../../Images/Recomand/psz_cur.png"
      })
    } else if (_self.data.active == "3") {
      _self.setData({
        "steps[3].iconSrc": "../../Images/Recomand/ywc_Cur.png"
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