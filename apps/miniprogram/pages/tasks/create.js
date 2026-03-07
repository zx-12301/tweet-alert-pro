Page({
  data: {
    selectedPlatform: 'twitter',
    twitterHandle: '',
    notifyEmail: false,
    notifyWebhook: false
  },

  selectPlatform: function (e) {
    const platform = e.currentTarget.dataset.platform;
    
    if (platform === 'weibo') {
      wx.showToast({
        title: '微博监控开发中',
        icon: 'none'
      });
      return;
    }
    
    this.setData({
      selectedPlatform: platform
    });
  },

  onHandleChange: function (e) {
    this.setData({
      twitterHandle: e.detail.value
    });
  },

  toggleEmail: function () {
    this.setData({
      notifyEmail: !this.data.notifyEmail
    });
  },

  toggleWebhook: function () {
    this.setData({
      notifyWebhook: !this.data.notifyWebhook
    });
  },

  submitTask: async function () {
    if (!this.data.twitterHandle) {
      wx.showToast({
        title: '请输入 Twitter 账号',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({ title: '创建中...' });

    try {
      const app = getApp();
      await app.request({
        url: '/tasks',
        method: 'POST',
        data: {
          platform: this.data.selectedPlatform,
          twitterHandle: this.data.twitterHandle.replace('@', ''),
          notifyChannels: {
            email: this.data.notifyEmail,
            wechat: this.data.notifyWebhook
          }
        }
      });

      wx.hideLoading();
      wx.showToast({
        title: '创建成功',
        icon: 'success'
      });

      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    } catch (error) {
      wx.hideLoading();
      console.error('创建失败:', error);
    }
  }
});
