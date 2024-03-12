const db = require('../../data')

const savePlaceholderOrganisation = async (organisation, sbi, transaction) => {
  await db.organisation.findOrCreate({
    organisation,
    where: { sbi },
    transaction
  })
}

module.exports = savePlaceholderOrganisation
