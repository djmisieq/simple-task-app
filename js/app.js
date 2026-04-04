let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
let currentFilter = 'all';

const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTask');
const taskList = document.getElementById('taskList');
const clearCompletedBtn = document.getElementById('clearCompleted');
const filterBtns = document.querySelectorAll('.filter');
const themeToggleBtn = document.getElementById('themeToggle');

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addTask(); });
clearCompletedBtn.addEventListener('click', clearCompleted);
themeToggleBtn.addEventListener('click', toggleTheme);

taskList.addEventListener('click', (e) => {
  const item = e.target.closest('.task-item');
  if (!item) return;
  const id = item.dataset.id;

  if (e.target.closest('.delete-task')) {
    tasks = tasks.filter(t => t.id !== id);
    save();
    render();
  } else if (e.target.closest('.task-checkbox')) {
    const task = tasks.find(t => t.id === id);
    if (task) task.completed = !task.completed;
    save();
    render();
  }
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });
});

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;
  tasks.unshift({ id: Date.now().toString(), text, completed: false });
  taskInput.value = '';
  save();
  render();
}

function clearCompleted() {
  tasks = tasks.filter(t => !t.completed);
  save();
  render();
}

function save() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function render() {
  const noTasks = document.getElementById('noTasks');
  taskList.innerHTML = '';

  const filtered = tasks.filter(t => {
    if (currentFilter === 'active') return !t.completed;
    if (currentFilter === 'completed') return t.completed;
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
      taskList.appendChild(li);
    });
  }

  const count = tasks.filter(t => !t.completed).length;
  document.getElementById('taskCount').textContent = `${count} zadań pozostało`;
  clearCompletedBtn.style.display = tasks.some(t => t.completed) ? 'inline-block' : 'none';
}

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
  themeToggleBtn.querySelector('i').className = document.body.classList.contains('dark-mode')
    ? 'fas fa-sun' : 'fas fa-moon';
}

function initTheme() {
  const isDark = localStorage.getItem('darkMode') === 'true'
    || (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (isDark) {
    document.body.classList.add('dark-mode');
    themeToggleBtn.querySelector('i').className = 'fas fa-sun';
  }
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[tag]));
}

initTheme();
render();
