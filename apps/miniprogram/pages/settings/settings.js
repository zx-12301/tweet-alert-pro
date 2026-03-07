Page({
  data: {
    apiBaseUrl: 'http://localhost:3001/api',
    userId: '4c590dec-2c16-44b9-8291-8855cecc824f'
  },

  onLoad: function () {
    const app = getApp();
    this.setData({
      apiBaseUrl: app.globalData.apiBaseUrl,
      userId: app.globalData.userId
    });
  },

  onApiUrlChange: function (e) {
    this.setData({
      apiBaseUrl: e.detail.value
    });
  },

  saveSettings: function () {
    const app = getApp();
    app.globalData.apiBaseUrl = this.data.apiBaseUrl;
    
    wx.setStorageSync('apiBaseUrl', this.data.apiBaseUrl);
    
    wx.showToast({
      title: '保存成功',
      icon: 'success'
    });
  },

  contactSupport: function () {
    wx.setClipboardData({
      data: 'support@tweetalert.pro',
      success: () => {
        wx.showToast({
          title: '已复制邮箱',
          icon: 'success'
        });
      }
    });
  }
});
