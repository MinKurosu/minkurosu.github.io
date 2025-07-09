// dream-journal.js

// Firebase Imports
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getFirestore, collection, query, orderBy, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// YOUR FIREBASE CONFIG (same as in your other files)
const firebaseConfig = {
    apiKey: "AIzaSyA8-Ab2dE48sVOhmT-HfxIL5_rzDMRdcCc",
    authDomain: "minkurosu.firebaseapp.com",
    projectId: "minkurosu",
    storageBucket: "minkurosu.firebasestorage.app",
    messagingSenderId: "290821725607",
    appId: "1:290821725607:web:5e39e561da53ac7c8a2a82",
    measurementId: "G-M7PWC6DDRH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Container where dreams will be displayed
const dreamsContainer = document.getElementById('dreams-container');

// Function to format the date for the title (DD/MM/YYYY)
function formatTimestampForTitle(timestamp) {
    if (!timestamp) return 'Date Unavailable';
    const date = timestamp.toDate();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    return `${day}/${month}/${year}`;
}

// Load dreams from Firestore
async function loadDreams() {
    if (!dreamsContainer) {
        console.error("Error: Element with ID 'dreams-container' not found.");
        return;
    }
    try {
        // Query to fetch dreams from the 'dreams' collection, ordered by date
        const dreamsQuery = query(collection(db, 'dreams'), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(dreamsQuery);
        
        dreamsContainer.innerHTML = ''; // Clear the "loading" message

        if (querySnapshot.empty) {
            dreamsContainer.innerHTML = '<h2>No dreams recorded yet.</h2>';
            return;
        }

        let dreamNumber = querySnapshot.size; // Initial number for countdown

        querySnapshot.forEach(doc => {
            const dream = doc.data();
            const dreamElement = document.createElement('div');
            dreamElement.classList.add('blog-post'); // Reuse blog post styles

            const formattedDate = formatTimestampForTitle(dream.timestamp);
            // Formats the title as "Dream n° ### - DD/MM/YYYY"
            const title = `Dream n° ${String(dreamNumber).padStart(3, '0')} - ${formattedDate}`;

            dreamElement.innerHTML = `
               <h1>${title}</h1>
               <p>${dream.content.replace(/\n/g, '<br>')}</p>
               <hr class="post-divider">
            `;
            dreamsContainer.appendChild(dreamElement);
            dreamNumber--; // Decrement for the next dream
        });
    } catch (error) {
        console.error("Error loading dreams:", error);
        dreamsContainer.innerHTML = '<p style="color: red;">An error occurred while loading dreams.</p>';
    }
}

// Load dreams when the page DOM is ready
document.addEventListener('DOMContentLoaded', loadDreams);