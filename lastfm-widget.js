if (window.LASTFM_WIDGET_LOADED) {
    console.log('widget já carregado, pulando...');
    return;
}
window.LASTFM_WIDGET_LOADED = true;



const LASTFM_USERNAME = 'minkurosu';
const LASTFM_API_KEY = 'a2ef624a3dff8ec934580b0577d18cb5';

async function fetchLastFmTrack() {
    console.log("[Last.fm] Procurando pela música mais recente...");
    const lastfmSongCell = document.getElementById('lastfm-song-cell');

    if (!lastfmSongCell) {
        console.error("[Last.fm] ERRO: Elemento 'lastfm-song-cell' não encontrado. O script não pode continuar.");
        return;
    }
    console.log("[Last.fm] Elemento 'lastfm-song-cell' encontrado com sucesso.");

    const apiUrl = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${minkurosu}&api_key=${a2ef624a3dff8ec934580b0577d18cb5}&format=json&limit=1`;

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
            const trackUrl = track.url;


            const newContent = `<a href="${trackUrl}" target="_blank">${songName.toLowerCase()} - ${artistName.toLowerCase()}</a>`;
            lastfmSongCell.innerHTML = newContent;
            console.log(`[Last.fm] Sucesso! Música atualizada para: ${songName} - ${artistName}`);

        } else {
            lastfmSongCell.textContent = 'nenhuma música recente.';
            console.log("[Last.fm] Nenhuma música recente encontrada.");
        }
    } catch (error) {
        console.error("[Last.fm] Falha ao buscar dados da API:", error);
        lastfmSongCell.textContent = 'erro ao carregar.';
    }
}

function inicializarLastFmWidget() {
    console.log("[Last.fm] Inicializando o widget...");
    fetchLastFmTrack();

}