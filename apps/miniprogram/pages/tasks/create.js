Page({
  data: {
    platform: 'twitter',
    twitterHandle: '',
    keywords: '',
    minLikes: '',
    minRetweets: '',
    notifyMail: false,
    notifyWebhook: false,
    notifyPhone: false
  },

  onLoad: function () {
    this.loadSettings();
  },

  // 加载用户配置
  loadSettings: async function () {
    try {
      const app = getApp();
      const settings = await app.request({ url: '/settings' });
      
      if (settings) {
        if (settings.defaultWebhook) {
          this.setData({ notifyWebhook: true, webhooks: settings.defaultWebhook });
        }
        if (settings.smtpFrom) {
          this.setData({ notifyMail: true, emails: settings.smtpFrom });
        }
        if (settings.twilioPhoneNumber) {
          this.setData({ notifyPhone: true, phoneNumbers: settings.twilioPhoneNumber });
        }
      }
    } catch (error) {
      console.error('加载配置失败:', error);
    }
  },

  // 选择平台
  selectPlatform: function (e) {
    const platform = e.currentTarget.dataset.platform;
    
    if (platform === 'weibo') {
      wx.showToast({
        title: '微博监控功能暂未开放',
        icon: 'none',
        duration: 2500
      });
      return;
    }
    
    this.setData({ platform });
  },

  // 表单输入
  onHandleChange: function (e) {
    this.setData({ twitterHandle: e.detail.value });
  },

  onKeywordsChange: function (e) {
    this.setData({ keywords: e.detail.value });
  },

  onMinLikesChange: function (e) {
    this.setData({ minLikes: e.detail.value });
  },

  onMinRetweetsChange: function (e) {
    this.setData({ minRetweets: e.detail.value });
  },

  // 切换通知
  toggleNotify: function (e) {
    const type = e.currentTarget.dataset.type;
    
    if (type === 'mail') {
      this.setData({ notifyMail: !this.data.notifyMail });
    } else if (type === 'webhook') {
      this.setData({ notifyWebhook: !this.data.notifyWebhook });
    } else if (type === 'phone') {
      this.setData({ notifyPhone: !this.data.notifyPhone });
    }
  },

  // 显示推荐账号
  showRecommendations: function () {
    wx.showActionSheet({
      itemList: ['Elon Musk', 'Sam Altman', 'Donald Trump', 'Barack Obama', 'Bill Gates', 'Jeff Bezos'],
      success: (res) => {
        const handles = ['elonmusk', 'sama', 'realDonaldTrump', 'BarackObama', 'billgates', 'jeffbezos'];
        this.setData({ twitterHandle: handles[res.tapIndex] });
        
        wx.showToast({
          title: `已选择 @${handles[res.tapIndex]}`,
          icon: 'success'
        });
      }
    });
  },

  // 跳转
  goToSettings: function () {
    wx.switchTab({
      url: '/pages/settings/settings'
    });
  },

  goBack: function () {
    wx.navigateBack();
  },

  // 提交任务
  submitTask: async function () {
    // 验证
    if (!this.data.twitterHandle) {
      wx.showToast({
        title: '请输入 Twitter 账号',
        icon: 'none'
      });
      return;
    }

    // 验证平台
    if (this.data.platform === 'weibo') {
      wx.showToast({
        title: '微博监控功能暂未开放',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({ title: '创建中...', mask: true });

    try {
      const app = getApp();
      
      // 处理数据
      const handle = this.data.twitterHandle.replace('@', '');
      const keywords = this.data.keywords ? this.data.keywords.split(',').filter(k => k.trim()) : [];
      const phoneNumbers = this.data.phoneNumbers ? this.data.phoneNumbers.split(',').filter(p => p.trim()) : [];
      const webhooks = this.data.webhooks ? this.data.webhooks.split(',').filter(w => w.trim()) : [];
      const emails = this.data.emails ? this.data.emails.split(',').filter(e => e.trim()) : [];

      await app.request({
        url: '/tasks',
        method: 'POST',
        data: {
          platform: this.data.platform,
          twitterHandle: handle,
          keywords: keywords,
          minLikes: this.data.minLikes ? parseInt(this.data.minLikes) : null,
          minRetweets: this.data.minRetweets ? parseInt(this.data.minRetweets) : null,
          notifyChannels: {
            email: this.data.notifyMail,
            wechat: this.data.notifyWebhook,
            phone: this.data.notifyPhone
          },
          phoneNumbers: phoneNumbers,
          webhooks: webhooks,
          emails: emails
        }
      });

      wx.hideLoading();
      
      wx.showToast({
        title: '创建成功',
        icon: 'success',
        duration: 2000
      });

      setTimeout(() => {
        wx.navigateBack();
      }, 2000);
    } catch (error) {
      wx.hideLoading();
      console.error('创建失败:', error);
      
      wx.showToast({
        title: error.message || '创建失败',
        icon: 'none'
      });
    }
  }
});
