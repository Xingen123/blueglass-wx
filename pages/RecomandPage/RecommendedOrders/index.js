var serverUrl = require('../../../utils/url.js');

var tabs = [{
    name: "自取"
  },
  {
    name: "配送"
  }
];
// pages/RecommendedOrders/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    indicatorColor: '#D8D8D8',
    indicatorActiveColor: '#9B9B9B',
    circular: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    // previousMargin: "30rpx",
    // nextMargin: "40rpx",
    tabs: tabs, //展示的数据
    currentTab: 0,
    activeIndex: 0,
    ak: "3cmQZvu49EvgdePdyf6oZ0n335aHQCOU",
    expNum: '',
    ldata: false,
    defaultScrollImg: "../../images/default/690-460.png", //默认图片
    typeBgDefaultImg: "../../images/default/180-120.png", //默认图片
    canIUse: false,
    chooseproducts: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.setData({
      initiatorUserId: options.initiatorUserId,
      partnerId: options.partnerId,
      multiTradeId: options.multiTradeId,
      iscanyu: options.isCanyu

    })
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        console.log(res)
        var latitude = res.latitude
        var longitude = res.longitude
        that.setData({
          wd: latitude,
          jd: longitude
        })
        that.requestNetWork(options, latitude, longitude);
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },
  requestNetWork: function(options, latitude, longitude) {
    var that = this;
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: serverUrl.serverUrl + 'mini/partner/recommendOrder',
      data: {
        token: wx.getStorageSync('token'),
        longitude: longitude,
        latitude: latitude,
        partnerId: options.partnerId
      },
      method: 'GET',
      success: function(res) {
        console.log(res)
        serverUrl.logoutAction(res)

        wx.hideLoading();

        that.setData({
          partnerInfo: res.data.data.partnerInfo,
          backgroundIVs: res.data.data.background,
          categoryList: res.data.data.myProducts,
          merchantInfo: res.data.data.merchantInfo
        });

        if (that.data.categoryList) {
          var categoryList = that.data.categoryList;
          for (var i = 0; i < categoryList.length; i++) {
            var isallNotHave = true;
            for (var k = 0; k < categoryList[i].productDIYList.length; k++) {
              if (categoryList[i].productDIYList[k].products) {
                isallNotHave = false;
              }
            }
            categoryList[i].isallNotHave = isallNotHave;
          }

          that.setData(
            {
              categoryList: categoryList
            }
          )
        }
        //初始化选中
        var chooseproducts = [];
        for (var i = 0; i < that.data.categoryList.length; i++) {
          if (that.data.categoryList[i].productDIYList) {
            for (var j = 0; j < that.data.categoryList[i].productDIYList.length; j++) {
              if (that.data.categoryList[i].productDIYList[j].products) {
                for (var k = 0; k < that.data.categoryList[i].productDIYList[j].products.length; k++) {
                  var produnctDic = that.data.categoryList[i].productDIYList[j].products[k];
                  produnctDic.numbers = 0;
                  chooseproducts.push(produnctDic);

                }
              }
            }
          }


        }
        that.setData({
          chooseproducts: chooseproducts
        });
        var shoppingCartData = JSON.parse(options.productListJson)
        var chooseproducts = that.data.chooseproducts;

        for (var i = 0; i < shoppingCartData.length; i++) {
          var mydic = shoppingCartData[i];

          for (var k = 0; k < chooseproducts.length; k++) {
            if (mydic.id == chooseproducts[k].id) {
              if (mydic.numbers) {
                chooseproducts[k].numbers = mydic.numbers;

              } else {
                chooseproducts[k].numbers = mydic.amount;

              }
            }
          }
        }
        that.setData({
          chooseproducts: chooseproducts
        });


        wx.getSystemInfo({
          success: function(res) {
            that.setData({
              //计算相关宽度
              clientHeight: 300,
              sliderWidth: res.windowWidth / that.data.tabs.length,
              sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
              contentHeight: res.windowHeight - res.windowWidth // 750 * 68 //计算内容区高度，rpx -> px计算
            });

          }
        });


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


  bindChange: function(e) {
    var that = this;

    var current = e.detail.current;
    that.setData({
      currentType: current
    });
    //创建节点选择器


    this.setData({
      activeIndex: current,
      sliderOffset: this.data.sliderWidth * current,
    });
    var typeStr;
    if (that.data.currentType == 0) {
      typeStr = '.collage';
    } else if (that.data.currentType == 1) {
      typeStr = '.have_in_hand';

    } else {
      typeStr = '.completed';

    }
    var query = wx.createSelectorQuery();
    query.select(typeStr).boundingClientRect();
    query.exec(function(res) {
      //res就是 所有标签为mjltest的元素的信息 的数组
      //取高度
      that.setData({
        clientHeight: res[0].height + 80
      })
    })
  },

  navTabClick: function(e) {

    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
    });





  },
  // 显示对话框 
  showModal: function() {
    // 显示遮罩层 
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框 
  hideModal: function() {
    // 隐藏遮罩层 
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  chooseProdunctAction: function(event) {
    var product = event.currentTarget.dataset.product;


    this.setData({
      currentproduct: product,
    })
    this.showModal();

  },
  guizeiTipsClick: function() {
    wx.navigateTo({

      url: './dispatchingRule/dispatchingRule',
    })
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


    // wx.navigateBack();
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
  addProudctAction: function(event) {
    var that = this;
    var product = event.currentTarget.dataset.product;

    var amount = 0;
    var produncts = this.data.chooseproducts;
    var ishave = false;
    var newproductList = [];
    for (var i = 0; i < produncts.length; i++) {
      var tempProdunctDic = produncts[i];
      if (tempProdunctDic.id == product.id) {
        tempProdunctDic.numbers++;
        amount = tempProdunctDic.numbers;
        ishave = true;
      }
      newproductList.push(tempProdunctDic);
    }
    if (!ishave) {

      product.numbers = 1;
      amount = 1;
      newproductList.push(product);

    }
    var productInfos = [];
    for (var i = 0; i < newproductList.length; i++) {
      var newDic = {};
      newDic.id = newproductList[i].id;
      newDic.amount = newproductList[i].numbers;
      productInfos.push(newDic);
    }

    var merchantId = that.data.merchantInfo.id;
    var totalPrice = parseFloat(product.salePrice) * parseInt(amount);
    var productInfosJson = JSON.stringify(productInfos);
    console.log(that.data.partnerId);
    that.setData({
      chooseproducts: newproductList
    })

    this.hideModal();

  },
  onChange: function(event) {
    var that = this;
    var product = event.currentTarget.dataset.product;
    var produncts = this.data.chooseproducts;
    var newproductList = [];
    var amount = event.detail;
    if (amount == '') {
      amount = 0;
    }
    for (var i = 0; i < produncts.length; i++) {
      var tempProdunctDic = produncts[i];
      if (tempProdunctDic.id == product.id) {
        tempProdunctDic.numbers = amount;
      }
      newproductList.push(tempProdunctDic);
    }
    var merchantId = that.data.merchantInfo.id;
    var totalPrice = parseFloat(product.salePrice) * parseInt(amount);

    var productInfos = [];
    for (var i = 0; i < newproductList.length; i++) {
      var newDic = {};
      newDic.id = newproductList[i].id;
      newDic.amount = newproductList[i].numbers;
      productInfos.push(newDic);
    }
    var productInfosJson = JSON.stringify(productInfos);

    that.setData({
      chooseproducts: newproductList
    })






  },
  gowucheAction: function() {

    var that = this;

    var productInfos = [];
    for (var i = 0; i < that.data.chooseproducts.length; i++) {
      var newDic = {};
      newDic.id = that.data.chooseproducts[i].id;
      newDic.amount = that.data.chooseproducts[i].numbers;
      productInfos.push(newDic);
    }
    var productInfosJson = JSON.stringify(productInfos);

    wx.request({
      url: serverUrl.serverUrl + 'mini/partner/submitMultiTrade',
      data: {
        token: wx.getStorageSync('token'),
        initiatorUserId: that.data.initiatorUserId,
        partnerId: that.data.partnerId,
        multiTradeId: that.data.multiTradeId,
        productInfos: productInfosJson
      },
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      method: 'POST',
      success: function(res) {
        if (res.data.status == "200") {
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2]; //上一个页面
          var tureproductList = [];
          var totalPrice = 0;
          for (var i = 0; i < that.data.chooseproducts.length; i++) {
            var product = that.data.chooseproducts[i];
            totalPrice = totalPrice + parseFloat(product.salePrice) * parseInt(product.numbers);

            if (product.numbers > 0) {
              tureproductList.push(product);
            }
          }
          var mychooseProudct = tureproductList;
          if (that.data.iscanyu != '1') {
            prevPage.setData({
              mychooseProudct: mychooseProudct,
              totalPrice: totalPrice
            })
          }
          //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
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



  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  morePersonClick() {
    wx.navigateTo({
      url: './MorePersonSubmitOrder/index',
    })
  },
  shopCartClick() {

    var tureproductList = [];
    for (var i = 0; i < this.data.chooseproducts.length; i++) {
      var product = this.data.chooseproducts[i];
      if (product.numbers > 0) {
        tureproductList.push(product);
      }
    }

    if (tureproductList.length == 0) {
      wx.showToast({
        title: '请选择你要够买产品',
      })
    } else {
      var isziqu = 1;
      if (this.data.activeIndex == 0) {
        isziqu = 0;
      }
      var partnerId = this.data.partnerInfo.partnerId;

      var productListJson = JSON.stringify(tureproductList);
      var merchantId = this.data.merchantInfo.id;

      wx.navigateTo({
        url: './ShopCart/index?productListJson=' + productListJson + '&isZiqu=' + isziqu + '&partnerId=' + partnerId + '&merchantId=' + merchantId,
      })
    }

  }
})