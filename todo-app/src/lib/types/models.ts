//Interface for a single TODO item
export interface Todo {
  id: string; //Unique identifier for the todo from Firestore
  text: string; //The content of the todo
  completed: boolean; //Whether the todo is marked as complete
  createdAt: Date; //The date and time when the todo was created
  userId: string; //The ID of the user who owns this todo
  imageUrl?: string; //Optional URL for an attached image in Firebase Storage
  videoUrl?: string; //Optional URL for an attached video in Firebase Storage
}

//Interface for the user data
export interface User {
  uid: string; //Firebase user ID
  email: string; //User's email address
  displayName?: string;
  creationTime?: string;
}

//Interface for authentication state
export interface AuthState {
  user: User | null; //Current user object or null if not logged in
  loading: boolean; //True while checking the user's authentication status
  error: string | null; //Any authentication error messages
}

//Interface for form data when creating/editing todos
export interface TodoForm {
  text: string;
}

//Interface for login form data
export interface LoginForm {
  email: string;
  password: string;
}

//Interface for signup form data
export interface SignupForm {
  email: string;
  password: string;
  confirmPassword: string;
}
