const { organisations } = require('../../data')

// Equivalent of Sequelize findOrCreate: insert the placeholder only when no
// row exists for the sbi, and leave an existing row untouched.
const savePlaceholderOrganisation = async (organisation, sbi, transaction) => {
  await organisations(transaction)
    .insert({ ...organisation, sbi })
    .onConflict('sbi')
    .ignore()
}

module.exports = savePlaceholderOrganisation
