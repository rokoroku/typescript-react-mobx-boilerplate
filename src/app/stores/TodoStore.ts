import { action, computed, makeAutoObservable, observable } from 'mobx';
import { TodoModel } from 'app/models';
import { makePersistable } from 'mobx-persist-store';

export class TodoStore {

  @observable public todos: TodoModel[] = [];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    makePersistable(this, {
      name: 'TodoStore',
      properties: ['todos'],
      expireIn: 15 * 60 * 1000, // 15 minutes so 900.000 milliseconds
      removeOnExpiration: true,
      storage: window.localStorage
    }, { delay: 200, fireImmediately: true });
  }

  @computed
  get activeTodos() {
    return this.todos.filter((todo) => !todo.completed);
  }

  @computed
  get completedTodos() {
    return this.todos.filter((todo) => todo.completed);
  }

  @action
  addTodo = (item: Partial<TodoModel>): void => {
    console.log(item);
    this.todos.push(new TodoModel(item.text, item.completed));
  };

  @action
  editTodo = (id: number, data: Partial<TodoModel>): void => {
    this.todos = this.todos.map((todo) => {
      if (todo.id === id) {
        if (typeof data.completed == 'boolean') {
          todo.completed = data.completed;
        }
        if (typeof data.text == 'string') {
          todo.text = data.text;
        }
      }
      return todo;
    });
  };

  @action
  deleteTodo = (id: number): void => {
    this.todos = this.todos.filter((todo) => todo.id !== id);
  };

  @action
  completeAll = (): void => {
    this.todos = this.todos.map((todo) => ({ ...todo, completed: true }));
  };

  @action
  clearCompleted = (): void => {
    this.todos = this.todos.filter((todo) => !todo.completed);
  };
}
