// firebase-init.js

// 1. Importar os módulos do Firebase usando seus URLs CDN
// Usaremos a versão 10.12.2, que é uma versão estável recente.
// Importe SOMENTE os serviços que você realmente vai usar.
// Para seu blog, precisaremos de 'app', 'auth', 'firestore' e 'storage'.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// 2. Sua Configuração do Projeto Firebase (substitua pelos seus VALORES REAIS do console!)
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyA8-Ab2dE48sVOhmT-HfxIL5_rzDMRdcCc",
    authDomain: "minkurosu.firebaseapp.com",
    projectId: "minkurosu",
    storageBucket: "minkurosu.firebasestorage.app",
    messagingSenderId: "290821725607",
    appId: "1:290821725607:web:5e39e561da53ac7c8a2a82",
    measurementId: "G-M7PWC6DDRH"
};

// 3. Inicializar o Firebase com sua configuração
const app = initializeApp(firebaseConfig);

// 4. Obter as instâncias dos serviços do Firebase que você vai usar
// E exportá-las para que possam ser usadas em outros arquivos JavaScript
export const auth = getAuth(app); // Para autenticação (login de admin)
export const db = getFirestore(app); // Para seu banco de dados de posts (Cloud Firestore)
export const storage = getStorage(app); // Para upload de imagens (Cloud Storage)

console.log("Firebase inicializado com sucesso para o projeto minkurosu!");
