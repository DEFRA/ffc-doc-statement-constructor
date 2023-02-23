const db = require('../../data')
const saveOrganisation = require('./save-organisation')

const processOrganisation = async (organisation) => {
  const transaction = await db.sequelize.transaction()
  try {
    await saveOrganisation(organisation, transaction)
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

module.exports = processOrganisation
