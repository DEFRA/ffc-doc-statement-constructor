const db = require('../../data')

const saveTotal = async (total, transaction) => {
  await db.total.upsert(total, { transaction })
}

module.exports = saveTotal
