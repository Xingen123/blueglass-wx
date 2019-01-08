var serverUrl = require('../../../utils/url.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {

    imgUrls: [

    ],
    indicatorDots: true,
    indicatorColor: '#D8D8D8',
    indicatorActiveColor: '#9B9B9B',
    circular: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    // previousMargin: "30rpx",
    // nextMargin: "40rpx",
    // tabs: tabs, //展示的数据
    currentTab: 0,
    ak: "3cmQZvu49EvgdePdyf6oZ0n335aHQCOU",
    expNum: '',
    ldata: false,
    defaultScrollImg: "../../images/default/690-460.png", //默认图片
    typeBgDefaultImg: "../../images/default/180-120.png", //默认图片
    canIUse: false,
    token: wx.getStorageSync('token'),
    backgroundIVs: [],
    showView: false,
     product:{},
    canvasHidden: true,     //设置画板的显示与隐藏，画板不隐藏会影响页面正常显示
    avatarUrl: '',         //用户头像
    nickName: '',          //用户昵称
    wxappName: '',    //小程序名称
    shareImgPath: '',
    screenWidth: '',       //设备屏幕宽度
    name:'',
    icon:'',
    salesAmount:'',
    productIdIndex:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this

    showView: (options.showView == "true" ? true : false),
      //获取用户设备信息，屏幕宽度
      wx.getSystemInfo({
        success: res => {
          that.setData({
            screenWidth: res.screenWidth
          })
          console.log(that.data.screenWidth)
        }
      })
  },

  shareProduct(e) {
    console.log(e)
    this.setData({
      showView: (!this.data.showView),
      // nickname: e.currentTarget.dataset.nickname,
      // headpath: e.currentTarget.dataset.headpath,
      // name: e.currentTarget.dataset.product.name,
      // shareicon: e.currentTarget.dataset.product.icon,
      // salesAmount: e.currentTarget.dataset.product.salesAmount
    })
    let fuDai = e.currentTarget.dataset.product.isLucky == "true" ? "https://clickvideo.oss-cn-beijing.aliyuncs.com/blueglass/acf3cc74-48ba-43c6-a653-b04b3b4e2f5f.png" : e.currentTarget.dataset.product.icon;
    let productSession = {
      name: e.currentTarget.dataset.product.name,
      nickname: e.currentTarget.dataset.nickname,
      headpath: e.currentTarget.dataset.headpath,
      shareicon: e.currentTarget.dataset.product.icon,
      salesAmount: e.currentTarget.dataset.product.salesAmount,
      backgournd: fuDai,
      glassType: e.currentTarget.dataset.product.type,
      isLucky: e.currentTarget.dataset.product.isLucky,
      glassIcon: e.currentTarget.dataset.product.glassIcon,
      partnerId: e.currentTarget.dataset.partnerid,
      ewmurl: "pages / ShopPage / shareMyShop / index ? partnerid = " + e.currentTarget.dataset.product.partnerId,
    }
    wx.setStorageSync('productSession', productSession);
  },
  mark_dialog() {
    this.setData({
      showView: false
    })
  },
  goShopIndex(){
    console.log(this.data.productIdIndex)
      wx.navigateTo({
      // //   url: '../index?partnerId=' + e.currentTarget.dataset.partnerid + '&shareiv=' + e.currentTarget.dataset.shareiv + '&shopName=' + e.currentTarget.dataset.shopname
        url: '../../RecomandPage/index?partnerId=' + this.data.productIdIndex
      })
  },
  // 分享海报
  sharePoster(e){
    console.log(e)
    this.setData({
      showView: false
    })
    // let productSession={
    //   name: e.currentTarget.dataset.product.name ,
    //   nickname:e.currentTarget.dataset.nickname,
    //   headpath: e.currentTarget.dataset.headpath,
    //   shareicon: e.currentTarget.dataset.product.icon ,
    //   salesAmount: e.currentTarget.dataset.product.salesAmount,
    //   backgournd: e.currentTarget.dataset.product.backgournd,
    //   glassType: e.currentTarget.dataset.product.type,
    //   glassIcon: e.currentTarget.dataset.product.glassIcon,
    //   partnerId: e.currentTarget.dataset.partnerid,
    //   ewmurl: "pages / ShopPage / shareMyShop / index ? partnerid = " + e.currentTarget.dataset.product.partnerId,
    // }
    // wx.setStorageSync('productSession', productSession);

    wx.navigateTo({
      url: '../shareShopHOme/index'
    })
  },
  requestNetWork: function() {
    var that = this;

    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: serverUrl.serverUrl + 'mini/partner/getMyShopMenu?token=' + wx.getStorageSync('token'),
      data: {},
      method: 'GET',
      success: function(res) {
        wx.hideLoading();
        serverUrl.logoutAction(res)
        console.log(res.data.data.partnerId)
        if (res.data.status == 200) {
          that.setData({
            icon: res.data.data.icon,
            nickname: res.data.data.nickName,
            salesVolume: res.data.data.salesVolume,
            shopLevel: res.data.data.shopLevel,
            backgroundIVs: res.data.data.background,
            categoryList: res.data.data.myProducts,
            productIdIndex: res.data.data.partnerId
          });
          var currentDIYList = [];

          for (var i = 0; i < that.data.categoryList.length; i++) {
            var currentDIY = that.data.categoryList[i];

            var currentproducts = currentDIY.productDIYList[0];

            currentproducts.chooseIndex = 0;

            currentDIYList.push(currentproducts);
          }
          that.setData({
            currentProducts: currentDIYList
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
  editAction: function() {
    wx.navigateTo({

      url: '../MyProductlibrary/index',
    })
  },

  choosetheDIY: function(event) {
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

    that.setData({
      currentProducts: currentDIYList

    })


  },

  addImageAction: function() {
    var backgroundIVs = this.data.backgroundIVs;

    var backgroundIVsJson = JSON.stringify(backgroundIVs);

    wx.navigateTo({

      url: '../UpLoadImages/index?backgroundIVsJson=' + backgroundIVsJson,
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

    that.requestNetWork();

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
  onShareAppMessage: function(res) {
    var that = this;
   
    if (res.from == 'button') {
      let product = wx.getStorageSync('productSession');
      console.log(product)
      var isLucky = product.isLucky == "true" ? "../../../Images/shop/fudai.png" : product.shareicon;
      
      
      return {
        
        title: product.name + '：这杯酸奶有魔力，喝了1秒变仙女！',
        path: '/pages/RecomandPage/index?shopName=' + product.nickname + '&partnerId=' + product.partnerId, 
        desc: '',
        imageUrl: isLucky,
        success(res) {
          console.log(res)
        },
        fail(err) {
          console.log(err)
          if (res.errMsg == 'shareAppMessage:fail cancel') {// 用户取消转发
            this.setData({
              showView: false
            })
          } else if (res.errMsg == 'shareAppMessage:fail') {　　　　　　　　 // 转发失败，其中 detail message 为详细失败信息
          }
         
        },
        complete(data) {
          console.log(data)
        }
      };
    }
  },
})