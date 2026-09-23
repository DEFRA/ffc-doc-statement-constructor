const { schemes } = require('../../../database')

const getSchemeByCode = async (name) => {
  const scheme = await schemes()
    .select('name', 'code')
    .where({ name })
    .first()
  return scheme ?? null
}

module.exports = getSchemeByCode
