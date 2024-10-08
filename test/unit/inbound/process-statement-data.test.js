const processStatementData = require('../../../app/inbound/statement-data/process-statement-data')
const { CALCULATION, ORGANISATION, TOTAL, DELINKED, DAX, D365 } = require('../../../app/constants/types')

const processOrganisation = require('../../../app/inbound/organisation/process-organisation')
const processCalculation = require('../../../app/inbound/calculation/process-calculation')
const processDelinked = require('../../../app/inbound/delinked/process-delinked')
const processTotal = require('../../../app/inbound/total/process-total')
const processDax = require('../../../app/inbound/dax/process-dax')
const processD365 = require('../../../app/inbound/d365/process-d365')

jest.mock('../../../app/inbound/organisation/process-organisation')
jest.mock('../../../app/inbound/calculation/process-calculation')
jest.mock('../../../app/inbound/delinked/process-delinked')
jest.mock('../../../app/inbound/total/process-total')
jest.mock('../../../app/inbound/dax/process-dax')
jest.mock('../../../app/inbound/d365/process-d365')

let calculationData
let organisationData
let totalData
let delinkedData
let daxData
let d365Data

describe('process statement data', () => {
  beforeEach(() => {
    calculationData = JSON.parse(JSON.stringify(require('../../mock-objects/mock-calculation')))
    organisationData = JSON.parse(JSON.stringify(require('../../mock-objects/mock-organisation')))
    totalData = JSON.parse(JSON.stringify(require('../../mock-objects/mock-total')))
    delinkedData = JSON.parse(JSON.stringify(require('../../mock-objects/mock-delinked')))
    daxData = JSON.parse(JSON.stringify(require('../../mock-objects/mock-dax')))
    d365Data = JSON.parse(JSON.stringify(require('../../mock-objects/mock-d365')))

    processCalculation.mockResolvedValue(undefined)
    processOrganisation.mockResolvedValue(undefined)
    processDelinked.mockResolvedValue(undefined)
    processTotal.mockResolvedValue(undefined)
    processDax.mockResolvedValue(undefined)
    processD365.mockResolvedValue(undefined)
  })

  test('should process calculation data', async () => {
    await processStatementData({ type: CALCULATION, ...calculationData })
    expect(processCalculation).toHaveBeenCalledWith({ type: CALCULATION, ...calculationData })
  })

  test('should process organisation data', async () => {
    await processStatementData({ type: ORGANISATION, ...organisationData })
    expect(processOrganisation).toHaveBeenCalledWith({ type: ORGANISATION, ...organisationData })
  })

  test('should process total data', async () => {
    await processStatementData({ type: TOTAL, ...totalData })
    expect(processTotal).toHaveBeenCalledWith({ type: TOTAL, ...totalData })
  })

  test('should process delinked data', async () => {
    await processStatementData({ type: DELINKED, ...delinkedData })
    expect(processDelinked).toHaveBeenCalledWith({ type: DELINKED, ...delinkedData })
  })

  test('should process dax data', async () => {
    await processStatementData({ type: DAX, ...daxData })
    expect(processDax).toHaveBeenCalledWith({ type: DAX, ...daxData })
  })

  test('should process d365 data', async () => {
    await processStatementData({ type: D365, ...d365Data })
    expect(processD365).toHaveBeenCalledWith({ type: D365, ...d365Data })
  })

  test('should warn if type is invalid or not supported', async () => {
    console.warn = jest.fn()
    await processStatementData({ type: 'INVALID_TYPE' })
    expect(console.warn).toHaveBeenCalledWith('Type is invalid or not supported: INVALID_TYPE')
  })
})
