// services/todosActions.ts - Todos business logic and actions
import { Logger } from "../utils/logger";
import { toast } from "svelte-sonner";
import type { Todo } from "../schema/todo_schema";
import type { Unsubscribe } from "firebase/firestore";
import {
  setTodosLoading,
  setTodosError,
  setTodosContent,
  resetTodosState,
  isDuplicateTodo,
  todosStore,
} from "./database_lce";
import {
  uploadFile,
  addTodoToFirestore,
  deleteTodoFromFirestore,
  getAllUserTodos,
  batchDeleteTodos,
  deleteFile,
  updateTodoInFirestore,
  subscribeToTodos,
} from "./database_api";

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
      log.error("database_actions", "Error fetching todos:", error);
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

// Function to add a new todo to the database
export const addTodo = async (
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
      log.error("database_actions", "A todo with this title already exists.");
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

    log.info("database_actions", `Todo "${newTodoData.title}" added successfully!`);
    toast.success(`Todo "${newTodoData.title}" added successfully!`);
    return true;
  } catch (error: any) {
    log.error("database_actions", error.message, error);
    toast.error("Failed to add Todo");
    setTodosError(error.message);
    return false;
  }
};

// Function to toggle todo in database
export const toggleTodo = async (todoId: string): Promise<boolean> => {
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
    log.info("database_actions", successMessage);
    toast.success(successMessage);
    return true;
  } catch (error: any) {
    log.error("database_actions", error.message, error);
    setTodosError(error.message);
    return false;
  }
};

// Function to delete a single todo form database
export const deleteTodo = async (todoId: string): Promise<boolean> => {
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
          log.error("database_actions", "Error deleting image:", err)
        );
      }
      if (todoToDelete.videoUrl) {
        await deleteFile(todoToDelete.videoUrl).catch((err) =>
          log.error("database_actions", "Error deleting video:", err)
        );
      }
    }

    // Delete from Firestore
    await deleteTodoFromFirestore(todoId);

    log.info("database_actions", `Todo "${todoToDelete?.title}" deleted Successfully`);
    toast.success(`Todo "${todoToDelete?.title}" deleted Successfully`);
    return true;
  } catch (error: any) {
    log.error("database_actions", error.message, error);
    toast.error("Todo Deletion Failed");
    setTodosError(error.message);
    return false;
  }
};

// Delete all todos from database
export const deleteAllTodos = async (userId: string): Promise<boolean> => {
  try {
    setTodosError(null);
    setTodosLoading(true);

    const querySnapshot = await getAllUserTodos(userId);

    if (querySnapshot.empty) {
      log.info("database_actions", "No todos to delete");
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
            log.error("database_actions", "Error deleting image:", err)
          )
        );
      }
      if (todoData.videoUrl) {
        deletePromises.push(
          deleteFile(todoData.videoUrl).catch((err) =>
            log.error("database_actions", "Error deleting video:", err)
          )
        );
      }

      todoRefs.push(docSnapshot.ref);
    });

    // Wait for file deletions and batch delete documents
    await Promise.all(deletePromises);
    await batchDeleteTodos(todoRefs);

    log.info("database_actions", `Successfully deleted All ${querySnapshot.size} todos`);
    toast.success(`Successfully deleted All ${querySnapshot.size} todos`);
    setTodosLoading(false);
    return true;
  } catch (error: any) {
    log.error("database_actions", error.message, error);
    toast.error("Failed to delete Todos");
    setTodosError(error.message);
    setTodosLoading(false);
    return false;
  }
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
  try {
    setTodosError(null);

    const { newTitle, newText, imageFile, videoFile } = updates;
    const dataToUpdate: any = {};
    const userId = originalTodo.userId;

    if (newTitle) {
      if (newTitle !== originalTodo.title && isDuplicateTodo(newTitle)) {
        setTodosError("A todo with this title already exists.");
        log.error("database_actions", "A todo with this title already exists.");
        toast.error("A todo with the same title already exists");
        return false;
      }
    }

    // Validate updates
    if (newTitle !== undefined) {
      if (newTitle.trim() === "") {
        setTodosError("Todo title cannot be empty");
        return false;
      }
      if (newTitle.length > 10) {
        setTodosError("Todo title cannot be longer than 100 characters");
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
          log.error("database_actions", "Error deleting old image:", err)
        );
      }
      dataToUpdate.imageUrl = await uploadFile(imageFile, userId, "image");
    }

    if (videoFile) {
      if (originalTodo.videoUrl) {
        await deleteFile(originalTodo.videoUrl).catch((err) =>
          log.error("database_actions", "Error deleting old video:", err)
        );
      }
      dataToUpdate.videoUrl = await uploadFile(videoFile, userId, "video");
    }

    // Update in Firestore if there are changes
    if (Object.keys(dataToUpdate).length > 0) {
      await updateTodoInFirestore(todoId, dataToUpdate);
    }

    log.info("database_actions", "Todo Update Successfully");
    toast.success("Todo Updated Successfully");
    return true;
  } catch (error: any) {
    log.error("database_actions", error.message, error);
    toast.error("Failed to update todo");
    setTodosError(error.message);
    return false;
  }
};
