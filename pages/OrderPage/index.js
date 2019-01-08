var serverUrl = require('../../utils/url.js');
import drawQrcode from '../../utils/weapp.qrcode.js' 


var tabs = [{
  name: "未付款"
},
{
  name: "进行中"
},
{
  name: "已完成"
}
];
Page({
  

  /**
   * 页面的初始数据
   */  
  data: {
    imgUrls: [
    ],
    indicatorDots: true,
    indicatorColor: 'rgba(255, 255, 255, 0.8)',
    indicatorActiveColor: '#0082bf',
    circular: true,
    autoplay: true, 
    interval: 5000,
    duration: 1000,
    navScrollLeft: 0,
    currentTab: 0,
    currentType: 0,
    tabs: tabs, //展示的数据
    slideOffset: 0, //指示器每次移动的距离
    activeIndex: 0, //当前展示的Tab项索引
    sliderWidth: 96, //指示器的宽度,计算得到
    contentHeight: 0, //页面除去头部Tabbar后，内容区的总高度，计算得到
    clientHeight: 400,
    // token: wx.getStorageSync("token"),
    defaultScrollImg: "../../images/default/690-460.png", //默认图片
  },

  /**
   * 生命周期函数--监听页面加载
   */
  requestNetWork: function (taptype) {
    var that = this;

    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: serverUrl.serverUrl + 'mini/partner/queryOrdersByStatus?token=' + wx.getStorageSync('token') + '&pageNum=1'  + '&status=' + taptype,
      data: {},
      method: 'GET',
      success: function (res) {
        wx.hideLoading();
        serverUrl.logoutAction(res)

        if (res.data.status == 200) {
          if (taptype == 'WAIT_PAY') {
            that.setData({
              collagingOrderlist: res.data.data,

            });


          } else if (taptype == 'PROCESSING') {
            that.setData({
              underWayOrderlist: res.data.data,

            })
          } else if (taptype == 'COMPLETED') {
            that.setData({
              completeOrderlist: res.data.data,

            })
          }
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
          query.exec(function (res) {
            //res就是 所有标签为mjltest的元素的信息 的数组
            console.log(res);
            //取高度
            // console.log(res[0].height);
            if (!res[0]) {
              that.setData({
                clientHeight: 400
              })
            } else {
              that.setData({
                clientHeight: res[0].height + 80
              })
            }
          })

        } else {
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
  },

  onLoad: function (options) {
    var that = this;

    var istype = options.istype;
    console.log(options);
    if(istype)
    {
      if(istype==2)
      {
        that.setData({
          currentTab: 1,
          currentType: 1,
          activeIndex: 1 
        })
      }
      else{
        that.setData({
          currentTab: 0,
          currentType: 0,
          activeIndex: 0
        })
      }
    }
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          //计算相关宽度
          clientHeight: res.windowHeight,
          sliderWidth: res.windowWidth / that.data.tabs.length,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
          contentHeight: res.windowHeight - res.windowWidth // 750 * 68 //计算内容区高度，rpx -> px计算
        });
      }
    });
    // that.requestNetWork('underWay');
    // that.requestNetWork('complete');

  },
  bindChange: function (e) {
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
    query.exec(function (res) {
      //res就是 所有标签为mjltest的元素的信息 的数组
      console.log(res);
      //取高度
      if (!res[0]) {
        that.setData({
          clientHeight: 400
        })
      } else {
        that.setData({
          clientHeight: res[0].height + 80
        })
      }
    })
  },

  navTabClick: function (e) {

    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
    });


  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // wx.navigateTo({
    //   url: './WaitingOrderDetail/WaitingOrderDetail',
    // })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    // this.setData({
    //   token: wx.getStorageSync('token')
    // })
    // that.requestNetWork('collaging');
    // that.requestNetWork('underWay');
    // that.requestNetWork('complete');

    that.requestNetWork('WAIT_PAY');
    that.requestNetWork('PROCESSING');
    that.requestNetWork('COMPLETED');

  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.timer);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // wx.reLaunch({
    //   url: '../../../pages/OrderPage/index',
    // })
  },
  goParenterAction: function (event) {
    console.log(event);

    var partnerid = event.target.dataset.partnerid;
    wx.navigateTo({
      url: '../ShopPage/shareMyShop/index?partnerid=' + partnerid,
    })
  },
  shouErweiMa: function(event)
  {
    console.log(event);
    this.showModal();

    var orderId =event.target.dataset.orderid;
    this.setData
    (
      {
          currentOrderId: orderId
      }
    )
    drawQrcode({
      width: 193, //二维码宽高,宽高要与canvas标签宽高一致
      height: 193,
      canvasId: 'myQrcode',
      text: orderId //二维码内容
    })
  },
  // 显示对话框 
  showModal: function () {
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
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框 
  hideModal: function () {
    // 隐藏遮罩层 
    wx.reLaunch({
      url: '/pages/OrderPage/index?istype=2',
    })

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
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })

    }.bind(this), 200)
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
  // onShareAppMessage: function (res) {
  //   if (res.from == "button") {
  //     //分享为按键中的求助即id=1

  //     var collagingOrderlist = this.data.collagingOrderlist;　　　　　　　 //将图片列表数据绑定到变量
  //     var orderInfo = collagingOrderlist[res.target.id];

  //       return {
  //         title: orderInfo.recommendTitle,
  //         path: 'pages/uclickSecTab/share/index?orderId=' + orderInfo.orderId,
  //         desc: '邀请体验',
  //         imageUrl: orderInfo.orderImgUrl,
  //         success: function (res) {
  //           if (this.data.savedId === orderInfo.orderId) {
  //             return;
  //           }

  //           this.saveData().then(() => {
  //             this.setData({
  //               savedId: orderInfo.orderId
  //             });
  //             // todo 如果跳转到其他页面，删除this.data.id
  //           });
  //         }
  //       };

  //   }

  // },
  /**
   * 进行中
   */
  // collage: function (event) {
  //   var orderId = event.currentTarget.dataset.orderid;

  //   wx.navigateTo({
  //     url: '../collageDetail/index?orderId=' + orderId,
  //   })
  // },
  // HaveInHand: function (event) {
  //   var orderId = event.currentTarget.dataset.orderid;

  //   wx.navigateTo({
  //     url: '../haveInHand/index?orderId=' + orderId,
  //   })
  // },
  // finishDetail: function (event) {
  //   var orderId = event.currentTarget.dataset.orderid;







  //   wx.navigateTo({
  //     url: '../finishDetail/index?orderId=' + orderId,
  //   })
  // },
  noPayListViewAction(event){
  // 跳转未付款订单详情页面
    // wx.navigateTo({
    //   url: './UnpaidOrderDetail/index'
    // })
    var orderId = event.currentTarget.dataset.orderid;
    var orderType = event.currentTarget.dataset.type;
    wx.navigateTo({
      url: './UnpaidOrderDetail/index?orderId=' + orderId + "&orderType=" + orderType,
    })
  },
  underWayListViewAction(event) {
    // 跳转未付款订单详情页面
    // wx.navigateTo({
    //   url: './UnpaidOrderDetail/index'
    // })
    var orderId = event.currentTarget.dataset.orderid;
    var orderType = event.currentTarget.dataset.type;
    var orderstatus = event.currentTarget.dataset.orderstatus;
    console.log(event.currentTarget.dataset)
    if (orderType != '外卖订单') {
      
      wx.navigateTo({
        url: './PurchaseOrder/index?orderId=' + orderId
      })
    }
    else {
     
      if (orderstatus == '支付完成') {
        wx.navigateTo({
          url: './DistributionOrderDetail/index?orderId=' + orderId,
        })
      }
      else {
        wx.navigateTo({
          url: './DistributionOrderDetail/index?orderId=' + orderId,
        })
      }
     
    }
  },
  finishListViewAction(event) {
    // 跳转未付款订单详情页面
    // wx.navigateTo({
    //   url: './UnpaidOrderDetail/index'
    // })
    var orderId = event.currentTarget.dataset.orderid;
    var orderType = event.currentTarget.dataset.type;
    wx.navigateTo({
      url: './FinishOrder/index?orderId=' + orderId,
    })
    // if (orderType != '外卖订单') {
    //   wx.navigateTo({
    //     url: './PurchaseOrder/index?orderId=' + orderId
    //   })
    // }
    // else {
     
    // }
  },

})