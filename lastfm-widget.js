// Arquivo: lastfm-widget.js

// SUAS CREDENCIAIS
const LASTFM_USERNAME = 'minkurosu';
const LASTFM_API_KEY = 'a2ef624a3dff8ec934580b0577d18cb5';

// FUNÇÃO DE INICIALIZAÇÃO
function inicializarLastFmWidget() {

    async function fetchLastFmTrack() {
        const lastfmSongCell = document.getElementById('lastfm-song-cell');

        if (!lastfmSongCell) {
            console.error("Erro: Elemento com ID 'lastfm-song-cell' não encontrado no HTML.");
            return;
        }

        const apiUrl = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USERNAME}&api_key=${LASTFM_API_KEY}&format=json&limit=1`;

        try {
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error(`Erro HTTP! Status: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();

            if (data.recenttracks && data.recenttracks.track && data.recenttracks.track.length > 0) {
                const track = data.recenttracks.track[0];
                const songName = track.name;
                const artistName = track.artist['#text'];
                const trackUrl = track.url;

                lastfmSongCell.innerHTML = `<a href="${trackUrl}" target="_blank">${songName} - ${artistName}</a>`;
                
            } else {
                lastfmSongCell.textContent = 'Nenhuma música encontrada.';
            }

        } catch (error) {
            console.error('Erro ao buscar músicas do Last.fm:', error);
            lastfmSongCell.textContent = 'Erro ao carregar a música.';
        }
    }

    fetchLastFmTrack();
    setInterval(fetchLastFmTrack, 30000);
}