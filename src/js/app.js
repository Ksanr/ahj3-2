// Главный модуль приложения
import { Task } from './Task';
import { renderPinnedSection, renderAllTasksSection } from './render';
import '../styles/main.css';

// Глобальное состояние
let tasks = [];
let currentFilter = '';

// DOM-элементы с проверкой существования
const taskInput = document.getElementById('taskInput');
const errorContainer = document.getElementById('inputError');
const pinnedContainer = document.getElementById('pinnedList');
const allTasksContainer = document.getElementById('allTasksList');

// Проверка существования DOM-элементов
if (!taskInput || !errorContainer || !pinnedContainer || !allTasksContainer) {
  throw new Error('Критические DOM-элементы не найдены');
}

// Функции для работы с ошибками
function showError(message) {
  errorContainer.innerHTML = `<span>⚠️ ${message}</span>`;
}

function clearError() {
  errorContainer.innerHTML = '';
}

// Переключение статуса закрепления
function togglePinStatus(taskId) {
  const targetTask = tasks.find(t => t.id === taskId);
  if (!targetTask) return;

  targetTask.isPinned = !targetTask.isPinned;

  renderPinnedSection(tasks, pinnedContainer, togglePinStatus);
  renderAllTasksSection(tasks, currentFilter, allTasksContainer, togglePinStatus);
}

// Добавление новой задачи
function addNewTask(rawTaskName) {
  const trimmedName = rawTaskName.trim();

  if (trimmedName === '') {
    showError('Ошибка: нельзя добавить пустую задачу. Введите текст.');
    return false;
  }

  // Проверка на дубликат
  const isDuplicate = tasks.some(task => task.name.toLowerCase() === trimmedName.toLowerCase());
  if (isDuplicate) {
    showError('Такая задача уже существует!');
    return false;
  }

  clearError();
  const newTask = Task.create(trimmedName, false);
  tasks.push(newTask);

  currentFilter = ''; // сброс фильтра
  taskInput.value = ''; // очистка поля

  renderPinnedSection(tasks, pinnedContainer, togglePinStatus);
  renderAllTasksSection(tasks, currentFilter, allTasksContainer, togglePinStatus);
  return true;
}

// Обработчики событий
function onEnterKey(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    addNewTask(taskInput.value);
  }
}

function handleFilterInput(event) {
  currentFilter = event.target.value;
  renderAllTasksSection(tasks, currentFilter, allTasksContainer, togglePinStatus);
  if (errorContainer.innerHTML !== '') {
    clearError();
  }
}

// Инициализация демо-данных
function initDemoTasks() {
  tasks = [];
  const demoData = [
    { name: 'Собрать проект через Webpack', pinned: true },
    { name: 'Настроить GitHub Actions CI/CD', pinned: false },
    { name: 'Добавить бейджик сборки в README', pinned: true },
    { name: 'Реализовать фильтрацию задач', pinned: false },
    { name: 'Написать понятную документацию', pinned: false },
    { name: 'Задеплоить на GitHub Pages', pinned: false },
  ];

  for (let i = 0; i < demoData.length; i++) {
    const item = demoData[i];
    const taskId = Date.now() + i * 1000 + Math.random() * 5000;
    const newTask = new Task(taskId, item.name, item.pinned);
    tasks.push(newTask);
  }

  currentFilter = '';
  if (taskInput) taskInput.value = '';
  clearError();
}

// Подписка на события
function bindEvents() {
  taskInput.addEventListener('keydown', onEnterKey);
  taskInput.addEventListener('input', handleFilterInput);
  taskInput.addEventListener('input', () => {
    if (errorContainer.innerHTML !== '') clearError();
  });
}

// Запуск приложения
function startApp() {
  bindEvents();
  initDemoTasks();
  renderPinnedSection(tasks, pinnedContainer, togglePinStatus);
  renderAllTasksSection(tasks, currentFilter, allTasksContainer, togglePinStatus);
}

startApp();
