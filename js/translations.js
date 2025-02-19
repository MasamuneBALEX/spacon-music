export async function loadTranslations(language) {
    try {
        if (language === 'en') {
            const primaryResponse = await fetch(`languages/${language}-version.json`);
            if (!primaryResponse.ok) throw new Error('Primary JSON file not found');
            const primaryTranslations = await primaryResponse.json();

            const customResponse = await fetch(`languages/about-site_${language}-version.json`);
            if (!customResponse.ok) throw new Error('Custom JSON file not found');
            const customTranslations = await customResponse.json();

            return { ...primaryTranslations, ...customTranslations };
        }

        if (language === 'ru') {
            const ruResponse = await fetch(`languages/${language}-version.json`);
            if (!ruResponse.ok) throw new Error('Russian JSON file not found');
            const ruTranslations = await ruResponse.json();

            const customResponse = await fetch(`languages/about-site_${language}-version.json`);
            if (!customResponse.ok) throw new Error('Custom JSON file not found');
            const ruCustomTranslations = await customResponse.json();

            return { ...ruTranslations, ...ruCustomTranslations };
        }

        return {};
    } catch (error) {
        console.error('Error loading translations:', error);
        return {};
    }
}
