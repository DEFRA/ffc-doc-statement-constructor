const { organisations } = require('../../data')

const getOrganisationByFrn = async (frn, transaction) => {
  const organisation = await organisations(transaction)
    .select('sbi')
    .where({ frn })
    .first()
  return organisation ?? null
}

module.exports = getOrganisationByFrn
