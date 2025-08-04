// services/updateTodoInDb.ts - Update todo service
import { Logger } from "../utils/logger";
import { toast } from "svelte-sonner";
import type { Todo } from "../types/models";
import { setTodosError } from "../utils/todos_lce";
import {
  deleteFile,
  uploadFile,
  updateTodoInFirestore,
} from "../utils/database_routes";

const log = Logger.getInstance();

export const updateTodoInDb = async (
  todoId: string,
  updates: {
    newTitle?: string;
    newText?: string;
    imageFile?: File;
    videoFile?: File;
  },
  originalTodo: Todo
): Promise<boolean> => {
  try {
    setTodosError(null);

    const { newTitle, newText, imageFile, videoFile } = updates;
    const dataToUpdate: any = {};
    const userId = originalTodo.userId;

    // Validate updates
    if (newTitle !== undefined) {
      if (newTitle.trim() === "") {
        setTodosError("Todo title cannot be empty");
        return false;
      }
      if (newTitle.length > 10) {
        setTodosError("Todo title cannot be longer than 10 characters");
        return false;
      }
      dataToUpdate.title = newTitle.trim();
    }

    if (newText !== undefined) {
      if (newText.length > 250) {
        setTodosError("Todo description cannot be longer than 250 characters");
        return false;
      }
      dataToUpdate.text = newText.trim();
    }

    // Handle file updates
    if (imageFile) {
      if (originalTodo.imageUrl) {
        await deleteFile(originalTodo.imageUrl).catch((err) =>
          log.error("todos", "Error deleting old image:", err)
        );
      }
      dataToUpdate.imageUrl = await uploadFile(imageFile, userId, "image");
    }

    if (videoFile) {
      if (originalTodo.videoUrl) {
        await deleteFile(originalTodo.videoUrl).catch((err) =>
          log.error("todos", "Error deleting old video:", err)
        );
      }
      dataToUpdate.videoUrl = await uploadFile(videoFile, userId, "video");
    }

    // Update in Firestore if there are changes
    if (Object.keys(dataToUpdate).length > 0) {
      await updateTodoInFirestore(todoId, dataToUpdate);
    }

    log.info("todos", "Todo Update Successfully");
    toast.success("Todo Updated Successfully");
    return true;
  } catch (error: any) {
    log.error("todos", error.message, error);
    toast.error("Failed to update todo");
    setTodosError(error.message);
    return false;
  }
};
