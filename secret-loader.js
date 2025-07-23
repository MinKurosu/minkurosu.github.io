// secret-loader.js

// Importa as funções necessárias do Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getFirestore, collection, getDocs, query, orderBy } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// SUA CONFIGURAÇÃO DO FIREBASE (a mesma do seu admin.js e twt-loader.js)
const firebaseConfig = {
    apiKey: "AIzaSyA8-Ab2dE48sVOhmT-HfxIL5_rzDMRdcCc",
    authDomain: "minkurosu.firebaseapp.com",
    projectId: "minkurosu",
    storageBucket: "minkurosu.firebasestorage.app",
    messagingSenderId: "290821725607",
    appId: "1:290821725607:web:5e39e561da53ac7c8a2a82",
    measurementId: "G-M7PWC6DDRH"
};

// Inicializa o Firebase (só precisamos do Firestore aqui)
const app = initializeApp(firebaseConfig, 'secret-app'); // Dê um nome único para evitar conflitos
const db = getFirestore(app);

// Função para formatar data e hora (similar ao twt-loader.js)
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

// Função para carregar os posts da coleção 'private_entries'
async function loadSecretPosts() {
    const secretPostsContainer = document.getElementById('secret-posts-container');
    if (!secretPostsContainer) {
        console.error("Elemento 'secret-posts-container' não encontrado!");
        return;
    }

    // Mostra uma mensagem de carregamento
    secretPostsContainer.innerHTML = '<li style="justify-content: center; padding: 20px; font-weight: bold; color: #667580;">loading secrets...</li>';

    try {
        const postsRef = collection(db, 'private_entries'); // <<--- Acessa a coleção correta!
        const q = query(postsRef, orderBy('timestamp', 'desc')); // Ordena do mais novo para o mais antigo
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            secretPostsContainer.innerHTML = '<li style="text-align: center; color: #B3B3B3; padding: 15px;">Nenhuma entrada secreta encontrada.</li>';
            return;
        }

        // Limpa a mensagem de carregamento
        secretPostsContainer.innerHTML = '';

        // Itera sobre os documentos e cria o HTML
        querySnapshot.forEach(doc => {
            const post = doc.data();
            const postContent = post.content || '';
            const postTimestamp = post.timestamp;
            const formattedTimestamp = formatTimestampMinimal(postTimestamp);

            const postElement = document.createElement('li');
            
            // HTML do post, com o mesmo estilo dos outros tweets
            postElement.innerHTML = `
                <img src="https://pbs.twimg.com/profile_images/1853559456900042752/PFV06W_5_400x400.jpg" alt="Avatar">
                <div class="info">
                    <strong>min* <span>@minkurosu • ${formattedTimestamp}</span></strong>
                    <p>${postContent.replace(/\n/g, '<br>')}</p>
                </div>
            `;
            
            secretPostsContainer.appendChild(postElement);
        });

    } catch (error) {
        console.error("Erro ao carregar os posts secretos: ", error);
        secretPostsContainer.innerHTML = '<li style="text-align: center; color: #dc3545; padding: 15px;">Ocorreu um erro ao carregar as entradas.</li>';
    }
}


// Lógica principal para o desbloqueio da seção
document.addEventListener('DOMContentLoaded', () => {
    const unlockButton = document.getElementById('unlock-button');
    const secretPasswordInput = document.getElementById('secret-password');
    const secretPostsContainer = document.getElementById('secret-posts-container');
    const passwordMessage = document.getElementById('password-message');
    
    // ATENÇÃO: A senha ainda está no código do cliente, o que não é seguro para produção.
    const CORRECT_PASSWORD = 'lili'; 

    if (unlockButton && secretPasswordInput && secretPostsContainer && passwordMessage) {
        unlockButton.addEventListener('click', () => {
            const enteredPassword = secretPasswordInput.value;

            if (enteredPassword === CORRECT_PASSWORD) {
                // Esconde o formulário de senha
                const formContainer = document.querySelector('#secret-section p, #secret-section input, #secret-section button');
                document.getElementById('secret-password').style.display = 'none';
                document.getElementById('unlock-button').style.display = 'none';
                document.querySelector('#secret-section p').style.display = 'none';
                passwordMessage.textContent = '';
                
                // Exibe o container e carrega os posts
                secretPostsContainer.style.display = 'block'; 
                loadSecretPosts(); // <<--- CHAMA A FUNÇÃO PARA CARREGAR OS DADOS DO FIREBASE

            } else {
                passwordMessage.textContent = 'Senha incorreta. Tente novamente.';
                secretPasswordInput.value = ''; 
            }
        });
    } else {
        console.error("Elementos da seção secreta não encontrados. Verifique os IDs no HTML.");
    }
});