// pages/ShopPage/addProduct/index.js
var serverUrl = require('../../../utils/url.js');
import Dialog from '../../../dist/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showView: false, // 购物车弹窗
    showView1: false, // 购物车弹窗
    showView2: false, // 购物车弹窗
    token: wx.getStorageSync('token'),
    curIndex: 0,
    curName: '',
    images: {},
    productProcess: [],
    productMaterials: [], //diy材料
    secondPriceeArr: [],
    firstPrice: '',
    firstimg: {},
    firsttitle: '',
    firstcomment: '',
    firstArr: [],
    firstMinimum: '',
    firstMaximum: "",
    materials: [], //管理每一份材料
    firstMaterials: [],
    secondMaterials: [],
    bzimages: [
      "../../../Images/shop/750-867.png",
      "../../../Images/shop/750-867.png",
      "../../../Images/shop/750-867.png",
    ],
    bg_images: [
      "../../../Images/shop/1@2x.png",
      "../../../Images/shop/2@2x.png",
      "../../../Images/shop/3@2x.png",
    ],
    options: {
      allPrice: "0",
      secondPrice: 0, //第二步价格
      secondimg: [
        // {
        //   "secondUrl": '../../../Images/shop/1.png',
        //   "secondName": "草莓",
        //   "secondComment": "",
        // },
      ],
    },
    outOfBounds: true,
    x: 30,
    y: 30,
    scale: true,
    scaleArea: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    showView: (options.showView == "0" ? false : true)
    this.getProductProcess()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // const ctx = wx.createCanvasContext('myCanvas')
    // ctx.setFillStyle('white')
    // // ctx.setGlobalAlpha(0)
    // ctx.fillRect(0, 0, 150, 310)
    // ctx.drawImage("../../../Images/shop/1@2x.png", 0, 0, 150, 310)
    // ctx.draw()
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

  },
  //加载DIY步骤
  getProductProcess(sequence) {
    let that = this;
    console.log(sequence)
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: serverUrl.serverUrl + 'mini/partner/getProductProcess',
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      data: {
        token: wx.getStorageSync('token'),
        productDIYId: "31757F8169BD40BBA9D5BDD9A553C917"
      },
      method: 'GET',
      success: function(res) {
        wx.hideLoading();
        serverUrl.logoutAction(res)

        let data = res.data
        if (data.status == 200) {
          console.log(data)
          console.log(data.data.productProcess.length)
          // curName:
          that.setData({
            productProcess: data.data.productProcess,
            firstMinimum: data.data.productProcess[0].minimum,
            firstMaximum: data.data.productProcess[0].maximum,
          })
          // for (var i = 0; i < data.data.productProcess.length;i++){
          //   var productMaterialsData = data.data.productProcess[i].productMaterials
          //   console.log(productMaterialsData)
          //   for (var j = 0; j < productMaterialsData.length; j++) {
          //     console.log(productMaterialsData[j])
          //     that.setData({
          //       productProcess: data.data.productProcess[i],
          //       productMaterials: productMaterialsData[j]
          //     })
          //   }
          // }

        } else {
          wx.showToast({
            title: data.errorMsg,
            icon: 'none',
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

  /*
   * 第一步购物车点击
   */
  //点击价格
  priceClick(e) {
    let _self = this;
    console.log(e)
    if (!_self.data.firsttitle) {
      return
    }
    _self.setData({
      showView: (!this.data.showView),
    })
  },
  shopSave(e) {
    let _self = this;
    console.log(e)
    _self.setData({
      showView: false,
    })
  },
  // 删除第一步购物车
  firstDel(e) {
    console.log(e)
    this.setData({
      firstPrice: 0,
      firstimg: {},
      firsttitle: '',
      showView: false,
      options: {
        allPrice: 0
      }
    })
  },
  /*
   * 第二步购物车下一步点击
   */
  secondpriceClick(e) {
    let _self = this;
    console.log(e)
    if (!_self.data.firsttitle) {
      return
    }
    _self.setData({
      showView: (!this.data.showView),
    })
  },
  secondNext(e) {
    let _self = this;
    console.log(e)
    console.log(_self.data.materials)
    if (!_self.data.options.secondimg || e.currentTarget.dataset.minimum > _self.data.options.secondimg.length) {
      wx.showToast({
        title: '最少添加' + e.currentTarget.dataset.minimum + '种原料',
        icon: 'none',
        duration: 2000
      })
      return
    } else {
      let getAllPrice = parseFloat(_self.data.options.allPrice)
      console.log(getAllPrice)
      _self.setData({
        curIndex: e.currentTarget.dataset.sequence,
        options: {
          allPrice: getAllPrice,
          secondimg: _self.data.secondPriceeArr
        }
      })
    }
  },
  secondDel(e) {
    let _self = this;
    let newSecondimg = [];
    let secondimg = _self.data.options.secondimg
    let materialid = e.currentTarget.dataset.materialid
    console.log(secondimg)
    if (e.currentTarget.dataset.sequence === 2) {
      for (let i = 0; i < secondimg.length; i++) {
        let item = secondimg[i]
        console.log(item)
        console.log(materialid)
        if (item.id != materialid) {
          newSecondimg.push(item);
          console.log(newSecondimg)
          _self.setData({
            options: {
              secondimg: newSecondimg
            }
          });
        }
      }
    }
  },
  /*
   * 第三步购物车下一步点击
   */
  thirdNext(e) {
    let _self = this;
    console.log(e)
    
    const ctx = wx.createCanvasContext('myCanvas')
    ctx.setFillStyle('white')
    // ctx.setGlobalAlpha(0)
    ctx.fillRect(0, 0, 150, 310)
    ctx.drawImage("../../../Images/shop/1@2x.png", 0, 0, 150, 310)
    ctx.draw()
    
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 150,
      height: 310,
      destWidth: 150,
      destHeight: 310,
      canvasId: 'myCanvas',
      success(res) {
        console.log(res.tempFilePath)
      }
    })
    // wx.getSetting({
    //   success(res) {
    //     console.log(res.authSetting)
    //     if (!res.authSetting['scope.writePhotosAlbum']) {
    //       wx.authorize({
    //         scope: 'scope.writePhotosAlbum',
    //         success() {
    //           console.log('授权成功')
    //           wx.saveImageToPhotosAlbum({
    //             success(res) {
    //               consolex.log(res)
    //             },
    //             fail(err) {
    //               console.log(err)
    //             },
    //             complete(err) {
    //               console.log(err)
    //             }
    //           })
    //         }
    //       })
    //     }
    //   }
    // })


    // if (!_self.data.options.secondimg || e.currentTarget.dataset.minimum > _self.data.options.secondimg.length) {
    //   wx.showToast({
    //     title: '最少添加' + e.currentTarget.dataset.minimum + '种原料',
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return
    // } else {
    //   let getAllPrice = parseFloat(_self.data.options.allPrice)
    //   console.log(getAllPrice)
    //   _self.setData({
    //     // curIndex: e.currentTarget.dataset.sequence,
    //     options: {
    //       allPrice: getAllPrice,

    //     }
    //   })
    _self.submitMyDecoration()

    // }
  },
  // 点击切换步骤
  stepsClick(e) {
    console.log(e)
    var _self = this;
    if (parseFloat(e.target.dataset.index) - parseFloat(_self.data.curIndex) > 1) {
      return
    } else {
      if (_self.data.curIndex == e.target.dataset.index) {
        return false;
      } else {
        if (e.target.dataset.index === 0) {
          _self.setData({
            curIndex: 0,
            firstPricee: _self.data.firstPricee,
            firstimg: _self.data.firstimg,
            options: {
              allPrice: 0,
            }
          })
        } else if (e.target.dataset.index === 1) { //第二步
          if (_self.data.firstimg.icon) {
            let getFirstPrice = parseFloat(_self.data.firstPricee)
            _self.setData({
              curIndex: 1,
              firstPrice: getFirstPrice,
              firstimg: {
                "icon": _self.data.firstimg.icon,
                "comment": _self.data.firstimg.comment
              },
              options: {
                allPrice: _self.data.firstPricee
              }
            });
          } else {
            wx.showToast({
              title: '请最少添加1种原料',
              icon: 'none',
              duration: 2000
            })
          }
        } else if (e.target.dataset.index === 2) {
          _self.setData({
            curIndex: 2
          })
        }
      }
    }
  },
  // 第一步点击水果
  fruitDiy(e) {
    console.log(e)
    let _self = this;
    // console.log(_self.data.options.secondimg)
    if ((e.currentTarget.dataset.minimum === e.currentTarget.dataset.maximum) && (e.currentTarget.dataset.maximum === 1)) {
      var firstObj = {},
        firstArr = []
      if (e.currentTarget.dataset.comment) {
        Dialog.alert({
          title: e.currentTarget.dataset.name,
          message: e.currentTarget.dataset.comment
        }).then(() => {

        })
      }
      firstObj.materialId = e.currentTarget.dataset.id
      firstObj.amount = 1
      firstObj.price = e.currentTarget.dataset.price
      _self.setData({
        firsttitle: e.currentTarget.dataset.name,
        firstcomment: e.currentTarget.dataset.comment,
        firstPrice: e.currentTarget.dataset.price,
        firstimg: {
          "icon": e.currentTarget.dataset.icon,
          "comment": e.currentTarget.dataset.comment
        },
        firstMaterials: firstObj,
        options: {
          allPrice: e.currentTarget.dataset.price,
        }
      });


      // for (let i = 0; i < firstArr.length;i++){
      //   if (firstArr[i].materialId.indexOf(e.currentTarget.dataset.id)>-1){
      //     firstObj.amount++
      //   }
      // }
      // firstArr.push(firstObj)

      // _self.data.firstMaterials.push(firstObj)

    } else if (e.currentTarget.dataset.sequence === 2) {
      // if (e.currentTarget.dataset.comment) {
      //   Dialog.alert({
      //     title: e.currentTarget.dataset.name,
      //     message: e.currentTarget.dataset.comment
      //   }).then(() => {

      //   })
      // }
      let secondPriceeObj = {},
        secondSubmitPriceObj = {},
        amount = 0,
        secondArr = []
      let getFirstPrice = parseFloat(_self.data.firstPricee)
      // console.log(getFirstPrice)

      secondPriceeObj.materialId = e.currentTarget.dataset.id;
      // secondSubmitPriceObj.amount = e.currentTarget.dataset.amount;
      // secondSubmitPriceObj.price = e.currentTarget.dataset.price;
      secondPriceeObj.id = e.currentTarget.dataset.id;
      secondPriceeObj.amount = 1;
      secondPriceeObj.price = e.currentTarget.dataset.price;
      secondPriceeObj.icon = e.currentTarget.dataset.icon;
      secondPriceeObj.name = e.currentTarget.dataset.name;
      secondPriceeObj.comment = e.currentTarget.dataset.comment;
      secondPriceeObj.productprocess = e.currentTarget.dataset.productprocess;
      secondPriceeObj.sequence = e.currentTarget.dataset.sequence;

      _self.data.secondPriceeArr.push(secondPriceeObj)


      // var secondArr = _self.uniq(_self.data.secondPriceeArr)

      // _self.data.materials.push(secondPriceeObj)
      // console.log(secondArr)

      // secondArr.push(secondPriceeObj)

      var secondArr = _self.data.secondPriceeArr
      console.log(secondArr.length)
      if (secondArr.length > e.currentTarget.dataset.maximum) {
        wx.showToast({
          title: '最多添加' + e.currentTarget.dataset.maximum + '种原料',
          icon: 'none',
          duration: 2000
        })
        return
      } else {
        var b = 0
        for (var i = 0; i < secondArr.length; i++) {
          // _self.data.secondPrice += secondArr[i].price

          // if (secondArr[i].id === e.currentTarget.dataset.id) {
          //   amount += secondArr[i].amount
          // }
          // console.log(secondArr[i])

          b += secondArr[i].price
          // console.log(b)
          // console.log('amount==='+amount)
        }
        var arr = [];
        for (var i = 0; i < _self.data.secondPriceeArr.length; i++) {
          // console.log(_self.data.secondPriceeArr[i])
          var a = false
          for (var j = 0; j < arr.length; j++) {
            if (_self.data.secondPriceeArr[i].id === arr[j].id) {
              // let price = _self.deepClone(_self.data.secondPriceeArr[i].price)
              arr[j].amount++
                // arr[j].price = arr[j].amount * price
                a = true
            }
          }
          if (!a) {
            let b = _self.deepClone(_self.data.secondPriceeArr[i])
            arr.push(b)
          }
        }
        console.log(arr)
        // _self.data.materials.push(arr)
        // console.log(_self.data.materials)
        _self.setData({
          secondMaterials: arr,
          options: {
            secondPrice: b + getFirstPrice,
            allPrice: getFirstPrice + b,
            secondimg: secondArr,
          }
        });
      }

    } else if (e.currentTarget.dataset.sequence === 3) {
      // if (e.currentTarget.dataset.comment) {
      //   Dialog.alert({
      //     title: e.currentTarget.dataset.name,
      //     message: e.currentTarget.dataset.comment
      //   }).then(() => {

      //   })
      // }
    }

    // firstObj.id = e.currentTarget.dataset.id;
    // firstObj.comment = e.currentTarget.dataset.comment;
    // firstObj.icon = e.currentTarget.dataset.icon;
    // firstObj.index = e.currentTarget.dataset.index;
    // firstObj.name = e.currentTarget.dataset.name;
    // firstObj.price = e.currentTarget.dataset.price;
    // firstObj.productprocess = e.currentTarget.dataset.productprocess;
    // _self.data.firstArr.push(firstObj)
    // var firstArray = _self.uniq(_self.data.firstArr)

    // let firstArray = _self.uniq(_self.data.firstArr.push(firstObj))
    // let FirstPrice = 0
    // for (let i = 0; i < firstArray.length; i++) {
    //   _self.data.firstPrice += firstArray[i].price
    //   FirstPrice += firstArray[i].price
    // }
    // console.log(firstArray)


  },
  // 点击第一个下一步
  Next(e) {
    let _self = this;
    console.log(e)
    // console.log(_self.data.options.allPrice)
    if (e.currentTarget.dataset.sequence === 1) {
      if (_self.data.firstimg.icon && e.currentTarget.dataset.maximum === e.currentTarget.dataset.maximum) {
        _self.setData({
          curIndex: e.currentTarget.dataset.sequence,
          firstPricee: _self.data.firstPrice,
          secondPriceeArr: [],

        })
      } else if (!_self.data.firstimg.icon) {
        wx.showToast({
          title: '请最少添加' + _self.data.firstMinimum + '种原料',
          icon: 'none',
          duration: 2000
        })
        return
      }
    }
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
        token: wx.getStorageSync('token'),
        name: "MY-PRODUCT",
        totalPrice: _self.data.options.allPrice,
        type: "fudai",
        productDIYId: "31757F8169BD40BBA9D5BDD9A553C917",
        materials: c,
      },
      method: 'GET',
      success: function(res) {
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
      fail: function(res) {
        wx.hideLoading();
        wx.showToast({
          title: '网络错误，请稍后重试',
          icon: 'none',
        })
      }
    });
  },
  // 数组去重
  uniq(array) {
    var temp = [];
    var index = [];
    var l = array.length;
    for (var i = 0; i < l; i++) {
      for (var j = i + 1; j < l; j++) {
        if (array[i].id === array[j].id) {
          i++;
          j = i;
        }

      }
      temp.push(array[i]);
      index.push(i);
    }
    console.log(index);
    return temp;
  },
  imageLoad: function(e) {
    var $width = e.detail.width, //获取图片真实宽度
      $height = e.detail.height,
      ratio = $width // $height; //图片的真实宽高比例
    var viewWidth = 100, //设置图片显示宽度，左右留有16rpx边距
      viewHeight = 100 // ratio; //计算的高度值
    var image = this.data.images;
    //将图片的datadata-index作为image对象的key,然后存储图片的宽高值
    image[e.target.dataset.index] = {
      width: viewWidth,
      height: viewHeight
    }
    this.setData({
      images: image
    })
  },
  deepClone(obj) {
    let _obj = JSON.stringify(obj),
      objClone = JSON.parse(_obj);
    return objClone
  }
})