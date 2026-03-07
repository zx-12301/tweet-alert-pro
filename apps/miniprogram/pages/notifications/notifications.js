Page({
  data: {
    notifications: [],
    filteredNotifications: [],
    groupedNotifications: [],
    stats: {
      total: 0,
      today: 0,
      unread: 0
    },
    filterType: 'all',
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
                keywords: task.keywords ? JSON.parse(task.keywords) : [],
                channel: notif.channel || '邮件'
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
        }, () => {
          this.applyFilter();
        });
      }
    } catch (error) {
      console.error('加载通知失败:', error);
    } finally {
      this.setData({ loading: false });
    }
  },

  applyFilter: function () {
    const { notifications, filterType } = this.data;
    let filteredNotifications = [...notifications];
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    if (filterType === 'unread') {
      filteredNotifications = notifications.filter(n => !n.read);
    } else if (filterType === 'today') {
      filteredNotifications = notifications.filter(n => {
        const notifDate = new Date(n.createdAt);
        return notifDate >= today;
      });
    } else if (filterType === 'week') {
      filteredNotifications = notifications.filter(n => {
        const notifDate = new Date(n.createdAt);
        return notifDate >= weekAgo;
      });
    }

    this.setData({ filteredNotifications }, () => {
      this.groupNotifications();
    });
  },

  groupNotifications: function () {
    const { filteredNotifications } = this.data;
    const groups = {};

    filteredNotifications.forEach(notif => {
      const date = this.formatDate(notif.createdAt);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notif);
    });

    const groupedNotifications = Object.keys(groups).map(date => ({
      date,
      notifications: groups[date]
    }));

    this.setData({ groupedNotifications });
  },

  formatDate: function (dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

    if (date >= today) {
      return '今天';
    } else if (date >= yesterday) {
      return '昨天';
    } else {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${month}月${day}日`;
    }
  },

  setFilter: function (e) {
    const filterType = e.currentTarget.dataset.type;
    this.setData({ filterType }, () => {
      this.applyFilter();
    });
  },

  getChannelIcon: function (channel) {
    const icons = {
      '邮件': '📧',
      'Webhook': '💬',
      '短信': '📱',
      '电话': '📞'
    };
    return icons[channel] || '📢';
  },

  viewDetail: function (e) {
    const notifId = e.currentTarget.dataset.id;
    wx.showToast({
      title: '通知详情开发中',
      icon: 'none'
    });
  },

  createTask: function () {
    wx.navigateTo({
      url: '/pages/tasks/create'
    });
  }
});
