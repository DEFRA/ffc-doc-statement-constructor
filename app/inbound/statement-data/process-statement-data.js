const { CALCULATION: calculation, ORGANISATION: organisation, TOTAL: total, DELINKED: delinked, DAX: dax, D365: d365 } = require('../../constants/types')

const processMapping = {
  [calculation]: () => require('../calculation/process-calculation'),
  [organisation]: () => require('../organisation/process-organisation'),
  [delinked]: () => require('../delinked/process-delinked'),
  [total]: () => require('../total/process-total'),
  [dax]: () => require('../dax/process-dax'),
  [d365]: () => require('../d365/process-d365')
}

const processStatementData = (statementData) => {
  const getProcessFunction = processMapping[statementData.type]
  if (getProcessFunction) {
    const processFunction = getProcessFunction()
    return processFunction(statementData)
  } else {
    console.warn(`Type is invalid or not supported: ${statementData.type}`)
    return Promise.resolve()
  }
}

module.exports = processStatementData
