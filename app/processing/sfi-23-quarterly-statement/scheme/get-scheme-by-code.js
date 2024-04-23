const db = require('../../../data')

const getSchemeByCode = async (code) => {
  return db.scheme.findOne({
    attributes: [
      'name',
      'code'
    ],
    where: {
      code
    },
    raw: true
  })
}

module.exports = getSchemeByCode
