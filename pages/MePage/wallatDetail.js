// pages/MePage/wallatDetail.js
var url = require('../../utils/url.js')


Page({

  /**
   * 页面的初始数据
   */

  
  data: {
    active: 0,
    incomeArray:[],
    putoutArray:[],
    totalArray:[],
    grandTotalAmount : ""
  },

  onChange: function (event){
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.request({
      url: url.serverUrl + 'mini/partner/getMyWalleRecored',
      method: 'POST',
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      data: {
        token: wx.getStorageSync('token'),
        type :"All"
      },
      success: function (res) {
        console.log(res.data)
        url.logoutAction(res)

        var data = res.data
        if (data.status == "200") {
          that.setData({
            totalArray : res.data.data.walletRecordInfos,
            grandTotalAmount: res.data.data.grandTotalAmount
          });

          for (let i = 0; i < that.data.totalArray.length; i ++){
            var temp = that.data.totalArray[i];
            if(temp.name == '收益'){
              that.data.incomeArray.push(temp);
            }
            else
            {
              that.data.putoutArray.push(temp);
            }
          }
          console.log(that.data.incomeArray + "11111" + that.data.putoutArray)

          that.setData({
            incomeArray: that.data.incomeArray,
            putoutArray: that.data.putoutArray
          });
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