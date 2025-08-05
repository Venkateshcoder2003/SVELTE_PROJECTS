//Interface for a single TODO item
export interface Todo {
  id: string; //Unique identifier for the todo from Firestore
  title: String; //Title of the todo
  text: string; //The content of the todo
  completed: boolean; //Whether the todo is marked as complete
  createdAt: Date; //The date and time when the todo was created
  userId: string; //The ID of the user who owns this todo
  imageUrl?: string; //Optional URL for an attached image in Firebase Storage
  videoUrl?: string; //Optional URL for an attached video in Firebase Storage
}

//Interface for form data when creating/editing todos
export interface TodoForm {
  text: string;
}
