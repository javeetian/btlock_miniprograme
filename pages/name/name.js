const app = getApp()
Page({
  data: {
    inputText: '',
    name: '',
    connectedDeviceId: '',
    connected: false
  },
  change_name: function () {
    var that = this
    if (that.data.inputText) {
      app.globalData.deviceName = that.data.inputText
      wx.setStorage({
        key: 'deviceName',
        data: that.data.inputText,
      })
      wx.showToast({
        title: '修改成功',
        icon: 'success',
        duration: 1000
      })
    }
    else
      wx.showModal({
        title: '提示',
        content: '名字至少一个字符',
        showCancel: false
      })
  },
  bindInput: function (e) {
    this.setData({
      inputText: e.detail.value
    })
    console.log(e.detail.value)
  },
  onLoad: function (options) {
    var that = this
    console.log(options)
    that.setData({
      name: options.name,
      connectedDeviceId: options.connectedDeviceId,
      connected: options.connected
    })
    if (app.globalData.deviceName)
      that.setData({
        inputText: app.globalData.deviceName
      })
    wx.onBLEConnectionStateChange(function (res) {
      console.log(res.connected)
      that.setData({
        connected: res.connected
      })
    })
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  }
})