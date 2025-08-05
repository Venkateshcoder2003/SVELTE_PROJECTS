import { writable } from "svelte/store";
import type { Todo } from "../schema/todo_schema";

// Initial todos state
const initialState = {
  todos: [] as Todo[],
  loading: false,
  error: null as string | null,
};

// Create writable stores for todos
export const todosStore = writable<Todo[]>([]);
export const todosLoading = writable<boolean>(false);
export const todosError = writable<string | null>(null);

// LCE Store action functions
export const setTodosLoading = (loading: boolean) => {
  todosLoading.set(loading);
};

export const setTodosError = (error: string | null) => {
  todosError.set(error);
};

export const setTodosContent = (todos: Todo[]) => {
  todosStore.set(todos);
};

// Reset all todos state
export const resetTodosState = () => {
  todosStore.set([]);
  todosLoading.set(false);
  todosError.set(null);
};

// Duplicate tracking (moved from main file)
const existingTodoTitles = new Set<string>();

todosStore.subscribe((todos) => {
  existingTodoTitles.clear();
  todos.forEach((todo) => existingTodoTitles.add(todo.title.toLowerCase()));
});

export const isDuplicateTodo = (title: string): boolean => {
  return existingTodoTitles.has(title.trim().toLowerCase());
};
