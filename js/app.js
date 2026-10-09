/**
 * Application logic for Yang Chen's GitHub homepage.
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
    nav_science: { zh: "科学研究", en: "Earth Science" },
    nav_repos: { zh: "所有项目", en: "Repositories" },
    nav_about: { zh: "关于作者", en: "About" },
    hero_pill: { zh: "加州大学尔湾分校 · 地球系统科学", en: "UC Irvine · Earth System Science" },
    hero_title_name: { zh: "陈洋", en: "Yang Chen" },
    hero_title_sub: { zh: "地球科学与计算探索", en: "Earth Science & Computational Tools" },
    hero_affiliation: { zh: "加州大学尔湾分校 (UCI) 地球系统科学系 · 副研究员", en: "Associate Researcher · Dept of Earth System Science, UC Irvine" },
    hero_desc: { zh: "专注于全球野火遥感监测、气候与火灾相互作用、碳排放反演以及次季节-年际气候预测。活跃于开源地球科学计算、微距交互式数字地图与实用算法开发。", en: "Researching global wildfire remote sensing, climate-fire interactions, carbon emissions, and climate prediction. Developing open-source scientific tools, high-res web cartography, and interactive applications." },
    btn_explore: { zh: "浏览开源项目", en: "Explore Projects" },
    btn_academic: { zh: "UCI 学术主页", en: "Academic Page" },
    stat_repos: { zh: "公开开源仓库", en: "Public Repositories" },
    stat_apps: { zh: "在线交互应用", en: "Live Web Apps" },
    stat_gfed: { zh: "全球野火核心算法", en: "GFED & FEDS Systems" },
    stat_years: { zh: "开源探索历程", en: "Years on GitHub" },
    feat_tag: { zh: "Interactive Applications", en: "Interactive Applications" },
    feat_title: { zh: "精选在线交互应用", en: "Featured Web Applications" },
    feat_desc: { zh: "基于现代 Web 技术构建的在线平台，涵盖古地图微距赏析、GeoGuessr 速查、区域美食导览与密码学交互训练。", en: "Interactive platforms built with modern web tech, covering deep-zoom cartography, GeoGuessr meta tools, food discovery, and cipher education." },
    sci_tag: { zh: "Scientific Computing", en: "Scientific Computing" },
    sci_title: { zh: "野火遥感与气候科学研究", en: "Earth & Wildfire Science" },
    sci_desc: { zh: "立足加州大学尔湾分校野火与气候团队，结合卫星遥感、气候动力学与空间算法，提供公开学术工具与代码库。", en: "Scientific computational toolkits and data pipelines for satellite fire monitoring, climate dynamics, and spatial simulation benchmark." },
    all_tag: { zh: "Project Library", en: "Project Library" },
    all_title: { zh: "全部公开项目库 (15)", en: "All Public Repositories (15)" },
    all_desc: { zh: "支持按分类筛选、关键词即时搜索与多维度排序，探索全部科研与业余开源项目。", en: "Explore all scientific packages, interactive web tools, curated knowledge bases, and algorithms." },
    tab_all: { zh: "全部项目 (15)", en: "All Projects (15)" },
    tab_webapps: { zh: "🚀 在线应用 (5)", en: "🚀 Web Apps (5)" },
    tab_science: { zh: "🌍 地球与野火 (5)", en: "🌍 Earth Science (5)" },
    tab_knowledge: { zh: "📚 精选知识库 (4)", en: "📚 Curated Lists (4)" },
    tab_algorithms: { zh: "🧮 数学与算法 (1)", en: "🧮 Math & Logic (1)" },
    search_placeholder: { zh: "搜索仓库名称、技术栈、标签或关键词...", en: "Search repository name, language, tag, or keywords..." },
    sort_featured: { zh: "精选推荐优先", en: "Featured First" },
    sort_stars: { zh: "Star 数量排序", en: "Most Stars" },
    sort_name: { zh: "名称字母排序", en: "Name (A-Z)" },
    about_tag: { zh: "About & Background", en: "About & Background" },
    about_title: { zh: "关于作者与研究工作", en: "About Yang Chen & Research" },
    about_p1: { zh: "我是加州大学尔湾分校 (University of California, Irvine) 地球系统科学系的科研人员。研究方向跨越大气、海洋与陆地生态系统，重点研究全球野火特征提取、气候对火灾的调控机制、火灾排放对空气质量的影响。", en: "I am a researcher at the Department of Earth System Science, University of California, Irvine. My research spans atmospheric, ocean, and terrestrial systems, with a particular focus on satellite wildfire characterization, climate-fire relationships, and air quality impacts." },
    about_p2: { zh: "作为全球火灾排放数据库 (GFED) 和卫星火灾跟踪数据系统 (FEDS) 的主要开发者之一，致力于将高时空分辨率遥感数据转化为可靠的科研数据。同时建立了南美火灾季节预测 (SAMFSS) 等平台。", en: "As a contributor to the Global Fire Emissions Database (GFED) and the Fire Events Data Suite (FEDS), I work on translating high-resolution satellite remote sensing into actionable climate data, including the South American Fire Season Forecast (SAMFSS)." },
    about_card1_title: { zh: "全球火灾排放数据库 (GFED)", en: "Global Fire Emissions Database (GFED)" },
    about_card1_desc: { zh: "国际广泛采用的全球火灾排放基准数据集，提供 0.25° 网格高精度过火面积与痕量气体排放数据。", en: "Widely used global fire emissions benchmark dataset providing 0.25-degree resolution burned area and trace gas emissions." },
    about_card2_title: { zh: "火灾事件追踪套件 (FEDS)", en: "Fire Events Data Suite (FEDS)" },
    about_card2_desc: { zh: "基于 VIIRS 卫星高频观测的单个火灾事件全生命周期时空演化追踪算法与数据库。", en: "Satellite-based tracking algorithm and dataset capturing the full lifecycle, perimeter, and spread of individual wildfires." },
    about_card3_title: { zh: "跨学科计算与数字人文", en: "Interdisciplinary Web & Humanities" },
    about_card3_desc: { zh: "热衷于将地理信息、微距制图、密码学及实用算法转化为直观优雅的 Web 交互体验。", en: "Passionate about translating geospatial data, deep-zoom cartography, and discrete algorithms into clean, responsive web experiences." }
  };

  // Launch on DOM ready
  document.addEventListener('DOMContentLoaded', init);
})();
