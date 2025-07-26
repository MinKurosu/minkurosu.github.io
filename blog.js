// blog.js

// Importações de Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getFirestore, collection, query, orderBy, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// SUA CONFIGURAÇÃO DO FIREBASE (sem alterações)
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
const db = getFirestore(app);

// Get the container where blog posts will be displayed
const blogPostsContainer = document.getElementById('posts-container'); // Make sure this ID matches your HTML

// Função para formatar a data
function formatTimestamp(timestamp) {
    if (!timestamp || !timestamp.toDate) return 'Data Indisponível'; // Add check for .toDate()
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'long',
        timeStyle: 'short',
    }).format(date);
}

async function loadBlogPosts() {
    if (!blogPostsContainer) {
        console.error("Elemento 'posts-container' não encontrado no HTML.");
        return;
    }
    blogPostsContainer.innerHTML = '<h2>Carregando posts...</h2>'; // Mensagem de carregamento

    try {
        // *** MUDANÇA AQUI: Altere a coleção de "blogPosts" para "blog_posts" ***
       const q = query(collection(db, "blog_posts"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            blogPostsContainer.innerHTML = '<p>Nenhum post de blog encontrado ainda.</p>';
            return;
        }

        blogPostsContainer.innerHTML = ''; // Clear loading message

        querySnapshot.forEach((doc) => {
            const post = doc.data();
            const postElement = document.createElement('article');
            postElement.classList.add('blog-post'); // Adicione uma classe para estilização

            // Formata a data usando a função formatTimestamp
            const formattedDate = formatTimestamp(post.timestamp); // Use the timestamp from Firestore

            postElement.innerHTML = `
                <h2>${post.title}</h2>
                <p class="post-meta">Publicado em ${formattedDate}</p>
                ${post.imageUrl ? `<img src="${post.imageUrl}" alt="${post.title}">` : ''}
                <div class="post-content">${post.content}</div>
                <hr class="post-divider">
            `;
            blogPostsContainer.appendChild(postElement);
        });
    } catch (e) {
        console.error("Erro ao carregar posts do blog: ", e);
        blogPostsContainer.innerHTML = '<p>Erro ao carregar os posts do blog.</p>';
    }
}

// Chama a função para carregar os posts quando a página é carregada
document.addEventListener('DOMContentLoaded', loadBlogPosts);