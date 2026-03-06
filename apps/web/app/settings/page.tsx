'use client';

import { useState, useEffect } from 'react';

const DEMO_USER_ID = '4c590dec-2c16-44b9-8291-8855cecc824f';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    defaultEmail: '',
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
        alert('保存成功！');
      } else {
        alert('保存失败，请重试');
      }
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'twitter', name: 'Twitter API', icon: '🐦' },
    { id: 'twilio', name: '语音电话', icon: '📞' },
    { id: 'email', name: '邮件服务', icon: '📧' },
    { id: 'webhook', name: 'Webhook', icon: '🔗' },
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
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {saving ? '保存中...' : '保存配置'}
          </button>
        </div>

        {/* 选项卡 */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Twitter API 配置 */}
            {activeTab === 'twitter' && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h3 className="font-medium text-blue-900 mb-2">🐦 Twitter API 配置</h3>
                  <p className="text-sm text-blue-700">
                    在 <a href="https://developer.twitter.com/en/portal/dashboard" target="_blank" className="underline font-medium">Twitter Developer Portal</a> 申请 API 密钥
                  </p>
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="请输入 Access Token Secret"
                    />
                  </div>
                </div>

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
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h3 className="font-medium text-blue-900 mb-2">📞 Twilio 语音电话配置</h3>
                  <p className="text-sm text-blue-700">
                    在 <a href="https://console.twilio.com/" target="_blank" className="underline font-medium">Twilio Console</a> 获取账户信息
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account SID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={settings.twilioAccountSid}
                    onChange={(e) => setSettings({...settings, twilioAccountSid: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="+1234567890"
                  />
                  <p className="text-xs text-gray-500 mt-1">用于外呼的 Twilio 号码</p>
                </div>

                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    💡 提示：Twilio 新账户默认有试用额度，可以发送测试短信和拨打验证过的号码
                  </p>
                </div>
              </div>
            )}

            {/* 邮件服务配置 */}
            {activeTab === 'email' && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h3 className="font-medium text-blue-900 mb-2">📧 SMTP 邮件服务配置</h3>
                  <p className="text-sm text-blue-700">
                    推荐使用 <a href="https://sendgrid.com/" target="_blank" className="underline font-medium">SendGrid</a> 或 <a href="https://www.aliyun.com/product/directmail" target="_blank" className="underline font-medium">阿里云邮件推送</a>
                  </p>
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="noreply@example.com"
                  />
                </div>

                <div className="mt-4">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">
                    测试邮件发送
                  </button>
                </div>
              </div>
            )}

            {/* Webhook 配置 */}
            {activeTab === 'webhook' && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h3 className="font-medium text-blue-900 mb-2">🔗 Webhook 通知配置</h3>
                  <p className="text-sm text-blue-700">
                    配置默认的 Webhook 地址，用于发送通知到微信、钉钉、飞书等平台
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    默认 Webhook URL
                  </label>
                  <input
                    type="url"
                    value={settings.defaultWebhook}
                    onChange={(e) => setSettings({...settings, defaultWebhook: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://oapi.dingtalk.com/robot/send?access_token=xxx"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    此地址将作为创建任务时的默认选项
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    默认通知邮箱
                  </label>
                  <input
                    type="email"
                    value={settings.defaultEmail}
                    onChange={(e) => setSettings({...settings, defaultEmail: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="user@example.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    此邮箱将作为创建任务时的默认邮件通知地址
                  </p>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">常用 Webhook 格式</h4>
                  <div className="space-y-2 text-sm">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium text-gray-700">钉钉机器人</p>
                      <code className="text-xs text-gray-600">https://oapi.dingtalk.com/robot/send?access_token=TOKEN</code>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium text-gray-700">企业微信机器人</p>
                      <code className="text-xs text-gray-600">https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=KEY</code>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium text-gray-700">飞书机器人</p>
                      <code className="text-xs text-gray-600">https://open.feishu.cn/open-apis/bot/v2/hook/TOKEN</code>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 配置说明 */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">💡 配置说明</h2>
          <div className="space-y-3 text-sm text-gray-600">
            <p>• <strong>Twitter API</strong> - 用于监控用户推文，需要申请开发者账号</p>
            <p>• <strong>Twilio</strong> - 用于语音电话通知，新账户有试用额度</p>
            <p>• <strong>邮件服务</strong> - 用于发送邮件通知，推荐使用 SendGrid 或阿里云</p>
            <p>• <strong>Webhook</strong> - 用于发送消息到微信、钉钉、飞书等协作平台</p>
          </div>
        </div>
      </div>
    </div>
  );
}
