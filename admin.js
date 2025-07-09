// admin.js (MODIFICADO)

// Importações de Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js';

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
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Variáveis globais para elementos do DOM
let loginForm, loginEmailInput, loginPasswordInput, loginBtn, loginMessage;
let adminPanelSection, logoutBtn;
// Elementos do formulário de Blog
let postTitleInput, postContentInput, postImageInput, publishPostBtn, postMessage;
// NOVO: Elementos do formulário de Sonhos
let dreamContentInput, publishDreamBtn, dreamMessage;

// Função para exibir mensagens
function showMessage(element, message, type) {
    if (element) {
        element.textContent = message;
        element.className = `message ${type}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Atribuição de elementos de Login e Painel
    loginForm = document.getElementById('login-form');
    loginEmailInput = document.getElementById('login-email');
    loginPasswordInput = document.getElementById('login-password');
    loginBtn = document.getElementById('login-btn');
    loginMessage = document.getElementById('login-message');
    adminPanelSection = document.getElementById('admin-panel-section');
    logoutBtn = document.getElementById('logout-btn');

    // Atribuição de elementos do formulário de Blog
    postTitleInput = document.getElementById('post-title');
    postContentInput = document.getElementById('post-content');
    postImageInput = document.getElementById('post-image');
    publishPostBtn = document.getElementById('publish-post-btn');
    postMessage = document.getElementById('post-message');

    // NOVO: Atribuição de elementos do formulário de Sonhos
    dreamContentInput = document.getElementById('dream-content');
    publishDreamBtn = document.getElementById('publish-dream-btn');
    dreamMessage = document.getElementById('dream-message');

    // Monitora o estado de autenticação para mostrar/esconder painéis
    onAuthStateChanged(auth, (user) => {
        if (adminPanelSection && loginForm) {
            if (user) {
                adminPanelSection.style.display = 'block';
                loginForm.style.display = 'none';
            } else {
                adminPanelSection.style.display = 'none';
                loginForm.style.display = 'block';
            }
        }
    });

    // Evento de Login (sem alterações)
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                await signInWithEmailAndPassword(auth, loginEmailInput.value, loginPasswordInput.value);
                showMessage(loginMessage, 'Login bem-sucedido!', 'success');
            } catch (error) {
                showMessage(loginMessage, `Erro de login: ${error.message}`, 'error');
            }
        });
    }

    // Evento de Publicação de POST DE BLOG (sem alterações na lógica)
    if (publishPostBtn) {
        publishPostBtn.addEventListener('click', async () => {
            const title = postTitleInput.value;
            const content = postContentInput.value;
            const imageFile = postImageInput ? postImageInput.files[0] : null;

            if (!title.trim() || !content.trim()) {
                showMessage(postMessage, 'Por favor, preencha o título e o conteúdo do post.', 'error');
                return;
            }

            try {
                let imageUrl = '';
                if (imageFile) {
                    showMessage(postMessage, 'Enviando imagem...', 'info');
                    const storageRef = ref(storage, `blog_images/${Date.now()}_${imageFile.name}`);
                    await uploadBytes(storageRef, imageFile);
                    imageUrl = await getDownloadURL(storageRef);
                }
                await addDoc(collection(db, 'posts'), {
                    title: title, content: content, imageUrl: imageUrl, timestamp: serverTimestamp()
                });
                showMessage(postMessage, 'Post publicado com sucesso!', 'success');
                postTitleInput.value = '';
                postContentInput.value = '';
                if (postImageInput) postImageInput.value = '';
            } catch (error) {
                showMessage(postMessage, `Erro ao publicar post: ${error.message}`, 'error');
            }
        });
    }

    // NOVO: Evento de Registro de SONHO
    if (publishDreamBtn) {
        publishDreamBtn.addEventListener('click', async () => {
            const content = dreamContentInput.value;

            // Validação independente, apenas para o campo de sonho
            if (!content.trim()) {
                showMessage(dreamMessage, 'Por favor, preencha o conteúdo do sonho.', 'error');
                return;
            }

            try {
                showMessage(dreamMessage, 'Registrando sonho...', 'info');
                // Adiciona o documento na nova coleção 'dreams'
                await addDoc(collection(db, 'dreams'), {
                    content: content,
                    timestamp: serverTimestamp()
                });
                showMessage(dreamMessage, 'Sonho registrado com sucesso!', 'success');
                dreamContentInput.value = ''; // Limpa o campo após o envio
            } catch (error) {
                showMessage(dreamMessage, `Erro ao registrar sonho: ${error.message}`, 'error');
            }
        });
    }

    // Evento de Logout (sem alterações)
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await signOut(auth);
                showMessage(loginMessage, 'Você saiu da sua conta.', 'info');
            } catch (error) {
                showMessage(loginMessage, `Erro ao sair: ${error.message}`, 'error');
            }
        });
    }
});