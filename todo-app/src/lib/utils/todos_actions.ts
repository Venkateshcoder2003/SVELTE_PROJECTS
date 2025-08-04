// services/todosActions.ts - Todos business logic and actions
import { Logger } from "./logger";
import { toast } from "svelte-sonner";
import type { Todo } from "../types/models";
import type { Unsubscribe } from "firebase/firestore";
import {
  setTodosLoading,
  setTodosError,
  setTodosContent,
  resetTodosState,
} from "../utils/todos_lce";
import {subscribeToTodos} from "../utils/database_routes";
import { addTodoToDb } from "$lib/services/add_todo_to_db";
import { deleteTodoFromDb } from "$lib/services/delete_todo_from_db";
import { deleteAllTodosFromDb } from "$lib/services/delete_all_todos_from_db";
import { toggleTodoInDb } from "$lib/services/toggle_todo_in_db";
import { updateTodoInDb } from "$lib/services/update_todo_in_db";

// Create Logger instance
const log = Logger.getInstance();

// Hold the subscription function
let unsubscribe: Unsubscribe | null = null;

// Subscribe to user's todos
export const subscribeTodos = (userId: string): void => {
  setTodosLoading(true);
  setTodosError(null);

  unsubscribe = subscribeToTodos(
    userId,
    (todos) => {
      setTodosContent(todos);
      setTodosLoading(false);
    },
    (error) => {
      log.error("todos", "Error fetching todos:", error);
      toast.error("Error in fetching your Todos");
      setTodosError(error.message);
      setTodosLoading(false);
    }
  );
};

// Unsubscribe from todos
export const unsubscribeTodos = (): void => {
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }
  resetTodosState();
};

export const addTodo = async (
  title: string,
  text: string,
  userId: string,
  imageFile?: File | null,
  videoFile?: File | null
): Promise<boolean> => {
  return await addTodoToDb(title, text, userId, imageFile, videoFile);
};

// Toggle todo completion
export const toggleTodo = async (todoId: string): Promise<boolean> => {
  return await toggleTodoInDb(todoId);
};

// Delete single todo - using the imported service
export const deleteTodo = async (todoId: string): Promise<boolean> => {
  return await deleteTodoFromDb(todoId);
};

// Delete all todos - using the imported service
export const deleteAllTodos = async (userId: string): Promise<boolean> => {
  return await deleteAllTodosFromDb(userId);
};

// Update todo - using the imported service
export const updateTodo = async (
  todoId: string,
  updates: {
    newTitle?: string;
    newText?: string;
    imageFile?: File;
    videoFile?: File;
  },
  originalTodo: Todo
): Promise<boolean> => {
  return await updateTodoInDb(todoId, updates, originalTodo);
};