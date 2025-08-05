export interface ValidationResult {
  isValid: boolean;
  error: string;
}

// Email validation
export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return { isValid: false, error: "Email is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }

  return { isValid: true, error: "" };
}

// Password validation
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, error: "Password is required" };
  }

  if (password.length < 6) {
    return {
      isValid: false,
      error: "Password must be at least 6 characters long",
    };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);

  if (!hasUpperCase || !hasSpecialChar) {
    return {
      isValid: false,
      error:
        "Password must contain at least one uppercase letter and one special character (!@#$%^&*)",
    };
  }

  return { isValid: true, error: "" };
}

// Confirm password validation
export function validateConfirmPassword(
  password: string,
  confirmPassword: string
): ValidationResult {
  if (!confirmPassword) {
    return { isValid: false, error: "Please confirm your password" };
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: "Passwords do not match" };
  }

  return { isValid: true, error: "" };
}

// Login form validation
export function validateLoginForm(
  email: string,
  password: string
): ValidationResult {
  if (!email || !password) {
    return { isValid: false, error: "Please fill in all fields" };
  }

  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    return emailValidation;
  }

  return { isValid: true, error: "" };
}

// Signup form validation
export function validateSignupForm(
  email: string,
  password: string,
  confirmPassword: string
): ValidationResult {
  if (!email || !password || !confirmPassword) {
    return { isValid: false, error: "All fields are required" };
  }

  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    return emailValidation;
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    return passwordValidation;
  }

  const confirmPasswordValidation = validateConfirmPassword(
    password,
    confirmPassword
  );
  if (!confirmPasswordValidation.isValid) {
    return confirmPasswordValidation;
  }

  return { isValid: true, error: "" };
}

// Forgot password validation
export function validateForgotPasswordForm(email: string): ValidationResult {
  return validateEmail(email);
}
