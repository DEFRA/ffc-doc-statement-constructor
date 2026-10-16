const db = require('../../../../../app/database')
const { truncate } = require('../../../../helpers/truncate')

const getTotalByCalculationId = require('../../../../../app/processing/sfi-23-quarterly-statement/total/get-total-by-calculation-id')

const calculationIdOne = 11235452
const calculationIdTwo = 76726627

let retrievedTotal

describe('process get calculation object', () => {
  beforeAll(async () => {
    await truncate()
  })

  beforeEach(async () => {
    const { type, ...organisation } = structuredClone(require('../../../../mock-objects/mock-organisation'))
    const { calculationReference, claimReference, actions, type: _type, ...total } = structuredClone(require('../../../../mock-objects/mock-total'))

    const totals = [
      { ...total, calculationId: calculationIdOne, claimId: claimReference },
      { ...total, calculationId: calculationIdTwo, claimId: claimReference }
    ]
    retrievedTotal = {
      agreementEnd: new Date('2022-01-01T00:00:00.000Z'),
      agreementNumber: 123456789,
      agreementStart: new Date('2022-12-31T00:00:00.000Z'),
      calculationDate: new Date('2022-01-27T00:00:00.000Z'),
      calculationReference: 11235452,
      claimReference: 123456789,
      invoiceNumber: 'INVOICE123456',
      sbi: 105321000,
      schemeCode: 'SFIA',
      totalActionPayments: '1234.56',
      totalAdditionalPayments: '1234.56',
      totalPayments: '9987.65'
    }

    await db.organisations().insert(organisation)
    await db.totals().insert(totals)
  })

  afterEach(async () => {
    await truncate()
  })

  afterAll(async () => {
    await db.close()
  })

  test('Should return total object when there is corresponding total with provided calculationId', async () => {
    const result = await getTotalByCalculationId(calculationIdOne)
    expect(result).toStrictEqual(retrievedTotal)
  })

  test('Should return null when there is no total with provided calculationId', async () => {
    const result = await getTotalByCalculationId(1)
    expect(result).toBeNull()
  })
})
