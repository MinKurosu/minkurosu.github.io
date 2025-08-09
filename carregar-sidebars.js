
function carregarScript(src, containerId, atributos = {}) {
    return new Promise((resolve, reject) => {
        const container = document.getElementById(containerId);
        if (!container) {
          
            console.warn(`Container com id '${containerId}' não encontrado. O script será anexado ao body.`);
            reject(new Error(`Container com id '${containerId}' não encontrado.`));
            return;
        }

        const script = document.createElement('script');
        script.src = src;

   
        Object.keys(atributos).forEach(key => {
            script.setAttribute(key, atributos[key]);
        });

        script.onload = () => resolve(script);
        script.onerror = () => reject(new Error(`Falha ao carregar o script ${src}`));
        
        container.appendChild(script); 
    });
}

document.addEventListener("DOMContentLoaded", function() {

    function carregarConteudo(url, containerId) {
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erro ao carregar o ficheiro: " + url);
                }
                return response.text();
            })
            .then(html => {
                const container = document.getElementById(containerId);
                if (container) {
                    container.innerHTML = html;
                }
            });
    }

    const promessaEsquerda = carregarConteudo('sidebar-esquerda.html', 'sidebar-esquerda-container');
    const promessaDireita = carregarConteudo('sidebar-direita.html', 'sidebar-direita-container');

    Promise.all([promessaEsquerda, promessaDireita]).then(() => {
        
        console.log('Sidebars carregadas. A iniciar scripts dependentes...');

        if (typeof inicializarThemeSwitcher === 'function') inicializarThemeSwitcher();
        if (typeof inicializarLastFmWidget === 'function') inicializarLastFmWidget();

        // Carrega o script do Status Cafe (ele encontrará a div #statuscafe sozinho)
        carregarScript('https://status.cafe/current-status.js?name=minkurosu', 'statuscafe')
            .catch(error => console.error(error));

        carregarScript('//counter1.fc2.com/counter.php?id=40451086&main=1', 'fc2-counter-container', {
            'language': 'javascript',
            'type': 'text/javascript',
            'style': 'color:#534F4A' // Atributo style adicionado aqui!
        }).catch(error => console.error(error));
        
    }).catch(error => {
        console.error("Falha ao carregar as sidebars ou os seus scripts:", error);
    });
});