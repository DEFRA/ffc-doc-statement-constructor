
const db = require('../../data')
const getPrintStatus = async (startPublish, lastProcessAttempt, completePublish, transaction) => {
  return db.d365.findOne({
    transaction,
    lock: true,
    where: {
      startPublish,
      completePublish,
      lastProcessAttempt
    }
  }
  )
}

module.exports = getPrintStatus
