import { Task } from '../src/js/Task';

describe('Класс Task', () => {
  test('создание задачи с корректными параметрами', () => {
    const task = new Task(123, 'Тестовая задача', false);
    expect(task.id).toBe(123);
    expect(task.name).toBe('Тестовая задача');
    expect(task.isPinned).toBe(false);
  });

  test('создание задачи с обрезанием пробелов в имени', () => {
    const task = new Task(456, '  Задача с пробелами  ', true);
    expect(task.name).toBe('Задача с пробелами');
    expect(task.isPinned).toBe(true);
  });

  test('статический метод create создаёт задачу с уникальным id', () => {
    const task1 = Task.create('Первая задача');
    const task2 = Task.create('Вторая задача');

    expect(task1.id).not.toBe(task2.id);
    expect(task1.name).toBe('Первая задача');
    expect(task1.isPinned).toBe(false);
  });

  test('статический метод create с параметром isPinned', () => {
    const task = Task.create('Закреплённая задача', true);
    expect(task.isPinned).toBe(true);
  });

  test('id задачи — число', () => {
    const task = Task.create('Любая задача');
    expect(typeof task.id).toBe('number');
  });
});
