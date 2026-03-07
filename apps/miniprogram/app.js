App({
  onLaunch: function () {
    console.log('推文哨兵小程序启动');
    
    // 检查登录状态
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.globalData.userInfo = userInfo;
      this.globalData.userId = userInfo.id || '4c590dec-2c16-44b9-8291-8855cecc824f';
    } else {
      // 使用演示用户
      this.globalData.userId = '4c590dec-2c16-44b9-8291-8855cecc824f';
    }
  },
  
  globalData: {
    userInfo: null,
    userId: '4c590dec-2c16-44b9-8291-8855cecc824f',
    // 后端 API 地址 - 开发环境请修改为实际 IP
    apiBaseUrl: 'http://localhost:3001/api',
    // 生产环境示例
    // apiBaseUrl: 'https://your-domain.com/api'
  },
  
  // 通用请求方法
  request: function(options) {
    const that = this;
    return new Promise((resolve, reject) => {
      wx.request({
        url: that.globalData.apiBaseUrl + options.url,
        method: options.method || 'GET',
        data: options.data || {},
        header: {
          'Content-Type': 'application/json',
          'x-user-id': that.globalData.userId,
          ...options.header
        },
        success: function(res) {
          if (res.statusCode === 200) {
            resolve(res.data);
          } else {
            wx.showToast({
              title: res.data.message || '请求失败',
              icon: 'none'
            });
            reject(res.data);
          }
        },
        fail: function(err) {
          wx.showToast({
            title: '网络错误',
            icon: 'none'
          });
          reject(err);
        }
      });
    });
  }
});
