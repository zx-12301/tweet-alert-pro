Page({
  data: {
    stats: {
      totalTasks: 0,
      activeTasks: 0,
      todayNotifications: 0
    },
    notifications: []
  },

  onLoad: function () {
    this.loadData();
  },

  onShow: function () {
    this.loadData();
  },

  loadData: async function () {
    try {
      const app = getApp();
      
      // 加载任务统计
      const tasks = await app.request({ url: '/tasks' });
      if (tasks && Array.isArray(tasks)) {
        this.setData({
          'stats.totalTasks': tasks.length,
          'stats.activeTasks': tasks.filter(t => t.isActive).length
        });
      }

      // 加载订阅信息
      const subscription = await app.request({ url: '/billing/subscription' });
      if (subscription) {
        this.setData({
          'stats.todayNotifications': subscription.dailyNotificationLimit || 0
        });
      }
    } catch (error) {
      console.error('加载数据失败:', error);
    }
  },

  // 跳转函数
  goToTasks: function () {
    wx.switchTab({ url: '/pages/tasks/list' });
  },

  goToSubscription: function () {
    wx.switchTab({ url: '/pages/subscription/subscription' });
  },

  createTask: function () {
    wx.navigateTo({ url: '/pages/tasks/create' });
  },

  viewSubscription: function () {
    wx.switchTab({ url: '/pages/subscription/subscription' });
  },

  viewSettings: function () {
    wx.switchTab({ url: '/pages/settings/settings' });
  },

  viewHelp: function () {
    wx.showModal({
      title: '使用帮助',
      content: '推文哨兵可以帮助您实时监控 Twitter 用户动态，当关注用户发布新推文时自动通知您。\n\n如需帮助请联系：support@tweetalert.pro',
      showCancel: false
    });
  }
});
