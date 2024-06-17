const db = require('../../data')
const saveOrganisation = require('./save-organisation')
const validateOrganisation = require('./validate-organisation')

const processOrganisation = async (organisation) => {
  const transaction = await db.sequelize.transaction()
  try {
    validateOrganisation(organisation, organisation.sbi)
    await saveOrganisation(organisation, transaction)
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

module.exports = processOrganisation
