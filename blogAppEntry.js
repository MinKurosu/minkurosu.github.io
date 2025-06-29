// ... (outras importações e a constante FIREBASE_CONFIG)

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
const OWNER_USER_ID = "SKRZj0yyBuZfmQKwlWYKup0K93q2"; // EX: "k4j2h1l3kj4h2l3kj4h2l3kj4h2l3kj4h2l3k"

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
            // AQUI É A LINHA QUE ESTAVA COMENTADA NA SUA IMAGEM, E É ONDE O ERRO ESTAVA.
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
                const posts = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setBlogPosts(posts); // Atualiza o estado com os posts
            }, (error) => {
                console.error("Erro ao buscar posts:", error);
                setMessage("Erro ao carregar posts. Por favor, tente novamente.");
            });

            // Função de limpeza para o listener de snapshot
            return () => unsubscribe();
        }
    }, [db, userId]); // Este efeito roda quando db ou userId mudam

    // Seu restante do código para renderizar a UI irá aqui,
    // incluindo a lógica para adicionar novos posts, etc.
    // Por exemplo, você teria um retorno (return) de JSX aqui.

    return (
        <div>
            <h1>Meu Blog Simples</h1>
            {message && <p style={{ color: 'red' }}>{message}</p>}
            {/* Aqui você renderizaria a lista de posts ou o formulário de novo post */}
            {currentView === 'list' && (
                <div>
                    <h2>Lista de Posts</h2>
                    {blogPosts.length > 0 ? (
                        <ul>
                            {blogPosts.map(post => (
                                <li key={post.id}>
                                    <h3>{post.title}</h3>
                                    <p>{post.content}</p>
                                    <small>{new Date(post.timestamp?.toDate()).toLocaleString()}</small>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Nenhum post encontrado.</p>
                    )}
                    <button onClick={() => setCurrentView('newPost')}>Criar Novo Post</button>
                </div>
            )}

            {currentView === 'newPost' && (
                <NewPostForm
                    db={db}
                    userId={userId}
                    ownerUserId={OWNER_USER_ID}
                    appId={FIREBASE_CONFIG.appId}
                    onPostAdded={() => {
                        setMessage("Post adicionado com sucesso!");
                        setCurrentView('list');
                    }}
                    onCancel={() => setCurrentView('list')}
                    onError={(msg) => setMessage(msg)}
                />
            )}
        </div>
    );
};

// Exemplo de um componente NewPostForm (você precisaria criá-lo)
const NewPostForm = ({ db, userId, ownerUserId, appId, onPostAdded, onCancel, onError }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!db || !userId) {
            onError("Banco de dados ou ID de usuário não disponíveis.");
            return;
        }

        // Apenas o OWNER_USER_ID pode adicionar posts
        if (userId !== ownerUserId) {
            onError("Você não tem permissão para adicionar posts.");
            return;
        }

        try {
            await addDoc(collection(db, `artifacts/${appId}/public/data/blogPosts`), {
                title,
                content,
                timestamp: new Date(),
                authorId: userId // Opcional: para identificar quem criou o post
            });
            onPostAdded();
            setTitle('');
            setContent('');
        } catch (error) {
            console.error("Erro ao adicionar post:", error);
            onError("Erro ao adicionar post. Por favor, tente novamente.");
        }
    };

    return (
        <div>
            <h2>Novo Post</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Título:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Conteúdo:</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    ></textarea>
                </div>
                <button type="submit">Adicionar Post</button>
                <button type="button" onClick={onCancel}>Cancelar</button>
            </form>
        </div>
    );
};

export default App;