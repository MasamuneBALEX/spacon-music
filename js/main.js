import { renderTranslations, saveOriginalContent } from './content.js';
import { updateLanguageButtons } from './buttons.js';

document.addEventListener('DOMContentLoaded', () => {
    let currentLanguage = localStorage.getItem('language') || 'ru';
    let translationsCache = {};

    // Сохранить исходный контент
    saveOriginalContent();

    // Отобразить текущие переводы
    renderTranslations(currentLanguage, translationsCache);

    // Обновить состояние кнопок
    updateLanguageButtons(currentLanguage);

    // Добавить обработчики на кнопки
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
