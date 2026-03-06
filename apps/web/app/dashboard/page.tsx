'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const DEMO_USER_ID = '4c590dec-2c16-44b9-8291-8855cecc824f';

export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalTasks: 0,
    activeTasks: 0,
    totalNotifications: 0,
    todayNotifications: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchData = async () => {
    try {
      console.log('开始获取数据...');
      const response = await fetch(`http://localhost:3001/api/tasks`, {
        headers: { 'x-user-id': DEMO_USER_ID },
      });

      console.log('响应状态:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('获取到的数据:', data);
        
        const tasksList = Array.isArray(data) ? data : (data.value || []);
        setTasks(tasksList);

        const activeTasks = tasksList.filter((t: any) => t.isActive).length;
        const totalNotifications = tasksList.reduce((sum: number, t: any) => sum + (t.totalNotifications || 0), 0);
        
        setStats({
          totalTasks: tasksList.length,
          activeTasks,
          totalNotifications,
          todayNotifications: totalNotifications,
        });
      }
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [refreshKey]);

  const handleDelete = async (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('确定删除此任务吗？')) return;

    try {
      const response = await fetch(`http://localhost:3001/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { 'x-user-id': DEMO_USER_ID },
      });

      if (response.ok) {
        alert('任务已删除');
        setRefreshKey(prev => prev + 1);
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
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">仪表盘</h1>
            <p className="text-gray-600 mt-1">实时监控您的 Twitter 监控任务</p>
          </div>
          <button
            onClick={() => {
              console.log('手动刷新');
              setRefreshKey(prev => prev + 1);
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            刷新
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-80">总任务数</p>
                <p className="text-3xl font-bold mt-1">{stats.totalTasks}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-80">活跃任务</p>
                <p className="text-3xl font-bold mt-1">{stats.activeTasks}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-80">总通知数</p>
                <p className="text-3xl font-bold mt-1">{stats.totalNotifications}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-7H4v7zM16 3h5v5h-5V3zM4 3h6v7H4V3z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-80">今日通知</p>
                <p className="text-3xl font-bold mt-1">{stats.todayNotifications}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold">我的监控任务</h2>
            <span className="text-sm text-gray-500">共 {tasks.length} 个</span>
          </div>
          
          {tasks.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  onClick={() => router.push(`/tasks/${task.id}`)}
                  className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          @{task.twitterHandle}
                        </h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          task.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {task.isActive ? '运行中' : '已暂停'}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {task.keywords && (() => {
                          try {
                            const keywords = typeof task.keywords === 'string' ? JSON.parse(task.keywords) : task.keywords;
                            return keywords.length > 0 ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                关键词：{keywords.join(', ')}
                              </span>
                            ) : null;
                          } catch { return null; }
                        })()}
                        
                        {task.minLikes && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            ≥{task.minLikes} 赞
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500 gap-4">
                        <span>通知数：{task.totalNotifications || 0}</span>
                        <span>最后检查：{task.lastCheckedAt ? new Date(task.lastCheckedAt).toLocaleString() : '从未'}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => handleDelete(task.id, e)}
                        className="text-red-600 hover:text-red-900 px-3 py-1 rounded hover:bg-red-50 text-sm"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">暂无监控任务</h3>
              <p className="mt-1 text-sm text-gray-500">开始创建第一个 Twitter 监控任务吧！</p>
              <div className="mt-6">
                <button
                  onClick={() => router.push('/tasks/create')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  创建任务
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
