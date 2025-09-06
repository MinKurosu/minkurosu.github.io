document.addEventListener('DOMContentLoaded', function () {
  const mainContainer = document.getElementById('container');
  const dynamicLinks = document.querySelectorAll('[data-page], .nav-link[href="#"][onclick="history.back(); return false;"]');

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

          // --- INÍCIO DA CORREÇÃO ---
          // Adicionamos um pequeno delay para garantir que o DOM foi atualizado
          // antes de executar scripts que dependem do novo conteúdo.
          setTimeout(() => {
            if (typeof inicializarLastFmWidget === 'function') {
              inicializarLastFmWidget();
            }
          }, 100); // 100 milissegundos é um tempo seguro.
          // --- FIM DA CORREÇÃO ---

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