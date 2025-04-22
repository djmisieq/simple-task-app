document.addEventListener('DOMContentLoaded', () => {
  // Selektory elementów
  const taskInput = document.getElementById('taskInput');
  const addTaskBtn = document.getElementById('addTask');
  const taskList = document.getElementById('taskList');
  const taskCount = document.getElementById('taskCount');
  const clearCompletedBtn = document.getElementById('clearCompleted');
  const filterBtns = document.querySelectorAll('.filter');
  const themeToggleBtn = document.getElementById('themeToggle');
  const themeIcon = themeToggleBtn.querySelector('i');
  const noTasksEl = document.getElementById('noTasks');
  
  // Stan aplikacji
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  let currentFilter = 'all';
  
  // Inicjalizacja aplikacji
  initTheme();
  renderTasks();
  updateTaskCount();
  
  // Obsługa wydarzeń
  addTaskBtn.addEventListener('click', addTask);
  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });
  
  taskList.addEventListener('click', (e) => {
    const taskItem = e.target.closest('.task-item');
    if (!taskItem) return;
    
    const taskId = taskItem.dataset.id;
    
    if (e.target.classList.contains('task-checkbox')) {
      toggleTaskStatus(taskId);
    } else if (e.target.classList.contains('delete-task') || e.target.parentElement.classList.contains('delete-task')) {
      deleteTask(taskId);
    }
  });
  
  clearCompletedBtn.addEventListener('click', clearCompleted);
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderTasks();
    });
  });
  
  themeToggleBtn.addEventListener('click', toggleTheme);
  
  // Funkcje
  function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText !== '') {
      const newTask = {
        id: Date.now().toString(),
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString()
      };
      
      tasks.unshift(newTask); // Dodawanie na początek listy
      saveTasksToLocalStorage();
      renderTasks();
      updateTaskCount();
      taskInput.value = '';
      taskInput.focus();
    }
  }
  
  function toggleTaskStatus(taskId) {
    tasks = tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    
    saveTasksToLocalStorage();
    renderTasks();
    updateTaskCount();
  }
  
  function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasksToLocalStorage();
    renderTasks();
    updateTaskCount();
  }
  
  function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    saveTasksToLocalStorage();
    renderTasks();
    updateTaskCount();
  }
  
  function renderTasks() {
    let filteredTasks = tasks;
    
    if (currentFilter === 'active') {
      filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
      filteredTasks = tasks.filter(task => task.completed);
    }
    
    taskList.innerHTML = '';
    
    if (filteredTasks.length === 0) {
      noTasksEl.style.display = 'block';
    } else {
      noTasksEl.style.display = 'none';
      
      filteredTasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskItem.dataset.id = task.id;
        
        taskItem.innerHTML = `
          <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} aria-label="Oznacz zadanie jako ${task.completed ? 'nieukończone' : 'ukończone'}">
          <span class="task-text">${escapeHTML(task.text)}</span>
          <button class="delete-task" aria-label="Usuń zadanie">
            <i class="fas fa-times"></i>
          </button>
        `;
        
        taskList.appendChild(taskItem);
      });
    }
  }
  
  function updateTaskCount() {
    const activeTasksCount = tasks.filter(task => !task.completed).length;
    const taskText = activeTasksCount === 1 ? 'zadanie pozostało' : 'zadań pozostało';
    taskCount.textContent = `${activeTasksCount} ${taskText}`;
    clearCompletedBtn.style.display = tasks.some(task => task.completed) ? 'block' : 'none';
  }
  
  function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  
  function initTheme() {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('darkMode');
    
    // Jeśli mamy zapisany motyw, używamy go
    if (savedTheme !== null) {
      const isDarkMode = savedTheme === 'true';
      setTheme(isDarkMode);
    } 
    // W przeciwnym razie używamy preferencji systemowych
    else if (prefersDarkScheme.matches) {
      setTheme(true);
    }
    
    // Nasłuchujemy zmian preferencji systemowych
    prefersDarkScheme.addEventListener('change', (e) => {
      // Aktualizujemy tylko jeśli użytkownik nie ustawił konkretnego motywu
      if (localStorage.getItem('darkMode') === null) {
        setTheme(e.matches);
      }
    });
  }
  
  function toggleTheme() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    setTheme(!isDarkMode);
    localStorage.setItem('darkMode', (!isDarkMode).toString());
  }
  
  function setTheme(isDarkMode) {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      themeIcon.className = 'fas fa-sun';
    } else {
      document.body.classList.remove('dark-mode');
      themeIcon.className = 'fas fa-moon';
    }
  }
  
  // Funkcja pomocnicza do zabezpieczania przed XSS
  function escapeHTML(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
});