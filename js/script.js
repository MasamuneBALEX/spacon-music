document.addEventListener('DOMContentLoaded', () => {
    let currentLanguage = localStorage.getItem('language') || 'ru';
    let isSwitching = false; // Флаг, чтобы не возникали конфликты

    const safeQuerySelector = selector => {
        const el = document.querySelector(selector);
        if (!el) console.error(`Could not find element: ${selector}`);
        return el;
    };

    // Загрузка данных переводов
    async function loadTranslations(language) {
        try {
            const response = await fetch(`languages/${language}-version.json`);
            if (!response.ok) throw new Error('Ошибка при загрузке данных');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Ошибка:", error);
            return {};
        }
    }

    // Актуализация кнопок
    function updateLanguageButtons() {
        const buttons = document.querySelectorAll('.language-buttons button');

        buttons.forEach(button => {
            const lang = button.textContent.toLowerCase();
            if (lang === currentLanguage) {
                button.classList.add('button-active');
            } else {
                button.classList.remove('button-active');
            }
        });
    }

    async function switchLanguage(lang) {
        if (isSwitching) return; // Ожидаем, чтобы переключения не конфликтовали
        isSwitching = true;

        currentLanguage = lang;
        localStorage.setItem('language', lang);

        const translations = await loadTranslations(lang);
        renderTranslations(translations);
        updateLanguageButtons();

        isSwitching = false;
    }

    function renderTranslations(translations) {
        const elementsToTranslate = document.querySelectorAll('[data-key]');
        elementsToTranslate.forEach(el => {
            const key = el.getAttribute('data-key');
            if (translations[key]) {
                el.innerHTML = translations[key];
            }
        });
    }

    const languageButtons = document.querySelectorAll('.language-buttons button');
    languageButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const lang = event.target.textContent.toLowerCase();
            if (lang !== currentLanguage) switchLanguage(lang);
        });
    });

    updateLanguageButtons();
});
