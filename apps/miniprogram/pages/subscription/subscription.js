Page({
  data: {
    subscription: {},
    usedNotifications: 12,
    usagePercent: 12
  },

  onLoad: function () {
    this.loadSubscription();
  },

  loadSubscription: async function () {
    try {
      const app = getApp();
      const subscription = await app.request({ url: '/billing/subscription' });
      
      if (subscription) {
        this.setData({
          subscription: subscription,
          usagePercent: Math.round((this.data.usedNotifications / (subscription.dailyNotificationLimit || 5)) * 100)
        });
      }
    } catch (error) {
      console.error('加载订阅失败:', error);
    }
  },

  upgradePlan: function () {
    wx.showToast({
      title: '请访问网页版升级',
      icon: 'none'
    });
  },

  cancelSubscription: function () {
    wx.showModal({
      title: '确认取消',
      content: '取消后当前周期结束将降级为免费版',
      success: async (res) => {
        if (res.confirm) {
          try {
            const app = getApp();
            await app.request({
              url: '/billing/cancel',
              method: 'POST'
            });
            
            wx.showToast({
              title: '已取消订阅',
              icon: 'success'
            });
            
            this.loadSubscription();
          } catch (error) {
            console.error('取消失败:', error);
          }
        }
      }
    });
  }
});
