// admin.js
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
let postContentInput, publishPostBtn, postMessage;
let postImageFile, postImageUrl; // ATUALIZADO: Variáveis para os dois campos de imagem

// NOVO: Elementos do formulário de Sonhos
let dreamContentInput, publishDreamBtn, dreamMessage;
// NOVO: Elementos do formulário de Entradas Privadas
let privateEntryContentInput, publishPrivateBtn, privateEntryMessage;


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



     // **NOVO: Elementos do formulário de Blog**
   
    const blogContentInput = document.getElementById('blog-content');
    const blogImageUrlInput = document.getElementById('blog-image-url');
    const publishBlogBtn = document.getElementById('publish-blog-btn');
    const blogMessage = document.getElementById('blog-message');




    // Atribuição de elementos do formulário de Blog
   
    postContentInput = document.getElementById('post-content');
    publishPostBtn = document.getElementById('publish-post-btn');
    postMessage = document.getElementById('post-message');
    // ATUALIZADO: Atribuição das novas variáveis de imagem
    postImageUrl = document.getElementById('post-image-url');
    postImageFile = document.getElementById('post-image-file');

    // NOVO: Atribuição de elementos do formulário de Sonhos
    dreamContentInput = document.getElementById('dream-content');
    publishDreamBtn = document.getElementById('publish-dream-btn');
    dreamMessage = document.getElementById('dream-message');
    
    // NOVO: Atribuição de elementos do formulário de Entrada Privada
    privateEntryContentInput = document.getElementById('private-entry-content');
    publishPrivateBtn = document.getElementById('publish-private-entry-btn');
    privateEntryMessage = document.getElementById('private-entry-message');


    // NOVO: Evento de Publicação de ENTRADA PRIVADA
    if (publishPrivateBtn) {
        publishPrivateBtn.addEventListener('click', async () => {
            const content = privateEntryContentInput.value;

            if (!content.trim()) {
                showMessage(privateEntryMessage, 'Por favor, preencha o conteúdo da entrada privada.', 'error');
                return;
            }

            try {
                showMessage(privateEntryMessage, 'Publicando entrada privada...', 'info');
                // Adiciona o documento na nova coleção 'private_entries'
                await addDoc(collection(db, 'private_entries'), {
                    content: content,
                    timestamp: serverTimestamp() // Usar serverTimestamp para garantir ordem cronológica
                });
                showMessage(privateEntryMessage, 'Entrada privada publicada com sucesso!', 'success');
                privateEntryContentInput.value = ''; // Limpa o campo após o envio
            } catch (error) {
                showMessage(privateEntryMessage, `Erro ao publicar entrada privada: ${error.message}`, 'error');
            }
        });
    }
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


     // **NOVO: Evento de Publicação de POST DE BLOG**
    if (publishBlogBtn) {
        publishBlogBtn.addEventListener('click', async () => {
          
            const content = blogContentInput.value;
            const imageUrl = blogImageUrlInput.value.trim();



            try {
                showMessage(blogMessage, 'Publicando post...', 'info');
                // Salva na nova coleção 'blog_posts'
                await addDoc(collection(db, 'blog_posts'), {
                   
                    content: content,
                    imageUrl: imageUrl, // Salva a URL da imagem (pode estar vazia)
                    timestamp: serverTimestamp()
                });

                showMessage(blogMessage, 'Post publicado com sucesso!', 'success');
               
                blogContentInput.value = '';
                blogImageUrlInput.value = '';
            } catch (error) {
                showMessage(blogMessage, `Erro ao publicar: ${error.message}`, 'error');
            }
        });
    }



    // Evento de Publicação de POST DE THOUGHTS (AGORA COM LÓGICA ATUALIZADA PARA URL/ARQUIVO)
    if (publishPostBtn) {
        publishPostBtn.addEventListener('click', async () => {
            const content = postContentInput.value;
            const selectedFile = postImageFile.files[0]; // Pega o arquivo selecionado, se houver
            const enteredUrl = postImageUrl.value.trim(); // Pega a URL digitada, se houver

          

            try {
                showMessage(postMessage, 'Publicando post...', 'info');
                let finalImageUrl = ''; // Variável para a URL final da imagem

                // Prioridade: 1. URL digitada, 2. Upload de arquivo (se o Firebase Storage funcionar)
                if (enteredUrl) {
                    finalImageUrl = enteredUrl; // Usa a URL digitada
                } else if (selectedFile) {
                    // Lógica para upload para Firebase Storage (AINDA DEPENDE DO CORS/FATURAMENTO)
                    showMessage(postMessage, 'Enviando imagem para o Storage (se o faturamento permitir)...', 'info');
                    const storageRef = ref(storage, `blog_images/${Date.now()}_${selectedFile.name}`);
                    await uploadBytes(storageRef, selectedFile);
                    finalImageUrl = await getDownloadURL(storageRef);
                    showMessage(postMessage, 'Imagem enviada com sucesso para o Storage!', 'success');
                }

                // Adiciona o post ao Firestore
                await addDoc(collection(db, 'posts'), {
                   
                    content: content,
                    imageUrl: finalImageUrl, // Salva a URL final (do upload ou digitada)
                    timestamp: serverTimestamp()
                });

                showMessage(postMessage, 'Post publicado com sucesso!', 'success');
            
                postContentInput.value = '';
                postImageFile.value = ''; // Limpa o campo de arquivo
                postImageUrl.value = '';  // Limpa o campo de URL
            } catch (error) {
                showMessage(postMessage, `Erro ao publicar post: ${error.message}`, 'error');
                console.error("Erro detalhado:", error);
                // Adicione uma mensagem mais clara se o erro for sobre o Firebase Storage
                if (error.code === 'storage/unauthorized' || error.message.includes('CORS policy') || error.message.includes('permission_denied')) {
                    showMessage(postMessage, 'Erro: Não foi possível fazer upload da imagem para o Firebase Storage. Isso geralmente indica problemas de CORS ou que o faturamento do Google Cloud não está ativo. Tente usar a opção "URL da Imagem" para imagens já hospedadas.', 'error');
                }
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