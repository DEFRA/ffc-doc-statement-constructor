const db = require('../../data')

const getPreviousPaymentCountByCalculationId = async (calculationId) => {
  return db.d365.count({
    where: {
      completePublish: {
        [db.Sequelize.Op.ne]: null
      },
      calculationId
    }
  })
}

module.exports = getPreviousPaymentCountByCalculationId
