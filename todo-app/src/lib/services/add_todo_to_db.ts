// services/addTodoToDb.ts - Add todo service
import { Logger } from "../utils/logger";
import { toast } from "svelte-sonner";
import { setTodosError, isDuplicateTodo } from "../utils/todos_lce";
import { uploadFile, addTodoToFirestore } from "../utils/database_routes";

const log = Logger.getInstance();

export const addTodoToDb = async (
  title: string,
  text: string,
  userId: string,
  imageFile?: File | null,
  videoFile?: File | null
): Promise<boolean> => {
  try {
    setTodosError(null);

    // Validation
    if (title.length > 10) {
      setTodosError("Todo title cannot be longer than 10 characters");
      return false;
    }
    if (text.length > 250) {
      setTodosError("Todo description cannot be longer than 250 characters");
      return false;
    }

    // Check for duplicates
    if (isDuplicateTodo(title)) {
      setTodosError("A todo with this title already exists.");
      log.error("todos", "A todo with this title already exists.");
      return false;
    }

    // Create base todo data
    const newTodoData: any = {
      title: title.trim(),
      text: text.trim(),
      completed: false,
      createdAt: new Date(),
      userId: userId,
    };

    // Upload files if provided
    if (imageFile) {
      newTodoData.imageUrl = await uploadFile(imageFile, userId, "image");
    }
    if (videoFile) {
      newTodoData.videoUrl = await uploadFile(videoFile, userId, "video");
    }

    // Add to Firestore
    await addTodoToFirestore(newTodoData);

    log.info("todos", `Todo "${newTodoData.title}" added successfully!`);
    toast.success(`Todo "${newTodoData.title}" added successfully!`);
    return true;
  } catch (error: any) {
    log.error("todos", error.message, error);
    toast.error("Failed to add Todo");
    setTodosError(error.message);
    return false;
  }
};
