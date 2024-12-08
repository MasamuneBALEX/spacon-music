document.addEventListener('DOMContentLoaded', () => {
    let currentLanguage = localStorage.getItem('language') || 'ru';
    let translationsCache = {};
    let isProcessing = false; // Флаг обработки кликов

    const safeQuerySelector = selector => {
        const el = document.querySelector(selector);
        if (!el) console.error(`Could not find element: ${selector}`);
        return el;
    };

    async function loadTranslations(language) {
        try {
            const response = await fetch(`languages/${language}-version.json`);
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Ошибка при загрузке данных:", error);
            return {};
        }
    }

    async function renderTranslations() {
        if (isProcessing) return; // Не выполнять повторно, если уже в процессе

        isProcessing = true; // Устанавливаем флаг обработки клика

        try {
            if (currentLanguage === 'en') {
                if (!translationsCache['en']) {
                    translationsCache['en'] = await loadTranslations('en');
                }
                const elementsToTranslate = document.querySelectorAll('[data-key]');
                elementsToTranslate.forEach(el => {
                    const key = el.getAttribute('data-key');
                    if (translationsCache['en'][key]) {
                        el.innerHTML = translationsCache['en'][key];
                    }
                });
            } else if (currentLanguage === 'ru') {
                const elementsToRestore = document.querySelectorAll('[data-key]');
                elementsToRestore.forEach(el => {
                    el.innerHTML = el.getAttribute('data-original');
                });
            }

            isProcessing = false; // Сбрасываем флаг после завершения рендеринга
            updateLanguageButtons();
        } catch (error) {
            console.error("Ошибка при попытке переключить язык:", error);
            isProcessing = false;
        }
    }

    function saveOriginalContent() {
        const elementsToCache = document.querySelectorAll('[data-key]');
        elementsToCache.forEach(el => el.setAttribute('data-original', el.innerHTML));
    }

    function updateLanguageButtons() {
        const buttons = document.querySelectorAll('.language-buttons button');
        buttons.forEach(button => {
            button.classList.toggle('button-active', button.textContent.toLowerCase() === currentLanguage);
        });
    }

    async function handleClickLanguageChange(event) {
        const clickedLanguage = event.target.textContent.toLowerCase();

        if (clickedLanguage !== currentLanguage) {
            currentLanguage = clickedLanguage;
            localStorage.setItem('language', currentLanguage);
            await renderTranslations();
        }
    }

    const languageButtons = document.querySelectorAll('.language-buttons button');
    languageButtons.forEach(button => {
        button.addEventListener('click', handleClickLanguageChange);
    });

    saveOriginalContent();
    renderTranslations();
    updateLanguageButtons();
});
