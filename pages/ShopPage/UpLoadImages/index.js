var serverUrl = require('../../../utils/url.js');
import Dialog from '../../../dist/dialog/dialog';

//index.js
//获取应用实例
var app = getApp();
var x, y, x1, y1, x2, y2, index, currindex, n, yy;

//多张图片上传

var app = getApp();
Page({
  data: {
    mainx: 0,
    content: [],
    moveStatus:1,
    start: {
      x: 0,
      y: 0
    }
  },

  addImageAction: function () {
    var that = this;
    console.log(that.data.content.length);
    wx.chooseImage({
      count: 6 - that.data.content.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        // const tempFilePaths = res.tempFilePaths;
        var imgsrc = res.tempFilePaths[0];
        console.log(imgsrc,"这是图片路径")
        wx.redirectTo({
          url: `../../Upload/upload?src=${imgsrc}`
        })
        
        // var pics =[];
        // pics = pics.concat(imgsrc);
        // that.setData({
        //   pics: pics
        // });
        
      }
    })
  },

  movestart: function(e) {
    console.log('movestart');

    currindex = e.target.dataset.index;
    x = e.touches[0].clientX;
    y = e.touches[0].clientY;
    x1 = e.currentTarget.offsetLeft;
    y1 = e.currentTarget.offsetTop;
    this.setData({
      moveStatus: 1,

    })
  },
  move: function(e) {
    this.setData({
      moveStatus: 2,

    })

    yy = e.currentTarget.offsetTop;
    x2 = e.touches[0].clientX - x + x1;
    y2 = e.touches[0].clientY - y + y1;


    this.setData({
      mainx: currindex,
      opacity: 0.7,
      start: {
        x: x2,
        y: y2
      }
    })
  },
  // imgUpload(){

  // },

  uploadimg: function (imgsrc) {//这里触发图片上传的方法
    // if (imgsrc){
      var pics = [];
      pics = pics.concat(imgsrc);
      this.setData({
        pics: pics
      });
    // }else
    // var picsData = this.data.pics;
    this.uploadimgss({
      url: serverUrl.serverUrl + "mini/partner/uploadMultiFile",//这里是你图片上传的接口
      path: pics//这里是选取的图片的地址数组
    });
  },
  onLoad: function (options) {
    console.log(options,"sss")
    if (options.avatar){
      this.uploadimg(options.avatar)

    }
  this.getnetWork();
  },
  getnetWork:function()
  {
    var that = this;
    wx.request({
      url: serverUrl.serverUrl + 'mini/partner/myBackground?token=' + wx.getStorageSync('token'),
      data: {},
      method: 'GET',
      success: function (res) {
        wx.hideLoading();
        serverUrl.logoutAction(res)

        if (res.data.status == 200) {

          var backgroundInfos = [];

          if (res.data.data.backgroundInfos) {
            backgroundInfos = res.data.data.backgroundInfos;
            console.log(backgroundInfos, "backgroundInfos");
            for(var i = 0; i < backgroundInfos.length; i++)
            {
              backgroundInfos[i].numbers = i+1;
            }
          }
          that.setData(
            {
              content: backgroundInfos
            });


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

  uploadimgss: function(data) {
    var that = this,
    i = data.i ? data.i : 0,//当前上传的哪张图片
    success = data.success ? data.success : 0,//上传成功的个数
    fail = data.fail ? data.fail : 0;//上传失败的个数
    console.log(data.url,data.path[i],wx.getStorageSync('token'),"这是uplodingIMG")
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'files',//这里根据自己的实际情况改
      formData: {
        'token': wx.getStorageSync('token'),
        'type': 'PARTNER_BACKGROUND'
      },//这里是上传图片时一起上传的数据
      success: (resp) => {
        success++;//图片上传成功，图片上传成功的变量+1
        console.log(resp)
        console.log(i);
        //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
      },
      fail: (res) => {
        fail++;//图片上传失败，图片上传失败的变量+1
        console.log('fail:' + i + "fail:" + fail);
      },
      complete: () => {
        console.log(i);
        i++;//这个图片执行完上传后，开始上传下一张
        if (i == data.path.length) {   //当图片传完时，停止调用          
          console.log('执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
          that.getnetWork();
        } else {//若图片还没有传完，则继续调用函数
          console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimgss(data);
        }

      }
    });
  },

  moveend: function() {
    var that = this;
    if(this.data.moveStatus==2)
    {
      this.setData({
        moveStatus: 3,

      })
      console.log('moveend');

      var arr = [];
      for (var i = 0; i < this.data.content.length; i++) {
        arr.push(this.data.content[i]);
      }
      var oldContentCount = this.data.content.length;
      n = 1;
      var width = wx.getSystemInfoSync().windowWidth;

      if (oldContentCount <= 3) {
        for (var k = 2; k <= oldContentCount; k++) {
          if (x2 >= (width / 3 * (k - 1)) / 2) {
            n = k;
          }
        }
        if (y2 >= ((width / 3) - 30)) {
          n = oldContentCount;
        }

      } else {
        if (y2 >= ((width / 3) + 10) / 2) {
          console.log("XXXXXXXXXX");

          n = 4;
          for (var k = 5; k <= oldContentCount; k++) {
            if (x2 >= (width / 3 * (k - 4)) / 2) {
              n = k;
            }
          }
        }
        else {
          console.log(n);
          for (var k = 2; k <= 3; k++) {
            if (x2 >= (width / 3 * (k - 1)) / 2) {
              n = k;
            }
          }
          console.log(n);

        }

      }
      var mycurrIcon = arr.splice((currindex - 1), 1);
      console.log(mycurrIcon);
      arr.splice((n - 1), 0, mycurrIcon[0]);

      for(var i = 0 ;i<arr.length;i++)
      {
        arr[i].numbers= i+1;
      }
      this.setData({
        mainx: "",
        content: arr,
        opacity: 1
      })

      let contentIVs = this.data.content;
      let fileSequence = [];
      for (let i = 0; i < contentIVs.length; i++) {
        let dic = contentIVs[i];
        let flie ={};
        flie.id = dic.id;
        flie.sequence = dic.numbers;
        fileSequence.push(flie);
      }
      var fileSequenceJson = JSON.stringify(fileSequence);

      wx.request({
        url: serverUrl.serverUrl + 'mini/partner/updateMulutiFile4Seq',
        data: {
          token: wx.getStorageSync('token'),
          fileSequence: fileSequenceJson,
        },
        header: {
          //设置参数内容类型为x-www-form-urlencoded
          'content-type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        method: 'POST',
        success: function (res) {

          if (res.data.status == 200) {
            that.getnetWork();
          }
          else {
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
    }

 
  },
  chooseImage:function(e)
  {
    var imageID = e.currentTarget.dataset.imageid;
    var content = this.data.content;
    for(var i= 0;i<content.length;i++)
    {
      if (imageID == content[i].id)
      {
        console.log('222222222');
        if (content[i].choose)
         {
          content[i].choose = false;
        }
        else 
        {
          content[i].choose = true;
        }
      }
      
    }
    this.setData({
      content:content
    })
    console.log(content);
  },
  longtapAction: function (e) {
    var that = this;
    var imageId = e.currentTarget.dataset.imageid;

    Dialog.confirm({
      title: '确认删除图片',
      message: '删除后，您需要重新上传图片'
    }).then(() => {
      wx.request({
        url: serverUrl.serverUrl + 'mini/partner/deleteMultiFile',
        data: {
          token: wx.getStorageSync('token'),
          // initiatorUserId: that.data.initiatorUser.id,
          imageId:imageId,
        },
        header: {
          //设置参数内容类型为x-www-form-urlencoded
          'content-type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        method: 'POST',
        success: function (res) {

          if (res.data.status == 200) {
            that.getnetWork();
          }
          else {
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
  DeleteAction:function()
  {

  }
})