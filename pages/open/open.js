const app = getApp()
Page({
  data: {
    inputText: '',
    receiveText: '',
    name: '',
    connectedDeviceId: '',
    services: {},
    characteristics: {},
    connected: false
  },
  bindInput: function (e) {
    this.setData({
      inputText: e.detail.value
    })
    console.log(e.detail.value)
  },
  Send: function () {
    var that = this
    if (that.data.connected) {

      if (that.data.inputText.length !== 6)
        wx.showToast({
          title: '密码长度必须为6',
          icon: 'none',
          duration: 1000
        })
      else {
        var i = 0
        var buffer = new ArrayBuffer(9)
        var dataView = new Uint8Array(buffer)
        dataView[i++] = 0xaa
        dataView[i++] = 0x55
        for (var j = 0; j < that.data.inputText.length; j++) {
          dataView[i++] = that.data.inputText.charCodeAt(j)
        }
        dataView[i++] = 0xff
        wx.writeBLECharacteristicValue({
          deviceId: that.data.connectedDeviceId,
          serviceId: that.data.services[1].uuid,
          characteristicId: that.data.characteristics[0].uuid,
          value: buffer,
          success: function (res) {
            console.log('发送成功')
          }
        })
      }
    }
    else {
      wx.showModal({
        title: '提示',
        content: '蓝牙已断开',
        showCancel: false,
        success: function (res) {
          that.setData({
            searching: false
          })
        }
      })
    }
  },
  onLoad: function (options) {
    var that = this
    console.log(options)
    that.setData({
      name: options.name,
      connectedDeviceId: options.connectedDeviceId,
      connected: options.connected
    })
    wx.getBLEDeviceServices({
      deviceId: that.data.connectedDeviceId,
      success: function (res) {
        console.log(res.services)
        that.setData({
          services: res.services
        })
        wx.getBLEDeviceCharacteristics({
          deviceId: options.connectedDeviceId,
          serviceId: res.services[1].uuid,
          success: function (res) {
            console.log(res.characteristics)
            that.setData({
              characteristics: res.characteristics
            })
            wx.notifyBLECharacteristicValueChange({
              state: true,
              deviceId: options.connectedDeviceId,
              serviceId: that.data.services[1].uuid,
              characteristicId: that.data.characteristics[3].uuid,
              success: function (res) {
                console.log('启用notify成功')
              }
            })
          }
        })
      }
    })
    wx.onBLEConnectionStateChange(function (res) {
      console.log(res.connected)
      that.setData({
        connected: res.connected
      })
    })
    wx.onBLECharacteristicValueChange(function (res) {
      var receiveText = app.buf2string(res.value)
      var dataView = new DataView(res.value)
      console.log('接收到数据：' + receiveText)
      if (dataView.byteLength == 9)
        wx.showToast({
          title: '开锁成功',
          icon: 'success',
          duration: 1000
        })
      else if (receiveText.search(/error/) !== -1)
        wx.showToast({
          title: '开锁失败',
          icon: 'none',
          duration: 1000
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