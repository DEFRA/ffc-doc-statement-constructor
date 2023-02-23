const getLatestPayment = require('./get-latest-payment')
const { calculateScheduledPayments } = require('./calculate-scheduled-payments')
const calculateDelta = require('./calculate-delta')

module.exports = {
  getLatestPayment,
  calculateScheduledPayments,
  calculateDelta
}
