import { safeQuerySelector } from './utils.js';
import { loadTranslations } from './translations.js'; // Импорт из translations.js
import { initializeVKWidget } from './vk-widget.js';

export async function renderTranslations(currentLanguage, translationsCache) {
    if (currentLanguage === 'en') {
        if (!translationsCache['en']) {
            translationsCache['en'] = await loadTranslations('en');
        }

        const elementsToTranslate = document.querySelectorAll('[data-key]');
        elementsToTranslate.forEach(el => {
            const key = el.getAttribute('data-key');
            if (translationsCache['en'][key]) {
                el.innerHTML = translationsCache['en'][key];
            } else {
                console.warn(`Key "${key}" is missing in translations`);
            }
        });

        const widgetContainer = safeQuerySelector('#widget-content');
        if (widgetContainer) {
            widgetContainer.innerHTML = translationsCache['en'].widgetContent || '';
            initializeVKWidget(currentLanguage);
        }
    } else if (currentLanguage === 'ru') {
        const elementsToRestore = document.querySelectorAll('[data-key]');
        elementsToRestore.forEach(el => {
            el.innerHTML = el.getAttribute('data-original');
        });

        const widgetContainer = safeQuerySelector('#widget-content');
        if (widgetContainer) {
            widgetContainer.innerHTML = widgetContainer.getAttribute('data-original') || '';
        }
    }
}

export function saveOriginalContent() {
    const elementsToCache = document.querySelectorAll('[data-key]');
    elementsToCache.forEach(el => {
        el.setAttribute('data-original', el.innerHTML);
    });

    const widgetContainer = safeQuerySelector('#widget-content');
    if (widgetContainer) {
        widgetContainer.setAttribute('data-original', widgetContainer.innerHTML);
    }
}
