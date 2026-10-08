declare global {
  interface Window {
    ymaps?: any;
    __ymapsPromise?: Promise<any>;
  }
}

const DEFAULT_YANDEX_API_KEY = '4435c9da-a1d3-436e-8391-c68f5dbc85f7';

export function loadYandexMaps(apiKey: string = DEFAULT_YANDEX_API_KEY): Promise<any> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Yandex Maps can only be loaded in the browser.'));
  }

  if (window.__ymapsPromise) {
    return window.__ymapsPromise;
  }

  if (window.ymaps && typeof window.ymaps.ready === 'function') {
    window.__ymapsPromise = new Promise((resolve) => {
      window.ymaps.ready(() => resolve(window.ymaps));
    });
    return window.__ymapsPromise;
  }

  const effectiveKey = apiKey || DEFAULT_YANDEX_API_KEY;

  window.__ymapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    const keyParam = effectiveKey ? `&apikey=${encodeURIComponent(effectiveKey)}` : '';
    script.src = `https://api-maps.yandex.ru/2.1/?lang=ru_RU${keyParam}`;
    script.async = true;

    const timeout = setTimeout(() => {
      reject(new Error('Время загрузки Яндекс Карт истекло. Проверьте подключение к интернету.'));
    }, 15000);

    script.onload = () => {
      clearTimeout(timeout);
      if (window.ymaps && typeof window.ymaps.ready === 'function') {
        window.ymaps.ready(() => {
          resolve(window.ymaps);
        });
      } else {
        reject(new Error('Яндекс Карты загрузились с ошибкой (объект ymaps не найден).'));
      }
    };

    script.onerror = () => {
      clearTimeout(timeout);
      reject(new Error('Не удалось загрузить скрипт API Яндекс Карт. Проверьте сеть или блокировщики рекламы.'));
    };

    document.head.appendChild(script);
  });

  return window.__ymapsPromise;
}
