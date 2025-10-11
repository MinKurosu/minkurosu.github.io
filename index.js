document.addEventListener('DOMContentLoaded', function () {
  const mainContainer = document.getElementById('container');
  const dynamicLinks = document.querySelectorAll('[data-page], .nav-link[href="#"][onclick="history.back(); return false;"]');

  function reinitializeGoogleTranslate() {
    const translateElement = document.getElementById('google_translate_element');
    if (!translateElement) return;

    translateElement.innerHTML = '';


    setTimeout(() => {
      if (typeof google !== 'undefined' && google.translate && google.translate.TranslateElement) {
        new google.translate.TranslateElement({
          pageLanguage: 'pt',
          includedLanguages: 'en,es,fr,ko,ja,pt,gn,it,de,ru,zh-CN',
          layout: google.translate.TranslateElement.InlineLayout.SIMPLE
        }, 'google_translate_element');
      }
    }, 300);
  }

  function loadContent(pageName) {
    const url = `${pageName}.html`;
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('error, click again to try to reload.' + response.statusText);
        }
        return response.text();
      })
      .then(data => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');
        const contentToLoad = doc.querySelector('#container');

        if (contentToLoad) {
          mainContainer.innerHTML = contentToLoad.innerHTML;

          setTimeout(() => {
            if (typeof inicializarLastFmWidget === 'function') {
              inicializarLastFmWidget();
            }



          } else {
            mainContainer.innerHTML = '<p>error, click again to try to reload.</p>';
          }
      })
      .catch(error => {
        console.error('error, click again to try to reload.', error);
        mainContainer.innerHTML = '<p>error, click again to try to reload.';
      });
  }

  function handleNavLinkClick(event) {
    event.preventDefault();
    if (this.getAttribute('onclick') && this.getAttribute('onclick').includes('history.back')) {
      history.back();
      return;
    }
    const page = this.getAttribute('data-page');
    if (page) {
      history.pushState({ page: page }, '', `${page}.html`);
      loadContent(page);
    }
    const allLinks = document.querySelectorAll('.nav-link');
    allLinks.forEach(link => link.classList.remove('active'));
    this.classList.add('active');
  }

  dynamicLinks.forEach(link => link.addEventListener('click', handleNavLinkClick));

  window.addEventListener('popstate', function (event) {
    const state = event.state;
    if (state && state.page) {
      loadContent(state.page);
    } else {
      loadContent('aboutme');
    }
  });

  loadContent('aboutme');
});