const db = require('../../data')

const saveDax = async (dax, transaction) => {
  const transformedDax = {
    ...dax,
    calculationId: dax.calculationReference
  }
  delete transformedDax.calculationReference

  return db.dax.create(transformedDax, { transaction })
}

module.exports = saveDax
