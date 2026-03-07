Component({
  data: {
    selected: 0,
    color: "#94a3b8",
    selectedColor: "#2563eb",
    list: [
      { pagePath: "/pages/index/index", text: "首页", icon: "🏠" },
      { pagePath: "/pages/tasks/list", text: "任务", icon: "📋" },
      { pagePath: "/pages/subscription/subscription", text: "订阅", icon: "💳" },
      { pagePath: "/pages/settings/settings", text: "设置", icon: "⚙️" }
    ]
  },

  attached() {
    // 获取当前页面路径
    const pages = getCurrentPages();
    if (pages.length > 0) {
      const currentPage = pages[pages.length - 1];
      const route = currentPage.route;

      // 设置当前选中的 tab
      const selected = this.data.list.findIndex(item => item.pagePath === route);
      if (selected !== -1) {
        this.setData({ selected });
      }
    }
  },

  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      const url = data.path;
      const index = data.index;

      // 更新选中状态
      this.setData({ selected: index });

      // 切换页面
      wx.switchTab({
        url,
        success: () => {
          // 页面切换成功后再次确保状态正确
          setTimeout(() => {
            const pages = getCurrentPages();
            if (pages.length > 0) {
              const currentPage = pages[pages.length - 1];
              const route = currentPage.route;
              const selected = this.data.list.findIndex(item => item.pagePath === route);
              if (selected !== -1) {
                this.setData({ selected });
              }
            }
          }, 100);
        }
      });
    }
  }
});
