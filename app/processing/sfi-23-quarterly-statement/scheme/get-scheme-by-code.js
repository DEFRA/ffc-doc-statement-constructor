const db = require('../../../data')

const getSchemeByCode = async (name) => {
  return db.scheme.findOne({
    attributes: [
      'name',
      'code'
    ],
    where: {
      name
    },
    raw: true
  })
}

module.exports = getSchemeByCode
