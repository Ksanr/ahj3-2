// src/js/render.js

// Создание элемента пустого сообщения
function createEmptyMessage(text) {
  const div = document.createElement('div');
  div.className = 'empty-message';
  div.textContent = text;
  return div;
}

// Создание DOM-элемента задачи
export function createTaskElement(task, onTogglePin) {
  const taskDiv = document.createElement('div');
  taskDiv.className = 'task-item';
  taskDiv.setAttribute('data-task-id', task.id);

  const nameSpan = document.createElement('span');
  nameSpan.className = 'task-name';
  nameSpan.textContent = task.name;

  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'pin-toggle';

  if (task.isPinned) {
    toggleBtn.innerHTML = `📍`;
    toggleBtn.style.color = '#f97316';
  } else {
    toggleBtn.innerHTML = `📌`;
    toggleBtn.style.color = '#94a3b8';
  }
  toggleBtn.title = task.isPinned ? 'Открепить' : 'Закрепить';

  toggleBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    onTogglePin(task.id);
  });

  taskDiv.append(nameSpan, toggleBtn);
  return taskDiv;
}

// Отрисовка блока закреплённых задач
export function renderPinnedSection(tasks, container, onTogglePin) {
  const pinnedTasks = tasks.filter(task => task.isPinned === true);
  container.innerHTML = '';

  if (pinnedTasks.length === 0) {
    container.append(createEmptyMessage('📌 Нет закреплённых задач'));
    return;
  }

  for (const task of pinnedTasks) {
    container.append(createTaskElement(task, onTogglePin));
  }
}

// Отрисовка блока всех задач (с фильтрацией)
export function renderAllTasksSection(tasks, filterText, container, onTogglePin) {
  // 1. Берём все незакреплённые задачи
  let visibleTasks = tasks.filter(task => task.isPinned === false);

  // 2. Применяем фильтр (если строка не пустая)
  const filterValue = filterText.trim();
  const hasFilter = filterValue !== '';

  if (hasFilter) {
    const lowerFilter = filterValue.toLowerCase();
    visibleTasks = visibleTasks.filter(task =>
      task.name.toLowerCase().startsWith(lowerFilter)
    );
  }

  // 3. Очищаем контейнер
  container.innerHTML = '';

  // 4. Если после фильтрации ничего нет — показываем соответствующее сообщение
  if (visibleTasks.length === 0) {
    let message;

    // Проверяем, есть ли вообще незакреплённые задачи
    const hasAnyUnpinned = tasks.some(task => task.isPinned === false);

    if (hasFilter) {
      // Если применён фильтр, но ничего не найдено
      message = '🔍 Задачи не найдены';
    } else if (!hasAnyUnpinned) {
      // Если нет незакреплённых задач (все задачи закреплены)
      message = '✨ Нет задач';
    } else {
      // Если незакреплённые задачи есть, но они не подходят под фильтр
      // (этот случай не должен сюда попадать, но на всякий случай)
      message = 'Нет подходящих задач';
    }

    container.append(createEmptyMessage(message));
    return;
  }

  // 5. Отрисовываем все подходящие задачи
  for (const task of visibleTasks) {
    container.append(createTaskElement(task, onTogglePin));
  }
}
