const { d365 } = require('../database')

const removeD365 = async (calculationIds, transaction) => {
  await d365(transaction)
    .whereIn('calculationId', calculationIds)
    .del()
}

module.exports = {
  removeD365
}
