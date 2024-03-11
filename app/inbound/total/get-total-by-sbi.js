const db = require('../../data')

const getTotalBySbi = async (sbi, transaction) => {
  return db.total.findOne({
    transaction,
    lock: true,
    where: {
      sbi
    }
  })
}

module.exports = getTotalBySbi
