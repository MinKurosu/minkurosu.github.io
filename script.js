
document.addEventListener('DOMContentLoaded', () => {
    const tracks = document.querySelectorAll('.track-inner');
    tracks.forEach(track => {
        const content = track.innerHTML;
        track.innerHTML += content;
    });

    const fridgeLink = document.querySelector('a[data-page="yaoifridge"]');

    if (fridgeLink) {
        fridgeLink.addEventListener('click', (event) => {
            event.preventDefault();
            loadYaoifridgeContent();
        });
    }
});


async function loadYaoifridgeContent() {
    try {
        const container = document.getElementById('container');
        if (!container) {
            console.error('Elemento #container não foi encontrado na página.');
            return;
        }

        const response = await fetch('yaoifridge.html');
        if (!response.ok) {
            throw new Error(`Erro ao buscar o arquivo: ${response.statusText}`);
        }
        const html = await response.text();

        container.innerHTML = html;

        initializeDrag();

    } catch (error) {
        console.error('Erro ao carregar o conteúdo do yaoifridge:', error);
    }
}


function initializeDrag() {
    function applyTransform(target, x, y, rotation) {
        target.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
    }

    interact('.draggable')
        .draggable({
            inertia: false,
            modifiers: [
                interact.modifiers.restrictRect({
                    restriction: 'parent',
                    endOnly: true
                })
            ],
            autoScroll: false,
            listeners: {
                move: function (event) {
                    const target = event.target;

                    let x = (parseFloat(target.dataset.x) || 0) + event.dx;
                    let y = (parseFloat(target.dataset.y) || 0) + event.dy;
                    const rotation = (parseFloat(target.dataset.rotation) || 0);

                    applyTransform(target, x, y, rotation);

                    target.dataset.x = x;
                    target.dataset.y = y;
                }
            }
        });

    document.querySelectorAll('.draggable').forEach(item => {
        const rotation = parseFloat(item.dataset.rotation) || 0;
        const x = parseFloat(item.dataset.x) || 0;
        const y = parseFloat(item.dataset.y) || 0;
        applyTransform(item, x, y, rotation);
    });
}