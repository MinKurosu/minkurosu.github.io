document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.getElementById('container');
    const navLinks = document.querySelectorAll('.nav-link');

    function loadPage(pageName) {
        const fileName = `${pageName}.html`;

        fetch(fileName)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Não foi possível carregar a página: ${response.statusText}`);
                }
                return response.text();
            })
            .then(html => {
                mainContainer.innerHTML = html;

                Fancybox.bind('[data-fancybox="gallery"]', {
                });
            })
            .catch(error => {
                console.error('Erro ao carregar a página:', error);
                mainContainer.innerHTML = '<p>Erro ao carregar o conteúdo. Por favor, verifique se o arquivo existe e tente novamente.</p>';
            });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const page = event.target.getAttribute('data-page');
            if (page) {
                loadPage(page);
            }
        });
    });

    loadPage('aboutme');
});