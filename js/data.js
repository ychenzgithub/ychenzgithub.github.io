/**
 * Repository dataset for ychenzgithub's GitHub repository portal.
 * Contains detailed bilingual metadata for all public repositories.
 */

const REPOSITORIES_DATA = [
  {
    id: "MapAppreciation",
    name: "MapAppreciation",
    title: {
      zh: "古地图超清微距交互赏析平台",
      en: "Historical Map Appreciation Platform"
    },
    desc: {
      zh: "历史古地图超高清微距微交互探索平台。支持利玛窦《坤舆万国全图》(1602) 与卫匡国《中国新图志》(1655) 毫米级瓦片缩放与历史图层解析，带来沉浸式地理历史人文体验。",
      en: "Deep-zoom interactive exploration platform for cartographic masterpieces, including Matteo Ricci's 1602 Kunyu Wanguo Quantu and Martino Martini's 1655 Novus Atlas Sinensis with deep-zoom tiles."
    },
    category: "webapps",
    categoryLabel: {
      zh: "交互应用",
      en: "Live Web App"
    },
    language: "JavaScript",
    langClass: "javascript",
    stars: 0,
    forks: 0,
    repoUrl: "https://github.com/ychenzgithub/MapAppreciation",
    liveUrl: "https://ychenzgithub.github.io/MapAppreciation/",
    featured: true,
    featuredRank: 1,
    image: "assets/map_appreciation.jpg",
    icon: "fa-solid fa-map-location-dot",
    tags: ["Deep Zoom", "OpenSeadragon", "Cartography", "Digital Humanities", "Historical Maps"]
  },
  {
    id: "GeoGuessr-Hub",
    name: "GeoGuessr-Hub",
    title: {
      zh: "GeoGuessr 知识宝典与速查工具",
      en: "GeoGuessr Master Hub & Competitive Meta"
    },
    desc: {
      zh: "提炼自实战笔记的全球 GeoGuessr Meta 识别指南与复习系统。涵盖街景相机代数、电线杆、路桩、车顶车身特征与交互式世界图集，助玩家精准秒杀坐标。",
      en: "Curated competitive meta guides, regional deep dives, Google Street View camera generations, utility poles, bollards, car meta, and interactive atlas for GeoGuessr players."
    },
    category: "webapps",
    categoryLabel: {
      zh: "交互应用",
      en: "Live Web App"
    },
    language: "JavaScript",
    langClass: "javascript",
    stars: 0,
    forks: 0,
    repoUrl: "https://github.com/ychenzgithub/GeoGuessr-Hub",
    liveUrl: "https://ychenzgithub.github.io/GeoGuessr-Hub/",
    featured: true,
    featuredRank: 2,
    image: "assets/geoguessr_hub.jpg",
    icon: "fa-solid fa-earth-americas",
    placeholderType: "geo",
    tags: ["Interactive Atlas", "Street View Meta", "Geography", "Competitive Guides", "Bollards & Poles"]
  },
  {
    id: "IrvineAsianFood",
    name: "IrvineAsianFood",
    title: {
      zh: "尔湾及周边亚洲美食地图",
      en: "Irvine Asian Food & Market Map"
    },
    desc: {
      zh: "尔湾及橙县（Tustin, Costa Mesa, Newport Beach 等）亚洲餐饮、甜品奶茶、亚洲超市交互式发现地图，支持品类筛选、地理距离及空间检索。",
      en: "Interactive, responsive food discovery web app for 200+ Asian restaurants, dessert shops, and supermarkets across Irvine and Orange County with rich category filters."
    },
    category: "webapps",
    categoryLabel: {
      zh: "交互应用",
      en: "Live Web App"
    },
    language: "TypeScript",
    langClass: "typescript",
    stars: 0,
    forks: 0,
    repoUrl: "https://github.com/ychenzgithub/IrvineAsianFood",
    liveUrl: "https://ychenzgithub.github.io/IrvineAsianFood/",
    featured: true,
    featuredRank: 3,
    image: "assets/irvine_asian_food.jpg",
    icon: "fa-solid fa-bowl-food",
    placeholderType: "food",
    tags: ["TypeScript", "Interactive Map", "Leaflet", "Orange County", "Food Discovery"]
  },
  {
    id: "codebusters-training-center",
    name: "codebusters-training-center",
    title: {
      zh: "Science Olympiad 密码学训练中心",
      en: "Codebusters Training Center (SO Division B)"
    },
    desc: {
      zh: "面向 Science Olympiad Codebusters (Division B, 2026–2027) 的全功能交互式训练平台。涵盖全部 13 种密码类型的详尽教程、题目自动生成器、速解演练及全真模拟测试。",
      en: "Interactive browser-based training center for Science Olympiad Codebusters event: lessons, worked examples, unlimited practice generators, speed drills, and mock tests for 13 ciphers."
    },
    category: "webapps",
    categoryLabel: {
      zh: "交互应用",
      en: "Live Web App"
    },
    language: "JavaScript",
    langClass: "javascript",
    stars: 0,
    forks: 0,
    repoUrl: "https://github.com/ychenzgithub/codebusters-training-center",
    liveUrl: "https://ychenzgithub.github.io/codebusters-training-center/",
    featured: true,
    featuredRank: 4,
    image: "assets/codebusters.jpg",
    icon: "fa-solid fa-key",
    placeholderType: "crypto",
    tags: ["Science Olympiad", "Cryptography", "Cipher Training", "Interactive Games", "Education"]
  },
  {
    id: "GFED5NRT",
    name: "GFED5NRT",
    title: {
      zh: "GFED5 近实时全球火灾排放计算系统",
      en: "GFED5 NRT Global Fire Emissions Extension"
    },
    desc: {
      zh: "基于 VIIRS 375m 主动火点数据和全球火灾排放数据库 (GFED5) 方法论，计算 0.25° 分辨率的近实时 (NRT) 全球过火面积与化学排放量，包含自动化数据获取与可视化管线。",
      en: "Professional scientific tool calculating Near Real-Time (NRT) global burned area and chemical emissions at 0.25° resolution using VIIRS 375m active fire data and GFED5 methodology."
    },
    category: "science",
    categoryLabel: {
      zh: "地球与野火科学",
      en: "Earth & Fire Science"
    },
    language: "Python",
    langClass: "python",
    stars: 1,
    forks: 1,
    repoUrl: "https://github.com/ychenzgithub/GFED5NRT",
    liveUrl: null,
    featured: true,
    featuredRank: 5,
    image: "assets/gfed5nrt_fires.jpg",
    icon: "fa-solid fa-fire",
    tags: ["Wildfire", "Remote Sensing", "GFED5", "Chemical Emissions", "VIIRS 375m", "Python"]
  },
  {
    id: "FireSpreadIndices",
    name: "FireSpreadIndices",
    title: {
      zh: "野火蔓延模拟评估基准指标库 (FSI)",
      en: "Fire Spread Indices (FSI) Benchmark"
    },
    desc: {
      zh: "用于评估野火蔓延模拟结果与真实过火边界吻合度的 Python 基准库。同时支持矢量面几何 (GeoPandas/Shapely) 与栅格网格 (Rasterio/NumPy)，提供 IoU、Dice、SDI、ADI、SSIM 等全套空间度量指标。",
      en: "Python benchmark library for evaluating wildfire spread simulations against observed fire perimeters across vector perimeters and raster grids (IoU, Dice/F1, SDI, ADI, SSIM)."
    },
    category: "science",
    categoryLabel: {
      zh: "地球与野火科学",
      en: "Earth & Fire Science"
    },
    language: "Python",
    langClass: "python",
    stars: 0,
    forks: 0,
    repoUrl: "https://github.com/ychenzgithub/FireSpreadIndices",
    liveUrl: null,
    featured: true,
    featuredRank: 6,
    image: "assets/fire_spread.png",
    icon: "fa-solid fa-fire-flame-curved",
    tags: ["Wildfire Modeling", "GeoPandas", "Rasterio", "Spatial Metrics", "IoU", "Shape Deviation"]
  },
  {
    id: "GEE",
    name: "GEE",
    title: {
      zh: "Google Earth Engine 系统指南与笔记",
      en: "Google Earth Engine (GEE) Guide & Notebooks"
    },
    desc: {
      zh: "Google Earth Engine 地球大数据系统笔记与实用代码速查：涵盖基础知识、JavaScript API、矢量/栅格计算、动态制图、UI 组件设计及遥感资产 I/O。",
      en: "Comprehensive notes and cheat sheet on Google Earth Engine: JavaScript API, Vector/Raster operations, Map visualization, UI development, and geospatial asset I/O."
    },
    category: "science",
    categoryLabel: {
      zh: "地球与野火科学",
      en: "Earth & Fire Science"
    },
    language: "JavaScript / GEE",
    langClass: "javascript",
    stars: 0,
    forks: 0,
    repoUrl: "https://github.com/ychenzgithub/GEE",
    liveUrl: null,
    featured: false,
    image: null,
    icon: "fa-solid fa-satellite",
    tags: ["Earth Engine", "Remote Sensing", "Geospatial Big Data", "GIS", "JavaScript"]
  },
  {
    id: "OnlineTools",
    name: "OnlineTools",
    title: {
      zh: "精选在线科研工具与交互网页合集",
      en: "Curated Online Tools & Interactive Resources"
    },
    desc: {
      zh: "精选科研与日常使用的实用在线工具、交互式可视化网页、精选高质量公开课与优秀开源电子书推荐清单。",
      en: "Curated directory of useful online research tools, interactive websites, online courses, and digital books for science and productivity."
    },
    category: "knowledge",
    categoryLabel: {
      zh: "精选知识库",
      en: "Curated Knowledge"
    },
    language: "Markdown",
    langClass: "markdown",
    stars: 0,
    forks: 0,
    repoUrl: "https://github.com/ychenzgithub/OnlineTools",
    liveUrl: null,
    featured: false,
    image: null,
    icon: "fa-solid fa-wrench",
    tags: ["Curated List", "Research Tools", "Interactive Web", "Productivity", "Resources"]
  },
  {
    id: "Onlinemaps",
    name: "Onlinemaps",
    title: {
      zh: "全球精选在线地图与时空可视化",
      en: "Curated Online Maps & Earth Observatories"
    },
    desc: {
      zh: "汇集全球顶级在线地图与时空数据可视化平台（如 Windy 全球天气与空气质量、哈佛全球经济复杂度地图、NASA 夜间灯光等）。",
      en: "Handpicked showcase of top dynamic cartography, earth observation, and climate visualization platforms worldwide (Windy, Harvard Atlas of Economic Complexity, etc.)."
    },
    category: "knowledge",
    categoryLabel: {
      zh: "精选知识库",
      en: "Curated Knowledge"
    },
    language: "Markdown",
    langClass: "markdown",
    stars: 2,
    forks: 0,
    repoUrl: "https://github.com/ychenzgithub/Onlinemaps",
    liveUrl: null,
    featured: false,
    image: null,
    icon: "fa-solid fa-compass",
    tags: ["Cartography", "Earth Observation", "GIS", "Interactive Maps", "Visualizations"]
  },
  {
    id: "Cov19",
    name: "Cov19",
    title: {
      zh: "COVID-19 疫情数据、图表与时空地图集锦",
      en: "COVID-19 Visualizations, Maps & Dashboards"
    },
    desc: {
      zh: "整理收录全球及区域 COVID-19 疫情数据的优质可视化追踪器、空间分布地图与流行病学模型展示网站。",
      en: "Curated collection of COVID-19 interactive dashboards, spatial maps, and epidemiological visualization platforms (JHU CSSE, 1point3acres, etc.)."
    },
    category: "knowledge",
    categoryLabel: {
      zh: "精选知识库",
      en: "Curated Knowledge"
    },
    language: "Jupyter Notebook",
    langClass: "jupyter",
    stars: 0,
    forks: 0,
    repoUrl: "https://github.com/ychenzgithub/Cov19",
    liveUrl: null,
    featured: false,
    image: null,
    icon: "fa-solid fa-chart-line",
    tags: ["COVID-19", "Jupyter Notebook", "Epidemiology", "GIS Tracking", "Charts"]
  },
  {
    id: "RubiksCube",
    name: "RubiksCube",
    title: {
      zh: "魔方初级到进阶完全指南",
      en: "Complete Rubik's Cube Tutorial"
    },
    desc: {
      zh: "原创总结的中文魔方教程，详解三阶魔方基础层先法 (LBL)、CFOP 快速法核心公式、二阶魔方以及四阶魔方降维法，图文并茂、公式清晰实用。",
      en: "Comprehensive Chinese tutorial covering 2x2, 3x3 (layer-by-layer LBL method and CFOP foundation), and 4x4 reduction method with clear diagrams."
    },
    category: "knowledge",
    categoryLabel: {
      zh: "精选知识库",
      en: "Curated Knowledge"
    },
    language: "Markdown",
    langClass: "markdown",
    stars: 4,
    forks: 0,
    repoUrl: "https://github.com/ychenzgithub/RubiksCube",
    liveUrl: null,
    featured: false,
    image: null,
    icon: "fa-solid fa-cube",
    tags: ["Rubik's Cube", "CFOP", "Layer-by-Layer", "Algorithms", "Tutorial"]
  },
  {
    id: "100PrisonersProblem",
    name: "100PrisonersProblem",
    title: {
      zh: "100名囚徒概率问题模拟与数学分析",
      en: "100 Prisoners Problem Probability Simulation"
    },
    desc: {
      zh: "经典概率论与组合数学难题“100名囚徒问题”的 Python 蒙特卡洛模拟与循环策略（Cycle Strategy）数学解析，直观展示为何生存概率能从几乎为零跃升至 31.18%。",
      en: "Python simulation and mathematical analysis of the classic 100 Prisoners Problem, verifying how cycle-following strategy raises survival chance from near-zero to 31.18%."
    },
    category: "algorithms",
    categoryLabel: {
      zh: "数学与算法",
      en: "Math & Algorithms"
    },
    language: "Python",
    langClass: "python",
    stars: 0,
    forks: 0,
    repoUrl: "https://github.com/ychenzgithub/100PrisonersProblem",
    liveUrl: null,
    featured: false,
    image: null,
    icon: "fa-solid fa-dice",
    tags: ["Probability", "Monte Carlo", "Permutation Cycles", "Discrete Math", "Python"]
  },
  {
    id: "ychenzgithub.github.io",
    name: "ychenzgithub.github.io",
    title: {
      zh: "ychenzgithub 个人主页与开源项目门户",
      en: "ychenzgithub Project Hub & Portal"
    },
    desc: {
      zh: "本开源主页项目源码：集中展示野火与气候开源工具、交互式 Web 地图与精选知识库，支持实时过滤与多语言切换。",
      en: "Central portfolio and directory of open-source projects, research tools, interactive web applications, and curated knowledge repositories with search & filters."
    },
    category: "meta",
    categoryLabel: {
      zh: "主页门户",
      en: "Portal"
    },
    language: "HTML5 / CSS / JS",
    langClass: "html",
    stars: 0,
    forks: 0,
    repoUrl: "https://github.com/ychenzgithub/ychenzgithub.github.io",
    liveUrl: "https://ychenzgithub.github.io/",
    featured: false,
    image: null,
    icon: "fa-solid fa-globe",
    tags: ["Portfolio", "GitHub Pages", "Responsive Web", "Vanilla JS", "Design System"]
  }
];
