//Svelte store for managing all todo-related operations
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
import type { Todo } from "../models";
import { toast } from "svelte-sonner";

//Stores the main array of todo items
export const todosStore = writable<Todo[]>([]);

//Stores the loading state (true when fetching data)
export const todosLoading = writable<boolean>(false);

//Stores any error messages
export const todosError = writable<string | null>(null);

//Holds the function to stop the Firestore listener
let unsubscribe: Unsubscribe | null = null;

//Function to start listening to user's todos
export const subscribeTodos = (userId: string): void => {
  //Set initial state for loading and error
  todosLoading.set(true);
  todosError.set(null);

  //Create a query to get todos for the specified user, ordered by newest first
  const q = query(
    collection(db, "todos"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  //onSnapshot listens for any changes to the query results in real-time
  unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const todos: Todo[] = [];

      //Loop through each document from Firestore and convert it to a Todo object
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

      //Update the Svelte store with the fresh list of todos
      todosStore.set(todos);
      todosLoading.set(false);
    },
    (error) => {
      //Handle any errors during fetching
      console.error("Error fetching todos:", error);
      todosError.set(error.message);
      todosLoading.set(false);
    }
  );
};

//Stops the real-time listener to prevent memory leaks when the user logs out
export const unsubscribeTodos = (): void => {
  if (unsubscribe) {
    unsubscribe(); //Call the function to stop listening
    unsubscribe = null;
  }
  //Clear the local todos array
  todosStore.set([]);
};

//Function to add a new todo
export const addTodo = async (
  text: string,
  userId: string,
  imageFile?: File | null,
  videoFile?: File | null
): Promise<boolean> => {
  try {
    todosError.set(null);

    //Validate todo text length (MAXLENGTH = 250)
    if (text.length > 250) {
      todosError.set("Todo text cannot be longer than 250 characters");
      return false;
    }

    //Validate that text is not empty
    if (text.trim() === "") {
      todosError.set("Todo text cannot be empty");
      return false;
    }

    //Create the base object for the new todo
    const newTodoData: any = {
      text: text.trim(),
      completed: false,
      createdAt: new Date(),
      userId: userId,
    };

    //If an image file is provided, upload it to Firebase Storage
    if (imageFile) {
      const imageRef = ref(
        storage,
        `todos/${userId}/${Date.now()}_${imageFile.name}`
      );
      await uploadBytes(imageRef, imageFile);
      newTodoData.imageUrl = await getDownloadURL(imageRef);
    }

    //If a video file is provided, upload it to Firebase Storage
    if (videoFile) {
      const videoRef = ref(
        storage,
        `todos/${userId}/${Date.now()}_${videoFile.name}`
      );
      await uploadBytes(videoRef, videoFile);
      newTodoData.videoUrl = await getDownloadURL(videoRef);
    }
    //Add new todo to Firestore
    await addDoc(collection(db, "todos"), newTodoData);
    toast.success(`${newTodoData.text} Todo added successfully!`);

    return true; //Success
  } catch (error: any) {
    console.error("Error adding todo:", error);
    todosError.set(error.message);
    return false; //Failed to add Todo
  }
};

//Function to toggle todo completion status
export const toggleTodo = async (todoId: string): Promise<boolean> => {
  try {
    todosError.set(null);

    //Get current todos to find the one to toggle
    let currentTodos: Todo[] = [];
    todosStore.subscribe((todos) => (currentTodos = todos))();

    //Find the todo to toggle
    const todoToToggle = currentTodos.find((todo) => todo.id === todoId);
    if (!todoToToggle) {
      todosError.set("Todo not found");
      return false;
    }

    //Update the todo in Firestore
    const todoRef = doc(db, "todos", todoId);
    await updateDoc(todoRef, {
      completed: !todoToToggle.completed,
    });

    return true;
  } catch (error: any) {
    console.error("Error toggling todo:", error);
    todosError.set(error.message);
    return false;
  }
};

//Deletes a todo and any associated files from Firebase
export const deleteTodo = async (todoId: string): Promise<boolean> => {
  try {
    todosError.set(null);

    //Get the todo to find file URLs before deleting the document
    let todoToDelete: Todo | undefined;
    todosStore.subscribe((todos) => {
      todoToDelete = todos.find((t) => t.id === todoId);
    })();

    if (todoToDelete) {
      //If an image URL exists, delete it file from Storage
      if (todoToDelete.imageUrl) {
        const imageRef = ref(storage, todoToDelete.imageUrl);
        await deleteObject(imageRef).catch((err) =>
          console.error("Error deleting image:", err)
        );
      }
      //Delete video from storage if it exists
      if (todoToDelete.videoUrl) {
        const videoRef = ref(storage, todoToDelete.videoUrl);
        await deleteObject(videoRef).catch((err) =>
          console.error("Error deleting video:", err)
        );
      }
    }

    //Delete todo document from Firestore
    await deleteDoc(doc(db, "todos", todoId));
    toast.success("Todo deleted Successfully");

    return true;
  } catch (error: any) {
    console.error("Error deleting todo:", error);
    todosError.set(error.message);
    return false;
  }
};

//Function to update todo text
export const updateTodo = async (
  todoId: string,
  newText: string
): Promise<boolean> => {
  try {
    todosError.set(null);

    //Validate todo text length
    if (newText.length > 250) {
      todosError.set("Todo text cannot be longer than 250 characters");
      return false;
    }

    //Validate that text is not empty
    if (newText.trim() === "") {
      todosError.set("Todo text cannot be empty");
      return false;
    }

    //Update todo in Firestore
    const todoRef = doc(db, "todos", todoId);
    await updateDoc(todoRef, {
      text: newText.trim(),
    });
    toast.success("Todo Update Successfully"); 
   
    return true;
  } catch (error: any) {
    console.error("Error updating todo:", error);
    todosError.set(error.message);
    return false;
  }
};
