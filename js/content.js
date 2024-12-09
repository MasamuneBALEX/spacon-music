import { safeQuerySelector } from './utils.js';
import { loadTranslations } from './translations.js';
import { initializeVKWidget } from './vk-widget.js';

export async function renderTranslations(currentLanguage, translationsCache) {
    if (!translationsCache[currentLanguage]) {
        translationsCache[currentLanguage] = await loadTranslations(currentLanguage);
    }

    const elementsToTranslate = document.querySelectorAll('[data-key]');
    elementsToTranslate.forEach(el => {
        const key = el.getAttribute('data-key');
        if (translationsCache[currentLanguage][key]) {
            el.innerHTML = translationsCache[currentLanguage][key];
        } else {
            console.warn(`Key "${key}" is missing in translations`);
        }
    });

    const widgetContainer = safeQuerySelector('#widget-content');
    if (widgetContainer) {
        widgetContainer.innerHTML = translationsCache[currentLanguage].widgetContent || '';
        initializeVKWidget(currentLanguage);
    }
}
