const db = require('../../data')

const saveDax = async (dax, transaction) => {
  await db.dax.upsert(dax, { transaction })
}

module.exports = saveDax
