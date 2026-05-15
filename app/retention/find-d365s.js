const db = require('../data')

const findD365s = async (calculationIds, transaction) => {
  return db.d365.findAll({
    attributes: ['paymentReference'],
    where: {
      calculationId: {
        [db.Sequelize.Op.in]: calculationIds
      }
    },
    transaction
  })
}

module.exports = {
  findD365s
}
