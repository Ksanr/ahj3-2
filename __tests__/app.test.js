/**
 * Интеграционные тесты для основной логики приложения
 * Здесь тестируется глобальное состояние и взаимодействие
 */

import { Task } from '../src/js/Task';

describe('Интеграционные тесты приложения', () => {
  // Создаём фиктивное состояние, имитирующее работу приложения
  let tasks = [];

  beforeEach(() => {
    tasks = [];
  });

  // Функция для переключения статуса закрепления
  function togglePinStatus(taskId) {
    const targetTask = tasks.find(t => t.id === taskId);
    if (targetTask) {
      targetTask.isPinned = !targetTask.isPinned;
    }
    return tasks;
  }

  // Функция для добавления задачи
  function addNewTask(taskName) {
    const trimmedName = taskName.trim();
    if (trimmedName === '') {
      return { success: false, error: 'empty' };
    }
    const newTask = Task.create(trimmedName, false);
    tasks.push(newTask);
    return { success: true, task: newTask };
  }

  // Функция фильтрации
  function filterTasks(filterText) {
    const lowerFilter = filterText.trim().toLowerCase();
    if (lowerFilter === '') {
      return tasks.filter(t => !t.isPinned);
    }
    return tasks.filter(t => !t.isPinned && t.name.toLowerCase().startsWith(lowerFilter));
  }

  test('добавление задачи — успешный сценарий', () => {
    const result = addNewTask('Новая задача');
    expect(result.success).toBe(true);
    expect(tasks.length).toBe(1);
    expect(tasks[0].name).toBe('Новая задача');
    expect(tasks[0].isPinned).toBe(false);
  });

  test('добавление пустой задачи — ошибка', () => {
    const result = addNewTask('   ');
    expect(result.success).toBe(false);
    expect(result.error).toBe('empty');
    expect(tasks.length).toBe(0);
  });

  test('переключение закрепления задачи', () => {
    const task = Task.create('Тестовая задача', false);
    tasks.push(task);

    expect(tasks[0].isPinned).toBe(false);

    togglePinStatus(task.id);
    expect(tasks[0].isPinned).toBe(true);

    togglePinStatus(task.id);
    expect(tasks[0].isPinned).toBe(false);
  });

  test('фильтрация задач по началу строки', () => {
    tasks.push(Task.create('Дизайн проект', false));
    tasks.push(Task.create('Документация API', false));
    tasks.push(Task.create('Релиз версии', false));
    tasks.push(Task.create('дизайн интерфейса', false));

    const filtered = filterTasks('дизайн');
    expect(filtered.length).toBe(2);
    expect(filtered[0].name).toBe('Дизайн проект');
    expect(filtered[1].name).toBe('дизайн интерфейса');
  });

  test('закреплённые задачи не проходят фильтрацию', () => {
    tasks.push(Task.create('Важная задача', true));
    tasks.push(Task.create('Обычная задача', false));

    const filtered = filterTasks('важная');
    expect(filtered.length).toBe(0);
  });

  test('при пустом фильтре показываются все незакреплённые задачи', () => {
    tasks.push(Task.create('Задача 1', false));
    tasks.push(Task.create('Задача 2', true));
    tasks.push(Task.create('Задача 3', false));

    const filtered = filterTasks('');
    expect(filtered.length).toBe(2);
    expect(filtered[0].name).toBe('Задача 1');
    expect(filtered[1].name).toBe('Задача 3');
  });

  test('перемещение задачи из закреплённых в общий список при откреплении', () => {
    const task = Task.create('Перемещаемая задача', true);
    tasks.push(task);

    // Проверяем, что задача в закреплённых
    let pinnedTasks = tasks.filter(t => t.isPinned);
    expect(pinnedTasks.length).toBe(1);
    expect(pinnedTasks[0].name).toBe('Перемещаемая задача');

    // Открепляем
    togglePinStatus(task.id);

    // Проверяем, что задача больше не закреплена
    pinnedTasks = tasks.filter(t => t.isPinned);
    expect(pinnedTasks.length).toBe(0);

    // Проверяем, что задача теперь в общем списке
    const allTasks = tasks.filter(t => !t.isPinned);
    expect(allTasks.length).toBe(1);
    expect(allTasks[0].name).toBe('Перемещаемая задача');
  });
});
