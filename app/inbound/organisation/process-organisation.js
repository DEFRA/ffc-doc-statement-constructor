const db = require('../../data')
const saveOrganisation = require('./save-organisation')
const validateOrganisation = require('./validate-organisation')

const processOrganisation = async (organisation) => {
  validateOrganisation(organisation, organisation.sbi)

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
