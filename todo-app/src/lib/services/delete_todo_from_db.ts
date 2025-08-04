// services/deleteTodoFromDb.ts - Delete todo service
import { Logger } from "../utils/logger";
import { toast } from "svelte-sonner";
import type { Todo } from "../types/models";
import { setTodosError, todosStore } from "../utils/todos_lce";
import { deleteFile, deleteTodoFromFirestore } from "../utils/database_routes";

const log = Logger.getInstance();

export const deleteTodoFromDb = async (todoId: string): Promise<boolean> => {
  try {
    setTodosError(null);

    // Get todo to delete
    let todoToDelete: Todo | undefined;
    todosStore.subscribe((todos) => {
      todoToDelete = todos.find((t) => t.id === todoId);
    })();

    if (todoToDelete) {
      // Delete associated files
      if (todoToDelete.imageUrl) {
        await deleteFile(todoToDelete.imageUrl).catch((err) =>
          log.error("todos", "Error deleting image:", err)
        );
      }
      if (todoToDelete.videoUrl) {
        await deleteFile(todoToDelete.videoUrl).catch((err) =>
          log.error("todos", "Error deleting video:", err)
        );
      }
    }

    // Delete from Firestore
    await deleteTodoFromFirestore(todoId);

    log.info("todos", `Todo "${todoToDelete?.title}" deleted Successfully`);
    toast.success(`Todo "${todoToDelete?.title}" deleted Successfully`);
    return true;
  } catch (error: any) {
    log.error("todos", error.message, error);
    toast.error("Todo Deletion Failed");
    setTodosError(error.message);
    return false;
  }
};
