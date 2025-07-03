document.addEventListener('DOMContentLoaded', () => {
    const tracks = document.querySelectorAll('.track-inner');

    tracks.forEach(track => {
        // Duplica o conteúdo da track para criar o efeito de loop infinito
        // Isso faz com que, quando a animação atinge o final da primeira cópia,
        // ela já esteja começando a exibir a segunda cópia, criando a ilusão de loop.
        const content = track.innerHTML;
        track.innerHTML += content; // Adiciona o conteúdo original novamente
    });
});