Page({
  data: {
    notifications: [],
    stats: {
      total: 0,
      today: 0,
      unread: 0
    },
    loading: false,
    page: 1,
    hasMore: true
  },

  onLoad: function () {
    this.loadNotifications();
  },

  onReachBottom: function () {
    if (this.data.hasMore && !this.data.loading) {
      this.loadNotifications();
    }
  },

  onPullDownRefresh: function () {
    this.setData({
      page: 1,
      hasMore: true
    });
    this.loadNotifications().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  loadNotifications: async function () {
    this.setData({ loading: true });
    
    try {
      const app = getApp();
      const tasks = await app.request({ url: '/tasks' });
      
      // 从任务中提取通知
      let allNotifications = [];
      if (tasks && Array.isArray(tasks)) {
        tasks.forEach(task => {
          if (task.notifications && Array.isArray(task.notifications)) {
            task.notifications.forEach(notif => {
              allNotifications.push({
                ...notif,
                twitterHandle: task.twitterHandle,
                keywords: task.keywords ? JSON.parse(task.keywords) : []
              });
            });
          }
        });
        
        // 按时间排序
        allNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // 分页
        const start = (this.data.page - 1) * 20;
        const end = start + 20;
        const newNotifications = allNotifications.slice(start, end);
        
        this.setData({
          notifications: this.data.page === 1 ? newNotifications : [...this.data.notifications, ...newNotifications],
          stats: {
            total: allNotifications.length,
            today: allNotifications.filter(n => {
              const today = new Date();
              const notifDate = new Date(n.createdAt);
              return today.toDateString() === notifDate.toDateString();
            }).length,
            unread: allNotifications.filter(n => !n.read).length
          },
          hasMore: end < allNotifications.length,
          page: this.data.page + 1
        });
      }
    } catch (error) {
      console.error('加载通知失败:', error);
    } finally {
      this.setData({ loading: false });
    }
  },

  viewDetail: function (e) {
    const notifId = e.currentTarget.dataset.id;
    wx.showToast({
      title: '通知详情开发中',
      icon: 'none'
    });
  },

  showFilter: function () {
    wx.showActionSheet({
      itemList: ['全部', '未读', '邮件通知', 'Webhook 通知'],
      success: (res) => {
        wx.showToast({
          title: '筛选功能开发中',
          icon: 'none'
        });
      }
    });
  },

  createTask: function () {
    wx.navigateTo({
      url: '/pages/tasks/create'
    });
  }
});
