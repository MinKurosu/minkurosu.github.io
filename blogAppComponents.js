// Importações de React e Firebase (para serem usadas no componente App)
import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js';

// ** ATENÇÃO: PASSO CRÍTICO! PREENCHA COM A SUA CONFIGURAÇÃO DO FIREBASE **
// 1. Vá para o Console do Firebase: https://console.firebase.google.com/
// 2. Selecione seu Projeto > Configurações do Projeto (ícone de engrenagem)
// 3. Na seção "Seus aplicativos", clique no ícone </> (Adicionar aplicativo web) e siga os passos.
// 4. Copie o objeto 'firebaseConfig' que será exibido e cole-o abaixo.
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyA8-Ab2dE48sVOhmT-HfxIL5_rzDMRdcCc",
    authDomain: "minkurosu.firebaseapp.com",
    projectId: "minkurosu",
    storageBucket: "minkurosu.firebasestorage.app",
    messagingSenderId: "290821725607",
    appId: "1:290821725607:web:5e39e561da53ac7c8a2a82",
    measurementId: "G-M7PWC6DDRH"
};


// ** ATENÇÃO: PASSO CRÍTICO! PREENCHA COM O SEU PRÓPRIO USER ID (UID) DO FIREBASE **
// 1. Publique seu site no GitHub Pages com o FIREBASE_CONFIG preenchido (mesmo que OWNER_USER_ID esteja vazio por enquanto).
// 2. Abra seu site no navegador.
// 3. Abra o Console do Desenvolvedor (F12 ou Ctrl+Shift+I).
// 4. No console, procure pela mensagem "Usuário logado: [SEU_UID_AQUI]".
// 5. Copie esse ID e cole-o abaixo. Ele será um ID aleatório gerado pelo Firebase para seu login anônimo.
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
                    console.log('Usuário logado:', user.uid);
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
                setBlogPosts(posts); // Atualiza o estado dos posts
            }, (error) => {
                console.error("Erro ao buscar posts do blog:", error);
                setMessage("Falha ao carregar os posts do blog. Por favor, tente novamente.");
            });

            // Função de limpeza para o listener do snapshot
            return () => unsubscribe();
        }
    }, [db, userId]); // Re-executa quando db ou userId mudam

    // Componente para exibir a lista de posts do blog
    const BlogList = () => {
        return (
            <div className="p-4 sm:p-6 md:p-8 flex flex-col items-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-inter rounded-lg shadow-lg">
                <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-center">Meus Posts do Blog</h1>
                {/* Exibe mensagens para o usuário (sucesso/erro) */}
                {message && (
                    <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-md relative mb-4 w-full max-w-2xl" role="alert">
                        <span className="block sm:inline">{message}</span>
                        {/* Botão para fechar a mensagem */}
                        <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={() => setMessage('')}>
                            <svg className="fill-current h-6 w-6 text-blue-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Fechar</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.103l-2.651 3.746a1.2 1.2 0 1 1-1.697-1.697l3.746-2.651-3.746-2.651a1.2 1.2 0 0 1 1.697-1.697L10 8.897l2.651-3.746a1.2 1.2 0 0 1 1.697 1.697L11.103 10l3.746 2.651a1.2 1.2 0 0 1 0 1.698z"/></svg>
                        </span>
                    </div>
                )}

                {/* Exibe o ID do usuário atual para contexto (útil para saber quem é o "proprietário") */}
                {userId && (
                    <div className="bg-gray-200 dark:bg-gray-800 p-3 rounded-md shadow-md mb-6 w-full max-w-2xl text-center text-sm">
                        Seu ID de Usuário: <span className="font-mono text-blue-600 dark:text-blue-400 break-all">{userId}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 w-full max-w-2xl">
                    {blogPosts.length === 0 ? (
                        // Mensagem se não houver posts
                        <p className="text-center text-lg text-gray-600 dark:text-gray-400">Nenhum post no blog ainda. Comece criando um!</p>
                    ) : (
                        // Mapeia e exibe cada post
                        blogPosts.map(post => (
                            <div key={post.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                                <h2 className="text-2xl font-semibold mb-2 text-blue-700 dark:text-blue-400">{post.title}</h2>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 whitespace-pre-wrap">{post.content}</p>
                                <div className="text-sm text-gray-500 dark:text-gray-400 flex justify-between items-center">
                                    <span>Por {post.author || 'Anônimo'}</span>
                                    <span>{new Date(post.timestamp?.toDate()).toLocaleString()}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    };

    // Componente para criar um novo post
    const NewPost = ({ userId, db, setMessage, setCurrentView }) => {
        const [title, setTitle] = useState(''); // Estado para o título do post
        const [content, setContent] = useState(''); // Estado para o conteúdo do post
        const [submitting, setSubmitting] = useState(false); // Estado para indicar se o formulário está sendo enviado

        // Função para lidar com o envio do formulário
        const handleSubmit = async (e) => {
            e.preventDefault(); // Previne o comportamento padrão de recarregar a página
            if (!db || !userId) {
                setMessage("Banco de dados não pronto. Por favor, aguarde um momento e tente novamente.");
                return;
            }
            if (!title.trim() || !content.trim()) {
                setMessage("Por favor, preencha o título e o conteúdo.");
                return;
            }

            // Lógica de restrição: só permite enviar se o usuário atual for o proprietário
            // Esta verificação é no lado do cliente, mas a segurança real está nas Regras do Firestore
            if (userId !== OWNER_USER_ID) {
                setMessage("Você não tem permissão para adicionar posts. Apenas o proprietário do blog pode postar.");
                return;
            }

            setSubmitting(true); // Ativa o estado de envio
            setMessage(''); // Limpa mensagens anteriores

            try {
                // Adiciona o documento à coleção 'blogPosts' no Firestore
                const blogPostsCollectionRef = collection(db, `artifacts/${FIREBASE_CONFIG.appId}/public/data/blogPosts`);
                await addDoc(blogPostsCollectionRef, {
                    title: title.trim(),
                    content: content.trim(),
                    author: userId, // O autor é o ID do usuário atual
                    timestamp: new Date(), // Timestamp da criação
                });
                setMessage("Post do blog adicionado com sucesso!");
                setTitle(''); // Limpa o título
                setContent(''); // Limpa o conteúdo
                setCurrentView('list'); // Volta para a lista de posts após o envio
            } catch (error) {
                console.error("Erro ao adicionar documento: ", error);
                setMessage("Falha ao adicionar post do blog: " + error.message);
            } finally {
                setSubmitting(false); // Desativa o estado de envio
            }
        };

        return (
            <div className="p-4 sm:p-6 md:p-8 flex flex-col items-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-inter rounded-lg shadow-lg">
                <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-center">Escrever Novo Post do Blog</h1>
                {message && (
                    <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-md relative mb-4 w-full max-w-2xl" role="alert">
                        <span className="block sm:inline">{message}</span>
                        <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={() => setMessage('')}>
                            <svg className="fill-current h-6 w-6 text-blue-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Fechar</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.103l-2.651 3.746a1.2 1.2 0 1 1-1.697-1.697l3.746-2.651-3.746-2.651a1.2 1.2 0 0 1 1.697-1.697L10 8.897l2.651-3.746a1.2 1.2 0 0 1 1.697 1.697L11.103 10l3.746 2.651a1.2 1.2 0 0 1 0 1.698z"/></svg>
                        </span>
                    </div>
                )}

                {/* Formulário para o novo post */}
                <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-gray-700 dark:text-gray-300 text-lg font-medium mb-2">Título</label>
                        <input
                            type="text"
                            id="title"
                            className="shadow-sm appearance-none border border-gray-300 dark:border-gray-600 rounded-md w-full py-3 px-4 text-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            disabled={submitting}
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="content" className="block text-gray-700 dark:text-gray-300 text-lg font-medium mb-2">Conteúdo</label>
                        <textarea
                            id="content"
                            rows="10"
                            className="shadow-sm appearance-none border border-gray-300 dark:border-gray-600 rounded-md w-full py-3 px-4 text-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 resize-y"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            disabled={submitting}
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md focus:outline-none focus:shadow-outline transition duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={submitting}
                    >
                        {submitting ? 'Enviando...' : 'Enviar Post'}
                    </button>
                </form>
            </div>
        );
    };

    // Renderização principal do componente App
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Cabeçalho com botões de navegação para o blog, estilizado com Tailwind */}
            <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-center sticky top-0 z-10 rounded-b-lg">
                <nav className="flex space-x-4">
                    <button
                        onClick={() => setCurrentView('list')} // Muda para a visualização da lista
                        className={`py-2 px-4 rounded-md text-lg font-medium transition duration-300 ease-in-out ${
                            currentView === 'list'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900'
                        }`}
                    >
                        Ver Posts do Blog
                    </button>
                    <button
                        onClick={() => setCurrentView('newPost')} // Muda para a visualização de novo post
                        className={`py-2 px-4 rounded-md text-lg font-medium transition duration-300 ease-in-out ${
                            currentView === 'newPost'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900'
                        }`}
                    >
                        Escrever Novo Post
                    </button>
                </nav>
            </header>

            {/* Conteúdo principal do blog, renderiza o componente apropriado com base em 'currentView' */}
            <main className="container mx-auto p-4">
                {(() => {
                    switch (currentView) {
                        case 'list':
                            return <BlogList />;
                        case 'newPost':
                            // Passa as props necessárias para o componente NewPost
                            return <NewPost
                                db={db}
                                userId={userId}
                                setMessage={setMessage}
                                setCurrentView={setCurrentView}
                            />;
                        default:
                            return <BlogList />; // Padrão para a visualização da lista
                    }
                })()}
            </main>
        </div>
    );
};

export default App; // Exporta o componente App como padrão
