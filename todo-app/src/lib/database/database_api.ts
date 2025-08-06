// utils/todosApi.ts - Firebase API operations for todos
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
  writeBatch,
  getDocs,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "../utils/firebase";
import type { Todo } from "../schema/todo_schema";

// Subscribe to user's todos
export const subscribeToTodos = (
  userId: string,
  onSuccess: (todos: Todo[]) => void,
  onError: (error: Error) => void
): Unsubscribe => {
  const q = query(
    collection(db, "todos"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    q,
    (querySnapshot) => {
      const todos: Todo[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        todos.push({
          id: doc.id,
          title: data.title,
          text: data.text,
          completed: data.completed,
          createdAt: data.createdAt.toDate(),
          userId: data.userId,
          imageUrl: data.imageUrl,
          videoUrl: data.videoUrl,
        });
      });
      onSuccess(todos);
    },
    onError
  );
};

// Upload file to Firebase Storage
export const uploadFile = async (
  file: File,
  userId: string,
  type: "image" | "video"
): Promise<string> => {
  const fileRef = ref(storage, `todos/${userId}/${Date.now()}_${file.name}`);
  await uploadBytes(fileRef, file);
  return await getDownloadURL(fileRef);
};

// Delete file from Firebase Storage
export const deleteFile = async (fileUrl: string): Promise<void> => {
  const fileRef = ref(storage, fileUrl);
  await deleteObject(fileRef);
};

// Add new todo to Firestore
export const addTodoToFirestore = async (todoData: any): Promise<void> => {
  await addDoc(collection(db, "todos"), todoData);
};

// Update todo in Firestore
export const updateTodoInFirestore = async (
  todoId: string,
  updates: any
): Promise<void> => {
  const todoRef = doc(db, "todos", todoId);
  await updateDoc(todoRef, updates);
};

// Delete todo from Firestore
export const deleteTodoFromFirestore = async (
  todoId: string
): Promise<void> => {
  await deleteDoc(doc(db, "todos", todoId));
};

// Get all todos for a user
export const getAllUserTodos = async (userId: string) => {
  const q = query(collection(db, "todos"), where("userId", "==", userId));
  return await getDocs(q);
};

// Batch delete todos
export const batchDeleteTodos = async (todoRefs: any[]): Promise<void> => {
  const batch = writeBatch(db);
  todoRefs.forEach((ref) => batch.delete(ref));
  await batch.commit();
};
