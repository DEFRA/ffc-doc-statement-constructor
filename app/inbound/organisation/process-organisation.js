const db = require('../../data')
const saveOrganisation = require('./save-organisation')
const validateOrganisation = require('./validate-organisation')
const { dataProcessingAlert } = require('../../utility/processing-alerts')
const { DATA_PROCESSING_ERROR } = require('../../constants/alerts')

const processOrganisation = async (organisation) => {
  const transaction = await db.sequelize.transaction()
  try {
    validateOrganisation(organisation, organisation.sbi)
    await saveOrganisation(organisation, transaction)
    await transaction.commit()
  } catch (error) {
    try {
      await dataProcessingAlert({
        process: 'process-organisation',
        sbi: organisation?.sbi,
        details: error?.message,
        error
      }, DATA_PROCESSING_ERROR)
    } catch (alertErr) {
      console.error('Failed to publish processing alert for organisation', alertErr)
    }

    await transaction.rollback()
    throw error
  }
}

module.exports = processOrganisation
