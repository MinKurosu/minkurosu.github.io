// games-loader.js
// Script para carregar conteúdo dos jogos dentro da página games.html

(function () {
    'use strict';

    console.log('🎮 Games Loader carregado!');

    // Função para inicializar a página de games
    function initGames() {
        const gameButtons = document.querySelectorAll('.game-button-link');
        const gameContentDiv = document.getElementById('gameContent');

        if (!gameContentDiv) {
            console.log('⚠️ gameContent div não encontrada');
            return;
        }

        if (gameButtons.length === 0) {
            console.log('⚠️ Botões de game não encontrados');
            return;
        }

        console.log(`✅ Encontrados ${gameButtons.length} botões de jogos`);

        function loadGameContent(url) {
            gameContentDiv.innerHTML = '<h1 style="text-align: center; padding: 20px; color: #534F4A; text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;">Carregando...</h1>';

            console.log('📥 Carregando:', url);

            fetch(url, {
                method: 'GET',
                cache: 'no-cache'
            })
                .then(response => {
                    console.log('📡 Status:', response.status);
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
                    return response.text();
                })
                .then(html => {
                    console.log('✅ HTML recebido:', html.length, 'caracteres');

                    // Parse do HTML
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');

                    // Busca conteúdo
                    let content = doc.querySelector('main') || doc.querySelector('body');

                    if (!content) {
                        throw new Error('Nenhum conteúdo encontrado no arquivo');
                    }

                    // Insere conteúdo
                    gameContentDiv.innerHTML = content.innerHTML;
                    console.log('✨ Conteúdo inserido com sucesso!');

                    // Executa scripts inline
                    const scripts = gameContentDiv.querySelectorAll('script');
                    console.log('📜 Scripts encontrados:', scripts.length);

                    scripts.forEach((oldScript) => {
                        const newScript = document.createElement('script');

                        // Copia atributos
                        Array.from(oldScript.attributes).forEach(attr => {
                            newScript.setAttribute(attr.name, attr.value);
                        });

                        if (oldScript.src) {
                            newScript.src = oldScript.src;
                        } else {
                            newScript.textContent = oldScript.textContent;
                        }

                        // Remove o antigo e adiciona o novo
                        oldScript.remove();
                        document.body.appendChild(newScript);
                    });

                })
                .catch(error => {
                    console.error('❌ Erro:', error);
                    gameContentDiv.innerHTML = `
                    <div style="text-align: center; padding: 40px;">
                        <h1 style="color: #8B0000; text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;">
                            Erro ao carregar
                        </h1>
                        <p style="color: #534F4A; text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;">
                            Não foi possível carregar: ${url}
                        </p>
                        <p style="color: #534F4A; font-size: 0.9em; text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;">
                            ${error.message}
                        </p>
                    </div>
                `;
                });
        }

        // Adiciona eventos aos botões
        gameButtons.forEach((button, index) => {
            // Remove listeners antigos
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);

            newButton.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                const gameSrc = this.getAttribute('data-src');
                console.log(`🖱️ Clique no botão ${index + 1}:`, gameSrc);

                // Remove active de todos
                document.querySelectorAll('.game-button-link').forEach(btn => {
                    btn.classList.remove('active');
                });

                // Adiciona active neste
                this.classList.add('active');

                // Carrega conteúdo
                loadGameContent(gameSrc);
            });
        });

        // Auto-carrega o primeiro
        console.log('🚀 Auto-carregando primeiro jogo...');
        const firstButton = document.querySelector('.game-button-link');
        if (firstButton) {
            firstButton.click();
        }
    }

    // Tenta inicializar em diferentes momentos
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGames);
    } else {
        initGames();
    }

    // Também tenta quando window carrega
    window.addEventListener('load', function () {
        const gameContentDiv = document.getElementById('gameContent');
        if (gameContentDiv && gameContentDiv.innerHTML.trim() === '') {
            console.log('🔄 Tentando inicializar novamente...');
            setTimeout(initGames, 100);
        }
    });

    // Export para uso manual se necessário
    window.initGamesPage = initGames;

})();