// app.js

// 1. Importar as instâncias do Firebase que você exportou de firebase-init.js
import { auth, db, storage } from './firebase-init.js';

// Agora você pode usar 'auth', 'db' e 'storage' neste arquivo!

// Este bloco de código garante que o DOM (Document Object Model) esteja completamente carregado
// antes de tentar manipular elementos HTML.
document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 app.js carregado! Pronto para construir o blog.");

    // Você pode ver os objetos importados no console para verificar:
    // console.log("Instância de autenticação:", auth);
    // console.log("Instância do Firestore:", db);
    // console.log("Instância do Storage:", storage);

    // Mais tarde, adicionaremos a lógica para carregar e exibir posts do Firestore aqui.
    // Por exemplo:
    /*
    const blogPostsContainer = document.getElementById('blog-posts-container');
    blogPostsContainer.innerHTML = '<h2>Posts Recentes:</h2>';

    // Exemplo de como você buscaria posts (ainda não temos a coleção 'posts' no Firestore)
    // db.collection("posts").orderBy("dataPublicacao", "desc").get()
    //     .then((querySnapshot) => {
    //         if (querySnapshot.empty) {
    //             blogPostsContainer.innerHTML += '<p>Nenhum post ainda. Seja o primeiro a escrever!</p>';
    //         } else {
    //             querySnapshot.forEach((doc) => {
    //                 const post = doc.data();
    //                 const postElement = document.createElement('article');
    //                 postElement.innerHTML = `
    //                     <h3>${post.titulo}</h3>
    //                     <p>${post.conteudo}</p>
    //                     ${post.urlImagemCapa ? `<img src="${post.urlImagemCapa}" alt="${post.titulo}" style="max-width: 100%; height: auto;">` : ''}
    //                     <small>Publicado em: ${new Date(post.dataPublicacao.toDate()).toLocaleDateString()}</small>
    //                 `;
    //                 blogPostsContainer.appendChild(postElement);
    //             });
    //         }
    //     })
    //     .catch((error) => {
    //         console.error("Erro ao buscar posts:", error);
    //         blogPostsContainer.innerHTML += '<p>Erro ao carregar posts. Tente novamente mais tarde.</p>';
    //     });
    */
});
