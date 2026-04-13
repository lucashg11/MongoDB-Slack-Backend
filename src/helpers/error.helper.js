class ServerError extends Error {
  constructor(message, status) {
    if (typeof message === 'object' && message !== null) {
      super(message.message || 'Server Error');
      this.status = message.status;
      this.ok = message.ok;
    }
    else {
      super(message);
      this.status = status;
    }
  }
}

export default ServerError;