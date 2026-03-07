Page({
  data: {
    plans: [
      {
        id: 'free',
        name: '免费版',
        price: 0,
        period: '永久',
        features: [
          '每日 5 次通知额度',
          '最多 3 个监控任务',
          '基础通知渠道（微信/邮件）',
          '5 分钟检测间隔',
          '基础数据分析'
        ],
        cta: '开始使用',
        popular: false
      },
      {
        id: 'pro',
        name: '专业版',
        price: 29,
        period: '月付',
        features: [
          '每日 100 次通知额度',
          '最多 20 个监控任务',
          '全部通知渠道（含语音电话）',
          '1 分钟检测间隔',
          '关键词过滤',
          '优先级支持',
          '数据导出功能'
        ],
        cta: '订阅专业版',
        popular: true
      },
      {
        id: 'enterprise',
        name: '企业版',
        price: 99,
        period: '月付',
        features: [
          '无限通知额度',
          '无限监控任务',
          '全部通知渠道',
          '实时检测（Streaming API）',
          '高级过滤规则',
          '专属客户经理',
          'API 访问权限',
          '自定义集成'
        ],
        cta: '联系销售',
        popular: false
      }
    ],
    
    // FAQ
    faqs: [
      {
        question: '如何取消订阅？',
        answer: '随时在账户设置中取消订阅，取消后当前周期内仍可正常使用。',
        open: false
      },
      {
        question: '支持退款吗？',
        answer: '支持 7 天无理由退款，订阅后 7 天内可随时申请全额退款。',
        open: false
      },
      {
        question: '可以升级或降级吗？',
        answer: '可以随时升级或降级套餐，费用按比例计算。',
        open: false
      },
      {
        question: '支持开具发票吗？',
        answer: '支持开具增值税普通发票和专用发票，企业版用户免费开具。',
        open: false
      }
    ],
    
    // 支付相关
    showPayment: false,
    selectedPlan: null,
    paymentStatus: 'selecting', // selecting, paying, success, failed
    paymentMethod: 'alipay',
    orderId: '',
    countdown: 900, // 15 分钟
    countdownText: '15:00',
    paying: false,
    
    // 支付方式
    paymentMethods: [
      { id: 'alipay', name: '支付宝', icon: '💳' },
      { id: 'wechat', name: '微信支付', icon: '💳' },
      { id: 'unionpay', name: '云闪付', icon: '💳' },
      { id: 'credit', name: '信用卡', icon: '💳' }
    ]
  },

  onLoad: function () {
    // 加载用户当前订阅状态
    this.loadCurrentSubscription();
  },

  // 加载当前订阅
  loadCurrentSubscription: async function () {
    try {
      const app = getApp();
      const subscription = await app.request({ url: '/billing/subscription' });
      
      if (subscription && subscription.plan) {
        // 更新计划显示（标记当前计划）
        const plans = this.data.plans.map(plan => ({
          ...plan,
          current: plan.id === subscription.plan
        }));
        this.setData({ plans });
      }
    } catch (error) {
      console.error('加载订阅失败:', error);
    }
  },

  // 订阅
  subscribe: function (e) {
    const planId = e.currentTarget.dataset.plan;
    const plan = this.data.plans.find(p => p.id === planId);
    
    if (planId === 'free') {
      // 免费版直接订阅
      this.confirmSubscription('free');
    } else if (planId === 'enterprise') {
      // 企业版显示联系信息
      wx.showModal({
        title: '企业版咨询',
        content: '📧 邮箱：sales@tweetalert.pro\n📞 电话：400-xxx-xxxx\n\n我们的销售团队将尽快与您联系。',
        showCancel: false,
        confirmColor: '#2563eb'
      });
    } else {
      // 其他版本显示支付页面
      this.openPayment(plan);
    }
  },

  // 打开支付
  openPayment: function (plan) {
    const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    this.setData({
      showPayment: true,
      selectedPlan: plan,
      paymentStatus: 'selecting',
      orderId: orderId,
      countdown: 900,
      countdownText: '15:00'
    });
    
    // 开始倒计时
    this.startCountdown();
  },

  // 倒计时
  startCountdown: function () {
    const timer = setInterval(() => {
      if (this.data.countdown <= 0) {
        clearInterval(timer);
        return;
      }
      
      const newCountdown = this.data.countdown - 1;
      const minutes = Math.floor(newCountdown / 60);
      const seconds = newCountdown % 60;
      const countdownText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      
      this.setData({
        countdown: newCountdown,
        countdownText: countdownText
      });
      
      // 超时自动失败
      if (newCountdown === 0) {
        this.setData({ paymentStatus: 'failed' });
      }
    }, 1000);
    
    this.countdownTimer = timer;
  },

  // 选择支付方式
  selectPaymentMethod: function (e) {
    const methodId = e.currentTarget.dataset.id;
    this.setData({ paymentMethod: methodId });
  },

  // 确认支付
  confirmPayment: async function () {
    this.setData({ 
      paying: true,
      paymentStatus: 'paying'
    });
    
    // 模拟支付处理延迟
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 模拟支付结果（90% 成功率）
    const success = Math.random() > 0.1;
    
    if (success) {
      this.setData({ paymentStatus: 'success' });
      
      // 实际订阅
      this.confirmSubscription(this.data.selectedPlan.id);
      
      // 2 秒后跳转
      setTimeout(() => {
        this.closePayment();
        wx.switchTab({
          url: '/pages/subscription/subscription'
        });
      }, 2000);
    } else {
      this.setData({ paymentStatus: 'failed' });
    }
    
    this.setData({ paying: false });
  },

  // 实际订阅
  confirmSubscription: async function (planId) {
    try {
      const app = getApp();
      await app.request({
        url: '/billing/subscribe',
        method: 'POST',
        data: { plan: planId }
      });
      
      wx.showToast({
        title: `✅ 订阅${this.data.plans.find(p => p.id === planId)?.name}成功！`,
        icon: 'success',
        duration: 2500
      });
    } catch (error) {
      console.error('订阅失败:', error);
      wx.showToast({
        title: '订阅失败',
        icon: 'none'
      });
    }
  },

  // 重试支付
  retryPayment: function () {
    this.setData({
      paymentStatus: 'selecting',
      countdown: 900,
      countdownText: '15:00'
    });
    this.startCountdown();
  },

  // 关闭支付
  closePayment: function () {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
    
    this.setData({
      showPayment: false,
      paymentStatus: 'selecting'
    });
  },

  // FAQ 展开/收起
  toggleFaq: function (e) {
    const index = e.currentTarget.dataset.index;
    const key = `faqs[${index}].open`;
    this.setData({
      [key]: !this.data.faqs[index].open
    });
  },

  // 阻止事件冒泡
  stop: function () {}
});
