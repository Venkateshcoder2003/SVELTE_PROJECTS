// services/toggleTodoInDb.ts - Toggle todo completion service
import { Logger } from "../utils/logger";
import { toast } from "svelte-sonner";
import type { Todo } from "../types/models";
import { setTodosError, todosStore } from "../utils/todos_lce";
import { updateTodoInFirestore } from "../utils/database_routes";

const log = Logger.getInstance();

export const toggleTodoInDb = async (todoId: string): Promise<boolean> => {
  try {
    setTodosError(null);

    //Get current todos to find the one to toggle
    let currentTodos: Todo[] = [];
    todosStore.subscribe((todos) => (currentTodos = todos))();

    //Find the todo to toggle
    const todoToToggle = currentTodos.find((todo) => todo.id === todoId);
    if (!todoToToggle) {
      setTodosError("Todo not found");
      return false;
    }


    // Update in Firestore
    await updateTodoInFirestore(todoId, {
      completed: !todoToToggle.completed,
    });

    const successMessage = todoToToggle.completed
      ? "Todo marked as pending."
      : "Todo completed!";
    log.info("todos", successMessage);
    toast.success(successMessage);
    return true;
  } catch (error: any) {
    log.error("todos", error.message, error);
    setTodosError(error.message);
    return false;
  }
};
