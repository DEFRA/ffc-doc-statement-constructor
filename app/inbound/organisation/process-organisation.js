const db = require('../../data')
const saveOrganisation = require('./save-organisation')
const validateOrganisation = require('./validate-organisation')
const { createAlerts } = require('../../messaging/create-alerts')

const processOrganisation = async (organisation) => {
  const transaction = await db.sequelize.transaction()
  try {
    validateOrganisation(organisation, organisation.sbi)
    await saveOrganisation(organisation, transaction)
    await transaction.commit()
  } catch (error) {
    createAlerts({
      type: 'OrganisationProcessingError',
      message: `Failed to process organisation with SBI ${organisation.sbi || 'unknown'}`,
      details: error.message
    })
    await transaction.rollback()
    throw (error)
  }
}

module.exports = processOrganisation
