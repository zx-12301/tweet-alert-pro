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

        // 合并数组（避免使用展开运算符）
        var allNotifs = [];
        if (this.data.page === 1) {
          allNotifs = newNotifications;
        } else {
          allNotifs = this.data.notifications.concat(newNotifications);
        }

        // 计算统计
        var todayCount = 0;
        var unreadCount = 0;
        var today = new Date();
        for (var i = 0; i < allNotifications.length; i++) {
          var n = allNotifications[i];
          var notifDate = new Date(n.createdAt);
          if (today.toDateString() === notifDate.toDateString()) {
            todayCount++;
          }
          if (!n.read) {
            unreadCount++;
          }
        }

        this.setData({
          notifications: allNotifs,
          stats: {
            total: allNotifications.length,
            today: todayCount,
            unread: unreadCount
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
    var notifications = this.data.notifications;
    var filterType = this.data.filterType;
    var filteredNotifications = notifications.slice();
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    if (filterType === 'unread') {
      filteredNotifications = [];
      for (var i = 0; i < notifications.length; i++) {
        if (!notifications[i].read) {
          filteredNotifications.push(notifications[i]);
        }
      }
    } else if (filterType === 'today') {
      filteredNotifications = [];
      for (var i = 0; i < notifications.length; i++) {
        var notifDate = new Date(notifications[i].createdAt);
        if (notifDate >= today) {
          filteredNotifications.push(notifications[i]);
        }
      }
    } else if (filterType === 'week') {
      filteredNotifications = [];
      for (var i = 0; i < notifications.length; i++) {
        var notifDate = new Date(notifications[i].createdAt);
        if (notifDate >= weekAgo) {
          filteredNotifications.push(notifications[i]);
        }
      }
    }

    var that = this;
    this.setData({ filteredNotifications: filteredNotifications }, function() {
      that.groupNotifications();
    });
  },

  groupNotifications: function () {
    var filteredNotifications = this.data.filteredNotifications;
    var groups = {};

    for (var i = 0; i < filteredNotifications.length; i++) {
      var notif = filteredNotifications[i];
      var date = this.formatDate(notif.createdAt);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notif);
    }

    var groupedNotifications = [];
    var dates = Object.keys(groups);
    for (var i = 0; i < dates.length; i++) {
      var date = dates[i];
      groupedNotifications.push({
        date: date,
        notifications: groups[date]
      });
    }

    this.setData({ groupedNotifications: groupedNotifications });
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
    var filterType = e.currentTarget.dataset.type;
    var that = this;
    this.setData({ filterType: filterType }, function() {
      that.applyFilter();
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
