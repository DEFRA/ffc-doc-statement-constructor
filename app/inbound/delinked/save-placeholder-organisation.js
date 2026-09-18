const { organisations } = require('../../data')

const savePlaceholderOrganisation = async (organisation, sbi, transaction) => {
  await organisations(transaction)
    .insert({ ...organisation, sbi })
    .onConflict('sbi')
    .ignore()
}

module.exports = savePlaceholderOrganisation
