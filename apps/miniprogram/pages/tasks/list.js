Page({
  data: {
    tasks: [],
    filteredTasks: [],
    filterType: 'all',
    activeCount: 0,
    pausedCount: 0,
    totalNotifications: 0
  },

  onLoad: function () {
    this.loadTasks();
  },

  onShow: function () {
    this.loadTasks();
  },

  loadTasks: async function () {
    wx.showLoading({ title: '加载中...' });

    try {
      const app = getApp();
      const tasks = await app.request({ url: '/tasks' });

      this.setData({
        tasks: tasks || []
      });

      this.calculateStats();
      this.applyFilter();
    } catch (error) {
      console.error('加载任务失败:', error);
    } finally {
      wx.hideLoading();
    }
  },

  calculateStats: function () {
    const { tasks } = this.data;
    const activeCount = tasks.filter(t => t.isActive).length;
    const pausedCount = tasks.filter(t => !t.isActive).length;
    const totalNotifications = tasks.reduce((sum, t) => sum + (t.totalNotifications || 0), 0);

    this.setData({
      activeCount,
      pausedCount,
      totalNotifications
    });
  },

  applyFilter: function () {
    const { tasks, filterType } = this.data;
    let filteredTasks = tasks;

    if (filterType === 'active') {
      filteredTasks = tasks.filter(t => t.isActive);
    } else if (filterType === 'paused') {
      filteredTasks = tasks.filter(t => !t.isActive);
    }

    this.setData({ filteredTasks });
  },

  setFilter: function (e) {
    const filterType = e.currentTarget.dataset.type;
    this.setData({ filterType }, () => {
      this.applyFilter();
    });
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
  },

  toggleTask: async function (e) {
    const taskId = e.currentTarget.dataset.id;
    const task = this.data.tasks.find(t => t.id === taskId);

    if (!task) return;

    wx.showLoading({ title: '更新中...' });

    try {
      const app = getApp();
      await app.request({
        url: `/tasks/${taskId}`,
        method: 'PUT',
        data: { isActive: !task.isActive }
      });

      wx.showToast({
        title: task.isActive ? '已暂停' : '已启动',
        icon: 'success'
      });

      this.loadTasks();
    } catch (error) {
      console.error('更新失败:', error);
    } finally {
      wx.hideLoading();
    }
  },

  deleteTask: async function (e) {
    const taskId = e.currentTarget.dataset.id;

    wx.showModal({
      title: '确认删除',
      content: '确定要删除此监控任务吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            const app = getApp();
            await app.request({
              url: `/tasks/${taskId}`,
              method: 'DELETE'
            });

            wx.showToast({
              title: '删除成功',
              icon: 'success'
            });

            this.loadTasks();
          } catch (error) {
            console.error('删除失败:', error);
          }
        }
      }
    });
  }
});
