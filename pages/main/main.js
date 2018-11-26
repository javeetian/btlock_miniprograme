const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '无',
    connected: false,
    connectedDeviceId: '',
    searching: false,
    devicesList: []
  },
  onTapSearch() {
    wx.navigateTo({
      url: '../search/search?connectedDeviceId=' + this.data.connectedDeviceId + '&name=' + this.data.name + '&connected=' + this.data.connected
    })
  },
  onTapOpen() {
      wx.navigateTo({
        url: '../open/open?connectedDeviceId=' + this.data.connectedDeviceId + '&name=' + this.data.name + '&connected=' + this.data.connected
      })
  },
  onTapOpen1() {
    if (this.data.connected)
      wx.navigateTo({
        url: '../open/open?connectedDeviceId=' + this.data.connectedDeviceId + '&name=' + this.data.name + '&connected=' + this.data.connected
      })
    else
      wx.showModal({
        title: '提示',
        content: '锁未连接',
        showCancel: false
      })
  },
  onTapSet() {
    wx.navigateTo({
      url: '../set/set?connectedDeviceId=' + this.data.connectedDeviceId + '&name=' + this.data.name + '&connected=' + this.data.connected
    })
  },

  search_devices: function () {
    var that = this
    console.log(that.data.searching)
    if (!that.data.searching) {
      wx.closeBluetoothAdapter({
        complete: function (res) {
          console.log(res)
          wx.openBluetoothAdapter({
            success: function (res) {
              console.log(res)
              wx.getBluetoothAdapterState({
                success: function (res) {
                  console.log(res)
                }
              })
              wx.startBluetoothDevicesDiscovery({
                services: ['FFF0'],
                allowDuplicatesKey: false,
                success: function (res) {
                  console.log(res)
                  that.setData({
                    searching: true,
                    devicesList: []
                  })
                }
              })
            },
            fail: function (res) {
              console.log(res)
              wx.showModal({
                title: '提示',
                content: '请检查手机蓝牙是否打开',
                showCancel: false,
                success: function (res) {
                  that.setData({
                    searching: false
                  })
                }
              })
            }
          })
        }
      })
    }
    else {
      wx.stopBluetoothDevicesDiscovery({
        success: function (res) {
          console.log(res)
          that.setData({
            searching: false
          })
        }
      })
    }
  },
  connect_devices: function (e) {
    var that = this
    var advertisData, name1
    console.log(app.globalData.deviceID)
    for (var i = 0; i < that.data.devicesList.length; i++) {
      if (app.globalData.deviceID == that.data.devicesList[i].deviceId) {
        if (app.globalData.deviceName)
          name1: app.globalData.deviceName
        else
          name1 = that.data.devicesList[i].name
        advertisData = that.data.devicesList[i].advertisData
        break
      }
    }
    wx.showLoading({
      title: '正在连接蓝牙锁...',
    })
    wx.createBLEConnection({
      deviceId: app.globalData.deviceID,
      success: function (res) {
        console.log(res)
        wx.hideLoading()
        wx.showToast({
          title: '连接成功',
          icon: 'success',
          duration: 1000
        })
        app.globalData.connected = true
        that.setData({
          connected: true,
          connectedDeviceId: app.globalData.deviceID,
          name: name1
        })
      },
      fail: function (res) {
        console.log(res)
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '连接失败',
          showCancel: false
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this
    wx.onBluetoothAdapterStateChange(function (res) {
      console.log(res)
      that.setData({
        searching: res.discovering
      })
      if (!res.available) {
        that.setData({
          searching: false
        })
      }
    })
    wx.onBluetoothDeviceFound(function (devices) {
      //剔除重复设备，兼容不同设备API的不同返回值
      var isnotexist = true
      if (devices.deviceId) {
        if (devices.advertisData) {
          devices.advertisData = app.buf2hex(devices.advertisData)
        }
        else {
          devices.advertisData = ''
        }
        console.log(devices)
        for (var i = 0; i < that.data.devicesList.length; i++) {
          if (devices.deviceId == that.data.devicesList[i].deviceId) {
            isnotexist = false
          }
        }
        if (isnotexist) {
          if (devices.deviceId == app.globalData.deviceID) {
            that.data.devicesList.push(devices)
            wx.stopBluetoothDevicesDiscovery({
              success: function (res) {
                console.log(res)
                that.setData({
                  searching: false
                })
                that.connect_devices()
              }
            })
          }
        }
      }
      else if (devices.devices) {
        if (devices.devices[0].advertisData) {
          devices.devices[0].advertisData = app.buf2hex(devices.devices[0].advertisData)
        }
        else {
          devices.devices[0].advertisData = ''
        }
        console.log(devices.devices[0])
        for (var i = 0; i < that.data.devicesList.length; i++) {
          if (devices.devices[0].deviceId == that.data.devicesList[i].deviceId) {
            isnotexist = false
          }
        }
        if (isnotexist) {
          if (devices.devices[0].deviceId == app.globalData.deviceID) {
            that.data.devicesList.push(devices.devices[0])
            wx.stopBluetoothDevicesDiscovery({
              success: function (res) {
                console.log(res)
                that.setData({
                  searching: false
                })
                that.connect_devices()
              }
            })
          }
        }
      }
      else if (devices[0]) {
        if (devices[0].advertisData) {
          devices[0].advertisData = app.buf2hex(devices[0].advertisData)
        }
        else {
          devices[0].advertisData = ''
        }
        console.log(devices[0])
        for (var i = 0; i < devices_list.length; i++) {
          if (devices[0].deviceId == that.data.devicesList[i].deviceId) {
            isnotexist = false
          }
        }
        if (isnotexist) {
          if (devices[0].deviceId == app.globalData.deviceID) {
            that.data.devicesList.push(devices[0])
            wx.stopBluetoothDevicesDiscovery({
              success: function (res) {
                console.log(res)
                that.setData({
                  searching: false
                })
                that.connect_devices()
              }
            })
          }
        }
      }
      that.setData({
        devicesList: that.data.devicesList
      })
    })
    wx.getStorage({
      key: 'deviceID',
      success(res) {
        console.log(res.data)
        app.globalData.deviceID = res.data
        wx.getStorage({
          key: res.data,
          success(res) {
            console.log(res.data)
            app.globalData.deviceName = res.data
          }
        })
        that.search_devices()
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var that = this
    that.setData({
      devicesList: []
    })
    if (this.data.searching) {
      wx.stopBluetoothDevicesDiscovery({
        success: function (res) {
          console.log(res)
          that.setData({
            searching: false
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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
  onShareAppMessage: function () {

  }
})