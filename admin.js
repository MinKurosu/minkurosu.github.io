
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js';


const firebaseConfig = {
    apiKey: "AIzaSyA8-Ab2dE48sVOhmT-HfxIL5_rzDMRdcCc",
    authDomain: "minkurosu.firebaseapp.com",
    projectId: "minkurosu",
    storageBucket: "minkurosu.firebasestorage.app",
    messagingSenderId: "290821725607",
    appId: "1:290821725607:web:5e39e561da53ac7c8a2a82",
    measurementId: "G-M7PWC6DDRH"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

//DOM
let loginForm, loginEmailInput, loginPasswordInput, loginBtn, loginMessage;
let adminPanelSection, logoutBtn;
//blog form
let postContentInput, publishPostBtn, postMessage;
let postImageFile, postImageUrl; //imgs

// dream form
let dreamContentInput, publishDreamBtn, dreamMessage;
// private form
let privateEntryContentInput, publishPrivateBtn, privateEntryMessage;


// show messages
function showMessage(element, message, type) {
    if (element) {
        element.textContent = message;
        element.className = `message ${type}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    //login
    loginForm = document.getElementById('login-form');
    loginEmailInput = document.getElementById('login-email');
    loginPasswordInput = document.getElementById('login-password');
    loginBtn = document.getElementById('login-btn');
    loginMessage = document.getElementById('login-message');
    adminPanelSection = document.getElementById('admin-panel-section');
    logoutBtn = document.getElementById('logout-btn');



     // blog form
   
    const blogContentInput = document.getElementById('blog-content');
    const blogImageUrlInput = document.getElementById('blog-image-url');
    const publishBlogBtn = document.getElementById('publish-blog-btn');
    const blogMessage = document.getElementById('blog-message');




    // blog form
   
    postContentInput = document.getElementById('post-content');
    publishPostBtn = document.getElementById('publish-post-btn');
    postMessage = document.getElementById('post-message');
    // imgs
    postImageUrl = document.getElementById('post-image-url');
    postImageFile = document.getElementById('post-image-file');

    // dreams form
    dreamContentInput = document.getElementById('dream-content');
    publishDreamBtn = document.getElementById('publish-dream-btn');
    dreamMessage = document.getElementById('dream-message');
    
    // private forms
    privateEntryContentInput = document.getElementById('private-entry-content');
    publishPrivateBtn = document.getElementById('publish-private-entry-btn');
    privateEntryMessage = document.getElementById('private-entry-message');


    // publish private
    if (publishPrivateBtn) {
        publishPrivateBtn.addEventListener('click', async () => {
            const content = privateEntryContentInput.value;

            if (!content.trim()) {
                showMessage(privateEntryMessage, 'Por favor, preencha o conteúdo da entrada privada.', 'error');
                return;
            }

            try {
                showMessage(privateEntryMessage, 'Publicando entrada privada...', 'info');
                // 'private_entries'
                await addDoc(collection(db, 'private_entries'), {
                    content: content,
                    timestamp: serverTimestamp() // cronologic
                });
                showMessage(privateEntryMessage, 'Entrada privada publicada com sucesso!', 'success');
                privateEntryContentInput.value = '';
            } catch (error) {
                showMessage(privateEntryMessage, `Erro ao publicar entrada privada: ${error.message}`, 'error');
            }
        });
    }
   
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

    // login event
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


     // blog post
    if (publishBlogBtn) {
        publishBlogBtn.addEventListener('click', async () => {
          
            const content = blogContentInput.value;
            const imageUrl = blogImageUrlInput.value.trim();



            try {
                showMessage(blogMessage, 'Publicando post...', 'info');
                //'blog_posts'
                await addDoc(collection(db, 'blog_posts'), {
                   
                    content: content,
                    imageUrl: imageUrl, 
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



    // thoughts
    if (publishPostBtn) {
        publishPostBtn.addEventListener('click', async () => {
            const content = postContentInput.value;
            const selectedFile = postImageFile.files[0];
            const enteredUrl = postImageUrl.value.trim(); 

          

            try {
                showMessage(postMessage, 'Publicando post...', 'info');
                let finalImageUrl = ''; 

               
                if (enteredUrl) {
                    finalImageUrl = enteredUrl; 
                } else if (selectedFile) {
                    
                    showMessage(postMessage, 'Enviando imagem para o Storage (se o faturamento permitir)...', 'info');
                    const storageRef = ref(storage, `blog_images/${Date.now()}_${selectedFile.name}`);
                    await uploadBytes(storageRef, selectedFile);
                    finalImageUrl = await getDownloadURL(storageRef);
                    showMessage(postMessage, 'Imagem enviada com sucesso para o Storage!', 'success');
                }

               
                await addDoc(collection(db, 'posts'), {
                   
                    content: content,
                    imageUrl: finalImageUrl, 
                    timestamp: serverTimestamp()
                });

                showMessage(postMessage, 'Post publicado com sucesso!', 'success');
            
                postContentInput.value = '';
                postImageFile.value = ''; 
                postImageUrl.value = '';  
            } catch (error) {
                showMessage(postMessage, `Erro ao publicar post: ${error.message}`, 'error');
                console.error("Erro detalhado:", error);
             
                if (error.code === 'storage/unauthorized' || error.message.includes('CORS policy') || error.message.includes('permission_denied')) {
                    showMessage(postMessage, 'Erro: Não foi possível fazer upload da imagem para o Firebase Storage. Isso geralmente indica problemas de CORS ou que o faturamento do Google Cloud não está ativo. Tente usar a opção "URL da Imagem" para imagens já hospedadas.', 'error');
                }
            }
        });
    }

    // dream register
    if (publishDreamBtn) {
        publishDreamBtn.addEventListener('click', async () => {
            const content = dreamContentInput.value;

            
            if (!content.trim()) {
                showMessage(dreamMessage, 'Por favor, preencha o conteúdo do sonho.', 'error');
                return;
            }

            try {
                showMessage(dreamMessage, 'Registrando sonho...', 'info');
                //'dreams'
                await addDoc(collection(db, 'dreams'), {
                    content: content,
                    timestamp: serverTimestamp()
                });
                showMessage(dreamMessage, 'Sonho registrado com sucesso!', 'success');
                dreamContentInput.value = '';
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