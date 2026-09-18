const { d365 } = require('../data')

const removeD365 = async (calculationIds, transaction) => {
  await d365(transaction)
    .whereIn('calculationId', calculationIds)
    .del()
}

module.exports = {
  removeD365
}
