//singleton logger class that provides structured console logging and toast notifications
export class Logger {
  //A private static property to hold the single instance of the logger.
  private static instance: Logger;

  //The constructor is private to prevent direct instantiation using `new Logger()`
  private constructor() {}

  /**
   * The static method that controls access to the singleton instance
   * It creates the instance if it doesn't exist yet, and then returns it
   */
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  //Logs an informational message and shows a success toast
  info(context: string, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [INFO] [${context}] ${message}`, data || "");
  }

  //Logs a warning message and shows a warning toast
  warn(context: string, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] [WARN] [${context}] ${message}`, data || "");
  }

  //Logs an error message and shows an error toast
  error(context: string, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] [ERROR] [${context}] ${message}`, data || "");
  }
}
