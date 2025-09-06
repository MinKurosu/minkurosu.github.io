function inicializarThemeSwitcher() {
    const themeToggleButton = document.getElementById('theme-toggle-button');
    const stylesheet = document.getElementById('theme-stylesheet');
    const themeIcon = document.getElementById('theme-icon');
    const portfolioIframe = document.querySelector('iframe[name="vitrine-portfolio"]');

    const themeFiles = {
        default: 'emo.css',
        alternative: 'styles.css'
    };

    const iconFiles = {
        default: 'imgs/site_imgs/lua.png',
        alternative: 'imgs/site_imgs/sol.png'
    };

    function applyTheme(themeKey) {
        if (!stylesheet || !themeIcon) {
            return;
        }

        stylesheet.setAttribute('href', themeFiles[themeKey]);
        themeIcon.setAttribute('src', iconFiles[themeKey]);

        localStorage.setItem('theme', themeFiles[themeKey]);
    }

    function applySavedTheme() {
        const savedTheme = localStorage.getItem('theme');
        const currentThemeKey = (savedTheme && savedTheme.includes(themeFiles.default)) ? 'default' : 'alternative';
        applyTheme(currentThemeKey);
    }

    applySavedTheme();

    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', function () {
            const currentHref = stylesheet.getAttribute('href');
            const newThemeKey = (currentHref && currentHref.includes(themeFiles.default)) ? 'alternative' : 'default';

            applyTheme(newThemeKey);

            if (portfolioIframe && portfolioIframe.contentWindow) {
                portfolioIframe.contentWindow.postMessage({ theme: newThemeKey }, '*');
            }
        });
    }

    window.addEventListener('message', (event) => {
        if (event.data && event.data.theme) {
            applyTheme(event.data.theme);
        }
    });
}

document.addEventListener('DOMContentLoaded', inicializarThemeSwitcher);