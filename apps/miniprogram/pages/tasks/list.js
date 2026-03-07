Page({
  data: {
    tasks: [],
    filteredTasks: [],
    filterType: 'all',
    stats: {
      totalTasks: 0,
      activeTasks: 0,
      totalNotifications: 0,
      todayNotifications: 0
    },
    pausedCount: 0
  },

  onLoad: function () {
    this.loadTasks();
  },

  onShow: function () {
    this.loadTasks();
  },

  loadTasks: async function () {
    wx.showLoading({ title: '加载中...', mask: true });
    
    try {
      const app = getApp();
      const tasks = await app.request({ url: '/tasks' });
      
      if (tasks && Array.isArray(tasks)) {
        const activeTasks = tasks.filter(t => t.isActive).length;
        const pausedTasks = tasks.length - activeTasks;
        
        // 计算总通知数
        const totalNotifications = tasks.reduce((sum, t) => sum + (t.totalNotifications || 0), 0);
        
        this.setData({
          tasks,
          filteredTasks: tasks,
          'stats.totalTasks': tasks.length,
          'stats.activeTasks': activeTasks,
          'stats.totalNotifications': totalNotifications,
          'stats.todayNotifications': 0,
          pausedCount: pausedTasks
        }, () => {
          this.applyFilter();
        });
      }
    } catch (error) {
      console.error('加载任务失败:', error);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
    }
  },

  refreshTasks: async function () {
    wx.showLoading({ title: '刷新中...', mask: true });
    await this.loadTasks();
    wx.hideLoading();
    wx.showToast({
      title: '刷新成功',
      icon: 'success'
    });
  },

  setFilter: function (e) {
    const filterType = e.currentTarget.dataset.type;
    this.setData({ filterType }, () => {
      this.applyFilter();
    });
  },

  applyFilter: function () {
    const { tasks, filterType } = this.data;
    let filteredTasks = [...tasks];
    
    if (filterType === 'running') {
      filteredTasks = tasks.filter(t => t.isActive);
    } else if (filterType === 'paused') {
      filteredTasks = tasks.filter(t => !t.isActive);
    }
    
    this.setData({ filteredTasks });
  },

  createTask: function () {
    wx.navigateTo({
      url: '/pages/tasks/create'
    });
  },

  viewTaskDetail: function (e) {
    const taskId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/tasks/detail?id=${taskId}`
    });
  }
});
