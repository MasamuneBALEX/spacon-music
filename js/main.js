import { renderTranslations } from './content.js';
import { updateLanguageButtons } from './buttons.js';

document.addEventListener('DOMContentLoaded', () => {
    let currentLanguage = localStorage.getItem('language') || 'ru';
    let translationsCache = {};

    renderTranslations(currentLanguage, translationsCache);
    updateLanguageButtons(currentLanguage);

    const languageButtons = document.querySelectorAll('.language-buttons button');
    languageButtons.forEach(button => {
        button.addEventListener('click', async () => {
            currentLanguage = button.textContent.toLowerCase();
            localStorage.setItem('language', currentLanguage);
            await renderTranslations(currentLanguage, translationsCache);
            updateLanguageButtons(currentLanguage);
        });
    });
});
