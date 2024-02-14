const getAddress = require('./get-address')
const getDetails = require('./get-details')
const getDetailedFunding = require('./get-detailed-funding')
const getScheme = require('./get-scheme')
const getDetailedPayments = require('./get-detailed-payments')
const getScheduleDates = require('./get-schedule-dates')
const getAdjustment = require('./get-adjustment')
const getRemainingAmount = require('./get-remaining-amount')

module.exports = {
  getAddress,
  getDetailedFunding,
  getDetails,
  getDetailedPayments,
  getScheme,
  getScheduleDates,
  getAdjustment,
  getRemainingAmount
}
