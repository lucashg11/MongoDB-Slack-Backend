class ServerError extends Error {
  constructor(message, status) {
    super(message, status);
    this.status = status;
  }
}

export default ServerError;