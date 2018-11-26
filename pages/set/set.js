// pages/set/set.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    connectedDeviceId: '',
    connected: false,
  },

  onTapName() {
    if(this.data.connected)
      wx.navigateTo({
        url: '/pages/name/name?connectedDeviceId=' + this.data.connectedDeviceId + '&name=' + this.data.name + '&connected=' + this.data.connected
      })
    else
      wx.showModal({
        title: '提示',
        content: '锁未连接',
        showCancel: false
      })
  },

  onTapPassword() {
    if (this.data.connected)
      wx.navigateTo({
        url: '/pages/password/password?connectedDeviceId=' + this.data.connectedDeviceId + '&name=' + this.data.name + '&connected=' + this.data.connected
      })
    else
      wx.showModal({
      title: '提示',
        content: '锁未连接',
      showCancel: false
    })
  },

  onTapMethod() {
    wx.navigateTo({
      url: '/pages/method/method',
    })
  },

  onTapPrecautions() {
    wx.navigateTo({
      url: '/pages/precautions/precautions',
    })
  },

  onTapContact() {
    wx.navigateTo({
      url: '/pages/contact/contact',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options)
    that.setData({
      name: options.name,
      connectedDeviceId: options.connectedDeviceId,
      connected: options.connected
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