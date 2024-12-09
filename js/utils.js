// Безопасный поиск элемента
export function safeQuerySelector(selector) {
    const el = document.querySelector(selector);
    if (!el) {
        console.error(`Could not find element: ${selector}`);
    }
    return el;
}