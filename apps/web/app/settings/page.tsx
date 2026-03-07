'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const DEMO_USER_ID = '4c590dec-2c16-44b9-8291-8855cecc824f';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState<{[key: string]: boolean}>({});
  const [testResults, setTestResults] = useState<{[key: string]: {success: boolean, message: string}}>({});
  const [activeTab, setActiveTab] = useState('twitter');
  const [settings, setSettings] = useState({
    // Twitter API
    twitterApiKey: '',
    twitterApiSecret: '',
    twitterAccessToken: '',
    twitterAccessSecret: '',
    
    // Twilio
    twilioAccountSid: '',
    twilioAuthToken: '',
    twilioPhoneNumber: '',
    
    // 邮件
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPassword: '',
    smtpFrom: '',
    
    // 默认通知配置
    defaultWebhook: '',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/settings`, {
        headers: { 'x-user-id': DEMO_USER_ID },
      });
      
      if (response.ok) {
        const data = await response.json();
        setSettings(prev => ({
          ...prev,
          ...data,
        }));
      }
    } catch (error) {
      console.error('加载配置失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`http://localhost:3001/api/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': DEMO_USER_ID,
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        alert('✅ 保存成功！配置已更新');
      } else {
        alert('❌ 保存失败，请重试');
      }
    } catch (error) {
      console.error('保存失败:', error);
      alert('❌ 保存失败，请重试');
    } finally {
      setSaving(false);
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
        body: JSON.stringify({ 
          type,
          settings 
        }),
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

  const tabs = [
    { id: 'twitter', name: 'Twitter API', icon: '🐦', required: true },
    { id: 'twilio', name: '语音电话', icon: '📞', required: true },
    { id: 'email', name: '邮件服务', icon: '📧', required: true },
    { id: 'webhook', name: '消息通知', icon: '💬', required: false },
  ];

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">功能配置</h1>
            <p className="text-gray-600 mt-1">配置第三方服务和通知渠道</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium shadow-lg shadow-blue-500/30"
          >
            {saving ? '保存中...' : '保存配置'}
          </button>
        </div>

        {/* 配置说明 */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-start">
            <span className="text-2xl mr-3">💡</span>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">配置指南</h3>
              <p className="text-sm text-blue-700">
                详细配置步骤请查看{' '}
                <a href="/SETUP_GUIDE.md" target="_blank" className="underline font-medium">
                  配置清单文档
                </a>
                {' '}或访问{' '}
                <a href="https://github.com/zx-12301/tweet-alert-pro" target="_blank" className="underline font-medium">
                  GitHub 仓库
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* 选项卡 */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-all relative ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
                {tab.required && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Twitter API 配置 */}
            {activeTab === 'twitter' && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-blue-900 mb-2">🐦 Twitter API 配置</h3>
                  <p className="text-sm text-blue-700 mb-3">
                    在{' '}
                    <a href="https://developer.twitter.com/en/portal/dashboard" target="_blank" className="underline font-medium">
                      Twitter Developer Portal
                    </a>{' '}
                    申请 API 密钥
                  </p>
                  <div className="flex items-center text-sm text-blue-800">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2">
                      必须配置
                    </span>
                    <span>用于监控 Twitter 用户推文</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      API Key <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={settings.twitterApiKey}
                      onChange={(e) => setSettings({...settings, twitterApiKey: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="请输入 API Key"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      API Secret <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={settings.twitterApiSecret}
                      onChange={(e) => setSettings({...settings, twitterApiSecret: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="请输入 API Secret"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Access Token <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={settings.twitterAccessToken}
                      onChange={(e) => setSettings({...settings, twitterAccessToken: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="请输入 Access Token"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Access Token Secret <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={settings.twitterAccessSecret}
                      onChange={(e) => setSettings({...settings, twitterAccessSecret: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="请输入 Access Token Secret"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleTestConnection('twitter')}
                    disabled={testing['twitter']}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium flex items-center"
                  >
                    {testing['twitter'] ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        测试中...
                      </>
                    ) : (
                      <>
                        🔍 测试连接
                      </>
                    )}
                  </button>
                </div>
                {testResults['twitter'] && (
                  <div className={`p-3 rounded-lg ${testResults['twitter'].success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <p className={`text-sm ${testResults['twitter'].success ? 'text-green-800' : 'text-red-800'}`}>
                      {testResults['twitter'].message}
                    </p>
                  </div>
                )}

                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    ⚠️ 注意：需要申请 Twitter API v2 的读取权限才能监控用户推文
                  </p>
                </div>
              </div>
            )}

            {/* Twilio 配置 */}
            {activeTab === 'twilio' && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-green-900 mb-2">📞 Twilio 语音电话配置</h3>
                  <p className="text-sm text-green-700 mb-3">
                    在{' '}
                    <a href="https://console.twilio.com/" target="_blank" className="underline font-medium">
                      Twilio Console
                    </a>{' '}
                    获取账户信息
                  </p>
                  <div className="flex items-center text-sm text-green-800">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2">
                      必须配置
                    </span>
                    <span>用于拨打语音电话通知</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account SID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={settings.twilioAccountSid}
                    onChange={(e) => setSettings({...settings, twilioAccountSid: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Auth Token <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={settings.twilioAuthToken}
                    onChange={(e) => setSettings({...settings, twilioAuthToken: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="请输入 Auth Token"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    电话号码
                  </label>
                  <input
                    type="tel"
                    value={settings.twilioPhoneNumber}
                    onChange={(e) => setSettings({...settings, twilioPhoneNumber: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="+1234567890"
                  />
                  <p className="text-xs text-gray-500 mt-1">用于外呼的 Twilio 号码</p>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleTestConnection('twilio')}
                    disabled={testing['twilio']}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium flex items-center"
                  >
                    {testing['twilio'] ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        测试中...
                      </>
                    ) : (
                      <>
                        📞 测试电话
                      </>
                    )}
                  </button>
                </div>
                {testResults['twilio'] && (
                  <div className={`p-3 rounded-lg ${testResults['twilio'].success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <p className={`text-sm ${testResults['twilio'].success ? 'text-green-800' : 'text-red-800'}`}>
                      {testResults['twilio'].message}
                    </p>
                  </div>
                )}

                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    💡 提示：Twilio 新账户默认有$15 试用额度，可以发送测试短信和拨打验证过的号码
                  </p>
                </div>
              </div>
            )}

            {/* 邮件服务配置 */}
            {activeTab === 'email' && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-purple-900 mb-2">📧 SMTP 邮件服务配置</h3>
                  <p className="text-sm text-purple-700 mb-3">
                    推荐使用{' '}
                    <a href="https://sendgrid.com/" target="_blank" className="underline font-medium">
                      SendGrid
                    </a>{' '}
                    或{' '}
                    <a href="https://www.aliyun.com/product/directmail" target="_blank" className="underline font-medium">
                      阿里云邮件推送
                    </a>
                  </p>
                  <div className="flex items-center text-sm text-purple-800">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2">
                      必须配置
                    </span>
                    <span>用于发送邮件通知</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SMTP 服务器
                    </label>
                    <input
                      type="text"
                      value={settings.smtpHost}
                      onChange={(e) => setSettings({...settings, smtpHost: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="smtp.example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      端口
                    </label>
                    <select
                      value={settings.smtpPort}
                      onChange={(e) => setSettings({...settings, smtpPort: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="25">25 (SMTP)</option>
                      <option value="465">465 (SSL)</option>
                      <option value="587">587 (TLS)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    用户名
                  </label>
                  <input
                    type="text"
                    value={settings.smtpUser}
                    onChange={(e) => setSettings({...settings, smtpUser: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="username@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    密码 / 授权码
                  </label>
                  <input
                    type="password"
                    value={settings.smtpPassword}
                    onChange={(e) => setSettings({...settings, smtpPassword: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="请输入密码或授权码"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    发件人邮箱
                  </label>
                  <input
                    type="email"
                    value={settings.smtpFrom}
                    onChange={(e) => setSettings({...settings, smtpFrom: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="noreply@example.com"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleTestConnection('email')}
                    disabled={testing['email']}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium flex items-center"
                  >
                    {testing['email'] ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        测试中...
                      </>
                    ) : (
                      <>
                        📧 测试邮件
                      </>
                    )}
                  </button>
                </div>
                {testResults['email'] && (
                  <div className={`p-3 rounded-lg ${testResults['email'].success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <p className={`text-sm ${testResults['email'].success ? 'text-green-800' : 'text-red-800'}`}>
                      {testResults['email'].message}
                    </p>
                  </div>
                )}

                <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">常用邮箱 SMTP 配置</h4>
                  <div className="text-sm text-purple-800 space-y-1">
                    <p><strong>Gmail:</strong> smtp.gmail.com:587</p>
                    <p><strong>163 邮箱:</strong> smtp.163.com:587</p>
                    <p><strong>QQ 邮箱:</strong> smtp.qq.com:587</p>
                  </div>
                </div>
              </div>
            )}

            {/* Webhook 配置 */}
            {activeTab === 'webhook' && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-orange-900 mb-2">💬 消息通知配置</h3>
                  <p className="text-sm text-orange-700 mb-3">
                    配置默认的 Webhook 地址，用于发送通知到飞书、钉钉、企业微信等平台
                  </p>
                  <div className="flex items-center text-sm text-orange-800">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                      可选配置
                    </span>
                    <span>按需配置使用的平台</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    默认 Webhook URL
                  </label>
                  <input
                    type="url"
                    value={settings.defaultWebhook}
                    onChange={(e) => setSettings({...settings, defaultWebhook: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="https://open.feishu.cn/open-apis/bot/v2/hook/xxx"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    此地址将作为创建任务时的默认 Webhook 选项
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <p className="text-sm text-blue-800">
                    💡 <strong>提示：</strong>邮件通知请使用上方<strong>「邮件服务」</strong>标签中配置的发件人邮箱，创建任务时会自动填充。
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleTestConnection('webhook')}
                    disabled={testing['webhook']}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium flex items-center"
                  >
                    {testing['webhook'] ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        测试中...
                      </>
                    ) : (
                      <>
                        💬 测试 Webhook
                      </>
                    )}
                  </button>
                </div>
                {testResults['webhook'] && (
                  <div className={`p-3 rounded-lg ${testResults['webhook'].success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <p className={`text-sm ${testResults['webhook'].success ? 'text-green-800' : 'text-red-800'}`}>
                      {testResults['webhook'].message}
                    </p>
                  </div>
                )}

                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">常用 Webhook 格式</h4>
                  <div className="space-y-3">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center mb-2">
                        <span className="text-xl mr-2">🚀</span>
                        <p className="font-medium text-gray-900">飞书机器人</p>
                      </div>
                      <code className="text-xs text-gray-600 block bg-white p-2 rounded">
                        https://open.feishu.cn/open-apis/bot/v2/hook/TOKEN
                      </code>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center mb-2">
                        <span className="text-xl mr-2">📌</span>
                        <p className="font-medium text-gray-900">钉钉机器人</p>
                      </div>
                      <code className="text-xs text-gray-600 block bg-white p-2 rounded">
                        https://oapi.dingtalk.com/robot/send?access_token=TOKEN
                      </code>
                    </div>
                    
                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                      <div className="flex items-center mb-2">
                        <span className="text-xl mr-2">💼</span>
                        <p className="font-medium text-gray-900">企业微信机器人</p>
                      </div>
                      <code className="text-xs text-gray-600 block bg-white p-2 rounded">
                        https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=KEY
                      </code>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h4 className="font-medium text-orange-900 mb-2">💡 如何获取 Webhook</h4>
                  <div className="text-sm text-orange-800 space-y-2">
                    <p><strong>飞书:</strong> 群聊 → ... → 添加机器人 → 自定义机器人</p>
                    <p><strong>钉钉:</strong> 群聊 → ... → 智能群助手 → 添加机器人 → 自定义</p>
                    <p><strong>企业微信:</strong> 群聊 → ... → 添加群机器人 → 新建</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 配置说明 */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">📖 配置说明</h2>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start">
              <span className="inline-flex items-center justify-center w-5 h-5 bg-red-100 text-red-600 rounded-full text-xs font-bold mr-2 mt-0.5">!</span>
              <p><strong>红色标记</strong> 为必须配置的核心功能，否则监控无法正常工作</p>
            </div>
            <div className="flex items-start">
              <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs font-bold mr-2 mt-0.5">?</span>
              <p><strong>蓝色标记</strong> 为可选配置，根据实际需求配置</p>
            </div>
            <div className="flex items-start">
              <span className="text-xl mr-2">🐦</span>
              <p><strong>Twitter API</strong> - 用于监控用户推文，需要申请开发者账号（免费）</p>
            </div>
            <div className="flex items-start">
              <span className="text-xl mr-2">📞</span>
              <p><strong>Twilio</strong> - 用于语音电话通知，新账户有$15 试用额度</p>
            </div>
            <div className="flex items-start">
              <span className="text-xl mr-2">📧</span>
              <p><strong>邮件服务</strong> - 用于发送邮件通知，推荐使用 Gmail 或 SendGrid</p>
            </div>
            <div className="flex items-start">
              <span className="text-xl mr-2">💬</span>
              <p><strong>Webhook</strong> - 用于发送消息到飞书、钉钉、企业微信等协作平台</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
