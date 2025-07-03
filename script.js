document.addEventListener('DOMContentLoaded', () => {
    // --- Código para o efeito de loop de track ---
    const tracks = document.querySelectorAll('.track-inner');

    tracks.forEach(track => {
        // Duplica o conteúdo da track para criar o efeito de loop infinito
        const content = track.innerHTML;
        track.innerHTML += content; // Adiciona o conteúdo original novamente
    });

}

  import { SkinViewer, WalkingAnimation } from 'skinview3d';

// Seu código aqui
const skinViewer = new SkinViewer({
    canvas: document.getElementById("skin_container"),
    width: 300,
    height: 400,
    skin: "C:\Users\yasmi\Desktop\meu-blog-firebase-novo\imgs\skins\me2020.png"
});