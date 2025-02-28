export default class CustomServerError extends Error {
    constructor(message) {
      super(message)
      this.name = ""
      this.stack = ""
    }
  }