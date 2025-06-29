// Importações de React e Firebase
import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js';

// ** SUA CONFIGURAÇÃO DO FIREBASE (FORNECIDA POR VOCÊ) **
// Certifique-se de que estes valores estão corretos do seu Console do Firebase.
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyA8-Ab2dE48sVOhmT-HfxIL5_rzDMRdcCc",
    authDomain: "minkurosu.firebaseapp.com",
    projectId: "minkurosu",
    storageBucket: "minkurosu.firebasestorage.app",
    messagingSenderId: "290821725607",
    appId: "1:290821725607:web:5e39e561da53ac7c8a2a82",
    measurementId: "G-M7PWC6DDRH" // measurementId é opcional para a funcionalidade do blog
};

// ** ATENÇÃO: PASSO CRÍTICO! PREENCHA COM O SEU PRÓPRIO USER ID (UID) DO FIREBASE (NO PASSO 6 ABAIXO) **
// Você encontrará este ID exibido na tela do seu blog após o primeiro deploy com FIREBASE_CONFIG.
const OWNER_USER_ID = "SEU_OWN_FIREBASE_USER_ID_AQUI"; // EX: "k4j2h1l3kj4h2l3kj4h2l3kj4h2l3kj4h2l3k"

// Componente principal da aplicação
const App = () => {
    // Estados para gerenciar a conexão com o Firebase, usuário, posts e visualização
    const [db, setDb] = useState(null); // Instância do Firestore
    const [auth, setAuth] = useState(null); // Instância de autenticação
    const [userId, setUserId] = useState(null); // ID do usuário atualmente logado
    const [blogPosts, setBlogPosts] = useState([]); // Array de posts do blog
    const [currentView, setCurrentView] = useState('list'); // Controla qual tela é exibida: 'list' (lista de posts) ou 'newPost' (formulário de novo post)
    const [message, setMessage] = useState(''); // Mensagens para o usuário (sucesso/erro)

    // Efeito para inicializar o Firebase e configurar a autenticação
    useEffect(() => {
        try {
            // Inicializa o Firebase App com sua configuração
            const app = initializeApp(FIREBASE_CONFIG);
            const firestore = getFirestore(app);
            const authentication = getAuth(app);

            // Armazena as instâncias no estado
            setDb(firestore);
            setAuth(authentication);

            // Listener para mudanças no estado de autenticação
            const unsubscribeAuth = onAuthStateChanged(authentication, async (user) => {
                if (user) {
                    // Se o usuário está logado, define o userId
                    setUserId(user.uid);
                    console.log('Usuário logado (do console.log de depuração):', user.uid); // Log para depuração no console
                } else {
                    // Tenta logar anonimamente se não houver usuário logado
                    try {
                        await signInAnonymously(authentication);
                        console.log('Logado anonimamente.');
                    } catch (error) {
                        console.error("Erro durante a autenticação:", error);
                        setMessage("Falha na autenticação. Por favor, tente novamente.");
                    }
                }
            });

            // Função de limpeza para o listener de autenticação
            return () => unsubscribeAuth();
        } catch (error) {
            console.error("Falha ao inicializar o Firebase:", error);
            setMessage("Falha ao inicializar o aplicativo. Verifique o console para detalhes.");
        }
    }, []); // Array de dependências vazio significa que este efeito roda apenas uma vez (na montagem)

    // Efeito para buscar posts do blog do Firestore
    useEffect(() => {
        // Só busca se o DB e o userId estiverem disponíveis
        if (db && userId) {
            // Define o caminho da coleção para dados públicos
            // Os posts são armazenados em um caminho público para que todos possam vê-los
            const blogPostsCollectionRef = collection(db, `artifacts/${FIREBASE_CONFIG.appId}/public/data/blogPosts`);
            // Cria uma query para ordenar os posts por data, do mais novo para o mais antigo
            const q = query(blogPostsCollectionRef, orderBy('timestamp', 'desc'));

            // Configura um listener em tempo real para os posts do blog
            const unsubscribe = onSnapshot(q, (snapshot) => {
                // Mapeia os documentos do snapshot para o formato de post
                const posts = snapshot.docs.map(