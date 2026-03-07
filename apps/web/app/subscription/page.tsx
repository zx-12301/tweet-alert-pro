'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const DEMO_USER_ID = '4c590dec-2c16-44b9-8291-8855cecc824f';

export default function SubscriptionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);
  const [usage, setUsage] = useState({
    usedNotifications: 12,
    totalNotifications: 100,
    usedTasks: 3,
    maxTasks: 20,
  });

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/billing/subscription', {
        headers: { 'x-user-id': DEMO_USER_ID },
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
      } else {
        // 没有订阅则显示免费版
        setSubscription({
          plan: 'free',
          status: 'active',
          dailyNotificationLimit: 5,
          maxTasks: 3,
        });
      }
    } catch (error) {
      console.error('加载订阅失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('确定要取消订阅吗？取消后当前周期结束将降级为免费版。')) {
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/billing/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': DEMO_USER_ID,
        },
      });

      if (response.ok) {
        alert('✅ 已取消订阅，当前周期结束后将降级为免费版');
        loadSubscription();
      } else {
        alert('❌ 取消失败，请重试');
      }
    } catch (error) {
      console.error('取消订阅失败:', error);
      alert('❌ 网络错误，请重试');
    }
  };

  const planNames: any = {
    free: '免费版',
    pro: '专业版',
    enterprise: '企业版',
  };

  const planColors: any = {
    free: 'from-gray-400 to-gray-500',
    pro: 'from-blue-500 to-blue-600',
    enterprise: 'from-purple-500 to-purple-600',
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载订阅信息...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto">
        {/* 页面头部 */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">订阅管理</h1>
            <p className="text-gray-600 mt-1">管理你的订阅计划和用量</p>
          </div>
          <button
            onClick={() => router.push('/pricing')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            升级计划
          </button>
        </div>

        {/* 当前计划卡片 */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className={`bg-gradient-to-r ${planColors[subscription?.plan || 'free']} p-6 text-white`}>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-80">当前计划</p>
                <h2 className="text-3xl font-bold">{planNames[subscription?.plan || 'free']}</h2>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-80">状态</p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20">
                  {subscription?.status === 'active' ? '✅ 活跃' : '⏸️ 已取消'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* 用量统计 */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* 通知用量 */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-900">📧 通知用量</h3>
                  <span className="text-sm text-gray-500">
                    {usage.usedNotifications} / {subscription?.dailyNotificationLimit || 5} /天
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${Math.min((usage.usedNotifications / (subscription?.dailyNotificationLimit || 5)) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">
                  剩余 {(subscription?.dailyNotificationLimit || 5) - usage.usedNotifications} 次通知额度
                </p>
              </div>

              {/* 任务用量 */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-900">📋 监控任务</h3>
                  <span className="text-sm text-gray-500">
                    {usage.usedTasks} / {subscription?.maxTasks || 3}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all"
                    style={{ width: `${Math.min((usage.usedTasks / (subscription?.maxTasks || 3)) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">
                  还可创建 {subscription?.maxTasks || 3} - {usage.usedTasks} 个任务
                </p>
              </div>
            </div>

            {/* 计划详情 */}
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">📊 计划详情</h3>
              <div className="space-y-3">
                <DetailRow label="订阅周期" value="按月订阅" />
                <DetailRow label="下次账单日" value="2026-04-07" />
                <DetailRow label="自动续费" value={
                  <span className="inline-flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    已开启
                  </span>
                } />
                <DetailRow label="支付方式" value="支付宝" />
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="border-t mt-6 pt-6 flex gap-4">
              <button
                onClick={() => router.push('/pricing')}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                升级/降级计划
              </button>
              <button
                onClick={handleCancelSubscription}
                className="flex-1 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 font-medium"
              >
                取消订阅
              </button>
            </div>
          </div>
        </div>

        {/* 账单历史 */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">📄 账单历史</h3>
          <div className="space-y-4">
            <BillItem
              date="2026-03-07"
              description="订阅专业版 - 月付"
              amount={29}
              status="paid"
            />
            <BillItem
              date="2026-02-07"
              description="订阅专业版 - 月付"
              amount={29}
              status="paid"
            />
            <BillItem
              date="2026-01-07"
              description="订阅专业版 - 月付"
              amount={29}
              status="paid"
            />
          </div>
          
          <div className="mt-6 text-center">
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              查看完整账单历史 →
            </button>
          </div>
        </div>

        {/* 常见问题 */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-md">
          <h3 className="font-bold mb-4">💡 温馨提示</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start">
              <span className="text-blue-500 mr-2">ℹ️</span>
              <p>取消订阅后，当前周期内仍可正常使用所有功能</p>
            </div>
            <div className="flex items-start">
              <span className="text-blue-500 mr-2">ℹ️</span>
              <p>升级计划立即生效，费用按比例计算</p>
            </div>
            <div className="flex items-start">
              <span className="text-blue-500 mr-2">ℹ️</span>
              <p>降级计划在下一个周期生效</p>
            </div>
            <div className="flex items-start">
              <span className="text-blue-500 mr-2">ℹ️</span>
              <p>需要帮助？联系 support@tweetalert.pro</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 详情行组件
function DetailRow({ label, value }: any) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}

// 账单项目组件
function BillItem({ date, description, amount, status }: any) {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600">📄</span>
        </div>
        <div>
          <p className="font-medium text-gray-900">{description}</p>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-gray-900">¥{amount}</p>
        <p className="text-xs text-green-600">
          {status === 'paid' ? '✅ 已支付' : '⏳ 待支付'}
        </p>
      </div>
    </div>
  );
}
