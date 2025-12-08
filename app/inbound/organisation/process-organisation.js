const db = require('../../data')
const saveOrganisation = require('./save-organisation')
const validateOrganisation = require('./validate-organisation')
const { checkAndRemoveEmptyAddress } = require('./check-and-remove-empty-address')

const processOrganisation = async (organisation) => {
  const transaction = await db.sequelize.transaction()

  try {
    const removed = await checkAndRemoveEmptyAddress(organisation, transaction)

    if (!removed) {
      validateOrganisation(organisation, organisation.sbi)
      await saveOrganisation(organisation, transaction)
    }

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

module.exports = processOrganisation
