/**
 * Application logic for ychenzgithub's GitHub repository portal.
 * Handles theme toggling, language switching, search, category filtering, and sorting.
 */

(function () {
  'use strict';

  // State — defaults are English + light; only an explicit toggle is remembered.
  // Language is kept per tab (sessionStorage), so every new visit opens in English.
  // (Keys renamed from yc_lang/yc_theme, which older versions saved on every visit.)
  const LANG_KEY = 'ychub_lang';
  const THEME_KEY = 'ychub_theme';
  localStorage.removeItem(LANG_KEY); // drop a Chinese choice saved by the previous version
  let currentLang = sessionStorage.getItem(LANG_KEY) || 'en';
  let currentTheme = localStorage.getItem(THEME_KEY) || 'light';
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
    updateThemeToggle();
  }

  function updateThemeToggle() {
    const theme = currentTheme;
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
    localStorage.setItem(THEME_KEY, currentTheme);
  }

  // Language Management
  function applyLanguage(lang) {
    currentLang = lang;
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
        langText.textContent = lang === 'zh' ? 'EN' : 'ZH';
      }
      langToggleBtn.setAttribute('title', lang === 'zh' ? 'Switch to English' : 'Switch to Chinese');
    }

    updateThemeToggle();
    renderRepositories();
  }

  function toggleLanguage() {
    applyLanguage(currentLang === 'zh' ? 'en' : 'zh');
    sessionStorage.setItem(LANG_KEY, currentLang);
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
      const title = repo.title[currentLang] || repo.title.en;
      const desc = repo.desc[currentLang] || repo.desc.en;
      const catLabel = repo.categoryLabel[currentLang] || repo.categoryLabel.en;

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
    feat_desc: { zh: "基于现代 Web 技术构建的在线平台，涵盖古地图微距赏析、GeoGuessr 速查、区域美食导览、密码学交互训练、魔方教程、树木与野花图鉴以及古典音乐典藏。", en: "Interactive platforms built with modern web tech, covering deep-zoom cartography, GeoGuessr meta tools, food discovery, cipher education, Rubik's Cube tutorials, tree and wildflower identification, and classical music appreciation." },
    btn_code: { zh: "源码", en: "Code" },
    feat1_title: { zh: "古地图超清微距交互赏析平台", en: "Historical Map Appreciation Platform" },
    feat1_desc: { zh: "历史地图超高清微距交互探索平台。支持利玛窦《坤舆万国全图》(1602) 与卫匡国《中国新图志》(1655) 毫米级高分辨率金字塔瓦片缩放与历史图层解析，带来极致细腻的沉浸式赏析体验。", en: "An ultra-high-resolution deep-zoom platform for exploring historical maps. Zoom into millimeter-level pyramid tiles of Matteo Ricci's Kunyu Wanguo Quantu (1602) and Martino Martini's Novus Atlas Sinensis (1655), with historical layer annotations for an immersive viewing experience." },
    feat1_btn: { zh: "进入赏析平台", en: "Launch Map Viewer" },
    feat2_title: { zh: "GeoGuessr 知识宝典与速查工具", en: "GeoGuessr Knowledge Hub & Quick Reference" },
    feat2_desc: { zh: "提炼自实战笔记的全球 GeoGuessr Meta 识别指南与高效复习系统。涵盖全球街景相机代数、电线杆、路桩、车顶车身天线特征以及精细化交互式国家与地区图集，辅助竞技选手极速定点。", en: "A global GeoGuessr meta identification guide and review system distilled from real game notes. Covers Street View camera generations, utility poles, bollards, car and antenna meta, and a detailed interactive atlas of countries and regions to help competitive players pinpoint locations fast." },
    feat2_btn: { zh: "进入知识宝典", en: "Open the Hub" },
    feat3_title: { zh: "尔湾及周边亚洲美食地图", en: "Irvine & Orange County Asian Food Map" },
    feat3_desc: { zh: "涵盖尔湾及橙县周边（Tustin, Costa Mesa 等）200+ 亚洲餐厅、奶茶甜品及超市的交互式美食地图，支持品类筛选与空间检索。", en: "An interactive map of 200+ Asian restaurants, boba and dessert shops, and supermarkets across Irvine and nearby Orange County cities (Tustin, Costa Mesa, and more), with category filters and spatial search." },
    feat3_btn: { zh: "体验美食地图", en: "Explore the Food Map" },
    feat4_title: { zh: "Codebusters 密码学训练中心", en: "Codebusters Cryptography Training Center" },
    feat4_desc: { zh: "面向 Science Olympiad Codebusters (Division B 2026–27) 训练平台，涵盖全 13 种密码教程、无限习题生成器、限时竞速与模拟考。", en: "A training platform for Science Olympiad Codebusters (Division B, 2026–27), with tutorials for all 13 cipher types, unlimited practice generators, timed speed drills, and mock tests." },
    feat4_btn: { zh: "进入训练中心", en: "Start Training" },
    feat5_title: { zh: "魔方教程：从层先法到 CFOP", en: "Rubik's Cube Guide: Beginner to CFOP" },
    feat5_desc: { zh: "中英双语魔方教程：标记方法、三阶层先法、CFOP（F2L、OLL、PLL）、二阶以及四阶降维法与奇偶矫正。每个情形的示意图都由公式自动生成，所有公式都可以在 3D 魔方上播放。", en: "A bilingual Rubik's Cube tutorial: notation, the layer-by-layer beginner method, CFOP (F2L, OLL, PLL), the 2×2, and 4×4 reduction with parity. Every case diagram is generated from its algorithm, and every algorithm plays on a 3D cube." },
    feat5_btn: { zh: "打开教程", en: "Open the Guide" },
    feat6_title: { zh: "树木识别图鉴", en: "Tree ID: Photo Guide to Identifying Trees" },
    feat6_desc: { zh: "从整体、叶、花、果和树皮认识树木：92 种常见树的照片图鉴，SciOly Forest Finds 树种与检索表、易混树种对比，植物学基础、针叶树分类和城市树木地图。", en: "Learn trees by whole tree, leaf, flower, fruit and bark: a photo atlas of 92 common trees, SciOly Forest Finds species with identification keys and look-alikes, botany basics, conifer classification, and city tree maps." },
    feat6_btn: { zh: "开始认树", en: "Explore Trees" },
    feat7_title: { zh: "野花识别图鉴", en: "Wildflower ID: Photo Guide to Wildflowers" },
    feat7_desc: { zh: "61 种加州野花、园艺花卉和加拿大落基山野花：照片、识别要点和根据 iNaturalist 记录统计的花期日历，还有易混花卉对比、花的结构、赏花地点和看图识花小测验。", en: "61 wildflowers of California, gardens and the Canadian Rockies with photos, ID features and bloom calendars from iNaturalist records, plus look-alike pairs, flower anatomy, where to see wildflowers and a quiz." },
    feat7_btn: { zh: "开始认花", en: "Explore Wildflowers" },
    feat8_title: { zh: "古典音乐典藏：55 首传世名作", en: "Classical Music Collection: 55 Masterworks" },
    feat8_desc: { zh: "精选 55 首跨越巴洛克、古典、浪漫、印象派与现代主义时期的经典名作，支持一键内置视频播放、详尽作品导赏背景与乐章解析、双语即时切换。", en: "Curated collection of 55 timeless classical masterworks spanning Baroque, Classical, Romantic, Impressionist, and Modern eras, with embedded playback and program notes." },
    feat8_btn: { zh: "进入音乐厅", en: "Explore Music" },
    sci_tag: { zh: "Scientific Computing", en: "Scientific Computing" },
    sci_title: { zh: "野火遥感与空间科学计算", en: "Wildfire & Spatial Computing" },
    sci_desc: { zh: "结合卫星遥感、空间分析与数值基准度量，提供公开开源的地球科学计算工具与数据处理管线。", en: "Open-source computational toolkits and data pipelines for satellite fire monitoring and spatial spread benchmark metrics." },
    sci1_title: { zh: "GFED5NRT · 全球近实时火灾排放", en: "GFED5NRT · Global Near Real-Time Fire Emissions" },
    sci1_desc: { zh: "基于 VIIRS 375m 高分辨率卫星主动火点观测，结合 GFED5 区域与植被类型衍生有效过火面积 (EFA) 和燃料消耗 (FC) 标量，在 0.25° 网格上自动化生成近实时全球过火面积与化学物种排放。", en: "Combines VIIRS 375m satellite active fire detections with GFED5 region- and vegetation-specific effective fire area (EFA) and fuel consumption (FC) scalars to automatically generate near real-time global burned area and chemical species emissions on a 0.25° grid." },
    sci1_f1: { zh: "每日自动化拉取 Suomi-NPP / NOAA-20 卫星火点", en: "Automated daily retrieval of Suomi-NPP / NOAA-20 active fire detections" },
    sci1_f2: { zh: "严格的多物种化学排放因子 (EF) 矩阵转换", en: "Rigorous multi-species emission factor (EF) matrix conversion" },
    sci1_f3: { zh: "支持端到端云端同步与全球时空制图", en: "End-to-end cloud sync and global spatiotemporal mapping" },
    sci1_btn: { zh: "查看 GFED5NRT 仓库", en: "View GFED5NRT Repository" },
    sci2_title: { zh: "FireSpreadIndices · 蔓延模拟评估库", en: "FireSpreadIndices · Spread Simulation Benchmark" },
    sci2_desc: { zh: "专业评估野火蔓延数值模拟与观测边界空间吻合度的 Python 基准库。涵盖整体吻合度 (IoU, Dice, SDI, ADI, SSIM) 及过预测/欠预测分解指标。", en: "A Python benchmark library for evaluating the spatial agreement between simulated wildfire spread and observed fire perimeters. Includes overall agreement metrics (IoU, Dice, SDI, ADI, SSIM) and over-/under-prediction decomposition." },
    sci2_f1: { zh: "矢量多边形与栅格二值/连续网格双通道计算", en: "Supports both vector polygons and binary/continuous raster grids" },
    sci2_f2: { zh: "完整的火灾蔓延形状偏差与面积偏差空间度量", en: "Complete spatial metrics for fire spread shape and area deviation" },
    sci2_f3: { zh: "包含可重现的 Jupyter 测试工作流与可视化", en: "Reproducible Jupyter test workflows and visualizations" },
    sci2_btn: { zh: "查看 FireSpreadIndices 源码", en: "View FireSpreadIndices Source" },
    all_tag: { zh: "Project Library", en: "Project Library" },
    all_title: { zh: "全部公开项目库 (16)", en: "All Public Repositories (16)" },
    all_desc: { zh: "支持按分类筛选、关键词即时搜索与多维度排序，探索全部科研与开源工具。", en: "Explore all scientific packages, interactive web tools, curated knowledge bases, and algorithms." },
    tab_all: { zh: "全部项目 (16)", en: "All Projects (16)" },
    tab_webapps: { zh: "🚀 在线应用 (8)", en: "🚀 Web Apps (8)" },
    tab_science: { zh: "🌍 地球与野火 (3)", en: "🌍 Earth Science (3)" },
    tab_knowledge: { zh: "📚 精选知识库 (3)", en: "📚 Curated Lists (3)" },
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
    about_card3_desc: { zh: "高分辨率微距古地图探索、GeoGuessr 速查宝典、美食地图及密码学训练平台。", en: "Deep-zoom historical cartography, GeoGuessr meta hub, discovery maps, and cryptography tools." },
    about_btn_all: { zh: "查看所有 16 个项目", en: "View All 16 Projects" },
    footer_title: { zh: "ychenzgithub · 开源项目门户", en: "ychenzgithub · Open Source Portal" },
    footer_repos: { zh: "项目库", en: "Project Library" },
    footer_top: { zh: "返回顶部", en: "Back to Top" }
  };

  // Launch on DOM ready
  document.addEventListener('DOMContentLoaded', init);
})();
