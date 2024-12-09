const mediaQuery = window.matchMedia('(max-width: 992px)');

function checkAndRemove() {
    const elementToDelete = document.querySelector('[data-key="delete-script"]');
    if (mediaQuery.matches && elementToDelete) {
        // Удаляем элемент из DOM
        elementToDelete.remove();
        console.log('Элемент удалён из DOM');
    }
}

// Проверяем изначально при загрузке страницы
checkAndRemove();

// Добавляем слушатель, чтобы следить за изменениями
mediaQuery.addEventListener('change', checkAndRemove);

function createRightSection() {
    const section = document.createElement('section');
    section.className = 'right-section';
    section.innerHTML = `
        <div class="main_title-block title_radius">
          <h2 class="main_vidgets-header" data-key="vidgets">Виджеты</h2>
        </div>
        
        <div class="main_vidgets">
          <div class="main_vidget">
            <div class="main_vidget-header">
              <h3>SoundCloud</h3>
            </div>
            <div class="main_vidget-element">
              <iframe width="290" height="290"
                src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/users/316538396&amp;color=%23f08cb4&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;show_teaser=true"></iframe>
            </div>
          </div>
        
          <div class="main_vidget">
            <div class="main_vidget-header">
              <h3 data-key="widget-name">VK Группа</h3>
            </div>
            <div class="main_vidget-element main_vidget-element-flex" id="widget-content">
              <div id="vk_groups"></div>
            </div>
          </div>
        </div>
      `;
    return section;
}

/**
 * Инициализация VK-виджета
 */
function initializeVKWidget() {
    return new Promise((resolve, reject) => {
        if (typeof VK !== 'undefined' && VK.Widgets) {
            VK.Widgets.Group("vk_groups", {
                mode: 3,
                no_cover: 1,
                width: 290,
                height: 290,
                color1: "FFFFFF",
                color2: "000000",
                color3: "666666"
            }, 50158044);
            resolve();
        } else {
            reject('VK виджеты не инициализированы');
        }
    });
}

/**
 * Функция обработки медиа-запросов
 */
async function handleMediaQuery() {
    const mainWrapper = document.querySelector('.main_wrapper');
    const leftSection = document.querySelector('.left-section');
    const rightSection = document.querySelector('.right-section');

    if (!mainWrapper || !leftSection) {
        console.error('Не найдены родительские элементы');
        return;
    }

    if (mediaQuery.matches) {
        // Удаляем элемент, если ширина <= 992px
        if (rightSection) {
            rightSection.remove();
            console.log('Блок удален из DOM');
        }
    } else {
        // Добавляем блок, если его еще нет, при ширине > 992px
        if (!rightSection) {
            const newSection = createRightSection();
            leftSection.insertAdjacentElement('afterend', newSection);

            console.log('Блок добавлен');
            try {
                await initializeVKWidget();
                console.log('VK виджет успешно инициализирован');
            } catch (error) {
                console.error(error);
            }
        }
    }
}

// Начальная проверка при загрузке
handleMediaQuery();

// Слушаем изменения размеров экрана
mediaQuery.addEventListener('change', handleMediaQuery);
