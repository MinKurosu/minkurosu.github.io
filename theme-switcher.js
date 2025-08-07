
function inicializarThemeSwitcher() {
    const themeToggleButton = document.getElementById('theme-toggle-button');
    const stylesheet = document.getElementById('theme-stylesheet');
    const themeIcon = document.getElementById('theme-icon'); 
    
    const themeFiles = {
        default: 'styles.css',
        alternative: 'emo.css'
    };
    
    const iconFiles = {
        default: 'imgs/site_imgs/lua.png',
        alternative: 'imgs/site_imgs/sol.png'
    };
    
    function applySavedTheme() {
        const savedTheme = localStorage.getItem('theme');
       
const currentThemeKey = (savedTheme && savedTheme.includes(themeFiles.default)) ? 'default' : 'alternative';
        if (stylesheet) {
            stylesheet.setAttribute('href', themeFiles[currentThemeKey]);
        }
        if (themeIcon) {
            themeIcon.setAttribute('src', iconFiles[currentThemeKey]); 
        }
    }
    
    applySavedTheme();
    
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', function() {
            const currentHref = stylesheet.getAttribute('href');
            let newThemeKey;
    
            if (currentHref && currentHref.includes(themeFiles.default)) {
                newThemeKey = 'alternative';
            } else {
                newThemeKey = 'default';
            }
    
            localStorage.setItem('theme', themeFiles[newThemeKey]);
            if (stylesheet) {
                stylesheet.setAttribute('href', themeFiles[newThemeKey]);
            }
            if (themeIcon) {
                themeIcon.setAttribute('src', iconFiles[newThemeKey]); 
            }
        });
    }
}


document.addEventListener('DOMContentLoaded', inicializarThemeSwitcher);