// Importa React e ReactDOM
import React from 'react';
import ReactDOM from 'react-dom/client'; // Importa a nova API de cliente do ReactDOM

// Importa o componente principal do seu blog
import App from './blogAppComponents.js';

// Encontra o elemento 'root' no seu HTML onde o aplicativo React será montado
const container = document.getElementById('blog-root');

// Cria uma raiz do React (usando a nova API de cliente)
const root = ReactDOM.createRoot(container);

// Renderiza o componente App dentro da raiz
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// As variáveis globais __app_id, __firebase_config e __initial_auth_token
// são injetadas no ambiente de execução e serão acessíveis dentro de App.js
// Nenhuma manipulação direta é necessária aqui.
