'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const navigation = [
    { name: '仪表盘', href: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: '创建任务', href: '/tasks/create', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
    { name: '通知历史', href: '/notifications', icon: 'M15 17h5l-5 5v-5zM4 19h6v-7H4v7zM16 3h5v5h-5V3zM4 3h6v7H4V3z' },
    { name: '功能配置', href: '/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
    { name: '账户设置', href: '/account', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { name: '订阅计划', href: '/pricing', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-110"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
          <div className="fixed bottom-24 right-6 bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl p-4 w-64 border border-white/10">
            <nav className="space-y-2">
              {navigation.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-blue-600/20 to-blue-600/10 text-blue-400 border border-blue-500/30'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop sidebar - Fixed position with proper z-index */}
      <div className="hidden md:block fixed inset-y-0 left-0 z-40 w-64 bg-slate-900/95 backdrop-blur-xl border-r border-white/10 shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center h-20 border-b border-white/10 hover:bg-white/5 transition-all duration-300 group flex-shrink-0">
            <div className="flex items-center space-x-3 px-4">
              <div className="relative">
                <span className="text-3xl animate-pulse">🦞</span>
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full group-hover:bg-blue-500/30 transition-all duration-300"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">推文哨兵</h1>
                <p className="text-xs text-gray-500">Tweet Alert Pro</p>
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
            {navigation.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`group relative flex items-center px-4 py-3 rounded-xl transition-all duration-300 overflow-hidden ${
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-blue-600/20 to-blue-600/10 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {/* Active indicator animation */}
                {isActive(item.href) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent rounded-xl"></div>
                )}
                
                {/* Hover effect background */}
                <div className={`absolute inset-0 bg-gradient-to-r from-blue-600/5 to-transparent rounded-xl transition-opacity duration-300 ${
                  hoveredIndex === index ? 'opacity-100' : 'opacity-0'
                }`}></div>
                
                {/* Icon with glow effect */}
                <div className="relative">
                  <svg className={`w-5 h-5 mr-3 transition-all duration-300 ${
                    isActive(item.href) ? 'text-blue-400' : 'text-gray-400 group-hover:text-white'
                  } ${hoveredIndex === index ? 'scale-110' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  {isActive(item.href) && (
                    <div className="absolute inset-0 bg-blue-400/20 blur-md rounded-full"></div>
                  )}
                </div>
                
                {/* Text */}
                <span className="relative font-medium">{item.name}</span>
                
                {/* Active dot */}
                {isActive(item.href) && (
                  <div className="absolute right-3 w-2 h-2 bg-blue-400 rounded-full shadow-lg shadow-blue-500/50">
                    <div className="absolute inset-0 bg-blue-400 blur-sm"></div>
                  </div>
                )}
              </Link>
            ))}
          </nav>

          {/* User info - Clickable to go to pricing */}
          <div className="p-4 border-t border-white/10 flex-shrink-0">
            <div 
              onClick={() => router.push('/pricing')}
              className="bg-gradient-to-br from-white/5 to-white/0 rounded-xl p-4 border border-white/10 hover:border-blue-500/30 transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300">
                    U
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900">
                    <div className="absolute inset-0 bg-green-500 animate-ping rounded-full opacity-75"></div>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">演示用户</p>
                  <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">免费版</p>
                </div>
                <svg className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center group-hover:text-blue-400 transition-colors">
                💳 点击升级到专业版
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Global styles for scrollbar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
        
        /* 确保侧边栏在所有内容之上 */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
        }
      `}</style>
    </>
  );
}
