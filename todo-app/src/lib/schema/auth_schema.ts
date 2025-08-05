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
