// lastfm-widget.js

// SUAS CREDENCIAIS (já preenchidas)
const LASTFM_USERNAME = 'minkurosu';
const LASTFM_API_KEY = 'a2ef624a3dff8ec934580b0577d18cb5';

// Agora, o elemento que vamos atualizar é a célula da tabela pelo seu ID
const lastfmSongCell = document.getElementById('lastfm-song-cell');

async function fetchLastFmTrack() {
    if (!lastfmSongCell) {
        console.error("Erro: Elemento com ID 'lastfm-song-cell' não encontrado no HTML.");
        return; // Sai da função se o elemento não for encontrado
    }

    // CORREÇÃO AQUI: Usando HTTPS e as variáveis corretas
    const apiUrl = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USERNAME}&api_key=${LASTFM_API_KEY}&format=json&limit=1`;

    try {
        const response = await fetch(apiUrl); 
        
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.recenttracks && data.recenttracks.track && data.recenttracks.track.length > 0) {
            const track = data.recenttracks.track[0];
            const songName = track.name;
            const artistName = track.artist['#text'];

            // Corrigido para não adicionar espaço extra se não estiver tocando agora
         const nowPlayingIndicator = ''; // Não adiciona "(agora)"

            // ATUALIZA O CONTEÚDO DA CÉLULA DA TABELA
            lastfmSongCell.textContent = `${songName} - ${artistName}${nowPlayingIndicator}`;
            // Usamos textContent para evitar injeção de HTML e garantir que seja apenas texto puro
            
        } else {
            lastfmSongCell.textContent = 'Nenhuma música encontrada.';
        }

    } catch (error) {
        console.error('Erro ao buscar músicas do Last.fm:', error);
        lastfmSongCell.textContent = 'Erro ao carregar a música.'; // Define o texto da célula para um erro
    }
}

// Chama a função uma vez quando a página é carregada
document.addEventListener('DOMContentLoaded', fetchLastFmTrack);

// Atualiza a cada 30 segundos
setInterval(fetchLastFmTrack, 30000);