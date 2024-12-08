document.addEventListener('DOMContentLoaded', () => {
    let currentLanguage = localStorage.getItem('language') || 'ru';
    let translationsCache = {}; // Кэш для хранения данных из JSON при переключении языка

    // Безопасный поиск элемента
    function safeQuerySelector(selector) {
        const el = document.querySelector(selector);
        if (!el) {
            console.error(`Could not find element: ${selector}`);
        }
        return el;
    }

    // Загрузка переводов из JSON
    async function loadTranslations(language) {
        try {
            if (language === 'en') {
                const primaryResponse = await fetch(`languages/${language}-version.json`);
                if (!primaryResponse.ok) throw new Error('Primary JSON file not found');
                const primaryTranslations = await primaryResponse.json();

                const customResponse = await fetch(`languages/about-site_${language}-version.json`);
                if (!customResponse.ok) throw new Error('Custom JSON file not found');
                const customTranslations = await customResponse.json();

                return { ...primaryTranslations, ...customTranslations };
            }
            return {}; // Возвращаем пустой объект при возврате на русский
        } catch (error) {
            console.error('Error loading translations:', error);
            return {};
        }
    }

    // Загрузка VK-виджета динамически
    async function loadVKWidget() {
        return new Promise((resolve, reject) => {
            if (typeof VK === 'undefined') {
                const script = document.createElement('script');
                script.src = "https://vk.com/js/api/openapi.js?168";
                script.async = true;
                script.onload = () => {
                    if (typeof VK !== 'undefined' && VK.Widgets) {
                        resolve();
                    } else {
                        reject('VK.Widgets not defined after script load');
                    }
                };
                script.onerror = () => reject('Failed to load VK script');
                document.head.appendChild(script);
            } else {
                resolve();
            }
        });
    }

    async function initializeVKWidget() {
        try {
            await loadVKWidget();
            if (currentLanguage === 'ru' && typeof VK !== 'undefined' && VK.Widgets) {
                VK.Widgets.Group("vk_groups", {
                    mode: 1,
                    no_cover: 1,
                    width: 290,
                    height: 290,
                    color1: "FFFFFF",
                    color2: "000000",
                    color3: "666666"
                }, 50158044);
            }
        } catch (error) {
            console.error('Error initializing VK Widget:', error);
        }
    }

    async function renderTranslations() {
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
                initializeVKWidget();
            }
        } else if (currentLanguage === 'ru') {
            // Возвращаем исходный контент при переключении обратно на русский
            const elementsToRestore = document.querySelectorAll('[data-key]');
            elementsToRestore.forEach(el => {
                const key = el.getAttribute('data-key');
                el.innerHTML = el.getAttribute('data-original');
            });

            const widgetContainer = safeQuerySelector('#widget-content');
            if (widgetContainer) {
                widgetContainer.innerHTML = widgetContainer.getAttribute('data-original') || '';
            }
        }
    }

    function saveOriginalContent() {
        const elementsToCache = document.querySelectorAll('[data-key]');
        elementsToCache.forEach(el => {
            el.setAttribute('data-original', el.innerHTML);
        });

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

    const languageButtons = document.querySelectorAll('.language-buttons button');
    languageButtons.forEach(button => {
        button.addEventListener('click', async () => {
            currentLanguage = button.textContent.toLowerCase();
            localStorage.setItem('language', currentLanguage);
            await renderTranslations();
            updateLanguageButtons();
        });
    });

    saveOriginalContent();
    renderTranslations();
    updateLanguageButtons();
});
