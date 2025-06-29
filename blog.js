// blog.js

// Importações de Firebase usando a sintaxe modular
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getFirestore, collection, query, orderBy, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// ** SUA CONFIGURAÇÃO DO FIREBASE **
// Copie e cole do seu console do Firebase.
const firebaseConfig = {
    apiKey: "AIzaSyA8-Ab2dE48sVOhmT-HfxIL5_rzDMRdcCc",
    authDomain: "minkurosu.firebaseapp.com",
    projectId: "minkurosu",
    storageBucket: "minkurosu.firebasestorage.app",
    messagingSenderId: "290821725607",
    appId: "1:290821725607:web:5e39e561da53ac7c8a2a82",
    measurementId: "G-M7PWC6DDRH"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Obtém a instância do Firestore

const postsContainer = document.getElementById('posts-container');

// Função para formatar a data e hora
function formatTimestamp(timestamp) {
    if (!timestamp) return 'Data Indisponível';
    const date = timestamp.toDate(); // Converte o timestamp do Firestore para objeto Date
    return new Intl.DateTimeFormat('pt-BR', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    
    }).format(date);
}

// Nova função para formatar a data no formato DD/MM/YY HH:MM
function formatTimestampMinimal(timestamp) {
    if (!timestamp) return 'Data Indisponível';
    const date = timestamp.toDate();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês é 0-indexed
    const year = String(date.getFullYear()).slice(2); // Últimos dois dígitos do ano
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

// Carrega os posts do Firestore
async function loadPosts() {
    try {
        // Cria a query para buscar posts ordenados por data decrescente
        const postsQuery = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(postsQuery);
        
        postsContainer.innerHTML = ''; // Limpa o conteúdo existente

        if (querySnapshot.empty) {
            postsContainer.innerHTML = '<p>Nenhum post encontrado ainda. Volte mais tarde!</p>';
            return;
        }

        querySnapshot.forEach(doc => {
            const post = doc.data();
            const postElement = document.createElement('div');
            postElement.classList.add('blog-post');

            // Constrói o HTML para cada post, incluindo a nova div .post-info-header
          postElement.innerHTML = `
                <div class="post-author-line">@minkurosu</div> <br><h2>${post.title}</h2>
                <p>${post.content.replace(/\n/g, '<br>')}</p>
                ${post.imageUrl ? `<img src="${post.imageUrl}" alt="${post.title}">` : ''}
                <div class="post-timestamp-line">${formatTimestamp(post.timestamp)}</div> <hr class="post-divider">
            `;
            postsContainer.appendChild(postElement);
        });
    } catch (error) {
        console.error("Erro ao carregar posts:", error);
        postsContainer.innerHTML = '<p style="color: red;">Erro ao carregar as postagens. Por favor, verifique o console para mais detalhes.</p>';
    }
}

// Carrega os posts quando a página for carregada
document.addEventListener('DOMContentLoaded', loadPosts);