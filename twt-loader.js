// twt-loader.js (CORRIGIDO E OTIMIZADO)

// Importa as funções necessárias do Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getFirestore, collection, query, orderBy, onSnapshot, doc, addDoc, updateDoc, increment, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// SUA CONFIGURAÇÃO DO FIREBASE
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

// Função para formatar a data
function formatTimestampMinimal(timestamp) {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

async function listenForPosts() {
    const tweetsContainer = document.getElementById('tweets-container');
    if (!tweetsContainer) return;

    const postsRef = collection(db, 'posts');
    const q = query(postsRef, orderBy('timestamp', 'desc'));

    onSnapshot(q, (querySnapshot) => {
        tweetsContainer.innerHTML = ''; // Limpa para redesenhar
        if (querySnapshot.empty) {
            tweetsContainer.innerHTML = '<li><p>Nenhum post encontrado.</p></li>';
            return;
        }

        querySnapshot.forEach(doc => {
            const post = doc.data();
            const postId = doc.id;
            const likeCount = post.likeCount || 0;
            const likedPosts = JSON.parse(localStorage.getItem('likedPosts')) || [];
            const isLiked = likedPosts.includes(postId);

            const postElement = document.createElement('li');
            postElement.dataset.postId = postId;

            postElement.innerHTML = `
                <img src="https://pbs.twimg.com/profile_images/1853559456900042752/PFV06W_5_400x400.jpg" alt="Avatar">
                <div class="info">
                    <strong>min* <span>@minkurosu • ${formatTimestampMinimal(post.timestamp)}</span></strong>
                    <p>${(post.content || '').replace(/\n/g, '<br>')}</p>
                    ${post.imageUrl ? `<img src="${post.imageUrl}" alt="img" style="max-width: 100%; border-radius: 15px; margin-top: 10px;">` : ''}
                    <div class="post-actions">
                        <div class="action-button reply-button">
                            <span>reply</span>
                        </div>
                        <div class="action-button like-button ${isLiked ? 'liked' : ''}" data-type="post">
                             <svg viewBox="0 0 24 24"><path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z"></path></svg>
                            <span class="like-count">${likeCount}</span>
                        </div>
                    </div>
                    <form class="reply-form">
                        <input type="text" name="authorName" placeholder="user" required maxlength="49">
                        <textarea name="content" placeholder="write your reply" required maxlength="999"></textarea>
                        <button type="submit">send</button>
                    </form>
                    <div class="replies-section"></div>
                </div>`;
            
            tweetsContainer.appendChild(postElement);
            listenForReplies(postId);
        });
    }, (error) => {
        console.error("Erro ao carregar posts: ", error);
        tweetsContainer.innerHTML = '<li><p>Ocorreu um erro ao carregar os posts.</p></li>';
    });
}

// Função para carregar respostas em tempo real
function listenForReplies(postId) {
    const postElement = document.querySelector(`li[data-post-id="${postId}"]`);
    if (!postElement) return;

    const repliesContainer = postElement.querySelector('.replies-section');
    const repliesRef = collection(db, 'posts', postId, 'replies');
    const q = query(repliesRef, orderBy('timestamp', 'asc'));

    onSnapshot(q, (querySnapshot) => {
        repliesContainer.innerHTML = '';
        if (querySnapshot.empty) {
            repliesContainer.style.display = 'none';
            return;
        }
        
        repliesContainer.style.display = 'block';

        querySnapshot.forEach(doc => {
            const reply = doc.data();
            const replyId = doc.id;
            const likeCount = reply.likeCount || 0;
            const likedReplies = JSON.parse(localStorage.getItem('likedReplies')) || [];
            const isLiked = likedReplies.includes(replyId);

            const replyElement = document.createElement('div');
            replyElement.className = 'reply';
            replyElement.dataset.replyId = replyId;
            
            replyElement.innerHTML = `
                <div class="info">
                    <strong class="author-name">${reply.authorName} <span>• ${formatTimestampMinimal(reply.timestamp)}</span></strong>
                    <p class="content">${reply.content.replace(/\n/g, '<br>')}</p>
                    <div class="actions">
                        <div class="action-button like-button ${isLiked ? 'liked' : ''}" data-type="reply">
                            <svg viewBox="0 0 24 24"><path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z"></path></svg>
                            <span class="like-count">${likeCount}</span>
                        </div>
                    </div>
                </div>`;
            repliesContainer.appendChild(replyElement);
        });
    });
}

// --- GERENCIADORES DE EVENTOS ---

// Função para lidar com cliques nos botões
async function handleActionClick(e) {
    // Lógica para o botão de 'reply'
    const replyButton = e.target.closest('.reply-button');
    if (replyButton) {
        const postElement = replyButton.closest('li[data-post-id]');
        const form = postElement.querySelector('.reply-form');
        form.classList.toggle('active');
        return; // Encerra a função aqui
    }

    // Lógica para o botão de 'like'
    const likeButton = e.target.closest('.like-button');
    if (likeButton) {
        const postElement = likeButton.closest('li[data-post-id]');
        if (!postElement) return;
        
        const postId = postElement.dataset.postId;
        const type = likeButton.dataset.type;
        
        let docRef, storageKey, itemId;

        if (type === 'post') {
            docRef = doc(db, 'posts', postId);
            storageKey = 'likedPosts';
            itemId = postId;
        } else if (type === 'reply') {
            const replyElement = likeButton.closest('.reply[data-reply-id]');
            if (!replyElement) return;
            const replyId = replyElement.dataset.replyId;
            docRef = doc(db, 'posts', postId, 'replies', replyId);
            storageKey = 'likedReplies';
            itemId = replyId;
        } else {
            return; // Tipo de botão desconhecido
        }

        const likedItems = JSON.parse(localStorage.getItem(storageKey)) || [];
        if (likedItems.includes(itemId)) {
            console.log("Item já curtido:", itemId);
            return;
        }

        try {
            await updateDoc(docRef, { likeCount: increment(1) });
            likedItems.push(itemId);
            localStorage.setItem(storageKey, JSON.stringify(likedItems));
            likeButton.classList.add('liked');
        } catch (error) {
            console.error("Falha ao curtir:", { type, itemId, error });
            alert("Não foi possível registrar a curtida. Tente novamente.");
        }
    }
}

// Função para lidar com o envio do formulário de resposta
async function handleReplySubmit(e) {
    if (!e.target.classList.contains('reply-form')) return;
    
    e.preventDefault();
    const form = e.target;
    const postElement = form.closest('li[data-post-id]');
    const postId = postElement.dataset.postId;

    const authorName = form.querySelector('input[name="authorName"]').value.trim();
    const content = form.querySelector('textarea[name="content"]').value.trim();

    if (!authorName || !content) {
        alert("Por favor, preencha seu nome e a resposta.");
        return;
    }

    try {
        const repliesRef = collection(db, 'posts', postId, 'replies');
        await addDoc(repliesRef, {
            authorName,
            content,
            likeCount: 0,
            timestamp: serverTimestamp()
        });
        form.reset();
        form.classList.remove('active');
    } catch (error) {
        console.error("Erro ao adicionar resposta:", error);
        alert("Não foi possível enviar sua resposta. Tente novamente.");
    }
}


// Adiciona os 'ouvintes' de eventos quando o DOM está pronto
document.addEventListener('DOMContentLoaded', () => {
    const tweetsContainer = document.getElementById('tweets-container');
    if (tweetsContainer) {
        tweetsContainer.addEventListener('click', handleActionClick);
        tweetsContainer.addEventListener('submit', handleReplySubmit);
    }
    listenForPosts();
});