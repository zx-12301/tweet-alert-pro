'use client';

import { useState, useEffect } from 'react';

const DEMO_USER_ID = '4c590dec-2c16-44b9-8291-8855cecc824f';

export default function NotificationsPage() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    status: 'all',
    channel: 'all',
  });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadNotifications();
    // 每 30 秒自动刷新
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [refreshKey]);

  const loadNotifications = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/notifications', {
        headers: { 'x-user-id': DEMO_USER_ID },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.value || []);
      }
    } catch (error) {
      console.error('加载通知失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filters.status !== 'all' && n.status !== filters.status) return false;
    if (filters.channel !== 'all' && n.channel !== filters.channel) return false;
    return true;
  });

  const getStatusBadge = (status: string, channel: string, errorMessage?: string) => {
    if (status === 'sent') {
      const channelText = channel === 'phone' ? '语音电话' : channel === 'email' ? '邮件' : '微信/钉钉';
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          已发送{channelText}
        </span>
      );
    } else if (status === 'failed') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800" title={errorMessage}>
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {channel === 'phone' ? '语音电话失败' : channel === 'email' ? '邮件发送失败' : '发送失败'}
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          待发送
        </span>
      );
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'phone':
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
        );
      case 'email':
        return (
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        );
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
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">通知历史</h1>
            <p className="text-gray-600 mt-1">查看所有监控通知记录</p>
          </div>
          <button
            onClick={() => setRefreshKey(prev => prev + 1)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
          >
            刷新
          </button>
        </div>

        {/* 筛选器 */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全部</option>
                <option value="sent">已发送</option>
                <option value="failed">发送失败</option>
                <option value="pending">待发送</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">通知渠道</label>
              <select
                value={filters.channel}
                onChange={(e) => setFilters({ ...filters, channel: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全部</option>
                <option value="phone">语音电话</option>
                <option value="email">邮件</option>
                <option value="wechat">微信/钉钉</option>
              </select>
            </div>

            <div className="ml-auto flex items-end">
              <button
                onClick={() => setFilters({ status: 'all', channel: 'all' })}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                重置筛选
              </button>
            </div>
          </div>
        </div>

        {/* 通知列表 */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">通知记录</h2>
              <span className="text-sm text-gray-500">共 {filteredNotifications.length} 条</span>
            </div>
          </div>

          {filteredNotifications.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <div key={notification.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start gap-4">
                    {getChannelIcon(notification.channel)}
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusBadge(notification.status, notification.channel, notification.errorMessage)}
                        <span className="text-sm text-gray-500">
                          {new Date(notification.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <p className="text-gray-900 font-medium mb-1">
                        @{notification.task?.twitterHandle} 发布了新推文
                      </p>

                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {notification.tweetContent}
                      </p>

                      {notification.errorMessage && (
                        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-800">
                            <strong>失败原因：</strong>{notification.errorMessage}
                          </p>
                        </div>
                      )}

                      <a
                        href={notification.tweetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium mt-2"
                      >
                        查看推文
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-7H4v7zM16 3h5v5h-5V3zM4 3h6v7H4V3z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">暂无通知记录</h3>
              <p className="mt-1 text-sm text-gray-500">
                当监控到推文更新时，通知记录将显示在这里
              </p>
              <p className="mt-2 text-xs text-gray-400">
                💡 提示：确保已在功能配置中正确配置 Twitter API
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
