/**
 * Application logic for ychenzgithub's GitHub repository portal.
 * Handles theme toggling, language switching, search, category filtering, and sorting.
 */

(function () {
  'use strict';

  // State
  let currentLang = localStorage.getItem('yc_lang') || 'zh';
  let currentTheme = localStorage.getItem('yc_theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  let currentCategory = 'all';
  let searchQuery = '';
  let sortBy = 'featured';

  // DOM Elements
  const themeToggleBtn = document.getElementById('theme-toggle');
  const langToggleBtn = document.getElementById('lang-toggle');
  const searchInput = document.getElementById('search-input');
  const filterTabs = document.querySelectorAll('.filter-tab');
  const sortSelect = document.getElementById('sort-select');
  const reposGrid = document.getElementById('repos-grid');
  const repoCountEl = document.getElementById('repo-count');
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  // Initialize
  function init() {
    applyTheme(currentTheme);
    applyLanguage(currentLang);
    bindEvents();
    renderRepositories();
  }

  // Theme Management
  function applyTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('yc_theme', theme);

    if (themeToggleBtn) {
      const icon = themeToggleBtn.querySelector('i');
      if (icon) {
        if (theme === 'light') {
          icon.className = 'fa-solid fa-moon';
          themeToggleBtn.setAttribute('title', currentLang === 'zh' ? '切换到暗黑模式' : 'Switch to Dark Mode');
        } else {
          icon.className = 'fa-solid fa-sun';
          themeToggleBtn.setAttribute('title', currentLang === 'zh' ? '切换到明亮模式' : 'Switch to Light Mode');
        }
      }
    }
  }

  function toggleTheme() {
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
  }

  // Language Management
  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('yc_lang', lang);
    document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');

    // Update i18n text nodes
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (I18N_TEXTS[key] && I18N_TEXTS[key][lang]) {
        el.textContent = I18N_TEXTS[key][lang];
      }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (I18N_TEXTS[key] && I18N_TEXTS[key][lang]) {
        el.setAttribute('placeholder', I18N_TEXTS[key][lang]);
      }
    });

    // Update lang button text
    if (langToggleBtn) {
      const langText = langToggleBtn.querySelector('.lang-text');
      if (langText) {
        langText.textContent = lang === 'zh' ? 'EN' : '中文';
      }
      langToggleBtn.setAttribute('title', lang === 'zh' ? 'Switch to English' : '切换为中文');
    }

    renderRepositories();
  }

  function toggleLanguage() {
    applyLanguage(currentLang === 'zh' ? 'en' : 'zh');
  }

  // Event Listeners
  function bindEvents() {
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', toggleTheme);
    }

    if (langToggleBtn) {
      langToggleBtn.addEventListener('click', toggleLanguage);
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        renderRepositories();
      });
    }

    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentCategory = tab.getAttribute('data-category');
        renderRepositories();
      });
    });

    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        sortBy = e.target.value;
        renderRepositories();
      });
    }

    if (mobileNavToggle && navMenu) {
      mobileNavToggle.addEventListener('click', () => {
        const isVisible = navMenu.style.display === 'flex';
        navMenu.style.display = isVisible ? 'none' : 'flex';
        if (!isVisible) {
          navMenu.style.flexDirection = 'column';
          navMenu.style.position = 'absolute';
          navMenu.style.top = '100%';
          navMenu.style.left = '0';
          navMenu.style.right = '0';
          navMenu.style.background = 'var(--bg-glass)';
          navMenu.style.padding = '1.5rem';
          navMenu.style.borderBottom = '1px solid var(--border-color)';
        }
      });
    }
  }

  // Repository Filtering and Sorting
  function getFilteredRepositories() {
    return REPOSITORIES_DATA.filter(repo => {
      // Category filter
      if (currentCategory !== 'all') {
        if (currentCategory === 'webapps' && repo.category !== 'webapps') return false;
        if (currentCategory === 'science' && repo.category !== 'science') return false;
        if (currentCategory === 'knowledge' && repo.category !== 'knowledge') return false;
        if (currentCategory === 'algorithms' && repo.category !== 'algorithms') return false;
      }

      // Search filter
      if (searchQuery) {
        const nameMatch = repo.name.toLowerCase().includes(searchQuery);
        const titleMatch = (repo.title.zh + ' ' + repo.title.en).toLowerCase().includes(searchQuery);
        const descMatch = (repo.desc.zh + ' ' + repo.desc.en).toLowerCase().includes(searchQuery);
        const langMatch = repo.language.toLowerCase().includes(searchQuery);
        const tagsMatch = repo.tags.some(tag => tag.toLowerCase().includes(searchQuery));
        return nameMatch || titleMatch || descMatch || langMatch || tagsMatch;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'featured') {
        const rankA = a.featuredRank || 99;
        const rankB = b.featuredRank || 99;
        return rankA - rankB;
      } else if (sortBy === 'stars') {
        return b.stars - a.stars;
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }

  // Render Repository Cards
  function renderRepositories() {
    if (!reposGrid) return;

    const filtered = getFilteredRepositories();

    if (repoCountEl) {
      if (currentLang === 'zh') {
        repoCountEl.textContent = `共显示 ${filtered.length} / ${REPOSITORIES_DATA.length} 个公开仓库`;
      } else {
        repoCountEl.textContent = `Showing ${filtered.length} of ${REPOSITORIES_DATA.length} repositories`;
      }
    }

    if (filtered.length === 0) {
      reposGrid.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-magnifying-glass"></i>
          <p>${currentLang === 'zh' ? '未找到符合条件的仓库，请尝试更换关键词。' : 'No matching repositories found. Try another search term.'}</p>
        </div>
      `;
      return;
    }

    reposGrid.innerHTML = filtered.map(repo => {
      const title = repo.title[currentLang] || repo.title.zh;
      const desc = repo.desc[currentLang] || repo.desc.zh;
      const catLabel = repo.categoryLabel[currentLang] || repo.categoryLabel.zh;

      const liveBtn = repo.liveUrl ? `
        <a href="${repo.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn-card-launch" title="${currentLang === 'zh' ? '在线体验' : 'Live Demo'}">
          <i class="fa-solid fa-arrow-up-right-from-square"></i>
          <span>${currentLang === 'zh' ? '在线体验' : 'Live Demo'}</span>
        </a>
      ` : '';

      const codeBtn = `
        <a href="${repo.repoUrl}" target="_blank" rel="noopener noreferrer" class="btn-card-code" title="${currentLang === 'zh' ? '查看源码' : 'View Code'}">
          <i class="fa-brands fa-github"></i>
          <span>${currentLang === 'zh' ? '源码' : 'Code'}</span>
        </a>
      `;

      return `
        <div class="repo-card">
          <div class="repo-header">
            <div class="repo-title-group">
              <span class="repo-icon"><i class="${repo.icon}"></i></span>
              <a href="${repo.repoUrl}" target="_blank" rel="noopener noreferrer" class="repo-name">${repo.name}</a>
            </div>
            <div class="repo-badges">
              ${repo.liveUrl ? `<span class="badge-live">${currentLang === 'zh' ? '在线可用' : 'Live Demo'}</span>` : ''}
            </div>
          </div>
          <div style="font-size: 0.95rem; font-weight: 600; color: var(--text-main); margin-bottom: 0.5rem;">${title}</div>
          <div class="repo-desc">${desc}</div>
          
          <div class="card-tags" style="margin-bottom: 1rem;">
            ${repo.tags.slice(0, 4).map(t => `<span class="tag-pill">${t}</span>`).join('')}
          </div>

          <div class="repo-meta">
            <div class="meta-lang">
              <span class="lang-dot ${repo.langClass}"></span>
              <span>${repo.language}</span>
            </div>
            <div class="meta-stats">
              ${repo.stars > 0 ? `<span><i class="fa-regular fa-star"></i> ${repo.stars}</span>` : ''}
              ${repo.forks > 0 ? `<span><i class="fa-solid fa-code-fork"></i> ${repo.forks}</span>` : ''}
              <span class="tag-pill" style="font-size: 0.7rem; border-color: transparent; background: rgba(255,255,255,0.05);">${catLabel}</span>
            </div>
          </div>

          <div class="repo-card-footer">
            ${liveBtn}
            ${codeBtn}
          </div>
        </div>
      `;
    }).join('');
  }

  // Translation Dictionary
  const I18N_TEXTS = {
    nav_featured: { zh: "精选应用", en: "Featured Apps" },
    nav_science: { zh: "科学计算", en: "Scientific Tools" },
    nav_repos: { zh: "所有项目", en: "Repositories" },
    nav_about: { zh: "关于项目", en: "About Hub" },
    hero_pill: { zh: "开源项目合集 · 地球科学与计算应用", en: "Open Source Hub · Geospatial & Web Tools" },
    hero_title_name: { zh: "项目主页", en: "Project Hub" },
    hero_title_sub: { zh: "地球科学计算、Web 交互应用与精选知识库", en: "Scientific Computing, Web Apps & Curated Guides" },
    hero_affiliation: { zh: "GitHub 开源仓库导航与在线应用集合", en: "Open-source repositories & interactive web applications" },
    hero_desc: { zh: "汇集野火遥感监测、蔓延空间度量、微距古地图交互赏析、GeoGuessr 知识宝典及实用算法工具，全部代码与资源均托管于 GitHub 开源生态。", en: "A curated collection of wildfire satellite tools, spread simulation metrics, deep-zoom historical cartography, GeoGuessr meta guides, and algorithms." },
    btn_explore: { zh: "浏览全部项目", en: "Explore Projects" },
    btn_live_apps: { zh: "在线交互体验", en: "Live Web Apps" },
    stat_repos: { zh: "公开开源仓库", en: "Public Repositories" },
    stat_apps: { zh: "在线交互应用", en: "Live Web Apps" },
    stat_open: { zh: "开源开放代码", en: "Open Source Code" },
    stat_years: { zh: "持续探索历程", en: "Years on GitHub" },
    feat_tag: { zh: "Interactive Applications", en: "Interactive Applications" },
    feat_title: { zh: "精选在线交互应用", en: "Featured Web Applications" },
    feat_desc: { zh: "基于现代 Web 技术构建的在线平台，涵盖古地图微距赏析、GeoGuessr 速查、区域美食导览与密码学交互训练。", en: "Interactive platforms built with modern web tech, covering deep-zoom cartography, GeoGuessr meta tools, food discovery, and cipher education." },
    sci_tag: { zh: "Scientific Computing", en: "Scientific Computing" },
    sci_title: { zh: "野火遥感与空间科学计算", en: "Wildfire & Spatial Computing" },
    sci_desc: { zh: "结合卫星遥感、空间分析与数值基准度量，提供公开开源的地球科学计算工具与数据处理管线。", en: "Open-source computational toolkits and data pipelines for satellite fire monitoring and spatial spread benchmark metrics." },
    all_tag: { zh: "Project Library", en: "Project Library" },
    all_title: { zh: "全部公开项目库 (13)", en: "All Public Repositories (13)" },
    all_desc: { zh: "支持按分类筛选、关键词即时搜索与多维度排序，探索全部科研与开源工具。", en: "Explore all scientific packages, interactive web tools, curated knowledge bases, and algorithms." },
    tab_all: { zh: "全部项目 (13)", en: "All Projects (13)" },
    tab_webapps: { zh: "🚀 在线应用 (4)", en: "🚀 Web Apps (4)" },
    tab_science: { zh: "🌍 地球与野火 (3)", en: "🌍 Earth Science (3)" },
    tab_knowledge: { zh: "📚 精选知识库 (4)", en: "📚 Curated Lists (4)" },
    tab_algorithms: { zh: "🧮 数学与算法 (1)", en: "🧮 Math & Logic (1)" },
    search_placeholder: { zh: "搜索仓库名称、技术栈、标签或关键词...", en: "Search repository name, language, tag, or keywords..." },
    sort_featured: { zh: "精选推荐优先", en: "Featured First" },
    sort_stars: { zh: "Star 数量排序", en: "Most Stars" },
    sort_name: { zh: "名称字母排序", en: "Name (A-Z)" },
    about_tag: { zh: "About This Hub", en: "About This Hub" },
    about_title: { zh: "关于项目库与技术方向", en: "About the Repositories & Tech Stack" },
    about_p1: { zh: "本站收录了由 ychenzgithub 维护的公开开源仓库，涵盖卫星遥感计算、野火蔓延空间度量、高分辨率数字地图交互、实用科普与算法探索。", en: "This hub collects public open-source repositories maintained under ychenzgithub, spanning satellite remote sensing, wildfire spread metrics, high-res web cartography, and discrete algorithms." },
    about_p2: { zh: "所有在线应用均部署于 GitHub Pages 或云端平台，代码与数据完全公开透明，欢迎自由探索与交流学习。", en: "All interactive web apps are hosted on GitHub Pages or cloud platforms with completely open-source code and data." },
    about_card1_title: { zh: "全球火灾排放与遥感", en: "Fire Emissions & Remote Sensing" },
    about_card1_desc: { zh: "近实时全球过火面积、火灾排放估算管线及蔓延模拟空间度量基准算法。", en: "Near real-time burned area, emissions estimation pipelines, and spread simulation benchmark metrics." },
    about_card2_title: { zh: "地球大数据与遥感计算", en: "Geospatial Big Data & Computing" },
    about_card2_desc: { zh: "Google Earth Engine (GEE) 系统技术架构、时空栅格运算与遥感数据处理。", en: "Google Earth Engine (GEE) architecture, spatiotemporal raster operations, and remote sensing pipelines." },
    about_card3_title: { zh: "交互式地图与工具", en: "Interactive Maps & Web Tools" },
    about_card3_desc: { zh: "高分辨率微距古地图探索、GeoGuessr 速查宝典、美食地图及密码学训练平台。", en: "Deep-zoom historical cartography, GeoGuessr meta hub, discovery maps, and cryptography tools." }
  };

  // Launch on DOM ready
  document.addEventListener('DOMContentLoaded', init);
})();
