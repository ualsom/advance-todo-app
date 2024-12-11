document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('taskForm');
  const taskList = document.getElementById('taskList');
  const searchTasks = document.getElementById('searchTasks');
  const sortTasks = document.getElementById('sortTasks');
  const toggleTheme = document.getElementById('toggleTheme');
  const taskProgress = document.getElementById('taskProgress');
  const progressText = document.getElementById('progressText');

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }

  
  renderTasks(tasks);
  updateProgress();

  
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('taskName').value.trim();
    const dueDate = document.getElementById('taskDueDate').value;
    const priority = document.getElementById('taskPriority').value;

    if (!name || !dueDate) {
      alert('Please provide both a task name and a due date.');
      return;
    }

    const task = { id: Date.now(), name, dueDate, priority, completed: false };
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    renderTasks(tasks);
    updateProgress();
    taskForm.reset();
  });

  
  function renderTasks(taskArray) {
    taskList.innerHTML = '';
    taskArray.forEach((task) => addTaskToDOM(task));
  }

  
  function addTaskToDOM(task) {
    const li = document.createElement('li');
    li.classList.add(task.priority);
    li.dataset.id = task.id;

    const currentDate = new Date().toISOString().split('T')[0];
    if (new Date(task.dueDate) < new Date(currentDate)) {
      li.style.backgroundColor = '#ffcccc'; // Mark overdue task with red background
    }

    li.innerHTML = `
      <span class="task-details">${task.name} - ${task.dueDate} (${task.priority.toUpperCase()})</span>
      <div class="task-actions">
        <button class="editBtn">Edit</button>
        <button class="completeBtn">${task.completed ? 'Unmark' : 'Complete'}</button>
        <button class="deleteBtn">Delete</button>
      </div>
    `;

    
    li.querySelector('.editBtn').addEventListener('click', () => {
      const taskIndex = tasks.findIndex((t) => t.id === task.id);
      const updatedName = prompt('Edit Task Name:', tasks[taskIndex].name);
      const updatedDueDate = prompt('Edit Due Date (YYYY-MM-DD):', tasks[taskIndex].dueDate);

      if (updatedName && updatedDueDate) {
        tasks[taskIndex].name = updatedName.trim();
        tasks[taskIndex].dueDate = updatedDueDate;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks(tasks);
        updateProgress();
      }
    });

  
    li.querySelector('.completeBtn').addEventListener('click', () => {
      const taskIndex = tasks.findIndex((t) => t.id === task.id);
      tasks[taskIndex].completed = !tasks[taskIndex].completed;
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks(tasks);
      updateProgress();
    });

    
    li.querySelector('.deleteBtn').addEventListener('click', () => {
      tasks = tasks.filter((t) => t.id !== task.id);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks(tasks);
      updateProgress();
    });

    taskList.appendChild(li);
  }

  
  sortTasks.addEventListener('change', (e) => {
    const sortBy = e.target.value;
    let sortedTasks = [...tasks];

    if (sortBy === 'dueDate') {
      sortedTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (sortBy === 'priority') {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      sortedTasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else if (sortBy === 'alphabetical') {
      sortedTasks.sort((a, b) => a.name.localeCompare(b.name));
    }

    renderTasks(sortedTasks);
  });

  
  searchTasks.addEventListener('input', () => {
    const query = searchTasks.value.toLowerCase();
    const filteredTasks = tasks.filter((task) =>
      task.name.toLowerCase().includes(query)
    );
    renderTasks(filteredTasks);
  });

  
  function updateProgress() {
    const completedTasks = tasks.filter((task) => task.completed).length;
    const totalTasks = tasks.length;
    const progress = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

    taskProgress.value = progress;
    progressText.innerText = `${progress}% Completed`;
  }


  toggleTheme.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
  });
});
