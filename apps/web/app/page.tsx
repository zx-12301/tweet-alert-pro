'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: '⚡',
      title: '实时监控',
      description: '每 5 分钟自动检测，不错过任何重要推文',
    },
    {
      icon: '📞',
      title: '多渠道通知',
      description: '语音电话、邮件、微信、钉钉，总有一种方式适合你',
    },
    {
      icon: '🎯',
      title: '智能过滤',
      description: '关键词、点赞数、转发数多维度筛选，只通知重要的',
    },
    {
      icon: '📊',
      title: '数据统计',
      description: '完整的通知历史和统计，掌握每一次监控动态',
    },
  ];

  const useCases = [
    { emoji: '💼', title: '投资人/分析师', desc: '监控行业大佬动态，第一时间获取重要信息' },
    { emoji: '⭐', title: '粉丝追星', desc: '偶像发推立即通知，不再错过任何动态' },
    { emoji: '🏢', title: '竞品分析', desc: '监控竞品官方账号，掌握市场动态' },
    { emoji: '📰', title: '新闻媒体', desc: '监控热点人物，快速捕捉新闻线索' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* 导航栏 */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-slate-900/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <span className="text-3xl animate-pulse">🦞</span>
              <span className="text-xl font-bold text-white">推文哨兵</span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 text-white hover:text-blue-300 transition-colors"
              >
                仪表盘
              </button>
              <button
                onClick={() => router.push('/tasks/create')}
                className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-500/30"
              >
                开始使用
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-1/2 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-blue-300 text-sm mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            7×24 小时实时监控
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in-up">
            当关注的用户发推时
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              第一时间通知你
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
            智能监控 Twitter 账号动态，支持语音电话、邮件、微信等多种通知方式，
            让你不错过任何重要信息
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
            <button
              onClick={() => router.push('/tasks/create')}
              className="group px-8 py-4 bg-blue-600 text-white rounded-full font-semibold text-lg hover:bg-blue-700 transition-all hover:shadow-xl hover:shadow-blue-500/30 flex items-center justify-center"
            >
              创建监控任务
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold text-lg hover:bg-white/20 transition-all border border-white/20"
            >
              查看仪表盘
            </button>
          </div>

          {/* 统计数据 */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-in-up animation-delay-600">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">5 分钟</div>
              <div className="text-gray-400">检测间隔</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">4 种</div>
              <div className="text-gray-400">通知渠道</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-400">全天候监控</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">100%</div>
              <div className="text-gray-400">实时触达</div>
            </div>
          </div>
        </div>
      </section>

      {/* 功能特性 */}
      <section className="py-20 px-4 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">核心功能</h2>
            <p className="text-gray-400 text-lg">强大的监控能力，简洁的使用体验</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/20"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 使用场景 */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">使用场景</h2>
            <p className="text-gray-400 text-lg">适合多种角色和需求</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{useCase.emoji}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{useCase.title}</h3>
                <p className="text-gray-400 text-sm">{useCase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-3xl border border-white/10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              准备好开始监控了吗？
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              立即创建第一个监控任务，体验实时通知的便捷
            </p>
            <button
              onClick={() => router.push('/tasks/create')}
              className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold text-lg hover:bg-blue-700 transition-all hover:shadow-xl hover:shadow-blue-500/30"
            >
              免费开始使用
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-2xl">🦞</span>
            <span className="text-lg font-semibold text-white">推文哨兵</span>
          </div>
          <p className="text-sm">© 2026 Tweet Alert Pro. All rights reserved.</p>
        </div>
      </footer>

      {/* 全局样式 */}
      <style jsx global>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
