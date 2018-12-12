var serverUrl = 'https://wxmp.clicksdiy.com/'
// var serverUrl = 'http://101.200.156.70:9091/'

function logoutAction(res){
  console.log(res,5555555)
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