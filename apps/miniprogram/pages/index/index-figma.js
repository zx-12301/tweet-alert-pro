Page({
  data: {
    stats: {
      totalTasks: 0,
      activeTasks: 0,
      todayNotifications: 100
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
          'stats.todayNotifications': subscription.dailyNotificationLimit || 100
        });
      }
      
      // 模拟通知数据
      this.setData({
        notifications: [
          {
            id: '1',
            twitterHandle: '@elonmusk',
            tweetContent: 'Just launched Starship! 🚀',
            createdAt: '5 分钟前',
            read: false
          },
          {
            id: '2',
            twitterHandle: '@sama',
            tweetContent: 'Excited about the future of AI. We are building the tools of tomorrow.',
            createdAt: '1 小时前',
            read: true
          },
          {
            id: '3',
            twitterHandle: '@vercel',
            tweetContent: 'Next.js 15 is now stable and ready for production.',
            createdAt: '3 小时前',
            read: true
          }
        ]
      });
    } catch (error) {
      console.error('加载数据失败:', error);
    }
  },

  // 跳转函数
  createTask: function () {
    wx.navigateTo({ url: '/pages/tasks/create' });
  },

  viewSubscription: function () {
    wx.switchTab({ url: '/pages/subscription/subscription' });
  },

  viewSettings: function () {
    wx.switchTab({ url: '/pages/settings/settings' });
  },

  viewAll: function () {
    wx.switchTab({ url: '/pages/tasks/list' });
  },

  viewAllNotifications: function () {
    wx.navigateTo({ url: '/pages/notifications/notifications' });
  },

  viewNotificationDetail: function (e) {
    const notifId = e.currentTarget.dataset.id;
    wx.showToast({
      title: '通知详情',
      icon: 'none'
    });
  },

  viewHelp: function () {
    wx.showModal({
      title: '使用帮助',
      content: '推文哨兵可以帮助您实时监控 Twitter 用户动态，当关注用户发布新推文时自动通知您。\n\n如需帮助请联系：support@tweetalert.pro',
      showCancel: false,
      confirmColor: '#60a5fa'
    });
  }
});
