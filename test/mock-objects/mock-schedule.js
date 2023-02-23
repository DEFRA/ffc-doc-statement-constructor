const { STATEMENT, SCHEDULE } = require('../../app/constants/categories')

module.exports = {
  STATEMENT: {
    settlementId: 1,
    completed: null,
    started: null,
    category: STATEMENT
  },
  SCHEDULE: {
    paymentRequestId: 1,
    completed: null,
    started: null,
    category: SCHEDULE
  }
}
