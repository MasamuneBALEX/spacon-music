// Функция для загрузки HTML-контента по указанному пути
function loadPage(path) {
    fetch(`${path}.html`) // Загрузка HTML-контента для указанного пути
        .then(response => {
            if (!response.ok) throw new Error('Page not found');
            return response.text();
        })
        .then(content => {
            document.getElementById('content').innerHTML = content; // Вставка нового содержимого
            window.scrollTo(0, 0); // Прокрутка к началу страницы
        })
        .catch(error => {
            document.getElementById('content').innerHTML = '<p>Error loading page.</p>';
            console.error('Error loading page:', error);
        });
}

// Обработчик кликов по ссылкам
document.querySelectorAll('a[data-path]').forEach(link => {
    link.addEventListener('click', event => {
        event.preventDefault(); // Отключаем стандартный переход по ссылке
        const path = link.getAttribute('data-path'); // Извлекаем путь из ссылки
        history.pushState(null, '', `/${path}`); // Обновляем URL без перезагрузки
        loadPage(path); // Загружаем новый контент
    });
});

// Поддержка кнопок "Назад" и "Вперед"
window.addEventListener('popstate', () => {
    // Загружаем текущий путь при навигации по истории
    const path = location.pathname.slice(1) || 'index'; // Используем 'index' как путь по умолчанию
    loadPage(path);
});

// Загрузка раздела по умолчанию при первой загрузке
document.addEventListener('DOMContentLoaded', () => {
    const initialPath = location.pathname.slice(1) || 'index';
    loadPage(initialPath); // Загрузка текущей страницы по умолчанию
});