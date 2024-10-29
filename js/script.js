// Устанавливаем язык по умолчанию или читаем его из localStorage
let currentLanguage = localStorage.getItem('language') || 'ru';

// Функция загрузки перевода
function loadTranslation(language) {
    fetch(`languages/${language}-version.json`) // Путь к JSON-файлам
        .then(response => {
            if (!response.ok) throw new Error('Translation file not found'); // Обработка ошибки, если файл не найден
            return response.json();
        })
        .then(translation => {
            // Обновляем текст на странице
            document.querySelectorAll('[data-key]').forEach(element => {
                const key = element.getAttribute('data-key');
                element.textContent = translation[key];
            });

            // Обновляем содержимое виджета
            const widgetContent = translation.widgetContent; // Получаем содержимое виджета
            const widgetContainer = document.getElementById('widget-content');
            widgetContainer.innerHTML = ''; // Очищаем контейнер виджета перед добавлением нового содержимого

            // Добавляем код виджета для русского и английского языка
            widgetContainer.innerHTML = widgetContent; // Добавляем HTML внутри виджета

            // Инициализируем виджет ВКонтакте только для русского языка
            if (language === 'ru' && typeof VK !== 'undefined' && VK.Widgets) {
                VK.Widgets.Group("vk_groups", { mode: 1, no_cover: 1, width: 290, height: 290, color1: "FFFFFF", color2: "000000", color3: "666666" }, 50158044);
            }
        })
        .catch(error => console.error('Error loading translation:', error));
}

// Функция обновления состояния кнопок языка
function updateLanguageButtons() {
    const buttons = document.querySelectorAll('.language-buttons button');
    buttons.forEach(button => {
        button.classList.toggle('button-active', button.textContent.toLowerCase() === currentLanguage);
    });
}

// Обработчик кликов по кнопкам языка
document.querySelectorAll('.language-buttons button').forEach(button => {
    button.addEventListener('click', event => {
        currentLanguage = button.textContent.toLowerCase(); // Устанавливаем язык по клику
        localStorage.setItem('language', currentLanguage); // Сохраняем выбранный язык
        loadTranslation(currentLanguage); // Загружаем перевод
        updateLanguageButtons(); // Обновляем состояние кнопок
    });
});

// Загрузка перевода и установка активной кнопки при первой загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadTranslation(currentLanguage);
    updateLanguageButtons();
});

// Обновляем язык при навигации
window.addEventListener('popstate', () => {
    loadTranslation(currentLanguage);
});