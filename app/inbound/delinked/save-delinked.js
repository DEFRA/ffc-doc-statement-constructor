const db = require('../../data')

const saveDelinked = async (calculation, transaction) => {
  return db.delinked.create(calculation, { transaction })
}

module.exports = saveDelinked
