Page({
  data: {
    userInfo: {
      name: '演示用户',
      email: 'user@demo.com',
      phone: ''
    },
    currentPlan: '免费版',
    notificationsEnabled: true,
    cacheSize: '12.5 MB'
  },

  onLoad: function () {
    this.loadUserInfo();
  },

  // 加载用户信息
  loadUserInfo: async function () {
    try {
      const app = getApp();
      
      // 从全局获取用户信息
      if (app.globalData.userInfo) {
        this.setData({
          userInfo: app.globalData.userInfo
        });
      }
      
      // 加载订阅信息
      const subscription = await app.request({ url: '/billing/subscription' });
      if (subscription && subscription.plan) {
        const planNames = {
          free: '免费版',
          pro: '专业版',
          enterprise: '企业版'
        };
        this.setData({
          currentPlan: planNames[subscription.plan] || '免费版'
        });
      }
    } catch (error) {
      console.error('加载用户信息失败:', error);
    }
  },

  // 编辑资料
  editProfile: function () {
    wx.showActionSheet({
      itemList: ['修改昵称'],
      success: (res) => {
        if (res.tapIndex === 0) {
          wx.showModal({
            title: '修改昵称',
            editable: true,
            placeholderText: '请输入新昵称',
            success: (res) => {
              if (res.confirm && res.content) {
                this.setData({
                  'userInfo.name': res.content
                });
                
                wx.showToast({
                  title: '修改成功',
                  icon: 'success'
                });
              }
            }
          });
        }
      }
    });
  },

  // 编辑邮箱
  editEmail: function () {
    wx.showModal({
      title: '修改邮箱',
      editable: true,
      placeholderText: '请输入新邮箱',
      success: (res) => {
        if (res.confirm && res.content) {
          // 验证邮箱格式
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(res.content)) {
            wx.showToast({
              title: '邮箱格式不正确',
              icon: 'none'
            });
            return;
          }
          
          this.setData({
            'userInfo.email': res.content
          });
          
          wx.showToast({
            title: '修改成功',
            icon: 'success'
          });
        }
      }
    });
  },

  // 编辑手机号
  editPhone: function () {
    wx.showModal({
      title: '绑定手机号',
      editable: true,
      placeholderText: '请输入手机号',
      success: (res) => {
        if (res.confirm && res.content) {
          // 验证手机号格式
          const phoneRegex = /^1[3-9]\d{9}$/;
          if (!phoneRegex.test(res.content)) {
            wx.showToast({
              title: '手机号格式不正确',
              icon: 'none'
            });
            return;
          }
          
          this.setData({
            'userInfo.phone': res.content
          });
          
          wx.showToast({
            title: '绑定成功',
            icon: 'success'
          });
        }
      }
    });
  },

  // 修改密码
  changePassword: function () {
    wx.showModal({
      title: '修改密码',
      content: '请联系管理员重置密码',
      showCancel: false,
      confirmText: '知道了',
      confirmColor: '#2563eb'
    });
  },

  // 查看登录设备
  viewLoginDevices: function () {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  // 切换通知
  toggleNotifications: function () {
    this.setData({
      notificationsEnabled: !this.data.notificationsEnabled
    });
    
    wx.showToast({
      title: this.data.notificationsEnabled ? '已开启通知' : '已关闭通知',
      icon: 'success'
    });
  },

  // 清除缓存
  clearCache: function () {
    wx.showLoading({ title: '清理中...' });
    
    setTimeout(() => {
      wx.hideLoading();
      this.setData({ cacheSize: '0 B' });
      
      wx.showToast({
        title: '清理成功',
        icon: 'success'
      });
    }, 1000);
  },

  // 查看版本
  viewVersion: function () {
    wx.showModal({
      title: '版本信息',
      content: '当前版本：1.0.0\n\n检查更新...',
      showCancel: false,
      confirmColor: '#2563eb'
    });
  },

  // 联系客服
  contactSupport: function () {
    wx.showModal({
      title: '联系客服',
      content: '📧 邮箱：support@tweetalert.pro\n\n客服时间：9:00-18:00',
      showCancel: false,
      confirmColor: '#2563eb'
    });
  },

  // 退出登录
  logout: function () {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除本地存储
          wx.clearStorageSync();
          
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          });
          
          // 跳转到登录页或首页
          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/index/index'
            });
          }, 1500);
        }
      }
    });
  }
});
