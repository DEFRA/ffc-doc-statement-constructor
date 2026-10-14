const { organisations } = require('../../database')
const TABLES = require('../../constants/tables')
const { pickColumns } = require('../../constants/columns')

const saveOrganisation = async (organisation, transaction) => {
  const organisationRecord = pickColumns({
    ...organisation,
    updated: organisation.updated || new Date()
  }, TABLES.organisations)

  return organisations(transaction)
    .insert(organisationRecord)
    .onConflict('sbi')
    .merge()
}

module.exports = saveOrganisation
