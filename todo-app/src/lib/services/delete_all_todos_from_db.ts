// services/deleteAllTodosFromDb.ts - Delete all todos service
import { Logger } from "../utils/logger";
import { toast } from "svelte-sonner";
import { setTodosError, setTodosLoading } from "../utils/todos_lce";
import {
  deleteFile,
  getAllUserTodos,
  batchDeleteTodos,
} from "../utils/database_routes";

const log = Logger.getInstance();

export const deleteAllTodosFromDb = async (
  userId: string
): Promise<boolean> => {
  try {
    setTodosError(null);
    setTodosLoading(true);

    const querySnapshot = await getAllUserTodos(userId);

    if (querySnapshot.empty) {
      log.info("todos", "No todos to delete");
      toast.success("No Todos to delete");
      setTodosLoading(false);
      return true;
    }

    const deletePromises: Promise<void>[] = [];
    const todoRefs: any[] = [];

    // Process each todo for deletion
    querySnapshot.forEach((docSnapshot) => {
      const todoData = docSnapshot.data();

      // Delete associated files
      if (todoData.imageUrl) {
        deletePromises.push(
          deleteFile(todoData.imageUrl).catch((err) =>
            log.error("todos", "Error deleting image:", err)
          )
        );
      }
      if (todoData.videoUrl) {
        deletePromises.push(
          deleteFile(todoData.videoUrl).catch((err) =>
            log.error("todos", "Error deleting video:", err)
          )
        );
      }

      todoRefs.push(docSnapshot.ref);
    });

    // Wait for file deletions and batch delete documents
    await Promise.all(deletePromises);
    await batchDeleteTodos(todoRefs);

    log.info("todos", `Successfully deleted All ${querySnapshot.size} todos`);
    toast.success(`Successfully deleted All ${querySnapshot.size} todos`);
    setTodosLoading(false);
    return true;
  } catch (error: any) {
    log.error("todos", error.message, error);
    toast.error("Failed to delete Todos");
    setTodosError(error.message);
    setTodosLoading(false);
    return false;
  }
};
