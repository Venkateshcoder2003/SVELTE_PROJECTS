// TypeScript type definitions for the entire application
// This file defines all the interfaces and types used throughout the project

// Interface for a single TODO item
export interface Todo {
  id: string;          // Unique identifier for the todo
  text: string;        // The todo text content
  completed: boolean;  // Whether the todo is completed or not
  createdAt: Date;     // When the todo was created
  userId: string;  
  imageUrl?: string;   
  videoUrl?: string;    
}

// Interface for user authentication data
export interface User {
  uid: string;         // Firebase user ID
  email: string;       // User's email address
  displayName?: string; // Optional display name
}

// Interface for authentication state
export interface AuthState {
  user: User | null;   // Current user object or null if not logged in
  loading: boolean;    // Whether authentication is still loading
  error: string | null; // Any authentication error messages
}

// Interface for form data when creating/editing todos
export interface TodoForm {
  text: string;        // The todo text content
}

// Interface for login form data
export interface LoginForm {
  email: string;       // User's email
  password: string;    // User's password
}

// Interface for signup form data
export interface SignupForm {
  email: string;       // User's email
  password: string;    // User's password
  confirmPassword: string; // Password confirmation
}