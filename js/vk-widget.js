export async function loadVKWidget() {
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

export async function initializeVKWidget(currentLanguage) {
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
