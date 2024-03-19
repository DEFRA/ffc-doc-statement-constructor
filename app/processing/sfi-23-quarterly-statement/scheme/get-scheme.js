const getSchemeByCode = require('./get-scheme-by-code')
const validateScheme = require('./validate-scheme')

const getScheme = async (code) => {
  const scheme = await getSchemeByCode(code)
  return validateScheme(scheme, code)
}

module.exports = getScheme
