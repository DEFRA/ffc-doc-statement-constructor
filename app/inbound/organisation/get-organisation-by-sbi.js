const { organisations } = require('../../database')

const getOrganisationBySbi = async (sbi, transaction) => {
  const organisation = await organisations(transaction)
    .where({ sbi })
    .forUpdate()
    .first()
  return organisation ?? null
}

module.exports = getOrganisationBySbi
