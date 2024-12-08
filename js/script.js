document.addEventListener('DOMContentLoaded', () => {
    let currentLanguage = localStorage.getItem('language') || 'ru';
    let translationsCache = {}; // Кэш для данных переводов

    // Безопасный поиск элемента
    const safeQuerySelector = selector => {
        const el = document.querySelector(selector);
        if (!el) console.error(`Could not find element: ${selector}`);
        return el;
    };

    // Загрузка переводов из JSON
    async function loadTranslations(language) {
        try {
            if (language === 'en') {
                const primaryResponse = await fetch(`languages/${language}-version.json`);
                if (!primaryResponse.ok) throw new Error('Primary JSON not found');
                
                const customResponse = await fetch(`languages/about-site_${language}-version.json`);
                if (!customResponse.ok) throw new Error('Custom JSON not found');
                
                const primaryTranslations = await primaryResponse.json();
                const customTranslations = await customResponse.json();
                
                return { ...primaryTranslations, ...customTranslations };
            }
            return {}; // Пустой объект при русском языке
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            return {};
        }
    }

    // Переключение перевода и контента
    async function renderTranslations() {
        try {
            if (currentLanguage === 'en') {
                if (!translationsCache['en']) {
                    translationsCache['en'] = await loadTranslations('en');
                }

                const elementsToTranslate = document.querySelectorAll('[data-key]');
                elementsToTranslate.forEach(el => {
                    const key = el.getAttribute('data-key');
                    el.innerHTML = translationsCache['en'][key] || el.innerHTML;
                });

                const widgetContainer = safeQuerySelector('#widget-content');
                if (widgetContainer) {
                    widgetContainer.innerHTML = translationsCache['en'].widgetContent || '';
                }
            } else if (currentLanguage === 'ru') {
                const elementsToRestore = document.querySelectorAll('[data-key]');
                elementsToRestore.forEach(el => {
                    el.innerHTML = el.getAttribute('data-original') || el.innerHTML;
                });

                const widgetContainer = safeQuerySelector('#widget-content');
                if (widgetContainer) {
                    widgetContainer.innerHTML = widgetContainer.getAttribute('data-original') || '';
                }
            }
        } catch (error) {
            console.error('Ошибка при рендеринге переводов:', error);
        }
    }

    // Сохранение контента для восстановления при возврате на русский
    function saveOriginalContent() {
        const elementsToCache = document.querySelectorAll('[data-key]');
        elementsToCache.forEach(el => el.setAttribute('data-original', el.innerHTML));

        const widgetContainer = safeQuerySelector('#widget-content');
        if (widgetContainer) {
            widgetContainer.setAttribute('data-original', widgetContainer.innerHTML);
        }
    }

    function updateLanguageButtons() {
        const buttons = document.querySelectorAll('.language-buttons button');
        buttons.forEach(button => {
            button.classList.toggle('button-active', button.textContent.toLowerCase() === currentLanguage);
        });
    }

    async function handleLanguageChange(newLang) {
        if (newLang !== currentLanguage) {
            currentLanguage = newLang;
            localStorage.setItem('language', newLang);
            await renderTranslations();
            updateLanguageButtons();
        }
    }

    const languageButtons = document.querySelectorAll('.language-buttons button');
    languageButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const newLanguage = button.textContent.toLowerCase();
            await handleLanguageChange(newLanguage);
        });
    });

    saveOriginalContent();
    renderTranslations();
    updateLanguageButtons();
});
