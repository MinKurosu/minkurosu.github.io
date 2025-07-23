// twt-loader.js
// Importa as funções necessárias do Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getFirestore, collection, getDocs, query, orderBy } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// SUA CONFIGURAÇÃO DO FIREBASE (a mesma do seu admin.js)
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

// Função para formatar a data e hora (já estava no seu código)
function formatTimestamp(timestamp) {
    if (!timestamp) return 'Data Indisponível';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('pt-BR', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
}

// Nova função para formatar a data no formato DD/MM/YY HH:MM (já estava no seu código)
function formatTimestampMinimal(timestamp) {
    if (!timestamp) return 'Data Indisponível';
    const date = timestamp.toDate();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

// Função assíncrona para carregar os posts do Firestore
async function loadPosts() {
    const tweetsContainer = document.getElementById('tweets-container');
    if (!tweetsContainer) {
        console.error("Elemento 'tweets-container' não encontrado!");
        return;
    }

    try {
        const postsRef = collection(db, 'posts');
        const q = query(postsRef, orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            tweetsContainer.innerHTML = '<p>Nenhum post encontrado. Seja o primeiro a postar algo pelo painel de admin!</p>';
            return;
        }

        tweetsContainer.innerHTML = '';

        querySnapshot.forEach(doc => {
            const post = doc.data();
            const postContent = post.content || '';
            const postImageUrl = post.imageUrl || '';
            const postTimestamp = post.timestamp; // Get the timestamp from the post data

            const tweetElement = document.createElement('li');
            
            // Format the timestamp using your desired function
            const formattedTimestamp = formatTimestampMinimal(postTimestamp); // Using formatTimestampMinimal

            let innerHTML = `
                <img src="https://pbs.twimg.com/profile_images/1853559456900042752/PFV06W_5_400x400.jpg" alt="Avatar">
                <div class="info">
                    <strong>min* <span>@minkurosu • ${formattedTimestamp}</span></strong>
                    <p>${postContent.replace(/\n/g, '<br>')}</p>
            `;

            if (postImageUrl) {
                innerHTML += `<img src="${postImageUrl}" alt="Imagem do post" style="max-width: 100%; border-radius: 15px; margin-top: 10px;">`;
            }

            innerHTML += `
                </div>
            `;
            
            tweetElement.innerHTML = innerHTML;
            tweetsContainer.appendChild(tweetElement);
        });

    } catch (error) {
        console.error("Erro ao carregar os posts: ", error);
        tweetsContainer.innerHTML = '<p>Ocorreu um erro ao carregar os posts. Tente novamente mais tarde.</p>';
    }
}

document.addEventListener('DOMContentLoaded', loadPosts);