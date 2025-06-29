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
const auth = getAuth(app); // Instância de autenticação
const db = getFirestore(app); // Instância do Firestore
const storage = getStorage(app); // Instância do Storage

// Referências aos elementos HTML (Login)
// É CRUCIAL que esses IDs existam no seu HTML!
const loginSection = document.getElementById('admin-login-section');
const adminPanelSection = document.getElementById('admin-panel-section');
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('login-email');
const passwordInput = document.getElementById('login-password');
const loginBtn = document.getElementById('login-btn'); // Embora não usado diretamente no listener de 'submit' do form, é bom ter.
const loginMessage = document.getElementById('login-message'); // Para mensagens de login

// Referências aos elementos HTML (Postagem)
const postTitleInput = document.getElementById('post-title');
const postContentInput = document.getElementById('post-content');
const postImageInput = document.getElementById('post-image');
const publishPostBtn = document.getElementById('publish-post-btn');
const postMessage = document.getElementById('post-message'); // Para mensagens de postagem
const logoutBtn = document.getElementById('logout-btn');

// Função para exibir mensagens temporárias
function showMessage(element, msg, type = 'info') {
    if (!element) {
        console.warn(`Elemento para exibir mensagem não encontrado: ${msg}`);
        return;
    }
    element.textContent = msg;
    element.className = `message ${type}`; // Adiciona classes para estilização
    setTimeout(() => {
        if (element) { // Verifica novamente se o elemento ainda existe
            element.textContent = '';
            element.className = 'message';
        }
    }, 5000); // Mensagem desaparece após 5 segundos
}

// Lida com o estado de autenticação (quando o usuário loga/desloga)
onAuthStateChanged(auth, (user) => {
    console.log("DEBUG: onAuthStateChanged - Usuário atual:", user ? user.email : "Nenhum usuário logado"); // Linha adicionada
    if (user) {
        // Usuário logado
        if (loginSection) loginSection.style.display = 'none';
        if (adminPanelSection) adminPanelSection.style.display = 'block';
        showMessage(loginMessage, `Bem-vindo, ${user.email || 'Usuário Anônimo'}!`, 'success');
    } else {
        // Usuário deslogado
        if (loginSection) loginSection.style.display = 'block';
        if (adminPanelSection) adminPanelSection.style.display = 'none';
        // Limpa as mensagens quando desloga
        showMessage(loginMessage, '', 'info');
        showMessage(postMessage, '', 'info');
    }
});

// Lida com o estado de autenticação (quando o usuário loga/desloga)
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Usuário logado
        if (loginSection) loginSection.style.display = 'none';
        if (adminPanelSection) adminPanelSection.style.display = 'block';
        showMessage(loginMessage, `Bem-vindo, ${user.email || 'Usuário Anônimo'}!`, 'success');
    } else {
        // Usuário deslogado
        if (loginSection) loginSection.style.display = 'block';
        if (adminPanelSection) adminPanelSection.style.display = 'none';
        // Limpa as mensagens quando desloga
        showMessage(loginMessage, '', 'info');
        showMessage(postMessage, '', 'info');
    }
});

// Evento de Login
// Verifica se o formulário de login existe antes de adicionar o listener
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Impede o recarregamento da página

        // Verifica se os inputs existem antes de tentar acessar seus valores
        if (!emailInput || !passwordInput) {
            console.error("Erro: Elementos de email ou senha não encontrados no HTML.");
            showMessage(loginMessage, 'Erro interno: Campos de login não encontrados.', 'error');
            return;
        }

        const email = emailInput.value;
        const password = passwordInput.value;

        showMessage(loginMessage, 'Tentando fazer login...', 'info');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            // onAuthStateChanged vai lidar com a exibição do painel
            // showMessage(loginMessage, 'Login bem-sucedido!', 'success'); // Já tratado por onAuthStateChanged
        } catch (error) {
            console.error("Erro no login:", error); // Adicionando log de erro explícito
            let errorMessage = 'Erro desconhecido ao fazer login.';
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'Usuário não encontrado. Verifique o email.';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Senha incorreta.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Email inválido.';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Muitas tentativas de login. Tente novamente mais tarde.';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Falha na conexão de rede. Verifique sua internet.';
                    break;
                default:
                    errorMessage = `Erro no login: ${error.message}`;
            }
            showMessage(loginMessage, errorMessage, 'error');
        }
    });
} else {
    console.error("Elemento 'login-form' não encontrado no HTML. O listener de login não foi anexado.");
}


// Evento de Publicar Post
// Verifica se o botão de publicação existe antes de adicionar o listener
if (publishPostBtn) {
    publishPostBtn.addEventListener('click', async () => {
        if (!postTitleInput || !postContentInput || !postImageInput) {
            console.error("Erro: Elementos do formulário de postagem não encontrados no HTML.");
            showMessage(postMessage, 'Erro interno: Campos de postagem não encontrados.', 'error');
            return;
        }

        const title = postTitleInput.value;
        const content = postContentInput.value;
        const imageFile = postImageInput.files[0];

        if (!title || !content) {
            showMessage(postMessage, 'Título e conteúdo são obrigatórios.', 'error');
            return;
        }

        showMessage(postMessage, 'Publicando post...', 'info');

        try {
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
            postImageInput.value = ''; // Limpa o input de arquivo
        } catch (error) {
            showMessage(postMessage, `Erro ao publicar: ${error.message}`, 'error');
            console.error("Erro ao publicar post:", error);
        }
    });
} else {
    console.error("Elemento 'publish-post-btn' não encontrado no HTML. O listener de publicação não foi anexado.");
}


// Evento de Logout
// Verifica se o botão de logout existe antes de adicionar o listener
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await signOut(auth);
            // onAuthStateChanged vai lidar com a exibição do painel de login
            // showMessage(loginMessage, 'Você saiu da sua conta.', 'info'); // Já tratado por onAuthStateChanged
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
            showMessage(loginMessage, `Erro ao sair: ${error.message}`, 'error');
        }
    });
} else {
    console.error("Elemento 'logout-btn' não encontrado no HTML. O listener de logout não foi anexado.");
}