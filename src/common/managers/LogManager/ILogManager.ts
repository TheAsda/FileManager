interface ILogManager {
  /**
   * Writes the message if info is enabled
   *
   * @param message the message to log
   */
  log(message: string): void;

  /**
   * Writes debug info if debug is enabled
   *
   * @param message the message to log
   */
  debug(message: string): void;

  /**
   * Writes the error message
   *
   * @param message the message to log
   */
  error(message: string): void;

  /**
   * Writes the critical message
   *
   * @param message the message to log
   */
  critical(message: string): void;
}

export { ILogManager };
