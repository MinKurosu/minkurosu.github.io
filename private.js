// private.js

// Firebase Imports
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'; // Adicione signInWithEmailAndPassword e signOut se for lidar com login/logout aqui
import { getFirestore, collection, query, where, orderBy, getDocs, addDoc, serverTimestamp } from 'firebase/firestore'; // Adicione addDoc e serverTimestamp se for adicionar entradas
// SUA CONFIGURAÇÃO DO FIREBASE (a mesma que você usa nos outros arquivos)
const auth = getAuth(app);
const db = getFirestore(app);


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

const db = getFirestore(app);

// Elementos HTML
const passwordForm = document.getElementById('password-form');
const passwordInput = document.getElementById('password-input');
const passwordMessage = document.getElementById('password-message');
// Contêiner onde as entradas privadas serão exibidas
const privateEntriesDisplay = document.getElementById('private-entries-display'); // Onde as entradas serão exibidas

// *** IMPORTANTE: Defina sua senha secreta aqui ***
const CORRECT_PASSWORD = "lili"; // <-- TROQUE PELA SUA SENHA REAL!

// Função para formatar o timestamp
function formatTimestampForTitle(timestamp) {
    if (!timestamp || !timestamp.toDate) return 'Data Indisponível';
    const date = timestamp.toDate();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês é baseado em zero
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Função para exibir mensagens na área de senha
function showPasswordMessage(message, type) {
    passwordMessage.textContent = message;
    passwordMessage.style.color = type === 'error' ? 'red' : 'green';
}

// Função para carregar e exibir as entradas privadas (só será chamada após a senha correta)
async function loadPrivateEntries() {
    if (!privateEntriesDisplay) {
        console.error("Elemento 'private-entries-display' não encontrado.");
        return;
    }

    try {
        privateEntriesDisplay.innerHTML = '<h2>Carregando entradas privadas...</h2>';
        
        // Consulta a coleção 'private_entries' e ordena por timestamp (mais recente primeiro)
        const entriesQuery = query(collection(db, 'private_entries'), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(entriesQuery);
        
        privateEntriesDisplay.innerHTML = ''; // Limpa a mensagem de "carregando"

        if (querySnapshot.empty) {
            privateEntriesDisplay.innerHTML = '<h2>Nenhuma entrada privada encontrada ainda.</h2>';
            return;
        }

        let entryNumber = querySnapshot.size; // Número inicial para contagem regressiva

        querySnapshot.forEach(doc => {
            const entry = doc.data();
            const entryElement = document.createElement('div');
            entryElement.classList.add('blog-post'); // Reutiliza estilos de post de blog

            const formattedDate = formatTimestampForTitle(entry.timestamp);
            // Formata o título como "Entrada Privada n° ### - DD/MM/YYYY"
            const title = `Entrada Privada n° ${String(entryNumber).padStart(3, '0')} - ${formattedDate}`;

            entryElement.innerHTML = `
               <h1>${title}</h1>
               <p>${entry.content.replace(/\n/g, '<br>')}</p>
               <hr class="post-divider">
            `;
            privateEntriesDisplay.appendChild(entryElement);
            entryNumber--; // Decrementa para a próxima entrada
        });
    } catch (error) {
        console.error("Erro ao carregar entradas privadas:", error);
        privateEntriesDisplay.innerHTML = '<p style="color: red;">Ocorreu um erro ao carregar as entradas privadas.</p>';
    }
}

// Event Listener para o formulário de senha
document.addEventListener('DOMContentLoaded', () => {
    if (passwordForm && privateEntriesDisplay) { // Verifica se os elementos existem
        // Inicialmente, esconde a área de exibição das entradas privadas
        privateEntriesDisplay.style.display = 'none';

        passwordForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Impede o envio padrão do formulário
            const enteredPassword = passwordInput.value.trim();

            if (enteredPassword === CORRECT_PASSWORD) {
                showPasswordMessage(passwordMessage, 'Senha correta! Carregando entradas...', 'success');
                passwordForm.style.display = 'none'; // Esconde o formulário de senha
                privateEntriesDisplay.style.display = 'block'; // Mostra o contêiner das entradas
                loadPrivateEntries(); // Carrega as entradas após a senha correta
            } else {
                showPasswordMessage(passwordMessage, 'Senha incorreta. Tente novamente.', 'error');
                passwordInput.value = ''; // Limpa o campo de senha
            }
        });
    } else {
        console.error("Elementos 'password-form' ou 'private-entries-display' não encontrados. Verifique seu HTML e JS.");
        // Se o formulário não for encontrado, talvez mostre as entradas por padrão (ou trate como erro)
        // privateEntriesDisplay.style.display = 'block'; // Pode descomentar para debug
        // loadPrivateEntries(); // Pode descomentar para debug
    }
});