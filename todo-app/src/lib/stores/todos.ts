// //Svelte store for managing all todo-related operations
// import { writable } from "svelte/store";
// import {
//   collection,
//   addDoc,
//   updateDoc,
//   deleteDoc,
//   doc,
//   query,
//   where,
//   orderBy,
//   onSnapshot,
//   type Unsubscribe,
//   writeBatch,
//   getDocs,
// } from "firebase/firestore";
// import {
//   getStorage,
//   ref,
//   uploadBytes,
//   getDownloadURL,
//   deleteObject,
// } from "firebase/storage";
// import { db, storage } from "../utils/firebase";
// import type { Todo } from "../types/models";
// import { Logger } from "../utils/logger";
// import { toast } from "svelte-sonner";
// //create an instance of Logger
// const log = Logger.getInstance();
// //set to store existing todos
// const existingTodoTexts = new Set<string>();

// //Stores the main array of todo items
// export const todosStore = writable<Todo[]>([]);

// //Stores the loading state (true when fetching data)
// export const todosLoading = writable<boolean>(false);

// //Stores any error messages
// export const todosError = writable<string | null>(null);

// //subscribe to the main todosStore to keep our Set automatically in sync
// todosStore.subscribe((todos) => {
//   existingTodoTexts.clear();
//   // UPDATED: Check for both title and text for duplicates
//   todos.forEach((todo) =>
//     existingTodoTexts.add(
//       `${todo.title.toLowerCase()}:${todo.text.toLowerCase()}`
//     )
//   );
// });

// //Holds the function to stop the Firestore listener
// let unsubscribe: Unsubscribe | null = null;

// //Function to start listening to user's todos
// export const subscribeTodos = (userId: string): void => {
//   //Set initial state for loading and error
//   todosLoading.set(true);
//   todosError.set(null);

//   //Create a query to get todos for the specified user, ordered by newest first
//   const q = query(
//     collection(db, "todos"),
//     where("userId", "==", userId),
//     orderBy("createdAt", "desc")
//   );

//   //onSnapshot listens for any changes to the query results in real-time
//   unsubscribe = onSnapshot(
//     q,
//     (querySnapshot) => {
//       const todos: Todo[] = [];

//       //Loop through each document from Firestore and convert it to a Todo object
//       querySnapshot.forEach((doc) => {
//         const data = doc.data();
//         todos.push({
//           id: doc.id,
//           // UPDATED: Added the title field
//           title: data.title,
//           text: data.text,
//           completed: data.completed,
//           createdAt: data.createdAt.toDate(), // Convert Firestore timestamp to Date
//           userId: data.userId,
//           imageUrl: data.imageUrl,
//           videoUrl: data.videoUrl,
//         });
//       });

//       //Update the Svelte store with the fresh list of todos
//       todosStore.set(todos);
//       todosLoading.set(false);
//     },
//     (error) => {
//       //Handle any errors during fetching
//       log.error("todos", "Error fetching todos:", error);
//       toast.error("Error in fetching your Todos");
//       todosError.set(error.message);
//       todosLoading.set(false);
//     }
//   );
// };

// //Stops the real-time listener to prevent memory leaks when the user logs out
// export const unsubscribeTodos = (): void => {
//   if (unsubscribe) {
//     unsubscribe(); //Call the function to stop listening
//     unsubscribe = null;
//   }
//   //Clear the local todos array
//   todosStore.set([]);
// };

// //Function to add a new todo
// export const addTodo = async (
//   title: string,
//   text: string,
//   userId: string,
//   imageFile?: File | null,
//   videoFile?: File | null
// ): Promise<boolean> => {
//   try {
//     todosError.set(null);
//     if (title.length > 10) {
//       todosError.set("Todo title cannot be longer than 10 characters");
//       return false;
//     }
//     if (text.length > 250) {
//       todosError.set("Todo description cannot be longer than 250 characters");
//       return false;
//     }

//     // UPDATED: Check for duplicate todos based on title and text
//     const newTodoCombined = `${title.trim().toLowerCase()}:${text
//       .trim()
//       .toLowerCase()}`;
//     if (existingTodoTexts.has(newTodoCombined)) {
//       todosError.set("A todo with this title and description already exists.");
//       log.error(
//         "todos",
//         "A todo with this title already exists."
//       );
//       return false; // Stop if a duplicate is found
//     }

//     //Create the base object for the new todo
//     const newTodoData: any = {
//       // UPDATED: Added the title field
//       title: title.trim(),
//       text: text.trim(),
//       completed: false,
//       createdAt: new Date(),
//       userId: userId,
//     };

//     //If an image file is provided, upload it to Firebase Storage
//     if (imageFile) {
//       const imageRef = ref(
//         storage,
//         `todos/${userId}/${Date.now()}_${imageFile.name}`
//       );
//       await uploadBytes(imageRef, imageFile);
//       newTodoData.imageUrl = await getDownloadURL(imageRef);
//     }

//     //If a video file is provided, upload it to Firebase Storage
//     if (videoFile) {
//       const videoRef = ref(
//         storage,
//         `todos/${userId}/${Date.now()}_${videoFile.name}`
//       );
//       await uploadBytes(videoRef, videoFile);
//       newTodoData.videoUrl = await getDownloadURL(videoRef);
//     }
//     //Add new todo to Firestore
//     await addDoc(collection(db, "todos"), newTodoData);
//     log.info("todos", `Todo "${newTodoData.title}" added successfully!`);
//     toast.success(`Todo "${newTodoData.title}" added successfully!`);

//     return true; //Success
//   } catch (error: any) {
//     log.error("todos", error.message, error);
//     toast.error("Failed to add Todo");
//     todosError.set(error.message);
//     return false; //Failed to add Todo
//   }
// };

// //Function to toggle todo completion status
// export const toggleTodo = async (todoId: string): Promise<boolean> => {
//   try {
//     todosError.set(null);

//     //Get current todos to find the one to toggle
//     let currentTodos: Todo[] = [];
//     todosStore.subscribe((todos) => (currentTodos = todos))();

//     //Find the todo to toggle
//     const todoToToggle = currentTodos.find((todo) => todo.id === todoId);
//     if (!todoToToggle) {
//       todosError.set("Todo not found");
//       return false;
//     }

//     //Update the todo in Firestore
//     const todoRef = doc(db, "todos", todoId);
//     await updateDoc(todoRef, {
//       completed: !todoToToggle.completed,
//     });

//     const successMessage = todoToToggle.completed
//       ? "Todo marked as pending."
//       : "Todo completed!";
//     log.info("todos", successMessage);
//     toast.success(successMessage);
//     return true;
//   } catch (error: any) {
//     log.error("todos", error.message, error);
//     todosError.set(error.message);
//     return false;
//   }
// };

// //Deletes a todo and any associated files from Firebase
// export const deleteTodo = async (todoId: string): Promise<boolean> => {
//   try {
//     todosError.set(null);

//     //Get the todo to find file URLs before deleting the document
//     let todoToDelete: Todo | undefined;
//     todosStore.subscribe((todos) => {
//       todoToDelete = todos.find((t) => t.id === todoId);
//     })();

//     if (todoToDelete) {
//       //If an image URL exists, delete it file from Storage
//       if (todoToDelete.imageUrl) {
//         const imageRef = ref(storage, todoToDelete.imageUrl);
//         await deleteObject(imageRef).catch((err) =>
//           log.error("todos", "Error deleting image:", err)
//         );
//       }
//       //Delete video from storage if it exists
//       if (todoToDelete.videoUrl) {
//         const videoRef = ref(storage, todoToDelete.videoUrl);
//         await deleteObject(videoRef).catch((err) =>
//           log.error("todos", "Error deleting video:", err)
//         );
//       }
//     }

//     //Delete todo document from Firestore
//     await deleteDoc(doc(db, "todos", todoId));
//     log.info("todos", `Todo "${todoToDelete?.title}" deleted Successfully`);
//     toast.success(`Todo "${todoToDelete?.title}" deleted Successfully`);
//     return true;
//   } catch (error: any) {
//     log.error("todos", error.message, error);
//     toast.error("Todo Deletion Failed");
//     todosError.set(error.message);
//     return false;
//   }
// };

// //Function to delete all todos for a user
// export const deleteAllTodos = async (userId: string): Promise<boolean> => {
//   try {
//     todosError.set(null);
//     todosLoading.set(true);

//     //Get all todos for the user
//     const q = query(collection(db, "todos"), where("userId", "==", userId));

//     const querySnapshot = await getDocs(q);

//     if (querySnapshot.empty) {
//       log.info("todos", "No todos to delete");
//       toast.success("No Todos to delete");
//       todosLoading.set(false);
//       return true;
//     }

//     //Create a batch for efficient deletion
//     const batch = writeBatch(db);
//     const deletePromises: Promise<void>[] = [];

//     //Process each todo for deletion
//     querySnapshot.forEach((docSnapshot) => {
//       const todoData = docSnapshot.data();

//       //Delete associated files from Storage
//       if (todoData.imageUrl) {
//         const imageRef = ref(storage, todoData.imageUrl);
//         deletePromises.push(
//           deleteObject(imageRef).catch((err) =>
//             log.error("todos", "Error deleting image:", err)
//           )
//         );
//       }

//       if (todoData.videoUrl) {
//         const videoRef = ref(storage, todoData.videoUrl);
//         deletePromises.push(
//           deleteObject(videoRef).catch((err) =>
//             log.error("todos", "Error deleting video:", err)
//           )
//         );
//       }

//       //Add document deletion to batch
//       batch.delete(docSnapshot.ref);
//     });

//     //Wait for all file deletions to complete
//     await Promise.all(deletePromises);

//     //Execute the batch deletion of documents
//     await batch.commit();

//     log.info("todos", `Successfully deleted All ${querySnapshot.size} todos`);
//     toast.success(`Successfully deleted All ${querySnapshot.size} todos`);
//     todosLoading.set(false);
//     return true;
//   } catch (error: any) {
//     log.error("todos", error.message, error);
//     toast.error("Failed to delete Todos");
//     todosError.set(error.message);
//     todosLoading.set(false);
//     return false;
//   }
// };

// //Function to update todo text
// export const updateTodo = async (
//   todoId: string,
//   updates: {
//     newTitle?: string;
//     newText?: string;
//     imageFile?: File;
//     videoFile?: File;
//   },
//   originalTodo: Todo
// ): Promise<boolean> => {
//   try {
//     todosError.set(null);

//     // UPDATED: Validate todo title and text length
//     const { newTitle, newText, imageFile, videoFile } = updates;
//     const dataToUpdate: any = {};
//     const userId = originalTodo.userId;

//     if (newTitle !== undefined) {
//       if (newTitle.trim() === "") {
//         todosError.set("Todo title cannot be empty");
//         return false;
//       }
//       if (newTitle.length > 100) {
//         todosError.set("Todo title cannot be longer than 100 characters");
//         return false;
//       }
//       dataToUpdate.title = newTitle.trim();
//     }

//     if (newText !== undefined) {
//       if (newText.length > 250) {
//         todosError.set("Todo description cannot be longer than 250 characters");
//         return false;
//       }
//       dataToUpdate.text = newText.trim();
//     }

//     if (imageFile) {
//       if (originalTodo.imageUrl) {
//         const oldImageRef = ref(storage, originalTodo.imageUrl);
//         await deleteObject(oldImageRef).catch((err) =>
//           log.error("todos", "Error in Uploading Image")
//         );
//       }
//       const newImageRef = ref(
//         storage,
//         `todos/${userId}/${Date.now()}_${imageFile.name}`
//       );
//       await uploadBytes(newImageRef, imageFile);
//       dataToUpdate.imageUrl = await getDownloadURL(newImageRef);
//     }

//     if (videoFile) {
//       // First, delete the old video from Storage if it exists
//       if (originalTodo.videoUrl) {
//         const oldVideoRef = ref(storage, originalTodo.videoUrl);
//         await deleteObject(oldVideoRef).catch((err) =>
//           log.error("todos", "Could not delete old video:", err)
//         );
//       }
//       // Then, upload the new video
//       const newVideoRef = ref(
//         storage,
//         `todos/${userId}/${Date.now()}_${videoFile.name}`
//       );
//       await uploadBytes(newVideoRef, videoFile);
//       dataToUpdate.videoUrl = await getDownloadURL(newVideoRef);
//     }

//     // Only update Firestore if there are actual changes
//     if (Object.keys(dataToUpdate).length > 0) {
//       const todoRef = doc(db, "todos", todoId);
//       await updateDoc(todoRef, dataToUpdate);
//     }

//     log.info("todos", "Todo Update Successfully");
//     toast.success("Todo Updated Successfully");

//     return true;
//   } catch (error: any) {
//     log.error("todos", error.message, error);
//     toast.error("Failed to update todo");
//     todosError.set(error.message);
//     return false;
//   }
// };


export { todosStore, todosLoading, todosError } from "../utils/todos_lce";

// Export all todo actions
export {
  subscribeTodos,
  unsubscribeTodos,
  addTodo,
  toggleTodo,
  deleteTodo,
  deleteAllTodos,
  updateTodo,
} from "../utils/todos_actions"