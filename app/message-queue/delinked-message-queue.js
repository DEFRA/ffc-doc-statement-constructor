const db = require('../data')

const MessageTypes = {
  ORGANISATION: 'organisation',
  DELINKED_CALCULATION: 'delinkedCalculation',
  D365: 'd365'
}

const DependencyMap = {
  [MessageTypes.ORGANISATION]: [],
  [MessageTypes.DELINKED_CALCULATION]: [MessageTypes.ORGANISATION],
  [MessageTypes.D365]: [MessageTypes.DELINKED_CALCULATION]
}

class DelinkedMessageQueue {
  constructor () {
    this.queue = new Map()
    this.processing = new Set()
    this.maxRetries = 3
  }

  async add (type, data) {
    const key = this.createKey(type, data)
    if (!this.processing.has(key)) {
      this.queue.set(key, { type, data, attempts: 0 })
      return this.process()
    }
  }

  createKey (type, data) {
    switch (type) {
      case MessageTypes.ORGANISATION:
        return `org-${data.sbi}`
      case MessageTypes.DELINKED_CALCULATION:
        return `calc-${data.calculationId}`
      case MessageTypes.D365:
        return `d365-${data.paymentReference}`
      default:
        throw new Error(`Invalid message type: ${type}`)
    }
  }

  async canProcess (message) {
    const dependencies = DependencyMap[message.type]
    if (!dependencies?.length) return true

    for (const dependency of dependencies) {
      const dependencyData = await this.getDependencyData(dependency, message.data)
      if (!dependencyData) return false
    }
    return true
  }

  async getDependencyData (dependencyType, data) {
    switch (dependencyType) {
      case MessageTypes.ORGANISATION:
        return await db.organisation.findByPk(data.sbi)
      case MessageTypes.DELINKED_CALCULATION:
        return await db.delinkedCalculation.findByPk(data.calculationId)
      default:
        return null
    }
  }

  async process () {
    for (const [key, message] of this.queue.entries()) {
      if (await this.canProcess(message)) {
        try {
          await this.processMessage(message)
          this.queue.delete(key)
        } catch (error) {
          console.error(`Processing error: ${error.message}`)
          message.attempts++
          if (message.attempts >= this.maxRetries) {
            this.queue.delete(key)
          }
        }
      }
    }
  }

  async processMessage (message) {
    const { type, data } = message
    switch (type) {
      case MessageTypes.ORGANISATION:
        await db.organisation.upsert(data)
        break
      case MessageTypes.DELINKED_CALCULATION:
        await db.delinkedCalculation.create(data)
        break
      case MessageTypes.D365:
        await db.d365.create(data)
        break
    }
  }
}

module.exports = {
  messageQueue: new DelinkedMessageQueue(),
  MessageTypes
}
