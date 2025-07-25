// lastfm-widget.js

// SUAS CREDENCIAIS
const LASTFM_USERNAME = 'minkurosu';
const LASTFM_API_KEY = 'a2ef624a3dff8ec934580b0577d18cb5'; // ATENÇÃO: Esta chave está exposta no frontend.

async function fetchLastFmTrack() {
    // Agora, o elemento que vamos atualizar é a célula da tabela pelo seu ID.
    // Buscamos o elemento DENTRO da função para garantir que o DOM já esteja carregado.
    const lastfmSongCell = document.getElementById('lastfm-song-cell');

    if (!lastfmSongCell) {
        console.error("Erro: Elemento com ID 'lastfm-song-cell' não encontrado no HTML.");
        return; // Sai da função se o elemento não for encontrado
    }

    // CORREÇÃO AQUI: Usando as variáveis constantes para o nome de usuário e a chave da API
    const apiUrl = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USERNAME}&api_key=${LASTFM_API_KEY}&format=json&limit=1`;

    try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            // Se a resposta não for OK (ex: 403 Forbidden, 429 Too Many Requests), lançamos um erro
            throw new Error(`Erro HTTP! Status: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        // Verifica se há faixas recentes e se a primeira faixa existe
        if (data.recenttracks && data.recenttracks.track && data.recenttracks.track.length > 0) {
            const track = data.recenttracks.track[0];
            const songName = track.name;
            const artistName = track.artist['#text'];
            const trackUrl = track.url; // Pega a URL da música para criar um link

            // ATUALIZA O CONTEÚDO DA CÉLULA DA TABELA com um link
            lastfmSongCell.innerHTML = `<a href="${trackUrl}" target="_blank">${songName} - ${artistName}</a>`;
            
        } else {
            lastfmSongCell.textContent = 'Nenhuma música encontrada.';
        }

    } catch (error) {
        console.error('Erro ao buscar músicas do Last.fm:', error);
        // Exibe uma mensagem de erro na célula da tabela
        lastfmSongCell.textContent = 'Erro ao carregar a música.';
    }
}

// Chama a função uma vez quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', fetchLastFmTrack);

// Atualiza a cada 30 segundos (30000 milissegundos)
setInterval(fetchLastFmTrack, 30000);