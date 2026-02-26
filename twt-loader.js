import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getFirestore, collection, query, orderBy, onSnapshot, doc, addDoc, updateDoc, increment, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyA8-Ab2dE48sVOhmT-HfxIL5_rzDMRdcCc",
    authDomain: "minkurosu.firebaseapp.com",
    projectId: "minkurosu",
    storageBucket: "minkurosu.firebasestorage.app",
    messagingSenderId: "290821725607",
    appId: "1:290821725607:web:5e39e561da53ac7c8a2a82",
    measurementId: "G-M7PWC6DDRH"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


const IMAGE_EXTENSIONS = /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i;
const GIF_URL = /\.(gif)(\?.*)?$/i;
const VIDEO_EXTENSIONS = /\.(mp4|webm|ogg|mov)(\?.*)?$/i;

function getYouTubeId(url) {
    try {
        const u = new URL(url);
        if (u.hostname.includes('youtu.be')) return u.pathname.slice(1).split('?')[0];
        if (u.hostname.includes('youtube.com')) {
            return u.searchParams.get('v') || 
                   (u.pathname.startsWith('/embed/') ? u.pathname.split('/')[2] : null) ||
                   (u.pathname.startsWith('/shorts/') ? u.pathname.split('/')[2] : null);
        }
    } catch {}
    return null;
}

function getSpotifyEmbed(url) {
    try {
        const u = new URL(url);
        if (!u.hostname.includes('spotify.com')) return null;
        const path = u.pathname;
        const match = path.match(/\/(track|album|playlist|episode|show)\/([a-zA-Z0-9]+)/);
        if (match) {
            return `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator&theme=0`;
        }
    } catch {}
    return null;
}

function isImageUrl(url) {
    return IMAGE_EXTENSIONS.test(url) ||
        url.includes('tenor.com') ||
        url.includes('giphy.com') ||
        url.includes('i.imgur.com') ||
        url.includes('pbs.twimg.com') ||
        url.includes('media.discordapp') ||
        url.includes('cdn.discordapp') ||
        url.includes('i.redd.it') ||
        url.includes('preview.redd.it') ||
        url.includes('picmix.com');
}

function isVideoUrl(url) {
    return VIDEO_EXTENSIONS.test(url);
}

function extractUrls(text) {
    const urlRegex = /https?:\/\/[^\s<>"]+/g;
    return [...(text.match(urlRegex) || [])];
}

function buildEmbedHtml(url) {
    const ytId = getYouTubeId(url);
    if (ytId) {
        return `
            <div class="embed-youtube" style="margin-top:10px; border-radius:16px; overflow:hidden; max-width:100%;">
                <iframe 
                    src="https://www.youtube.com/embed/${ytId}" 
                    width="100%" 
                    height="280" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen
                    style="border-radius:16px; display:block;">
                </iframe>
            </div>`;
    }

    const spotifyEmbed = getSpotifyEmbed(url);
    if (spotifyEmbed) {
        const isTrack = url.includes('/track/');
        const height = isTrack ? '152' : '352';
        return `
            <div class="embed-spotify" style="margin-top:10px;">
                <iframe 
                    src="${spotifyEmbed}" 
                    width="100%" 
                    height="${height}" 
                    frameborder="0" 
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                    loading="lazy"
                    style="border-radius:12px; display:block;">
                </iframe>
            </div>`;
    }

    if (isImageUrl(url)) {
        return `<img src="${url}" alt="media" style="max-width:100%; border-radius:16px; margin-top:10px; display:block;">`;
    }

    if (isVideoUrl(url)) {
        return `
            <video controls style="max-width:100%; border-radius:16px; margin-top:10px; display:block;">
                <source src="${url}">
            </video>`;
    }

    return '';
}

function buildAllEmbeds(content) {
    const urls = extractUrls(content);
    return urls.map(url => buildEmbedHtml(url)).filter(Boolean).join('');
}

function renderContent(content) {
    const urls = extractUrls(content);
    let text = content;

    urls.forEach(url => {
        const ytId = getYouTubeId(url);
        const spotifyEmbed = getSpotifyEmbed(url);
        if (ytId || spotifyEmbed || isImageUrl(url) || isVideoUrl(url)) {
            text = text.replace(url, '');
        } else {
            text = text.replace(url, `<a href="${url}" target="_blank" rel="noopener" style="color:#3BB9E3;">${url}</a>`);
        }
    });

    return text.replace(/\n/g, '<br>').trim();
}

function formatTimestampMinimal(timestamp) {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

async function listenForPosts() {
    const tweetsContainer = document.getElementById('tweets-container');
    if (!tweetsContainer) return;

    const postsRef = collection(db, 'posts');
    const q = query(postsRef, orderBy('timestamp', 'desc'));

    onSnapshot(q, (querySnapshot) => {
        tweetsContainer.innerHTML = '';
        if (querySnapshot.empty) {
            tweetsContainer.innerHTML = '<li><p>no posts found.</p></li>';
            return;
        }

        querySnapshot.forEach(docSnap => {
            const post = docSnap.data();
            const postId = docSnap.id;
            const likeCount = post.likeCount || 0;
            const likedPosts = JSON.parse(localStorage.getItem('likedPosts')) || [];
            const isLiked = likedPosts.includes(postId);

            const rawContent = post.content || '';
            const renderedText = renderContent(rawContent);
            const embedsHtml = buildAllEmbeds(rawContent);

            const legacyImage = post.imageUrl
                ? `<img src="${post.imageUrl}" alt="img" style="max-width:100%; border-radius:15px; margin-top:10px;">`
                : '';

            const postElement = document.createElement('li');
            postElement.dataset.postId = postId;

            postElement.innerHTML = `
                <img src="imgs/site_imgs/twitteravatar.jpg" alt="Avatar">
                <div class="info">
                    <strong>min* <span>@minkurosu • ${formatTimestampMinimal(post.timestamp)}</span></strong>
                    <p>${renderedText}</p>
                    ${legacyImage}
                    ${embedsHtml}
                    <div class="post-actions">
                        <div class="action-button reply-button">
                            <span>reply</span>
                        </div>
                        <div class="action-button like-button ${isLiked ? 'liked' : ''}" data-type="post">
                            <svg viewBox="0 0 24 24"><path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z"></path></svg>
                            <span class="like-count">${likeCount}</span>
                        </div>
                    </div>
                    <form class="reply-form">
                        <input type="text" name="authorName" placeholder="user" required maxlength="49">
                        <textarea name="content" placeholder="write your reply" required maxlength="999"></textarea>
                        <button type="submit">send</button>
                    </form>
                    <div class="replies-section"></div>
                </div>`;

            tweetsContainer.appendChild(postElement);
            listenForReplies(postId);
        });
    }, (error) => {
        console.error("error loading posts: ", error);
        tweetsContainer.innerHTML = '<li><p>something went wrong loading posts.</p></li>';
    });
}

function listenForReplies(postId) {
    const postElement = document.querySelector(`li[data-post-id="${postId}"]`);
    if (!postElement) return;

    const repliesContainer = postElement.querySelector('.replies-section');
    const repliesRef = collection(db, 'posts', postId, 'replies');
    const q = query(repliesRef, orderBy('timestamp', 'asc'));

    onSnapshot(q, (querySnapshot) => {
        repliesContainer.innerHTML = '';
        if (querySnapshot.empty) {
            repliesContainer.style.display = 'none';
            return;
        }

        repliesContainer.style.display = 'block';

        querySnapshot.forEach(docSnap => {
            const reply = docSnap.data();
            const replyId = docSnap.id;
            const likeCount = reply.likeCount || 0;
            const likedReplies = JSON.parse(localStorage.getItem('likedReplies')) || [];
            const isLiked = likedReplies.includes(replyId);

            const rawContent = reply.content || '';
            const renderedText = renderContent(rawContent);
            const embedsHtml = buildAllEmbeds(rawContent);

            const replyElement = document.createElement('div');
            replyElement.className = 'reply';
            replyElement.dataset.replyId = replyId;

            replyElement.innerHTML = `
                <div class="info">
                    <strong class="author-name">${reply.authorName} <span>• ${formatTimestampMinimal(reply.timestamp)}</span></strong>
                    <p class="content">${renderedText}</p>
                    ${embedsHtml}
                    <div class="actions">
                        <div class="action-button like-button ${isLiked ? 'liked' : ''}" data-type="reply">
                            <svg viewBox="0 0 24 24"><path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z"></path></svg>
                            <span class="like-count">${likeCount}</span>
                        </div>
                    </div>
                </div>`;
            repliesContainer.appendChild(replyElement);
        });
    });
}

async function handleActionClick(e) {
    // Reply toggle
    const replyButton = e.target.closest('.reply-button');
    if (replyButton) {
        const postElement = replyButton.closest('li[data-post-id]');
        const form = postElement.querySelector('.reply-form');
        form.classList.toggle('active');
        return;
    }

    // Like
    const likeButton = e.target.closest('.like-button');
    if (likeButton) {
        const postElement = likeButton.closest('li[data-post-id]');
        if (!postElement) return;

        const postId = postElement.dataset.postId;
        const type = likeButton.dataset.type;

        let docRef, storageKey, itemId;

        if (type === 'post') {
            docRef = doc(db, 'posts', postId);
            storageKey = 'likedPosts';
            itemId = postId;
        } else if (type === 'reply') {
            const replyElement = likeButton.closest('.reply[data-reply-id]');
            if (!replyElement) return;
            const replyId = replyElement.dataset.replyId;
            docRef = doc(db, 'posts', postId, 'replies', replyId);
            storageKey = 'likedReplies';
            itemId = replyId;
        } else {
            return;
        }

        const likedItems = JSON.parse(localStorage.getItem(storageKey)) || [];
        if (likedItems.includes(itemId)) return;

        try {
            await updateDoc(docRef, { likeCount: increment(1) });
            likedItems.push(itemId);
            localStorage.setItem(storageKey, JSON.stringify(likedItems));
            likeButton.classList.add('liked');
        } catch (error) {
            console.error("failed to like:", { type, itemId, error });
            alert("couldn't register your like. please try again.");
        }
    }
}

async function handleReplySubmit(e) {
    if (!e.target.classList.contains('reply-form')) return;

    e.preventDefault();
    const form = e.target;
    const postElement = form.closest('li[data-post-id]');
    const postId = postElement.dataset.postId;

    const authorName = form.querySelector('input[name="authorName"]').value.trim();
    const content = form.querySelector('textarea[name="content"]').value.trim();

    if (!authorName || !content) {
        alert("please fill in your name and reply.");
        return;
    }

    try {
        const repliesRef = collection(db, 'posts', postId, 'replies');
        await addDoc(repliesRef, {
            authorName,
            content,
            likeCount: 0,
            timestamp: serverTimestamp()
        });
        form.reset();
        form.classList.remove('active');
    } catch (error) {
        console.error("error adding reply:", error);
        alert("couldn't send your reply. please try again.");
    }
}

// ─────────────────────────────────────────────
//  INIT
// ─────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    const tweetsContainer = document.getElementById('tweets-container');
    if (tweetsContainer) {
        tweetsContainer.addEventListener('click', handleActionClick);
        tweetsContainer.addEventListener('submit', handleReplySubmit);
    }
    listenForPosts();
});