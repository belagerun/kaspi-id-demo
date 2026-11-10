const CACHE_NAME = 'kaspi-id-single-folder-v35';
const CORE_FILES = [
  './',
  './index.html',
  './style.css?v=20261110-35',
  './script.js?v=20261110-35',
  './pwa.js?v=20261110-35',
  './manifest.webmanifest',
  './favicon.png',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png',
  './060131500086-20250603111642292.pdf',
  './assets/gov/06_cat_popular.png',
  './assets/gov/11_self_employed.png',
  './assets/ui-kit/categories/category_01_semya.png',
  './assets/ui-kit/categories/category_02_zdorovye.png',
  './assets/ui-kit/categories/category_03_posobiya.png',
  './assets/ui-kit/categories/category_04_biznes.png',
  './assets/ui-kit/categories/category_05_platezhi.png',
  './assets/ui-kit/categories/category_06_drugie.png',
  './assets/ui-kit/categories/category_07_spravki.png',
  './assets/ui-kit/categories/category_08_avto.png',
  './assets/ui-kit/categories/category_09_zhilye.png',
  './assets/ui-kit/gov/10_badge_id_card_mini.png',
  './assets/ui-kit/gov/11_badge_passport_rk_mini.png',
  './assets/ui-kit/gov/13_icon_chevron_blue.png',
  './assets/ui-kit/gov/14_icon_certificates.png',
  './assets/ui-kit/gov/17_icon_address_registration.png',
  './assets/ui-kit/gov/20_icon_benefits_payments.png',
  './assets/ui-kit/gov/23_icon_car_reregistration.png',
  './assets/ui-kit/gov/28_icon_home_gray.png',
  './assets/ui-kit/gov/29_icon_kaspi_qr.png',
  './assets/ui-kit/gov/30_icon_messages.png',
  './assets/ui-kit/gov/31_icon_services_red.png',
  './assets/ui-kit/main/01_ad_banner_electronics.png',
  './assets/ui-kit/main/02_ad_banner_kaspi_travel.png',
  './assets/ui-kit/main/09_icon_search.png',
  './assets/ui-kit/main/10_icon_cart_top.png',
  './assets/ui-kit/main/11_icon_shop.png',
  './assets/ui-kit/main/12_icon_my_bank.png',
  './assets/ui-kit/main/13_icon_payments.png',
  './assets/ui-kit/main/14_icon_transfers.png',
  './assets/ui-kit/main/15_icon_magnum.png',
  './assets/ui-kit/main/16_icon_travel.png',
  './assets/ui-kit/main/17_icon_gov_services.png',
  './assets/ui-kit/main/18_icon_jobs.png',
  './assets/ui-kit/main/27_badge_kredit_red.png',
  './assets/ui-kit/main/28_badge_deposit_tenge_dollar.png',
  './assets/ui-kit/main/29_badge_0_0_12_red.png',
  './assets/ui-kit/main/30_badge_credit_green.png',
  './assets/ui-kit/main/35_chip_recommendations.png',
  './assets/ui-kit/main/36_chip_discounts.png',
  './assets/ui-kit/main/37_chip_tours.png',
  './assets/ui-kit/main/41_icon_magnum_circle.png',
  './assets/ui-kit/main/42_ad_product_card_tablet_full.png',
  './assets/ui-kit/main/43_ad_product_card_shaver_full.png',
  './assets/ui-kit/main/48_icon_home.png',
  './assets/ui-kit/main/49_icon_kaspi_qr.png',
  './assets/ui-kit/main/50_icon_messages.png',
  './assets/ui-kit/main/51_icon_services.png',
  './assets/ui-kit/splash/egov-mark.png',
  './assets/ui-kit/splash/kaspi-mark.png',
  './assets/ui-kit/vectors/action_back_chevron.svg',
  './assets/ui-kit/vectors/action_chevron_right.svg',
  './assets/ui-kit/vectors/action_close_cross.svg',
  './assets/ui-kit/vectors/action_search_loupe.svg',
  './assets/ui-kit/vectors/icon_service_meditsina.svg',
  './assets/ui-kit/vectors/icon_service_nedvizhimost.svg',
  './assets/ui-kit/vectors/icon_service_propiska.svg',
  './qr-icon.jpeg',
  './qr_4783412.png',
  './send-icon.jpeg',
  './udost.jpeg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith('kaspi-id-single-folder-') && key !== CACHE_NAME).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    if (request.mode === 'navigate') {
      try {
        const response = await fetch(request);
        if (response.ok) await cache.put(request, response.clone());
        return response;
      } catch {
        return (await cache.match(request)) || (await cache.match('./index.html'));
      }
    }

    try {
      const response = await fetch(request);
      if (response.ok && url.pathname.startsWith(new URL('./', self.registration.scope).pathname)) {
        await cache.put(request, response.clone());
      }
      return response;
    } catch {
      const cached = await cache.match(request);
      if (cached) return cached;
      throw new Error('Offline resource is not cached');
    }
  })());
});
