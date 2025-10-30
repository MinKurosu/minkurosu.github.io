document.addEventListener('DOMContentLoaded', function () {
  const mainContainer = document.getElementById('container');
  const dynamicLinks = document.querySelectorAll('[data-page], .nav-link[href="#"][onclick="history.back(); return false;"]');

  // Função para inicializar o slideshow
  function initializeSlideshow() {
    const slideshowArea = document.querySelector('.slideshow-area');
    if (!slideshowArea) return;

    const images = slideshowArea.querySelectorAll('img');
    if (images.length === 0) return;

    let currentIndex = 0;

    // Remove todas as classes active primeiro
    images.forEach(img => img.classList.remove('active'));

    // Adiciona active na primeira imagem
    images[0].classList.add('active');

    // Limpa qualquer intervalo anterior
    if (window.slideshowInterval) {
      clearInterval(window.slideshowInterval);
    }

    // Função para mudar para o próximo slide
    function nextSlide() {
      images[currentIndex].classList.remove('active');
      currentIndex = (currentIndex + 1) % images.length;
      images[currentIndex].classList.add('active');
    }

    // Inicia o intervalo de 4 segundos
    window.slideshowInterval = setInterval(nextSlide, 4000);
  }

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
          throw new Error('Erro ao carregar o conteúdo: ' + response.statusText);
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

            // Inicializa o slideshow após carregar o conteúdo
            initializeSlideshow();

            // Reinicializa o tradutor
            reinitializeGoogleTranslate();
          }, 100);

        } else {
          mainContainer.innerHTML = '<p>Conteúdo não encontrado.</p>';
        }
      })
      .catch(error => {
        console.error('Erro ao carregar o conteúdo:', error);
        mainContainer.innerHTML = '<p>Ocorreu um erro ao carregar a página.</p>';
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