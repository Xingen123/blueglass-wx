var serverUrl = require('../../utils/url.js');
var bmap = require('../../utils/bmap-wx.min.js');
var app = getApp()

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
    shareImg: "https://wxmp.clicksdiy.com/makeup/pbag/4.png?" + Math.random(),
    partnerID: '',
    ldata: false,
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
    chooseproducts:[],
    wd:0,
    jd:0,
    addressInfodetail:{},
    // isIphoneX: app.globalData.isIphoneX ? true : false,
    backgroundIVs:[],
    totalAmount:0,
    optionsArr:{}
  },
  addAddressGoto: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '../OrderPage/positionShop/index?latitude=' + e.currentTarget.dataset.latitude + "&longitude=" + e.currentTarget.dataset.longitude + "&id=" + e.currentTarget.dataset.id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options,"ssss")
    this.setData({
      optionsArr: options,
      partnerID: options.partnerId
    })
    console.log(options.partnerId)
    if (options.shareiv){
      var shareiv = options.shareiv;
      this.setData({
        shareiv: shareiv
      })
    }

    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res)
        var latitude = res.latitude
        var longitude = res.longitude
        that.setData({
          wd: latitude,
          jd: longitude,
          ldata: false
        })
        let parId = options.partnerId
        that.requestNetWork(parId,latitude,longitude);
      },
      fail: function (res) {
        console.log(res, '定位真不准啊')
        that.setData({
          ldata: true
        })
      }
    })
  },
  shareParekt() {
    wx.navigateTo({
      url: '../MePage/sharePacket',
    })
  },
  handler: function (e) {
    var that = this;
    if (!e.detail.authSetting['scope.userLocation']) 
    {
      that.setData({
        ldata: true
      })
    }
    else 
    {
      that.setData({
        ldata: false,
      })

      setTimeout(function () {
        wx.getLocation({
          type: 'wgs84',
          success: function (res) {
            var latitude = res.latitude
            var longitude = res.longitude
            that.setData({
              wd: latitude,
              jd: longitude
            })
            that.requestNetWork(that.data.partnerID, latitude, longitude);
          },
          fail: function (res) {
          }
        })
      }, 500)
    }
  },
  requestNetWork(parId,latitude,longitude) {
    var that = this;
    console.log(parId,latitude,longitude,"aiyou")
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: serverUrl.serverUrl + 'mini/partner/recommendOrder',
      data: {
        token: wx.getStorageSync('token'),
        longitude: longitude,
        latitude: latitude,
        partnerId: parId
      },
      method: 'GET',
      success: function(res) {
        console.log(res)
        wx.hideLoading();
        serverUrl.logoutAction(res)

        that.setData({
          partnerInfo: res.data.data.partnerInfo,
          backgroundIVs: res.data.data.background,
          categoryList: res.data.data.myProducts,
          merchantInfo: res.data.data.merchantInfo,
          shipment: res.data.data.shipment,
          partnerId: parId

        });
        if(that.data.categoryList)
        {
          var categoryList = that.data.categoryList;
          for (var i = 0; i < categoryList.length;i++)
          {
            var isallNotHave = true; 
            for (var k = 0; k < categoryList[i].productDIYList.length;k++)
            {
              if (categoryList[i].productDIYList[k].products)
              {
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
        var chooseproducts= [];
        for (var i = 0; i < that.data.categoryList.length;i++)
        {
          if (that.data.categoryList[i].productDIYList)
          {
            for (var j = 0; j < that.data.categoryList[i].productDIYList.length; j++) {
              if (that.data.categoryList[i].productDIYList[j].products)
               {
              for (var k = 0; k < that.data.categoryList[i].productDIYList[j].products.length; k++) 
              {
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
        var partnerId = that.data.partnerId;
        wx.request({
          url: serverUrl.serverUrl + 'mini/partner/viewShoppingCart?token=' + wx.getStorageSync('token') + '&partnerId=' + partnerId,
          data: {},
          method: 'GET',
          success: function (res) 
          {
            var shoppingCartData = [];
            if (res.data.data.shoppingCartData)
            {
              shoppingCartData = res.data.data.shoppingCartData;
            }

            var chooseproducts = that.data.chooseproducts;

            for (var i= 0;i<shoppingCartData.length;i++)
            {
              var mydic = shoppingCartData[i];

              for (var k = 0; k < chooseproducts.length; k++) {
                if (mydic.productId == chooseproducts[k].id) {
                  chooseproducts[k].numbers = mydic.amount;
                }
              }
            }
            console.log(shoppingCartData);

            console.log(chooseproducts);

            that.setData({
              chooseproducts: chooseproducts
            });

            var tureproductList = [];
            var totalAmount = 0;
            for (var i = 0; i < that.data.chooseproducts.length; i++) {
              var product = that.data.chooseproducts[i];
              if (product.numbers > 0) {
                tureproductList.push(product);
                totalAmount += product.numbers;
              }
            }
            that.setData({
              tureproductList: tureproductList,
              totalAmount:totalAmount
            })
            console.log(that.data.chooseproducts);
            console.log(that.data.tureproductList);

            wx.request({
              url: serverUrl.serverUrl + 'mini/partner/addressList',
              method: 'POST',
              header: {
                //设置参数内容类型为x-www-form-urlencoded
                'content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
              },
              data: {
                token: wx.getStorageSync('token')
              },
              success: function (res) {
                var data = res.data
                if (data.status == "200") {
                
                  if (data.data.myAddressInfos)
                  {
                    wx.showLoading({
                      title: '正在加载',
                    })
                    wx.request({
                      url: serverUrl.serverUrl + 'mini/partner/checkExpress',
                      method: 'POST',
                      header: {
                        //设置参数内容类型为x-www-form-urlencoded
                        'content-type': 'application/x-www-form-urlencoded',
                        'Accept': 'application/json'
                      },
                      data: {
                        token: wx.getStorageSync('token'),
                        address: data.data.myAddressInfos[0].addressId
                      },
                      success: function (myres) {
                        wx.hideLoading();

                        var mydata = myres.data
                        if (mydata.status == "200") {
                          that.setData({
                            addressInfo: data.data.myAddressInfos
                          });
                          that.setData({
                            addressInfodetail: data.data.myAddressInfos[0]
                          });
                        } else 
                        {
                          wx.hideLoading();
                          wx.showToast({
                            title: myres.data.errorMsg,
                            icon: 'none',
                            duration: 2000
                          })
                        }
                      }
                    })


                   
                  }
                  
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
          fail: function (res) {
            wx.hideLoading();
            wx.showToast({
              title: '网络错误，请稍后重试',
              icon: 'none',
            })
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
  addAddressAction:function()
  {
    wx.navigateTo({
      url: '../MePage/editAddress?isChoose=1',
    })
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
    // var query = wx.createSelectorQuery();
    // query.select(typeStr).boundingClientRect();
    // query.exec(function(res) {
      //res就是 所有标签为mjltest的元素的信息 的数组
            //取高度
      // that.setData({
      //   clientHeight: res[0].height + 80
      // })
    // })
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
  chooseProdunctAction: function (event) {
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
    var that = this;

    var modifyInfo = wx.getStorageSync('merchantInfo');
    if (modifyInfo) {
      that.setData({
        merchantInfo: {
          id: modifyInfo.id,
          shortName: modifyInfo.shortName,
          location: modifyInfo.businessAddress
        }
      });
      wx.removeStorageSync('merchantInfo');
    }
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
  addProudctAction:function(event)
  {
    var that = this;
    var product = event.currentTarget.dataset.product;

    var amount = 0;
    var produncts = this.data.chooseproducts;
    var ishave = false;
    var newproductList = [];
    for(var i = 0 ;i<produncts.length;i++)
    {
      var tempProdunctDic = produncts[i];
      if (tempProdunctDic.id == product.id)
      {
        tempProdunctDic.numbers++;
        amount = tempProdunctDic.numbers;
        ishave = true;
      }
      newproductList.push(tempProdunctDic);
    }
    if(!ishave)
    {
      product.numbers = 1;
      amount = 1;
      newproductList.push(product);
    }

    var merchantId = that.data.merchantInfo.id;
    var totalPrice = parseFloat(product.salePrice) * parseInt(amount);
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: serverUrl.serverUrl + 'mini/partner/addShoppingCart?isMulti=0&token=' + wx.getStorageSync('token') + '&merchantId=' + merchantId + '&partnerProductId=' + product.id + '&totalPrice=' + totalPrice + '&amount=' + amount,
      data: {},
      method: 'GET',
      success: function (res) {
        wx.hideLoading();
        console.log(newproductList);
        that.setData({
          chooseproducts: newproductList
        })
        var tureproductList = [];
        var totalAmount = 0;
        for (var i = 0; i < that.data.chooseproducts.length; i++) {
          var product = that.data.chooseproducts[i];
          if (product.numbers > 0) {
            tureproductList.push(product);
            totalAmount += product.numbers;
          }
        }      
        that.setData({
          tureproductList: tureproductList,
          totalAmount: totalAmount
        })
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showToast({
          title: '网络错误，请稍后重试',
          icon: 'none',
        })
      }
    });

    this.hideModal();

  },
  onChange: function (event)
  {
    var that =this;
    var product = event.currentTarget.dataset.product;
    var produncts = this.data.chooseproducts;
    var newproductList = [];
    var amount = event.detail;
    if (amount == '') {
      amount = 0;
    }
    for (var i = 0; i < produncts.length; i++) {
      var tempProdunctDic = produncts[i];
      if (tempProdunctDic.id == product.id) 
      {
        tempProdunctDic.numbers = amount;
      }
      newproductList.push(tempProdunctDic);
    }
    var merchantId = that.data.merchantInfo.id;
    var totalPrice = parseFloat(product.salePrice) * parseInt(amount);
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: serverUrl.serverUrl + 'mini/partner/addShoppingCart?isMulti=0&token=' + wx.getStorageSync('token') +'&merchantId=' + merchantId + '&partnerProductId=' + product.id + '&totalPrice=' + totalPrice + '&amount=' + amount,
      data: {
      },
      method: 'GET',
      success: function (res) 
      {
        wx.hideLoading();
        that.setData({
          chooseproducts: newproductList
        })

        var tureproductList = [];
        var totalAmount = 0;
        for (var i = 0; i < that.data.chooseproducts.length; i++) {
          var product = that.data.chooseproducts[i];
          if (product.numbers > 0) {
            tureproductList.push(product);
            totalAmount += product.numbers;
          }
        } 
        that.setData({
          tureproductList: tureproductList,
          totalAmount:totalAmount
        })
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function(e) {
    console.log(this.data.optionsArr)
    return {
      title: this.data.optionsArr.shopName + ":酸奶店里走一走,不买不是好朋友!",
      imageUrl: this.data.optionsArr.shareiv,
      success: function () {

      }
    }
  },
  morePersonClick(e) {
    var that = this;
    let icon = e.currentTarget.dataset.icon
    let nickName = e.currentTarget.dataset.nickname
    let partnerId = this.data.partnerId
    wx.navigateTo({
      url: './ShopCartMorePerson/index?icon=' + icon + '&nickName=' + nickName + "&partnerId=" + partnerId + '&shareiv=' + that.data.shareiv,
    })
  },
  shopCartClick() {
    var that = this;

    var tureproductList = [];
    for(var i=0;i<this.data.chooseproducts.length;i++)
    {
      var product = this.data.chooseproducts[i];
      if (product.numbers>0)
      {
        tureproductList.push(product);
      }
    }
    var isziqu = 1;
    if (this.data.activeIndex == 0) {

      isziqu = 0;
    }
    else

    {
      if (!this.data.addressInfodetail.addressId)
      {
        wx.showToast({
          title: '请选择地址',
          icon: 'none',
        })

        return;
      }
    }
    if (tureproductList.length==0)
     {
      wx.showToast({
        title: '请选择产品',
        icon: 'none',
      })

      return;
    }

    var partnerId = this.data.partnerId;

    var productListJson = JSON.stringify(tureproductList);
    var merchantId = this.data.merchantInfo.id;
    var addressId = '0';
    if (this.data.addressInfodetail) {
      addressId = this.data.addressInfodetail.addressId;
    }


    var addressInfodetailJson = JSON.stringify(this.data.addressInfodetail);

    wx.navigateTo({
      url: './ShopCart/index?productListJson=' + productListJson + '&isZiqu=' + isziqu + '&partnerId=' + partnerId + '&merchantId=' + merchantId + '&addressId=' + addressId + '&location=' + this.data.merchantInfo.location + '&shortName=' + this.data.merchantInfo.shortName + "&addressInfodetail=" + addressInfodetailJson
,
    })


  }
})