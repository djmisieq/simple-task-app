import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  where,
  serverTimestamp,
  arrayUnion
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { initAuth, getCurrentUser, showView } from "./auth.js";

// --- KONFIGURACJA FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyAXODQ3A_Nk8Ztja61iPhL8XNTHcGD3dBI",
  authDomain: "simple-task-app-agent.firebaseapp.com",
  projectId: "simple-task-app-agent",
  storageBucket: "simple-task-app-agent.firebasestorage.app",
  messagingSenderId: "695237530265",
  appId: "1:695237530265:web:6c85d4832d8cf09e6d5e08"
};

// Inicjalizacja
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Zmienne stanu
let currentListId = null;
let taskUnsubscribe = null;
let messageUnsubscribe = null;

document.addEventListener('DOMContentLoaded', () => {
  // Inicjalizacja Autoryzacji
  initAuth(app, db, (user) => {
    if (user) {
      setupDashboard(user);
    } else {
      // Czyszczenie
      if (taskUnsubscribe) taskUnsubscribe();
      if (messageUnsubscribe) messageUnsubscribe();
    }
  });

  // --- DASHBOARD ---
  const newListInput = document.getElementById('new-list-name');
  const createListBtn = document.getElementById('create-list-btn');

  createListBtn.addEventListener('click', () => createList(newListInput.value));

  // --- APP VIEW ---
  const taskInput = document.getElementById('taskInput');
  const addTaskBtn = document.getElementById('addTask');
  const taskList = document.getElementById('taskList');
  const clearCompletedBtn = document.getElementById('clearCompleted');
  const filterBtns = document.querySelectorAll('.filter');
  const themeToggleBtn = document.getElementById('themeToggle');
  const backToDashboardBtn = document.getElementById('back-to-dashboard');

  // Chat UI
  const chatPanel = document.getElementById('chat-panel');
  const toggleChatBtn = document.getElementById('toggle-chat-btn');
  const closeChatMobileBtn = document.getElementById('close-chat-mobile');
  const chatInput = document.getElementById('chat-input');
  const sendMsgBtn = document.getElementById('send-msg-btn');

  // Obsługa zdarzeń aplikacji
  addTaskBtn.addEventListener('click', addTask);
  taskInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addTask(); });

  taskList.addEventListener('click', handleTaskListClick);
  clearCompletedBtn.addEventListener('click', clearCompleted);

  backToDashboardBtn.addEventListener('click', () => {
    showView('dashboard-view');
    currentListId = null;
    if (taskUnsubscribe) taskUnsubscribe();
    if (messageUnsubscribe) messageUnsubscribe();
  });

  // Czat Toggle
  toggleChatBtn.addEventListener('click', () => {
    chatPanel.classList.toggle('collapsed');
  });
  closeChatMobileBtn.addEventListener('click', () => {
    chatPanel.classList.add('collapsed');
  });

  sendMsgBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

  // Filtry UI
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTasks(currentTasks, btn.dataset.filter);
    });
  });

  themeToggleBtn.addEventListener('click', toggleTheme);
  initTheme();

  // --- LOGIKA DASHBOARDU ---
  function setupDashboard(user) {
    // Pobierz listy, w których użytkownik jest członkiem
    const listsRef = collection(db, "lists");
    // Uwaga: Security Rules muszą pozwalać na czytanie list gdzie auth.uid in members
    // Tymczasowo w trybie test mode zadziała
    // Dla uproszczenia pobierzemy wszystkie gdzie users.uid jest w members? 
    // Firestore ma limitacje 'array-contains', użyjemy tego

    const q = query(listsRef, where("members", "array-contains", user.uid), orderBy("createdAt", "desc"));

    onSnapshot(q, (snapshot) => {
      const container = document.getElementById('lists-container');
      container.innerHTML = '';

      if (snapshot.empty) {
        container.innerHTML = '<p>Nie masz jeszcze żadnych list. Stwórz nową!</p>';
      }

      snapshot.forEach(docSnap => {
        const list = docSnap.data();
        const el = document.createElement('div');
        el.className = 'list-card';
        el.innerHTML = `<h3>${list.name}</h3><p>ID: ${docSnap.id}</p>`;
        el.onclick = () => openList(docSnap.id, list.name);
        container.appendChild(el);
      });
    });
  }

  async function createList(name) {
    const user = getCurrentUser();
    if (!user || !name.trim()) return;

    try {
      await addDoc(collection(db, "lists"), {
        name: name.trim(),
        ownerId: user.uid,
        members: [user.uid],
        createdAt: serverTimestamp()
      });
      newListInput.value = '';
    } catch (e) {
      console.error("Błąd tworzenia listy:", e);
    }
  }

  // --- LOGIKA LISTY (ZADANIA) ---
  let currentTasks = [];

  function openList(listId, listName) {
    currentListId = listId;
    document.getElementById('current-list-title').textContent = listName;
    showView('app-view');

    // 1. Zasubskrybuj zadania
    const q = query(collection(db, "tasks"), where("listId", "==", listId), orderBy("createdAt", "desc"));
    taskUnsubscribe = onSnapshot(q, (snapshot) => {
      currentTasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      renderTasks(currentTasks, document.querySelector('.filter.active').dataset.filter);
      updateTaskCount(currentTasks);
    });

    // 2. Zasubskrybuj wiadomości (Czat)
    setupChat(listId);
  }

  async function addTask() {
    const text = taskInput.value.trim();
    if (!text || !currentListId) return;

    await addDoc(collection(db, "tasks"), {
      text: text,
      completed: false,
      listId: currentListId,
      createdAt: serverTimestamp()
    });
    taskInput.value = '';
  }

  async function handleTaskListClick(e) {
    const item = e.target.closest('.task-item');
    if (!item) return;
    const id = item.dataset.id;

    if (e.target.closest('.delete-task')) {
      await deleteDoc(doc(db, "tasks", id));
    } else if (e.target.closest('.task-checkbox')) {
      // Toggle logic
      const task = currentTasks.find(t => t.id === id);
      if (task) {
        await updateDoc(doc(db, "tasks", id), { completed: !task.completed });
      }
    }
  }

  async function clearCompleted() {
    const toDelete = currentTasks.filter(t => t.completed);
    toDelete.forEach(t => deleteDoc(doc(db, "tasks", t.id)));
  }

  // --- LOGIKA CZATU ---
  function setupChat(listId) {
    const msgsRef = collection(db, "messages");
    const q = query(msgsRef, where("listId", "==", listId), orderBy("createdAt", "asc"));

    // Wyczyść stare
    const chatContainer = document.getElementById('chat-messages');
    chatContainer.innerHTML = '';

    messageUnsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach(change => {
        if (change.type === "added") {
          renderMessage(change.doc.data(), chatContainer);
        }
      });
      // Autoscroll
      chatContainer.scrollTop = chatContainer.scrollHeight;
    });
  }

  async function sendMessage() {
    const text = chatInput.value.trim();
    const user = getCurrentUser();

    if (!text || !currentListId || !user) return;

    await addDoc(collection(db, "messages"), {
      text: text,
      listId: currentListId,
      senderId: user.uid,
      senderName: user.displayName,
      senderPhoto: user.photoURL,
      createdAt: serverTimestamp()
    });
    chatInput.value = '';
  }

  function renderMessage(msg, container) {
    const user = getCurrentUser();
    const isMe = user && msg.senderId === user.uid;

    const div = document.createElement('div');
    div.className = `chat-msg ${isMe ? 'own' : ''}`;

    // Prosty format czasu
    let timeStr = "";
    if (msg.createdAt) {
      const date = msg.createdAt.toDate ? msg.createdAt.toDate() : new Date();
      timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    div.innerHTML = `
            <div class="msg-meta">
                <span class="msg-author">${isMe ? 'Ty' : msg.senderName}</span>
                <span class="msg-time">${timeStr}</span>
            </div>
            <div class="msg-bubble">${escapeHTML(msg.text)}</div>
        `;
    container.appendChild(div);
  }
});

// Reuse existing render/theme logic
function renderTasks(tasks, filter) {
  const list = document.getElementById('taskList');
  const noTasks = document.getElementById('noTasks');
  list.innerHTML = '';

  const filtered = tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  if (filtered.length === 0) {
    noTasks.style.display = 'block';
  } else {
    noTasks.style.display = 'none';
    filtered.forEach(task => {
      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''}`;
      li.dataset.id = task.id;
      li.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text">${escapeHTML(task.text)}</span>
                <button class="delete-task"><i class="fas fa-times"></i></button>
            `;
      list.appendChild(li);
    });
  }
}

function updateTaskCount(tasks) {
  const count = tasks.filter(t => !t.completed).length;
  document.getElementById('taskCount').textContent = `${count} zadań pozostało`;
  document.getElementById('clearCompleted').style.display = tasks.some(t => t.completed) ? 'block' : 'none';
}

function initTheme() {
  // ... (existing logic)
  const isDark = localStorage.getItem('darkMode') === 'true';
  if (isDark) document.body.classList.add('dark-mode');
}
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}
function escapeHTML(str) {
  if (!str) return "";
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;',
    "'": '&#39;', '"': '&quot;'
  }[tag]));
}