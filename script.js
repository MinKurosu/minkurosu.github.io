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
            console.error('elemento #container não foi encontrado');
            return;
        }

        const response = await fetch('yaoifridge.html');
        if (!response.ok) {
            throw new Error(`erro ao buscar o arquivo: ${response.statusText}`);
        }
        const html = await response.text();

        container.innerHTML = html;

        initializeDrag();

    } catch (error) {
        console.error('erro ao carregar o conteúdo do yaoifridge:', error);
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


    function initializeSlideshow() {
        let slideIndex = 0;
        const slides = document.querySelectorAll('.slideshow-area img');

        if (slides.length === 0) {
            return;
        }

        function showSlides() {

            slides.forEach(slide => {
                slide.classList.remove('active');
            });


            slideIndex++;
            if (slideIndex >= slides.length) {
                slideIndex = 0;
            }

            slides[slideIndex].classList.add('active');


            setTimeout(showSlides, 4000);
        }


        setTimeout(showSlides, 4000);
    }
}

const gtObserver = new MutationObserver(() => {
  const banner = document.querySelector('.goog-te-banner-frame');
  if (banner) {
    banner.style.setProperty('display', 'none', 'important');
  }
  if (document.body.style.top && document.body.style.top !== '0px') {
    document.body.style.setProperty('top', '0', 'important');
  }
});

gtObserver.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });