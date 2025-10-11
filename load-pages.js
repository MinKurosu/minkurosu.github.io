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
                // Insere o HTML
                mainContainer.innerHTML = html;

                // RE-EXECUTA os scripts da página carregada
                const scripts = mainContainer.querySelectorAll('script');
                console.log(`📜 Encontrados ${scripts.length} scripts na página ${pageName}`);

                scripts.forEach((oldScript, index) => {
                    const newScript = document.createElement('script');

                    // Copia todos os atributos
                    Array.from(oldScript.attributes).forEach(attr => {
                        newScript.setAttribute(attr.name, attr.value);
                    });

                    // Se tiver src (script externo)
                    if (oldScript.src) {
                        newScript.src = oldScript.src;
                        console.log(`  ↳ Script externo ${index + 1}:`, oldScript.src);
                    }
                    // Se for inline
                    else {
                        newScript.textContent = oldScript.textContent;
                        console.log(`  ↳ Script inline ${index + 1}`);
                    }

                    // Remove o script antigo
                    oldScript.remove();

                    // Adiciona o novo script ao body (isso força a execução)
                    document.body.appendChild(newScript);
                });

                // Inicializa Fancybox se existir
                if (typeof Fancybox !== 'undefined') {
                    Fancybox.bind('[data-fancybox="gallery"]', {});
                }

                // Se for a página games, aguarda um pouco e tenta inicializar
                if (pageName === 'games') {
                    console.log('🎮 Página games carregada, aguardando inicialização...');

                    // Tenta várias vezes para garantir
                    setTimeout(() => {
                        if (typeof window.initGamesPage === 'function') {
                            console.log('🎮 Inicializando games page manualmente...');
                            window.initGamesPage();
                        } else {
                            console.log('🎮 Tentando inicializar games automaticamente...');
                            const gameButtons = document.querySelectorAll('.game-button-link');
                            if (gameButtons.length > 0 && gameButtons[0].onclick === null) {
                                // Se os botões não têm eventos, força execução dos scripts
                                const gameScripts = document.querySelectorAll('script');
                                gameScripts.forEach(script => {
                                    if (script.textContent.includes('game-button-link')) {
                                        try {
                                            eval(script.textContent);
                                        } catch (e) {
                                            console.error('Erro ao executar script:', e);
                                        }
                                    }
                                });
                            }
                        }
                    }, 200);
                }

                console.log(`✅ Página ${pageName} carregada com sucesso!`);
            })
            .catch(error => {
                console.error('❌ Erro ao carregar a página:', error);
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

    // Carrega a página inicial
    loadPage('aboutme');
});