Page({
  data: {
    selectedPlatform: 'twitter',
    showRecommendations: false,
    showAdvanced: false,
    loading: false,
    
    // 表单数据
    twitterHandle: '',
    keywords: '',
    minLikes: '',
    minRetweets: '',
    notifyEmail: false,
    notifyWebhook: false,
    notifyPhone: false,
    emails: '',
    webhooks: '',
    phoneNumbers: '',
    
    // 推荐账号（与网页端一致）
    recommendedAccounts: [
      { handle: 'elonmusk', name: 'Elon Musk', description: 'Tesla & SpaceX CEO', avatar: '🚀' },
      { handle: 'sama', name: 'Sam Altman', description: 'OpenAI CEO', avatar: '🤖' },
      { handle: 'realDonaldTrump', name: 'Donald Trump', description: '45th US President', avatar: '🇺🇸' },
      { handle: 'BarackObama', name: 'Barack Obama', description: '44th US President', avatar: '📚' },
      { handle: 'billgates', name: 'Bill Gates', description: 'Microsoft Co-founder', avatar: '💻' },
      { handle: 'jeffbezos', name: 'Jeff Bezos', description: 'Amazon Founder', avatar: '📦' }
    ]
  },

  onLoad: function () {
    // 加载配置，自动填充
    this.loadSettings();
  },

  // 加载用户配置
  loadSettings: async function () {
    try {
      const app = getApp();
      const settings = await app.request({ url: '/settings' });
      
      if (settings) {
        if (settings.defaultWebhook) {
          this.setData({ webhooks: settings.defaultWebhook });
        }
        if (settings.smtpFrom) {
          this.setData({ emails: settings.smtpFrom });
        }
        if (settings.twilioPhoneNumber) {
          this.setData({ phoneNumbers: settings.twilioPhoneNumber });
        }
      }
    } catch (error) {
      console.error('加载配置失败:', error);
    }
  },

  // 平台选择
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
    
    this.setData({ selectedPlatform: platform });
  },

  // 推荐账号
  toggleRecommendations: function () {
    this.setData({
      showRecommendations: !this.data.showRecommendations
    });
  },

  selectAccount: function (e) {
    const handle = e.currentTarget.dataset.handle;
    this.setData({ twitterHandle: handle });
    
    wx.showToast({
      title: `已选择 @${handle}`,
      icon: 'success',
      duration: 1500
    });
    
    this.setData({ showRecommendations: false });
  },

  // 高级选项
  toggleAdvanced: function () {
    this.setData({
      showAdvanced: !this.data.showAdvanced
    });
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

  onEmailsChange: function (e) {
    this.setData({ emails: e.detail.value });
  },

  onWebhooksChange: function (e) {
    this.setData({ webhooks: e.detail.value });
  },

  onPhoneNumbersChange: function (e) {
    this.setData({ phoneNumbers: e.detail.value });
  },

  // 通知开关
  toggleEmail: function () {
    this.setData({ notifyEmail: !this.data.notifyEmail });
  },

  toggleWebhook: function () {
    this.setData({ notifyWebhook: !this.data.notifyWebhook });
  },

  togglePhone: function () {
    this.setData({ notifyPhone: !this.data.notifyPhone });
  },

  // 跳转
  goToSettings: function () {
    wx.switchTab({
      url: '/pages/settings/settings'
    });
  },

  cancel: function () {
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
    if (this.data.selectedPlatform === 'weibo') {
      wx.showToast({
        title: '微博监控功能暂未开放',
        icon: 'none'
      });
      return;
    }

    this.setData({ loading: true });

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
          platform: this.data.selectedPlatform,
          twitterHandle: handle,
          keywords: keywords,
          minLikes: this.data.minLikes ? parseInt(this.data.minLikes) : null,
          minRetweets: this.data.minRetweets ? parseInt(this.data.minRetweets) : null,
          notifyChannels: {
            email: this.data.notifyEmail,
            wechat: this.data.notifyWebhook,
            phone: this.data.notifyPhone
          },
          phoneNumbers: phoneNumbers,
          webhooks: webhooks,
          emails: emails
        }
      });

      wx.showToast({
        title: '创建成功',
        icon: 'success',
        duration: 2000
      });

      setTimeout(() => {
        wx.navigateBack();
      }, 2000);
    } catch (error) {
      console.error('创建失败:', error);
      wx.showToast({
        title: error.message || '创建失败',
        icon: 'none'
      });
    } finally {
      this.setData({ loading: false });
    }
  }
});
