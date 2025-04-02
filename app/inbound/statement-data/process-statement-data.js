const { CALCULATION, ORGANISATION, TOTAL, DELINKED, DAX, D365 } = require('../../constants/types')

const processMapping = {
  [CALCULATION]: () => require('../calculation/process-calculation'),
  [ORGANISATION]: () => require('../organisation/process-organisation'),
  [DELINKED]: () => require('../delinked/process-delinked'),
  [TOTAL]: () => require('../total/process-total'),
  [DAX]: () => require('../dax/process-dax'),
  [D365]: () => require('../d365/process-d365')
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
