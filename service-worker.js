const CACHE_NAME = 'kaspi-id-single-folder-v33';
const CORE_FILES = [
  './',
  './index.html',
  './style.css?v=20261110-33',
  './script.js?v=20261110-33',
  './pwa.js?v=20261110-33',
  './udost.jpeg',
  './060131500086-20250603111642292.pdf',
  './qr_4783412.png',
  './qr-icon.jpeg',
  './send-icon.jpeg',
  './manifest.webmanifest',
  './favicon.png',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png',
  './assets/ui/01_search.png',
  './assets/ui/02_scanner.png',
  './assets/ui/03_cart_top.png',
  './assets/ui/04_shop.png',
  './assets/ui/05_my_bank.png',
  './assets/ui/06_payments.png',
  './assets/ui/07_transfers.png',
  './assets/ui/08_magnum.png',
  './assets/ui/09_travel.png',
  './assets/ui/10_gov_services.png',
  './assets/ui/11_jobs.png',
  './assets/ui/12_installment_0_0_12.png',
  './assets/ui/13_credit.png',
  './assets/ui/14_red_plus.png',
  './assets/ui/15_deposit.png',
  './assets/ui/16_bonus_3_percent.png',
  './assets/ui/17_discount_63_percent.png',
  './assets/ui/18_rating_star.png',
  './assets/ui/19_home.png',
  './assets/ui/20_kaspi_qr.png',
  './assets/ui/21_messages.png',
  './assets/ui/22_services.png',
  './assets/gov/01_back_arrow.png',
  './assets/gov/02_search.png',
  './assets/gov/03_id_card.png',
  './assets/gov/04_student_id.png',
  './assets/gov/05_chevron_blue.png',
  './assets/gov/06_cat_popular.png',
  './assets/gov/07_cat_certificates.png',
  './assets/gov/08_cat_auto.png',
  './assets/gov/09_cat_housing.png',
  './assets/gov/10_cat_family.png',
  './assets/gov/11_self_employed.png',
  './assets/gov/12_car_reregistration.png',
  './assets/gov/13_address_registration.png',
  './assets/gov/14_chevron_gray.png',
  './assets/gov/15_home.png',
  './assets/gov/16_kaspi_qr.png',
  './assets/gov/17_messages.png',
  './assets/gov/18_services.png',
  './assets/ui-clean/01_search.png',
  './assets/ui-clean/02_cart_top.png',
  './assets/ui-clean/03_travel_banner_icon.png',
  './assets/ui-clean/04_shop.png',
  './assets/ui-clean/05_my_bank.png',
  './assets/ui-clean/06_payments.png',
  './assets/ui-clean/07_transfers.png',
  './assets/ui-clean/08_magnum.png',
  './assets/ui-clean/09_travel.png',
  './assets/ui-clean/10_gov_services.png',
  './assets/ui-clean/11_jobs.png',
  './assets/ui-clean/12_kredit_red.png',
  './assets/ui-clean/13_deposit_tenge_dollar.png',
  './assets/ui-clean/14_installment_0_0_12_red.png',
  './assets/ui-clean/15_credit_green.png',
  './assets/ui-clean/16_icon_discounts_percent.png',
  './assets/ui-clean/17_icon_tours_fire.png',
  './assets/ui-clean/18_icon_magnum_circle.png',
  './assets/ui-clean/19_chip_recommendations.png',
  './assets/ui-clean/20_chip_discounts.png',
  './assets/ui-clean/21_chip_tours.png',
  './assets/ui-clean/22_favorite_heart.png',
  './assets/ui-clean/23_discount_15_percent.png',
  './assets/ui-clean/24_home.png',
  './assets/ui-clean/25_kaspi_qr.png',
  './assets/ui-clean/26_messages.png',
  './assets/ui-clean/27_services.png'
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
