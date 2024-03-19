class ErrorHandler {
  constructor (message, data = null) {
    this.message = message
    this.data = data
  }

  handle () {
    console.error(this.message, this.data)
    throw new Error(this.message)
  }
}

module.exports = ErrorHandler
