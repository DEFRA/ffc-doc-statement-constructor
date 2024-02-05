const { STATEMENT, SCHEDULE } = require('../../app/constants/categories')

module.exports = {
  STATEMENT: {
    settlementId: 1,
    completed: null,
    started: null,
    category: STATEMENT,
    isActiveDocument: true
  },
  SCHEDULE: {
    paymentRequestId: 1,
    completed: null,
    started: null,
    category: SCHEDULE,
    isActiveDocument: true
  }
}
