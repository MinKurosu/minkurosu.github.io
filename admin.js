// admin.js

// Importações de Firebase usando a sintaxe modular
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js';

// ** SUA CONFIGURAÇÃO DO FIREBASE (A MESMA DO blog.js) **
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
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Declare as variáveis no escopo global, mas atribua-as dentro do DOMContentLoaded
let loginForm, loginEmailInput, loginPasswordInput, loginBtn, loginMessage;
let adminPanelSection, postTitleInput, postContentInput, postImageInput, publishPostBtn, postMessage, logoutBtn;

// Função para exibir mensagens de status
function showMessage(element, message, type) {
    if (element) {
        element.textContent = message;
        element.className = `message ${type}`; // Adiciona classes para estilização (e.g., 'error', 'success', 'info')
    } else {
        console.warn('Elemento de mensagem não encontrado:', message);
    }
}

// Garante que o DOM esteja completamente carregado antes de tentar acessar os elementos
document.addEventListener('DOMContentLoaded', () => {
    // Atribui os elementos do DOM aqui
    loginForm = document.getElementById('login-form');
    loginEmailInput = document.getElementById('login-email');
    loginPasswordInput = document.getElementById('login-password');
    loginBtn = document.getElementById('login-btn');
    loginMessage = document.getElementById('login-message');

    adminPanelSection = document.getElementById('admin-panel-section');
    postTitleInput = document.getElementById('post-title');
    postContentInput = document.getElementById('post-content');
    postImageInput = document.getElementById('post-image');
    publishPostBtn = document.getElementById('publish-post-btn');
    postMessage = document.getElementById('post-message');
    logoutBtn = document.getElementById('logout-btn');

    // Monitora o estado de autenticação do usuário
    onAuthStateChanged(auth, (user) => {
        if (adminPanelSection && loginForm) { // Verifica se os elementos existem antes de manipular
            if (user) {
                adminPanelSection.style.display = 'block';
                loginForm.style.display = 'none';
            } else {
                adminPanelSection.style.display = 'none';
                loginForm.style.display = 'block';
            }
        } else {
            console.warn("Elementos do painel de administração ou login não encontrados. Verifique admin.html.");
        }
    });

    // Evento de Login
    if (loginForm) { // Verifica se loginForm existe antes de adicionar o listener
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            // Verifica se os campos de input de login existem
            if (!loginEmailInput || !loginPasswordInput) {
                showMessage(loginMessage, 'Erro interno: Campos de login não encontrados.', 'error');
                console.error("Erro: Elementos de input de login não encontrados no DOM.");
                return;
            }
            const email = loginEmailInput.value;
            const password = loginPasswordInput.value;

            try {
                await signInWithEmailAndPassword(auth, email, password);
                showMessage(loginMessage, 'Login bem-sucedido!', 'success');
            } catch (error) {
                showMessage(loginMessage, `Erro de login: ${error.message}`, 'error');
                console.error("Erro de login:", error);
            }
        });
    } else {
        console.error("Elemento 'login-form' não encontrado no HTML. O listener de login não foi anexado.");
    }

    // Evento de Publicação de Post
    if (publishPostBtn) { // Verifica se o botão de publicação existe antes de adicionar o listener
        publishPostBtn.addEventListener('click', async () => {
            try {
                // Verifica se os campos de input do post existem
                if (!postTitleInput || !postContentInput) {
                    showMessage(postMessage, 'Erro interno: Campos de postagem (título ou conteúdo) não encontrados.', 'error');
                    console.error("Erro: Elementos de input do post (título ou conteúdo) não foram encontrados no DOM ao tentar publicar.");
                    return; // Impede a continuação da função
                }

                const title = postTitleInput.value;
                const content = postContentInput.value;
                const imageFile = postImageInput ? postImageInput.files[0] : null; // Verifica se postImageInput existe

                if (!title.trim() || !content.trim()) {
                    showMessage(postMessage, 'Por favor, preencha o título e o conteúdo do post.', 'error');
                    return;
                }

                let imageUrl = '';
                if (imageFile) {
                    showMessage(postMessage, 'Enviando imagem...', 'info');
                    const storageRef = ref(storage, `blog_images/${Date.now()}_${imageFile.name}`);
                    const uploadTask = uploadBytes(storageRef, imageFile);

                    await uploadTask; // Espera o upload terminar
                    imageUrl = await getDownloadURL(storageRef); // Pega a URL da imagem
                    showMessage(postMessage, 'Imagem enviada. Publicando post...', 'info');
                }

                // Salva os dados do post no Firestore
                await addDoc(collection(db, 'posts'), {
                    title: title,
                    content: content,
                    imageUrl: imageUrl,
                    timestamp: serverTimestamp() // Data e hora do servidor
                });

                showMessage(postMessage, 'Post publicado com sucesso!', 'success');
                // Limpa os campos após a publicação
                postTitleInput.value = '';
                postContentInput.value = '';
                if (postImageInput) postImageInput.value = ''; // Limpa o input de arquivo, se existir
            } catch (error) {
                showMessage(postMessage, `Erro ao publicar: ${error.message}`, 'error');
                console.error("Erro ao publicar post:", error);
            }
        });
    } else {
        console.error("Elemento 'publish-post-btn' não encontrado no HTML. O listener de publicação não foi anexado.");
    }

    // Evento de Logout
    if (logoutBtn) { // Verifica se o botão de logout existe antes de adicionar o listener
        logoutBtn.addEventListener('click', async () => {
            try {
                await signOut(auth);
                showMessage(loginMessage, 'Você saiu da sua conta.', 'info');
            } catch (error) {
                console.error("Erro ao fazer logout:", error);
                showMessage(loginMessage, `Erro ao sair: ${error.message}`, 'error');
            }
        });
    } else {
        console.error("Elemento 'logout-btn' não encontrado no HTML. O listener de logout não foi anexado.");
    }
});