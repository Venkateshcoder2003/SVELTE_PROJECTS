import { writable } from "svelte/store";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "../utils/firebase";
import type { Todo } from "../types";
import { toast } from "svelte-sonner";

// Create writable store for todos array
export const todosStore = writable<Todo[]>([]);

// Create writable store for loading state
export const todosLoading = writable<boolean>(false);

// Create writable store for error messages
export const todosError = writable<string | null>(null);

// Variable to store Firestore unsubscribe function
let unsubscribe: Unsubscribe | null = null;

// Function to start listening to user's todos
export const subscribeTodos = (userId: string): void => {
  // Set loading state
  todosLoading.set(true);
  todosError.set(null);

  // Create query to get todos for specific user, ordered by creation date
  const q = query(
    collection(db, "todos"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  // Listen for real-time updates
  unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const todos: Todo[] = [];

      // Convert Firestore documents to Todo objects
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        todos.push({
          id: doc.id,
          text: data.text,
          completed: data.completed,
          createdAt: data.createdAt.toDate(), // Convert Firestore timestamp to Date
          userId: data.userId,
          imageUrl: data.imageUrl,
          videoUrl: data.videoUrl,
        });
      });

      // Update store with new todos
      todosStore.set(todos);
      todosLoading.set(false);
    },
    (error) => {
      // Handle any errors
      console.error("Error fetching todos:", error);
      todosError.set(error.message);
      todosLoading.set(false);
    }
  );
};

// Function to stop listening to todos (cleanup)
export const unsubscribeTodos = (): void => {
  if (unsubscribe) {
    unsubscribe(); // Stop listening
    unsubscribe = null;
  }
  // Clear todos when user logs out
  todosStore.set([]);
};

// Function to add a new todo
export const addTodo = async (
  text: string,
  userId: string,
  imageFile?: File | null,
  videoFile?: File | null
): Promise<boolean> => {
  try {
    todosError.set(null);

    // Validate todo text length (max 250 characters as per requirements)
    if (text.length > 250) {
      todosError.set("Todo text cannot be longer than 250 characters");
      return false;
    }

    // Validate that text is not empty
    if (text.trim() === "") {
      todosError.set("Todo text cannot be empty");
      return false;
    }

    const newTodoData: any = {
      text: text.trim(),
      completed: false,
      createdAt: new Date(),
      userId: userId,
    };

    if (imageFile) {
      const imageRef = ref(
        storage,
        `todos/${userId}/${Date.now()}_${imageFile.name}`
      );
      await uploadBytes(imageRef, imageFile);
      newTodoData.imageUrl = await getDownloadURL(imageRef);
    }

    if (videoFile) {
      const videoRef = ref(
        storage,
        `todos/${userId}/${Date.now()}_${videoFile.name}`
      );
      await uploadBytes(videoRef, videoFile);
      newTodoData.videoUrl = await getDownloadURL(videoRef);
    }
    // Add new todo to Firestore
    await addDoc(collection(db, "todos"), newTodoData);
    toast.success("Todo added successfully!");

    return true; // Success
  } catch (error: any) {
    console.error("Error adding todo:", error);
    todosError.set(error.message);
    return false; // Failed
  }
};

// Function to toggle todo completion status
export const toggleTodo = async (todoId: string): Promise<boolean> => {
  try {
    todosError.set(null);

    // Get current todos to find the one to toggle
    let currentTodos: Todo[] = [];
    todosStore.subscribe((todos) => (currentTodos = todos))();

    // Find the todo to toggle
    const todoToToggle = currentTodos.find((todo) => todo.id === todoId);
    if (!todoToToggle) {
      todosError.set("Todo not found");
      return false;
    }

    // Update the todo in Firestore
    const todoRef = doc(db, "todos", todoId);
    await updateDoc(todoRef, {
      completed: !todoToToggle.completed,
    });

    return true; // Success
  } catch (error: any) {
    console.error("Error toggling todo:", error);
    todosError.set(error.message);
    return false; // Failed
  }
};

// Function to delete a todo
export const deleteTodo = async (todoId: string): Promise<boolean> => {
  try {
    todosError.set(null);

    // Get the todo to find file URLs before deleting the document
    let todoToDelete: Todo | undefined;
    todosStore.subscribe((todos) => {
      todoToDelete = todos.find((t) => t.id === todoId);
    })();

    if (todoToDelete) {
      // Delete image from storage if it exists
      if (todoToDelete.imageUrl) {
        const imageRef = ref(storage, todoToDelete.imageUrl);
        await deleteObject(imageRef).catch((err) =>
          console.error("Error deleting image:", err)
        );
      }
      // Delete video from storage if it exists
      if (todoToDelete.videoUrl) {
        const videoRef = ref(storage, todoToDelete.videoUrl);
        await deleteObject(videoRef).catch((err) =>
          console.error("Error deleting video:", err)
        );
      }
    }

    // Delete todo document from Firestore
    await deleteDoc(doc(db, "todos", todoId));
    toast.success("Todo deleted Successfully");

    return true;
  } catch (error: any) {
    console.error("Error deleting todo:", error);
    todosError.set(error.message);
    return false;
  }
};

// Function to update todo text
export const updateTodo = async (
  todoId: string,
  newText: string
): Promise<boolean> => {
  try {
    todosError.set(null);

    // Validate todo text length
    if (newText.length > 250) {
      todosError.set("Todo text cannot be longer than 250 characters");
      return false;
    }

    // Validate that text is not empty
    if (newText.trim() === "") {
      todosError.set("Todo text cannot be empty");
      return false;
    }

    // Update todo in Firestore
    const todoRef = doc(db, "todos", todoId);
    await updateDoc(todoRef, {
      text: newText.trim(),
    });

    return true; // Success
  } catch (error: any) {
    console.error("Error updating todo:", error);
    todosError.set(error.message);
    return false; // Failed
  }
};
