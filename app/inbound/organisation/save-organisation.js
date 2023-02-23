const db = require('../../data')

const saveOrganisation = async (organisation, transaction) => {
  await db.organisation.upsert(organisation, { transaction })
}

module.exports = saveOrganisation
