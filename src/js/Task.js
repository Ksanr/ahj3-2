// Класс Task — модель данных задачи
export class Task {
  constructor(id, name, isPinned = false) {
    this.id = id;          // уникальный идентификатор
    this.name = name.trim();
    this.isPinned = isPinned;
  }

  // Статический фабричный метод для создания новой задачи
  static create(name, isPinned = false) {
    const newId = Date.now() + Math.random() * 10000;
    return new Task(newId, name, isPinned);
  }
}
