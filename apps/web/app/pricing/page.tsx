'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const DEMO_USER_ID = '4c590dec-2c16-44b9-8291-8855cecc824f';

const plans = [
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
      '基础数据分析',
    ],
    cta: '开始使用',
    popular: false,
    color: 'gray',
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
      '数据导出功能',
    ],
    cta: '订阅专业版',
    popular: true,
    color: 'blue',
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
      '自定义集成',
    ],
    cta: '联系销售',
    popular: false,
    color: 'purple',
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const handleSubscribe = async (plan: any) => {
    if (plan.id === 'free') {
      // 免费版直接订阅
      await handleConfirmSubscription('free');
    } else if (plan.id === 'enterprise') {
      // 企业版显示联系信息
      alert('📧 企业版请联系：sales@tweetalert.pro\n📞 电话：400-xxx-xxxx');
    } else {
      // 其他版本显示支付页面
      setSelectedPlan(plan);
      setShowPayment(true);
    }
  };

  const handleConfirmSubscription = async (planId: string) => {
    setLoading(planId);
    try {
      const response = await fetch('http://localhost:3001/api/billing/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': DEMO_USER_ID,
        },
        body: JSON.stringify({ plan: planId }),
      });

      if (response.ok) {
        alert(`✅ 订阅${plans.find(p => p.id === planId)?.name}成功！`);
        router.push('/dashboard?subscribed=true');
      } else {
        alert('❌ 订阅失败，请重试');
      }
    } catch (error) {
      console.error('订阅失败:', error);
      alert('❌ 网络错误，请重试');
    } finally {
      setLoading(null);
    }
  };

  if (showPayment && selectedPlan) {
    return (
      <PaymentModal
        plan={selectedPlan}
        onClose={() => setShowPayment(false)}
        onConfirm={() => handleConfirmSubscription(selectedPlan.id)}
        loading={loading === selectedPlan.id}
      />
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto">
        {/* 页面头部 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            选择适合你的计划
          </h1>
          <p className="text-gray-600 text-lg">灵活订阅，随时取消，7 天无理由退款</p>
          
          <div className="mt-4 flex items-center justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              支持支付宝/微信
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              7 天无理由退款
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              随时取消
            </span>
          </div>
        </div>

        {/* 价格卡片 */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative p-8 rounded-2xl border-2 transition-all hover:shadow-xl ${
                plan.popular
                  ? 'border-blue-500 shadow-xl scale-105'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                  ⭐ 最受欢迎
                </span>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ¥{plan.price}
                  </span>
                  <span className="text-gray-500 ml-2">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan)}
                disabled={loading === plan.id}
                className={`w-full py-3 rounded-lg font-medium transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading === plan.id ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    处理中...
                  </span>
                ) : (
                  plan.cta
                )}
              </button>
            </div>
          ))}
        </div>

        {/* 常见问题 */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">❓ 常见问题</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <FAQItem
              question="如何取消订阅？"
              answer="随时在账户设置中取消订阅，取消后当前周期内仍可正常使用。"
            />
            <FAQItem
              question="支持退款吗？"
              answer="支持 7 天无理由退款，订阅后 7 天内可随时申请全额退款。"
            />
            <FAQItem
              question="可以升级或降级吗？"
              answer="可以随时升级或降级套餐，费用按比例计算。"
            />
            <FAQItem
              question="支持开具发票吗？"
              answer="支持开具增值税普通发票和专用发票，企业版用户免费开具。"
            />
          </div>
        </div>

        {/* 支付方式 */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-md">
          <h3 className="font-bold mb-4 text-lg">💳 支付方式</h3>
          <div className="flex flex-wrap gap-4">
            <PaymentMethod icon="💳" name="支付宝" />
            <PaymentMethod icon="💳" name="微信支付" />
            <PaymentMethod icon="💳" name="银联云闪付" />
            <PaymentMethod icon="💳" name="信用卡" />
          </div>
        </div>

        {/* 返回首页 */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center mx-auto"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回首页
          </button>
        </div>
      </div>
    </div>
  );
}

// 支付弹窗组件
function PaymentModal({ plan, onClose, onConfirm, loading }: any) {
  const [paymentMethod, setPaymentMethod] = useState('alipay');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative animate-fade-in">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 标题 */}
        <h2 className="text-2xl font-bold mb-2">确认订阅</h2>
        <p className="text-gray-600 mb-6">选择支付方式并完成支付</p>

        {/* 计划信息 */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">{plan.name}</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ¥{plan.price}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            周期：{plan.period}
          </div>
        </div>

        {/* 支付方式选择 */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">选择支付方式</h3>
          <div className="grid grid-cols-2 gap-3">
            <PaymentOption
              id="alipay"
              icon="💳"
              name="支付宝"
              selected={paymentMethod === 'alipay'}
              onSelect={() => setPaymentMethod('alipay')}
            />
            <PaymentOption
              id="wechat"
              icon="💳"
              name="微信支付"
              selected={paymentMethod === 'wechat'}
              onSelect={() => setPaymentMethod('wechat')}
            />
            <PaymentOption
              id="unionpay"
              icon="💳"
              name="云闪付"
              selected={paymentMethod === 'unionpay'}
              onSelect={() => setPaymentMethod('unionpay')}
            />
            <PaymentOption
              id="credit"
              icon="💳"
              name="信用卡"
              selected={paymentMethod === 'credit'}
              onSelect={() => setPaymentMethod('credit')}
            />
          </div>
        </div>

        {/* 模拟二维码 */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-center">
          <div className="w-48 h-48 bg-white mx-auto mb-3 flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <div className="text-4xl mb-2">📱</div>
              <div className="text-sm text-gray-500">模拟支付二维码</div>
              <div className="text-xs text-gray-400 mt-1">测试环境无需扫码</div>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            打开{paymentMethod === 'alipay' ? '支付宝' : paymentMethod === 'wechat' ? '微信' : '应用'}扫一扫
          </p>
        </div>

        {/* 确认按钮 */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                处理中...
              </span>
            ) : (
              `确认支付 ¥${plan.price}`
            )}
          </button>
        </div>

        {/* 安全提示 */}
        <div className="mt-4 text-center text-xs text-gray-500">
          🔒 安全加密支付 · 7 天无理由退款
        </div>
      </div>
    </div>
  );
}

// 支付选项组件
function PaymentOption({ id, icon, name, selected, onSelect }: any) {
  return (
    <button
      onClick={onSelect}
      className={`p-3 rounded-lg border-2 transition-all ${
        selected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-sm font-medium">{name}</div>
    </button>
  );
}

// 支付方式组件
function PaymentMethod({ icon, name }: any) {
  return (
    <div className="flex items-center px-4 py-2 bg-gray-50 rounded-lg">
      <span className="text-2xl mr-2">{icon}</span>
      <span className="text-gray-700">{name}</span>
    </div>
  );
}

// FAQ 组件
function FAQItem({ question, answer }: any) {
  return (
    <div className="border-b border-gray-200 pb-4">
      <h4 className="font-medium mb-2 flex items-center">
        <span className="text-blue-500 mr-2">❓</span>
        {question}
      </h4>
      <p className="text-gray-600 text-sm">{answer}</p>
    </div>
  );
}
