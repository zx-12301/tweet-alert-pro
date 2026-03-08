Page({
  data: {
    subscription: {},
    usedNotifications: 12,
    usagePercent: 12,
    autoRenew: true
  },

  onLoad: function () {
    this.loadSubscription();
  },

  loadSubscription: async function () {
    try {
      const app = getApp();
      const subscription = await app.request({ url: '/billing/subscription' });
      
      if (subscription) {
        const limit = subscription.dailyNotificationLimit || 5;
        this.setData({
          subscription: subscription,
          usagePercent: Math.round((this.data.usedNotifications / limit) * 100)
        });
      }
    } catch (error) {
      console.error('加载订阅失败:', error);
    }
  },

  upgradePlan: function () {
    wx.switchTab({
      url: '/pages/pricing/pricing'
    });
  },

  cancelSubscription: function () {
    wx.showModal({
      title: '确认取消',
      content: '取消后当前周期结束将降级为免费版，确定继续吗？',
      confirmText: '确认取消',
      confirmColor: '#ef4444',
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
              icon: 'success',
              duration: 2000
            });

            this.loadSubscription();
          } catch (error) {
            console.error('取消失败:', error);
            wx.showToast({
              title: '取消失败',
              icon: 'none'
            });
          }
        }
      }
    });
  },

  toggleAutoRenew: function () {
    const current = this.data.autoRenew;
    this.setData({ autoRenew: !current });
  },

  viewHelp: function () {
    wx.showToast({
      title: '查看常见问题',
      icon: 'none'
    });
  }
});
