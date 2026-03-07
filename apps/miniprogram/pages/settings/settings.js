Page({
  data: {
    activeTab: 'twitter',
    saving: false,
    testing: {},
    testResults: {},
    
    // SMTP 端口选项
    smtpPorts: ['25 (SMTP)', '465 (SSL)', '587 (TLS)'],
    smtpPortIndex: 1,
    
    // 选项卡
    tabs: [
      { id: 'twitter', name: 'Twitter API', icon: '🐦', required: true },
      { id: 'twilio', name: '语音电话', icon: '📞', required: true },
      { id: 'email', name: '邮件服务', icon: '📧', required: true },
      { id: 'webhook', name: '消息通知', icon: '💬', required: false }
    ],
    
    // 配置数据
    settings: {
      twitterApiKey: '',
      twitterApiSecret: '',
      twitterAccessToken: '',
      twitterAccessSecret: '',
      twilioAccountSid: '',
      twilioAuthToken: '',
      twilioPhoneNumber: '',
      smtpHost: '',
      smtpPort: '587',
      smtpUser: '',
      smtpPassword: '',
      smtpFrom: '',
      defaultWebhook: ''
    }
  },

  onLoad: function () {
    this.loadSettings();
  },

  // 加载配置
  loadSettings: async function () {
    wx.showLoading({ title: '加载中...', mask: true });
    
    try {
      const app = getApp();
      const settings = await app.request({ url: '/settings' });
      
      if (settings) {
        this.setData({ settings: { ...this.data.settings, ...settings } });
        
        // 设置 SMTP 端口索引
        const portIndex = this.data.smtpPorts.findIndex(p => p.includes(settings.smtpPort || '587'));
        if (portIndex >= 0) {
          this.setData({ smtpPortIndex: portIndex });
        }
      }
    } catch (error) {
      console.error('加载配置失败:', error);
    } finally {
      wx.hideLoading();
    }
  },

  // 切换选项卡
  switchTab: function (e) {
    const tabId = e.currentTarget.dataset.id;
    this.setData({ activeTab: tabId });
  },

  // 输入处理
  onInput: function (e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    
    this.setData({
      [`settings.${field}`]: value
    });
  },

  // SMTP 端口选择
  onSmtpPortChange: function (e) {
    const index = e.detail.value;
    const port = this.data.smtpPorts[index].split(' ')[0];
    
    this.setData({
      smtpPortIndex: index,
      'settings.smtpPort': port
    });
  },

  // 测试连接
  testConnection: async function (e) {
    const type = e.currentTarget.dataset.type;
    
    this.setData({
      [`testing.${type}`]: true,
      [`testResults.${type}`]: null
    });

    try {
      const app = getApp();
      const result = await app.request({
        url: '/settings/test',
        method: 'POST',
        data: {
          type,
          settings: this.data.settings
        }
      });

      this.setData({
        [`testResults.${type}`]: result
      });

      wx.showToast({
        title: result.message,
        icon: result.success ? 'success' : 'none',
        duration: 3000
      });
    } catch (error) {
      console.error('测试失败:', error);
      this.setData({
        [`testResults.${type}`]: {
          success: false,
          message: error.message || '测试失败'
        }
      });
      
      wx.showToast({
        title: '测试失败',
        icon: 'none'
      });
    } finally {
      this.setData({
        [`testing.${type}`]: false
      });
    }
  },

  // 保存配置
  saveSettings: async function () {
    this.setData({ saving: true });

    try {
      const app = getApp();
      await app.request({
        url: '/settings',
        method: 'PUT',
        data: this.data.settings
      });

      wx.showToast({
        title: '✅ 保存成功！配置已更新',
        icon: 'success',
        duration: 2500
      });
    } catch (error) {
      console.error('保存失败:', error);
      wx.showToast({
        title: '❌ 保存失败，请重试',
        icon: 'none'
      });
    } finally {
      this.setData({ saving: false });
    }
  }
});
