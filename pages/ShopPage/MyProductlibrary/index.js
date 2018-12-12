var serverUrl = require('../../../utils/url.js');
import Dialog from '../../../dist/dialog/dialog';

// pages/ShopPage/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    backgroundIVs:[],
    indicatorDots: false,
    autoplay: true,
    interval: 2000,
    duration: 1000
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;


  },
  requestNetWork: function () {
    var that = this;

    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: serverUrl.serverUrl + '/mini/partner/getMyProducts?token=' + wx.getStorageSync('token'),
      data: {},
      method: 'GET',
      success: function (res) {
        wx.hideLoading();
        serverUrl.logoutAction(res)

        that.setData({
          productAmount: res.data.data.productAmount,
          putawayAmount: res.data.data.putawayAmount,
          maxAmount: res.data.data.maxAmount,
          backgroundIVs: res.data.data.background,
          categoryList: res.data.data.myProducts,
          currentproductDIY: res.data.data.myProducts[0].productDIYList,
        });

        if(!that.data.currentProducts)
        {
          var currentDIYList = [];

          for (var i = 0; i < that.data.categoryList.length; i++) {
            var currentDIY = that.data.categoryList[i];

            var currentproducts = currentDIY.productDIYList[0];

            currentproducts.chooseIndex = 0;

            currentDIYList.push(currentproducts);
          }
          that.setData(
            {
              currentProducts: currentDIYList,
              currentCategory: 0,
              currentchooseIndex: 0
               
            }
          )
        }
        else
        {
          var currentDIYList = that.data.currentProducts;

          var products = that.data.categoryList[that.data.currentCategory].productDIYList[that.data.currentchooseIndex];
            products.chooseIndex = that.data.currentchooseIndex;
          currentDIYList[that.data.currentCategory] = products;
          that.setData(
            {
              currentProducts: currentDIYList,
            }
          )
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

  choosetheDIY: function (event)
  {
    var that = this;
    // if (that.data.curIndex == event.currentTarget.dataset.index) {
    //   return false;
    // } else {
    //   that.setData({
    //     curIndex: event.currentTarget.dataset.index
    //   })
    // }
    // console.log(event);

    var categoryidx = event.currentTarget.dataset.categoryidx;
    var products = event.currentTarget.dataset.products;
    products.chooseIndex = event.currentTarget.dataset.index;

    console.log(products);
    console.log(categoryidx);
    var currentDIYList = that.data.currentProducts;
    console.log(currentDIYList);

    currentDIYList[categoryidx] = products;
    console.log(currentDIYList);

    that.setData(
    {
      currentProducts: currentDIYList,
      currentCategory: categoryidx,
        currentchooseIndex: event.currentTarget.dataset.index
    })


  },
  editAction: function () {
    wx.navigateTo({
      // url: '../addProduct/index',
      url: '../ProductLibrary/index',
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
    var that = this;
    that.requestNetWork();

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
  deleteAction:function(event)
  {
    var that = this;
    var productid = event.currentTarget.dataset.product.id;

    Dialog.confirm({
      title: '确认删除产品',
      message: '删除后，您需要重新添加产品'
    }).then(() => {
      wx.request({
        url: serverUrl.serverUrl + 'mini/partner/deleteMyProduct',
        data: {
          token: wx.getStorageSync('token'),
          // initiatorUserId: that.data.initiatorUser.id,
          productId: productid,
        },
        header: {
          //设置参数内容类型为x-www-form-urlencoded
          'content-type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        method: 'POST',
        success: function (res) {
          if (res.data.status == 200) {
            that.requestNetWork();
          }
          else
          {
            wx.showToast({
              title: res.data.errorMsg,
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  shangxiaAction: function (event)
  {
    var that = this;
    var productid = event.currentTarget.dataset.product.id;

var isopen = true;
    if (event.currentTarget.dataset.product.isopen==1)
    {
      isopen = false;
    }
    else{
      isopen = true;
    }
    var that = this;
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: serverUrl.serverUrl + 'mini/partner/productManager?token=' + wx.getStorageSync('token'),
      data: {
        productId:productid,
        isOpen:isopen
      },
      method: 'GET',
      success: function (res) {
        wx.hideLoading();


        that.requestNetWork();



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
  showTips:function()
  {
    Dialog.alert({
      title: '',
      zIndex: 1000,
      message: '脑洞爆棚装不下？别担心，随着店铺等级提升，可上架产品数量也会越多哦！多分享、提升等级，养肥钱包吧！'
    }).then(() => {
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})