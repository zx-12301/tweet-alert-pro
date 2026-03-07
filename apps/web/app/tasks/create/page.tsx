'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const DEMO_USER_ID = '4c590dec-2c16-44b9-8291-8855cecc824f';

export default function CreateTaskPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [testing, setTesting] = useState<{[key: string]: boolean}>({});
  const [testResults, setTestResults] = useState<{[key: string]: {success: boolean, message: string}}>({});
  const [settings, setSettings] = useState<any>({});
  const [formData, setFormData] = useState({
    twitterHandle: '',
    keywords: '',
    minLikes: '',
    minRetweets: '',
    notifyChannels: {
      phone: false,
      wechat: false,
      email: false,
    },
    phoneNumbers: '',
    webhooks: '',
    emails: '',
  });

  // 加载用户配置，自动填充默认值
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/settings', {
        headers: { 'x-user-id': DEMO_USER_ID },
      });
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
        // 自动填充配置
        if (data.defaultWebhook) {
          setFormData(prev => ({ ...prev, webhooks: data.defaultWebhook }));
        }
        if (data.smtpFrom) {
          setFormData(prev => ({ ...prev, emails: data.smtpFrom }));
        }
        if (data.twilioPhoneNumber) {
          setFormData(prev => ({ ...prev, phoneNumbers: data.twilioPhoneNumber }));
        }
      }
    } catch (error) {
      console.error('加载配置失败:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/tasks', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': DEMO_USER_ID,
        },
        body: JSON.stringify({
          twitterHandle: formData.twitterHandle.replace('@', ''),
          keywords: formData.keywords.split(',').filter(k => k.trim()),
          minLikes: formData.minLikes ? parseInt(formData.minLikes) : null,
          minRetweets: formData.minRetweets ? parseInt(formData.minRetweets) : null,
          notifyChannels: formData.notifyChannels,
          phoneNumbers: formData.phoneNumbers.split(',').filter(p => p.trim()),
          webhooks: formData.webhooks.split(',').filter(w => w.trim()),
          emails: formData.emails.split(',').filter(e => e.trim()),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('✅ 任务创建成功！');
        router.push('/dashboard');
      } else {
        // 显示详细错误信息
        const errorMessage = result.message || result.error || '未知错误';
        alert(`❌ 创建失败：${errorMessage}`);
      }
    } catch (error: any) {
      console.error('Failed to create task:', error);
      const errorMessage = error.message || '网络错误，请检查 API 服务是否运行';
      alert(`❌ 创建失败：${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async (type: string) => {
    setTesting({...testing, [type]: true});
    setTestResults({...testResults, [type]: {success: false, message: '测试中...'}});

    try {
      const response = await fetch('http://localhost:3001/api/settings/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': DEMO_USER_ID,
        },
        body: JSON.stringify({ type }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setTestResults({...testResults, [type]: {success: true, message: result.message}});
        alert(`✅ ${result.message}`);
      } else {
        setTestResults({...testResults, [type]: {success: false, message: result.message || '测试失败'}});
        alert(`❌ ${result.message || '测试失败'}`);
      }
    } catch (error: any) {
      setTestResults({...testResults, [type]: {success: false, message: error.message}});
      alert(`❌ 测试失败：${error.message}`);
    } finally {
      setTesting({...testing, [type]: false});
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">创建监控任务</h1>
        <p className="text-gray-600 mb-8">配置要监控的 Twitter 账号和通知规则</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 基本信息 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">基本信息</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Twitter 账号 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.twitterHandle}
                  onChange={(e) => setFormData({ ...formData, twitterHandle: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="@elonmusk"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">输入要监控的 Twitter 用户名（包含或不包含 @ 均可）</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  关键词过滤
                </label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="AI, Tesla, SpaceX"
                />
                <p className="text-xs text-gray-500 mt-1">用逗号分隔多个关键词，留空则监控所有推文</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    最小点赞数
                  </label>
                  <input
                    type="number"
                    value={formData.minLikes}
                    onChange={(e) => setFormData({ ...formData, minLikes: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1000"
                  />
                  <p className="text-xs text-gray-500 mt-1">只通知点赞数达到此值的推文</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    最小转发数
                  </label>
                  <input
                    type="number"
                    value={formData.minRetweets}
                    onChange={(e) => setFormData({ ...formData, minRetweets: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="100"
                  />
                  <p className="text-xs text-gray-500 mt-1">只通知转发数达到此值的推文</p>
                </div>
              </div>
            </div>
          </div>

          {/* 通知设置 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">通知设置</h2>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
              >
                {showAdvanced ? '收起高级选项' : '展开高级选项'}
                <svg className={`w-4 h-4 ml-1 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            <div className={`space-y-4 transition-all duration-300 overflow-hidden ${showAdvanced ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
              {/* 语音电话 */}
              <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                <input
                  type="checkbox"
                  checked={formData.notifyChannels.phone}
                  onChange={(e) => setFormData({
                    ...formData,
                    notifyChannels: { ...formData.notifyChannels, phone: e.target.checked },
                  })}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-medium text-gray-900">语音电话通知</label>
                    <span className="text-xs text-gray-500">需要配置 Twilio</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">接到自动语音电话通知</p>
                  {formData.notifyChannels.phone && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={formData.phoneNumbers}
                        onChange={(e) => setFormData({ ...formData, phoneNumbers: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                        placeholder="+8613800138000（多个号码用逗号分隔）"
                      />
                      <button
                        type="button"
                        onClick={() => handleTestConnection('twilio')}
                        disabled={testing['twilio']}
                        className="text-xs px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        {testing['twilio'] ? '测试中...' : '🔊 测试电话'}
                      </button>
                      {testResults['twilio'] && (
                        <p className={`text-xs ${testResults['twilio'].success ? 'text-green-600' : 'text-red-600'}`}>
                          {testResults['twilio'].message}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* 邮件通知 */}
              <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                <input
                  type="checkbox"
                  checked={formData.notifyChannels.email}
                  onChange={(e) => setFormData({
                    ...formData,
                    notifyChannels: { ...formData.notifyChannels, email: e.target.checked },
                  })}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-medium text-gray-900">邮件通知</label>
                    <span className="text-xs text-gray-500">需要配置 SMTP</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">发送邮件到指定邮箱</p>
                  {formData.notifyChannels.email && (
                    <div className="space-y-2">
                      <input
                        type="email"
                        value={formData.emails}
                        onChange={(e) => setFormData({ ...formData, emails: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                        placeholder="user@example.com（多个邮箱用逗号分隔）"
                      />
                      <button
                        type="button"
                        onClick={() => handleTestConnection('email')}
                        disabled={testing['email']}
                        className="text-xs px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        {testing['email'] ? '测试中...' : '📧 测试邮件'}
                      </button>
                      {testResults['email'] && (
                        <p className={`text-xs ${testResults['email'].success ? 'text-green-600' : 'text-red-600'}`}>
                          {testResults['email'].message}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Webhook 通知 */}
              <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                <input
                  type="checkbox"
                  checked={formData.notifyChannels.wechat}
                  onChange={(e) => setFormData({
                    ...formData,
                    notifyChannels: { ...formData.notifyChannels, wechat: e.target.checked },
                  })}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-medium text-gray-900">微信/钉钉/飞书通知</label>
                    <span className="text-xs text-gray-500">需要配置 Webhook</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">发送消息到协作平台</p>
                  {formData.notifyChannels.wechat && (
                    <div className="space-y-2">
                      <input
                        type="url"
                        value={formData.webhooks}
                        onChange={(e) => setFormData({ ...formData, webhooks: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                        placeholder="https://oapi.dingtalk.com/robot/send?access_token=xxx"
                      />
                      <button
                        type="button"
                        onClick={() => handleTestConnection('webhook')}
                        disabled={testing['webhook']}
                        className="text-xs px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        {testing['webhook'] ? '测试中...' : '💬 测试 Webhook'}
                      </button>
                      {testResults['webhook'] && (
                        <p className={`text-xs ${testResults['webhook'].success ? 'text-green-600' : 'text-red-600'}`}>
                          {testResults['webhook'].message}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 配置提示 */}
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 还没有配置？前往 <Link href="/settings" className="underline font-medium">功能配置</Link> 页面设置 Twitter API、Twilio、邮件服务等
              </p>
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? '创建中...' : '创建监控任务'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
