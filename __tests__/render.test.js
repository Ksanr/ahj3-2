const { createTaskElement, renderPinnedSection, renderAllTasksSection } = require('../src/js/render');
const { Task } = require('../src/js/Task');

describe('Функции отрисовки', () => {
  let mockContainer;
  let mockOnTogglePin;

  beforeEach(() => {
    mockContainer = document.createElement('div');
    mockOnTogglePin = jest.fn();
  });

  describe('createTaskElement', () => {
    test('создаёт элемент задачи с правильной структурой', () => {
      const task = new Task(1, 'Тестовая задача', false);
      const element = createTaskElement(task, mockOnTogglePin);
      
      expect(element.classList.contains('task-item')).toBe(true);
      expect(element.querySelector('.task-name').textContent).toBe('Тестовая задача');
      expect(element.querySelector('.pin-toggle')).toBeTruthy();
    });

    test('для закреплённой задачи отображается иконка 📍', () => {
      const task = new Task(2, 'Закреплённая задача', true);
      const element = createTaskElement(task, mockOnTogglePin);
      const toggleBtn = element.querySelector('.pin-toggle');
      
      expect(toggleBtn.innerHTML).toContain('📍');
    });

    test('для незакреплённой задачи отображается иконка 📌', () => {
      const task = new Task(3, 'Обычная задача', false);
      const element = createTaskElement(task, mockOnTogglePin);
      const toggleBtn = element.querySelector('.pin-toggle');
      
      expect(toggleBtn.innerHTML).toContain('📌');
    });

    test('при клике на кнопку вызывается колбэк с id задачи', () => {
      const task = new Task(42, 'Задача для клика', false);
      const element = createTaskElement(task, mockOnTogglePin);
      const toggleBtn = element.querySelector('.pin-toggle');
      
      toggleBtn.click();
      expect(mockOnTogglePin).toHaveBeenCalledWith(42);
      expect(mockOnTogglePin).toHaveBeenCalledTimes(1);
    });
  });

  describe('renderPinnedSection', () => {
    test('при отсутствии закреплённых задач показывает сообщение', () => {
      const tasks = [
        new Task(1, 'Задача 1', false),
        new Task(2, 'Задача 2', false)
      ];
      
      renderPinnedSection(tasks, mockContainer, mockOnTogglePin);
      
      expect(mockContainer.innerHTML).toContain('Нет закреплённых задач');
      expect(mockContainer.querySelectorAll('.task-item').length).toBe(0);
    });

    test('отображает только закреплённые задачи', () => {
      const tasks = [
        new Task(1, 'Закреплённая 1', true),
        new Task(2, 'Обычная задача', false),
        new Task(3, 'Закреплённая 2', true)
      ];
      
      renderPinnedSection(tasks, mockContainer, mockOnTogglePin);
      
      const taskItems = mockContainer.querySelectorAll('.task-item');
      expect(taskItems.length).toBe(2);
      expect(taskItems[0].querySelector('.task-name').textContent).toBe('Закреплённая 1');
      expect(taskItems[1].querySelector('.task-name').textContent).toBe('Закреплённая 2');
    });
  });

  describe('renderAllTasksSection', () => {
    test('отображает все незакреплённые задачи без фильтра', () => {
      const tasks = [
        new Task(1, 'Задача A', false),
        new Task(2, 'Задача B', true),
        new Task(3, 'Задача C', false)
      ];
      
      renderAllTasksSection(tasks, '', mockContainer, mockOnTogglePin);
      
      const taskItems = mockContainer.querySelectorAll('.task-item');
      expect(taskItems.length).toBe(2);
      expect(taskItems[0].querySelector('.task-name').textContent).toBe('Задача A');
      expect(taskItems[1].querySelector('.task-name').textContent).toBe('Задача C');
    });

    test('фильтрация по началу строки (без учёта регистра)', () => {
      const tasks = [
        new Task(1, 'Арбуз', false),
        new Task(2, 'Апельсин', false),
        new Task(3, 'Банан', false),
        new Task(4, 'абрикос', false)
      ];
      
      renderAllTasksSection(tasks, 'ар', mockContainer, mockOnTogglePin);
      
      const taskItems = mockContainer.querySelectorAll('.task-item');
      // Ожидаем 1 задачу, так как startsWith('ар') найдёт только 'Арбуз'
      expect(taskItems.length).toBe(1);
      expect(taskItems[0].querySelector('.task-name').textContent).toBe('Арбуз');
    });

    test('фильтрация с учётом разных вариантов написания', () => {
      const tasks = [
        new Task(1, 'Арбуз', false),
        new Task(2, 'абрикос', false),
        new Task(3, 'Абрикос', false)
      ];
      
      renderAllTasksSection(tasks, 'абр', mockContainer, mockOnTogglePin);
      
      const taskItems = mockContainer.querySelectorAll('.task-item');
      // 'абр' должно найти 'абрикос' и 'Абрикос', но не 'Арбуз'
      expect(taskItems.length).toBe(2);
      expect(taskItems[0].querySelector('.task-name').textContent).toBe('абрикос');
      expect(taskItems[1].querySelector('.task-name').textContent).toBe('Абрикос');
    });

    test('при несовпадении фильтра показывает "Задачи не найдены"', () => {
      const tasks = [
        new Task(1, 'Яблоко', false),
        new Task(2, 'Груша', false)
      ];
      
      renderAllTasksSection(tasks, 'апельсин', mockContainer, mockOnTogglePin);
      
      expect(mockContainer.innerHTML).toContain('Задачи не найдены');
      expect(mockContainer.querySelectorAll('.task-item').length).toBe(0);
    });

    test('закреплённые задачи не учитываются в фильтрации', () => {
      const tasks = [
        new Task(1, 'Закреплённая задача', true),
        new Task(2, 'Другая закреплённая', true)
      ];
      
      // Передаём фильтр, который должен найти задачи, но они все закреплены
      renderAllTasksSection(tasks, 'закреплённая', mockContainer, mockOnTogglePin);

      // Ожидаем сообщение о том, что задачи не найдены (потому что есть фильтр)
      expect(mockContainer.innerHTML).toContain('Задачи не найдены');
      expect(mockContainer.querySelectorAll('.task-item').length).toBe(0);
    });

    test('при отсутствии незакреплённых задач и пустом фильтре показывает "Нет задач"', () => {
      const tasks = [
        new Task(1, 'Закреплённая задача', true),
        new Task(2, 'Другая закреплённая', true)
      ];

      // Пустой фильтр
      renderAllTasksSection(tasks, '', mockContainer, mockOnTogglePin);

      // Ожидаем сообщение "Нет задач", так как нет ни одной незакреплённой задачи
      expect(mockContainer.innerHTML).toContain('Нет задач');
      expect(mockContainer.querySelectorAll('.task-item').length).toBe(0);
    });
  });
});
