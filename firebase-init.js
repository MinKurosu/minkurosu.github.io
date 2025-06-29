

// firebase-init.js

// 1. Importar os módulos do Firebase usando seus URLs CDN.
//    Estou usando a versão 10.12.2, que é estável.
//    Importe SOMENTE os serviços que você vai usar para otimização.
//    Para o seu blog, vamos precisar de 'app', 'auth', 'firestore' e 'storage'.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// 2. SUA CONFIGURAÇÃO DO PROJETO MINKUROSU AQUI.
//    Copie e cole a partir do Firebase Console (Configurações do Projeto -> Seus aplicativos -> Web).
//    SUBSTITUA os placeholders 'SEU_VALOR_AQUI' pelos dados do seu projeto!
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
//    E exportá-las para que possam ser usadas em outros arquivos JavaScript do seu projeto.
export const auth = getAuth(app); // Instância do serviço de Autenticação
export const db = getFirestore(app); // Instância do serviço Cloud Firestore (seu banco de dados)
export const storage = getStorage(app); // Instância do serviço Cloud Storage (para mídias)

console.log("🔥 Firebase inicializado com sucesso para o projeto minkurosu!");
