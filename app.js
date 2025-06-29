// app.js

// 1. Importar as instâncias do Firebase que você exportou de firebase-init.js
import { auth, db, storage } from './firebase-init.js';

// Agora você pode usar 'auth', 'db' e 'storage' neste arquivo!

// Exemplo simples:
document.addEventListener('DOMContentLoaded', () => {
    console.log("app.js carregado!");
    console.log("Instância de autenticação:", auth);
    console.log("Instância do Firestore:", db);
    console.log("Instância do Storage:", storage);

    // Você pode, por exemplo, tentar listar posts do Firestore aqui
    // (Ainda não temos posts, mas a conexão com o banco de dados estará pronta)

    // db.collection("posts").get().then((querySnapshot) => {
    //     querySnapshot.forEach((doc) => {
    //         console.log(doc.id, " => ", doc.data());
    //     });
    // }).catch((error) => {
    //     console.error("Erro ao buscar documentos: ", error);
    // });
});

// Mais para frente, adicionaremos funções como:
// - Carregar e exibir posts na página principal
// - Lógica para a página de login do admin
// - Lógica para criar e enviar novos posts (com ou sem mídia)
