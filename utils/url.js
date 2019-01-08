var serverUrl = 'https://wxmp.clicksdiy.com/'
// var serverUrl = 'http://101.200.156.70:9091/'
// 
// var serverUrl = 'http://101.200.242.162:9091/'
// var serverUrl = 'http://192.168.1.45:9087/'

function logoutAction(res){
  if (res.data.status == 401){
    wx.reLaunch({
      url: '/pages/LogIn/LogIn',
    })
    return;
  }
}

module.exports = {
  serverUrl: serverUrl,
  logoutAction: logoutAction
}