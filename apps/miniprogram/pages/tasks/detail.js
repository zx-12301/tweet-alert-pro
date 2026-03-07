Page({
  data: {
    taskId: '',
    task: {},
    lastCheckedAt: '从未'
  },

  onLoad: function (options) {
    if (options.id) {
      this.setData({ taskId: options.id });
      this.loadTaskDetail();
    } else {
      wx.showToast({
        title: '任务 ID 缺失',
        icon: 'none'
      });
      setTimeout(() => wx.navigateBack(), 1500);
    }
  },

  loadTaskDetail: async function () {
    try {
      const app = getApp();
      const task = await app.request({ url: `/tasks/${this.data.taskId}` });
      
      if (task) {
        const keywords = task.keywords ? JSON.parse(task.keywords) : [];
        const notifyChannels = task.notifyChannels ? JSON.parse(task.notifyChannels) : {};
        
        this.setData({
          task: {
            ...task,
            keywords,
            notifyChannels: JSON.stringify(notifyChannels)
          },
          lastCheckedAt: task.lastCheckedAt ? this.formatTime(task.lastCheckedAt) : '从未'
        });
      }
    } catch (error) {
      console.error('加载任务详情失败:', error);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  formatTime: function (dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  },

  toggleTask: async function () {
    try {
      const app = getApp();
      await app.request({
        url: `/tasks/${this.data.taskId}`,
        method: 'PUT',
        data: {
          isActive: !this.data.task.isActive
        }
      });
      
      wx.showToast({
        title: this.data.task.isActive ? '已暂停' : '已恢复',
        icon: 'success'
      });
      
      this.loadTaskDetail();
    } catch (error) {
      console.error('操作失败:', error);
    }
  },

  editTask: function () {
    wx.showToast({
      title: '编辑功能开发中',
      icon: 'none'
    });
  },

  deleteTask: async function () {
    wx.showModal({
      title: '确认删除',
      content: '删除后无法恢复，确定要删除此任务吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            const app = getApp();
            await app.request({
              url: `/tasks/${this.data.taskId}`,
              method: 'DELETE'
            });
            
            wx.showToast({
              title: '删除成功',
              icon: 'success'
            });
            
            setTimeout(() => wx.navigateBack(), 1500);
          } catch (error) {
            console.error('删除失败:', error);
            wx.showToast({
              title: '删除失败',
              icon: 'none'
            });
          }
        }
      }
    });
  }
});
