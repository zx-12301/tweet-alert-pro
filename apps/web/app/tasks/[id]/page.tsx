'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function TaskDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [task, setTask] = useState<any>({
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
    isActive: true,
  });

  useEffect(() => {
    loadTask();
  }, [id]);

  const loadTask = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`http://localhost:3001/api/tasks/${id}`, {
        headers: { 'x-user-id': userId },
      });

      if (response.ok) {
        const data = await response.json();
        setTask({
          ...data,
          keywords: data.keywords ? JSON.parse(data.keywords).join(', ') : '',
          minLikes: data.minLikes || '',
          minRetweets: data.minRetweets || '',
          notifyChannels: data.notifyChannels ? JSON.parse(data.notifyChannels) : { phone: false, wechat: false, email: false },
          phoneNumbers: data.phoneNumbers ? JSON.parse(data.phoneNumbers).join(', ') : '',
          webhooks: data.webhooks ? JSON.parse(data.webhooks).join(', ') : '',
        });
      }
    } catch (error) {
      console.error('加载任务失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`http://localhost:3001/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({
          ...task,
          keywords: task.keywords.split(',').map((k: string) => k.trim()).filter((k: string) => k),
          minLikes: task.minLikes ? parseInt(task.minLikes) : null,
          minRetweets: task.minRetweets ? parseInt(task.minRetweets) : null,
          phoneNumbers: task.phoneNumbers.split(',').map((p: string) => p.trim()).filter((p: string) => p),
          webhooks: task.webhooks.split(',').map((w: string) => w.trim()).filter((w: string) => w),
        }),
      });

      if (response.ok) {
        alert('保存成功！');
        loadTask();
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

  const handleToggleStatus = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`http://localhost:3001/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({
          ...task,
          isActive: !task.isActive,
          keywords: task.keywords.split(',').map((k: string) => k.trim()).filter((k: string) => k),
          minLikes: task.minLikes ? parseInt(task.minLikes) : null,
          minRetweets: task.minRetweets ? parseInt(task.minRetweets) : null,
          phoneNumbers: task.phoneNumbers.split(',').map((p: string) => p.trim()).filter((p: string) => p),
          webhooks: task.webhooks.split(',').map((w: string) => w.trim()).filter((w: string) => w),
        }),
      });

      if (response.ok) {
        const updated = await response.json();
        setTask({ ...task, isActive: updated.isActive });
        alert(`任务已${updated.isActive ? '启用' : '暂停'}！`);
      }
    } catch (error) {
      console.error('更新状态失败:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('确定要删除此任务吗？此操作不可恢复。')) return;

    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`http://localhost:3001/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': userId },
      });

      if (response.ok) {
        alert('任务已删除');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败，请重试');
    }
  };

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
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">任务详情</h1>
            <p className="text-gray-600 mt-1">@{task.twitterHandle}</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleToggleStatus}
              className={`px-4 py-2 rounded-lg font-medium ${
                task.isActive
                  ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              {task.isActive ? '暂停任务' : '启用任务'}
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              删除
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? '保存中...' : '保存'}
            </button>
          </div>
        </div>

        {/* 基本配置 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-6">监控配置</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Twitter 账号
              </label>
              <input
                type="text"
                value={task.twitterHandle}
                onChange={(e) => setTask({ ...task, twitterHandle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="@username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                关键词过滤
              </label>
              <input
                type="text"
                value={task.keywords}
                onChange={(e) => setTask({ ...task, keywords: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="AI, Tesla, SpaceX"
              />
              <p className="text-xs text-gray-500 mt-1">逗号分隔，留空则监控所有推文</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                最小点赞数
              </label>
              <input
                type="number"
                value={task.minLikes}
                onChange={(e) => setTask({ ...task, minLikes: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="1000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                最小转发数
              </label>
              <input
                type="number"
                value={task.minRetweets}
                onChange={(e) => setTask({ ...task, minRetweets: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="100"
              />
            </div>
          </div>
        </div>

        {/* 通知设置 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-6">通知设置</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium">语音电话通知</h3>
                <p className="text-sm text-gray-500">接到自动语音电话</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={task.notifyChannels.phone}
                  onChange={(e) => setTask({
                    ...task,
                    notifyChannels: { ...task.notifyChannels, phone: e.target.checked },
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {task.notifyChannels.phone && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  接收电话的号码
                </label>
                <input
                  type="tel"
                  value={task.phoneNumbers}
                  onChange={(e) => setTask({ ...task, phoneNumbers: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="+8613800138000"
                />
                <p className="text-xs text-gray-500 mt-1">逗号分隔多个号码</p>
              </div>
            )}

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium">邮件通知</h3>
                <p className="text-sm text-gray-500">发送邮件通知</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={task.notifyChannels.email}
                  onChange={(e) => setTask({
                    ...task,
                    notifyChannels: { ...task.notifyChannels, email: e.target.checked },
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium">微信/钉钉通知</h3>
                <p className="text-sm text-gray-500">发送 Webhook 消息</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={task.notifyChannels.wechat}
                  onChange={(e) => setTask({
                    ...task,
                    notifyChannels: { ...task.notifyChannels, wechat: e.target.checked },
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {task.notifyChannels.wechat && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Webhook URL
                </label>
                <input
                  type="url"
                  value={task.webhooks}
                  onChange={(e) => setTask({ ...task, webhooks: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://oapi.dingtalk.com/robot/send?access_token=xxx"
                />
                <p className="text-xs text-gray-500 mt-1">逗号分隔多个 Webhook</p>
              </div>
            )}
          </div>
        </div>

        {/* 统计信息 */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">任务统计</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">状态</p>
              <p className={`text-lg font-semibold mt-1 ${task.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                {task.isActive ? '运行中' : '已暂停'}
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">总通知数</p>
              <p className="text-lg font-semibold text-green-600 mt-1">{task.totalNotifications || 0}</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">最后检查</p>
              <p className="text-lg font-semibold text-purple-600 mt-1">
                {task.lastCheckedAt ? new Date(task.lastCheckedAt).toLocaleString() : '从未'}
              </p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">创建时间</p>
              <p className="text-lg font-semibold text-orange-600 mt-1">
                {new Date(task.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
