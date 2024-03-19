const db = require('../../../data')

const getSchemeByCode = async (code) => {
  return db.scheme.findOne({
    attributes: [
      ['name', 'schemeName'],
      ['code', 'schemeCode']
    ],
    where: {
      code
    },
    raw: true
  })
}

module.exports = getSchemeByCode
