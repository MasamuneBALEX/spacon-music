export function updateLanguageButtons(currentLanguage) {
    const buttons = document.querySelectorAll('.language-buttons button');
    buttons.forEach(button => {
        button.classList.toggle('button-active', button.textContent.toLowerCase() === currentLanguage);
    });
}
