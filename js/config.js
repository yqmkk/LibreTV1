/**
 * LibreTV 优化版配置文件
 */

// 1. 基础配置
const SITE_CONFIG = {
    name: 'LibreTV',
    url: 'https://libretv.is-an.org',
    version: '1.0.3'
};

// 2. 核心 API 数据源 (结构化定义，便于随时增删)
const BASE_SITES = {
    fantaiying: { api: 'http://www.饭太硬.com/tv', name: '饭太硬（推荐）' },
    feimao: { api: 'http://肥猫.com/', name: '肥猫（资源全）' },
    duhe_duo: { api: 'https://tv.youdu.fan:666/', name: '毒盒多仓（自动选快）' },
    qixing: { api: 'https://qixing.myhkw.com/QX/api.json', name: '七星多仓' }
};

// 3. 动态合并逻辑 (使用对象解构，性能优于循环覆盖)
window.API_SITES = {
    ...BASE_SITES,
    jisu: { api: 'https://jszyapi.com/api.php/provide/vod', name: '极速资源' },
    ffzy: { api: 'https://api.ffzyapi.com/api.php/provide/vod', name: '非凡资源' }
};

// 4. 播放器缓存优化配置
window.PLAYER_CONFIG = {
    autoplay: true,
    filterAds: true, 
    // 增加缓冲池长度，解决播放缓存问题
    hlsConfig: {
        maxBufferLength: 60,
        maxMaxBufferLength: 300,
        enableWorker: true
    }
};

// 5. 聚合搜索性能优化
window.AGGREGATED_SEARCH_CONFIG = {
    enabled: true,
    timeout: 5000,          // 调低超时，防止某个慢源拖慢整体速度
    parallelRequests: true
};

console.log('LibreTV 配置加载成功，已优化缓存策略');
