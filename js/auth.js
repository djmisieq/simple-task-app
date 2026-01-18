import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const provider = new GoogleAuthProvider();
let auth;
let currentUser = null;

// Elementy UI
const loginView = document.getElementById('login-view');
const dashboardView = document.getElementById('dashboard-view');
const appView = document.getElementById('app-view');

const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const userAvatar = document.getElementById('user-avatar');
const userName = document.getElementById('user-name');

export function initAuth(app, db, onUserChanged) {
    auth = getAuth(app);

    // Obsługa logowania
    loginBtn.addEventListener('click', () => {
        signInWithPopup(auth, provider)
            .then(async (result) => {
                const user = result.user;
                // Zapisz użytkownika w bazie jeśli to pierwsze logowanie
                await saveUserToDb(db, user);
            })
            .catch((error) => {
                console.error("Błąd logowania:", error);
                alert("Nie udało się zalogować: " + error.message);
            });
    });

    // Obsługa wylogowania
    logoutBtn.addEventListener('click', () => {
        signOut(auth).then(() => {
            console.log("Wylogowano");
            showView('login-view');
        });
    });

    // Nasłuchiwanie stanu
    onAuthStateChanged(auth, (user) => {
        currentUser = user;
        if (user) {
            // Zalogowany
            console.log("Zalogowano jako:", user.displayName);
            if (userAvatar) userAvatar.src = user.photoURL;
            if (userName) userName.textContent = user.displayName;

            // Pokaż dashboard
            showView('dashboard-view');

            // Powiadom resztę aplikacji
            if (onUserChanged) onUserChanged(user);
        } else {
            // Wylogowany
            showView('login-view');
            if (onUserChanged) onUserChanged(null);
        }
    });
}

export function getCurrentUser() {
    return currentUser;
}

// Funkcja pomocnicza do przełączania widoków
export function showView(viewId) {
    [loginView, dashboardView, appView].forEach(view => {
        if (view) view.style.display = 'none';
    });
    const target = document.getElementById(viewId);
    if (target) target.style.display = 'block';
}

async function saveUserToDb(db, user) {
    const userRef = doc(db, "users", user.uid);
    try {
        await setDoc(userRef, {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            lastLogin: serverTimestamp()
        }, { merge: true }); // merge = nie nadpisuj jeśli istnieje
    } catch (e) {
        console.error("Błąd zapisu użytkownika do DB:", e);
    }
}
