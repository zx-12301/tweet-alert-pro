'use client';

const plans = [
  {
    name: '免费版',
    price: 0,
    period: '永久',
    features: [
      '每日 5 次通知额度',
      '最多 3 个监控任务',
      '基础通知渠道（微信/邮件）',
      '5 分钟检测间隔',
    ],
    cta: '开始使用',
    popular: false,
  },
  {
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
    ],
    cta: '订阅专业版',
    popular: true,
  },
  {
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
    ],
    cta: '联系销售',
    popular: false,
  },
];

export default function PricingPage() {
  const handleSubscribe = (plan: string) => {
    alert(`选择了${plan} - 支付功能待接入`);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">选择适合你的计划</h1>
          <p className="text-gray-600">灵活订阅，随时取消</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-8 rounded-2xl border-2 ${
                plan.popular ? 'border-blue-500 shadow-xl' : 'border-gray-200'
              } bg-white`}
            >
              {plan.popular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  最受欢迎
                </span>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold">¥{plan.price}</span>
                  <span className="text-gray-500 ml-2">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.name)}
                className={`w-full py-3 rounded-lg font-medium ${
                  plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-white rounded-xl">
          <h3 className="font-bold mb-2">💳 支付方式</h3>
          <p className="text-gray-600 text-sm">
            支持支付宝、微信支付、信用卡。企业版支持对公转账和开具发票。
          </p>
        </div>

        <div className="mt-8 text-center">
          <a href="/" className="text-blue-600 hover:underline">返回首页</a>
        </div>
      </div>
    </div>
  );
}
