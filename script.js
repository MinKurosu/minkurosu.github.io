document.addEventListener('DOMContentLoaded', () => {
    const tracks = document.querySelectorAll('.track-inner');

    tracks.forEach(track => {

        const content = track.innerHTML;
        track.innerHTML += content;
    });
});