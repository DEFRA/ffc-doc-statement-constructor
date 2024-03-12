const db = require('../../data')

const saveTotal = async (total, transaction) => {
  return db.total.create(total, { transaction })
}

module.exports = saveTotal
