jest.mock('../../../app/inbound/calculation/process-calculation')
const processCalculation = require('../../../app/inbound/calculation/process-calculation')

jest.mock('../../../app/inbound/organisation/process-organisation')
const processOrganisation = require('../../../app/inbound/organisation/process-organisation')

jest.mock('../../../app/inbound/total/process-total')
const processTotal = require('../../../app/inbound/total/process-total')

jest.mock('../../../app/inbound/dax/process-dax')
const processDax = require('../../../app/inbound/dax/process-dax')

const processStatementData = require('../../../app/inbound/statement-data')

let calculationData
let organisationData
let totalData
let daxData

describe('process statement data', () => {
  beforeEach(() => {
    calculationData = JSON.parse(JSON.stringify(require('../../mock-objects/mock-calculation')))
    organisationData = JSON.parse(JSON.stringify(require('../../mock-objects/mock-organisation')))
    totalData = JSON.parse(JSON.stringify(require('../../mock-objects/mock-total')))
    daxData = JSON.parse(JSON.stringify(require('../../mock-objects/mock-dax')))

    processCalculation.mockResolvedValue(undefined)
    processOrganisation.mockResolvedValue(undefined)
    processTotal.mockResolvedValue(undefined)
    processDax.mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call processCalculation when calculationData is given', async () => {
    await processStatementData(calculationData)
    expect(processCalculation).toHaveBeenCalled()
  })

  test('should call processCalculation once when calculationData is given', async () => {
    await processStatementData(calculationData)
    expect(processCalculation).toHaveBeenCalledTimes(1)
  })

  test('should call processCalculation with statementData when calculationData is given', async () => {
    await processStatementData(calculationData)
    expect(processCalculation).toHaveBeenCalledWith(calculationData)
  })

  test('should call processTotal when totalData is given', async () => {
    await processStatementData(totalData)
    expect(processTotal).toHaveBeenCalled()
  })

  test('should call processTotal once when totalData is given', async () => {
    await processStatementData(totalData)
    expect(processTotal).toHaveBeenCalledTimes(1)
  })

  test('should call processTotal with statementData when totalData is given', async () => {
    await processStatementData(totalData)
    expect(processTotal).toHaveBeenCalledWith(totalData)
  })

  test('should call processDax when daxData is given', async () => {
    await processStatementData(daxData)
    expect(processDax).toHaveBeenCalled()
  })

  test('should call processDax once when daxData is given', async () => {
    await processStatementData(daxData)
    expect(processDax).toHaveBeenCalledTimes(1)
  })

  test('should call processDax with daxData when calculationData is given', async () => {
    await processStatementData(daxData)
    expect(processDax).toHaveBeenCalledWith(daxData)
  })

  test('should not call processOrganisation when calculationData is given', async () => {
    await processStatementData(calculationData)
    expect(processOrganisation).not.toHaveBeenCalled()
  })

  test('should throw when processCalculation throws', async () => {
    processCalculation.mockRejectedValue(new Error('Processing calculation issue'))

    const wrapper = async () => {
      await processCalculation(calculationData)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when processCalculation throws Error', async () => {
    processCalculation.mockRejectedValue(new Error('Processing calculation issue'))

    const wrapper = async () => {
      await processCalculation(calculationData)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Processing calculation issue" when processCalculation throws error with "Processing organisation issue"', async () => {
    processCalculation.mockRejectedValue(new Error('Processing calculation issue'))

    const wrapper = async () => {
      await processCalculation(calculationData)
    }

    expect(wrapper).rejects.toThrow(/^Processing calculation issue$/)
  })

  test('should call processOrganisation when organisationData is given', async () => {
    await processStatementData(organisationData)
    expect(processOrganisation).toHaveBeenCalled()
  })

  test('should call processOrganisation once when organisationData is given', async () => {
    await processStatementData(organisationData)
    expect(processOrganisation).toHaveBeenCalledTimes(1)
  })

  test('should call processOrganisation with organisationData when organisationData is given', async () => {
    await processStatementData(organisationData)
    expect(processOrganisation).toHaveBeenCalledWith(organisationData)
  })

  test('should not call processCalculation when organisationData is given', async () => {
    await processStatementData(organisationData)
    expect(processCalculation).not.toHaveBeenCalled()
  })

  test('should throw when processOrganisation throws', async () => {
    processOrganisation.mockRejectedValue(new Error('Processing organisation issue'))

    const wrapper = async () => {
      await processOrganisation(organisationData)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when processOrganisation throws Error', async () => {
    processOrganisation.mockRejectedValue(new Error('Processing organisation issue'))

    const wrapper = async () => {
      await processOrganisation(organisationData)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Processing organisation issue" when processOrganisation throws error with "Processing organisation issue"', async () => {
    processOrganisation.mockRejectedValue(new Error('Processing organisation issue'))

    const wrapper = async () => {
      await processOrganisation(organisationData)
    }

    expect(wrapper).rejects.toThrow(/^Processing organisation issue$/)
  })

  test('should throw when statementData.type is not recognised', async () => {
    calculationData.type = 'Not a real type'

    const wrapper = async () => {
      await processStatementData(calculationData)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when statementData.type is not recognised', async () => {
    calculationData.type = 'Not a real type'

    const wrapper = async () => {
      await processStatementData(calculationData)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Type: type is invalid" when statementData.type is not recognised', async () => {
    calculationData.type = 'Not a real type'

    const wrapper = async () => {
      await processStatementData(calculationData)
    }

    expect(wrapper).rejects.toThrow(/^Type is invalid: Not a real type$/)
  })

  test('should not call processCalculation when statementData.type is not recognised', async () => {
    calculationData.type = 'Not a real type'
    try { await processStatementData(calculationData) } catch {}
    expect(processCalculation).not.toHaveBeenCalled()
  })

  test('should not call processOrganisation when statementData.type is not recognised', async () => {
    organisationData.type = 'Not a real type'
    try { await processStatementData(organisationData) } catch {}
    expect(processOrganisation).not.toHaveBeenCalled()
  })
})
