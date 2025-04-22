document.addEventListener('DOMContentLoaded', () => {
  // Selektory elementów
  const taskInput = document.getElementById('taskInput');
  const addTaskBtn = document.getElementById('addTask');
  const taskList = document.getElementById('taskList');
  const taskCount = document.getElementById('taskCount');
  const clearCompletedBtn = document.getElementById('clearCompleted');
  const filterBtns = document.querySelectorAll('.filter');
  
  // Stan aplikacji
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  let currentFilter = 'all';
  
  // Inicjalizacja aplikacji
  renderTasks();
  updateTaskCount();
  
  // Obsługa wydarzeń
  addTaskBtn.addEventListener('click', addTask);
  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });
  
  taskList.addEventListener('click', (e) => {
    const taskId = e.target.closest('.task-item')?.dataset.id;
    
    if (e.target.classList.contains('task-checkbox')) {
      toggleTaskStatus(taskId);
    } else if (e.target.classList.contains('delete-task')) {
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
      
      tasks.push(newTask);
      saveToLocalStorage();
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
    
    saveToLocalStorage();
    renderTasks();
    updateTaskCount();
  }
  
  function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveToLocalStorage();
    renderTasks();
    updateTaskCount();
  }
  
  function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    saveToLocalStorage();
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
    
    filteredTasks.forEach(task => {
      const taskItem = document.createElement('li');
      taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
      taskItem.dataset.id = task.id;
      
      taskItem.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
        <span class="task-text">${task.text}</span>
        <button class="delete-task">&times;</button>
      `;
      
      taskList.appendChild(taskItem);
    });
  }
  
  function updateTaskCount() {
    const activeTasksCount = tasks.filter(task => !task.completed).length;
    taskCount.textContent = `${activeTasksCount} zadań pozostało`;
  }
  
  function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
});