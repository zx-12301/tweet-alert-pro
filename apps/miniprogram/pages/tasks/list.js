Page({
  data: {
    tasks: []
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
    } catch (error) {
      console.error('加载任务失败:', error);
    } finally {
      wx.hideLoading();
    }
  },

  createTask: function () {
    wx.navigateTo({
      url: '/pages/tasks/create'
    });
  },

  viewTaskDetail: function (e) {
    const taskId = e.currentTarget.dataset.id;
    // TODO: 跳转到任务详情页
    wx.showToast({
      title: '任务详情开发中',
      icon: 'none'
    });
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
