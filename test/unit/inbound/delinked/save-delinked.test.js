const db = require('../../../../app/data')
const saveDelinked = require('../../../../app/inbound/delinked/save-delinked')

jest.mock('../../../../app/data')

const expectedPayload = {
  calculationId: 'calculationReference1',
  applicationId: 'applicationReference1',
  sbi: undefined,
  frn: undefined,
  paymentBand1: undefined,
  paymentBand2: undefined,
  paymentBand3: undefined,
  paymentBand4: undefined,
  percentageReduction1: undefined,
  percentageReduction2: undefined,
  percentageReduction3: undefined,
  percentageReduction4: undefined,
  paymentAmountCalculated: undefined,
  progressiveReductions1: undefined,
  progressiveReductions2: undefined,
  progressiveReductions3: undefined,
  progressiveReductions4: undefined,
  referenceAmount: undefined,
  totalProgressiveReduction: undefined,
  totalDelinkedPayment: undefined,
  datePublished: undefined,
  updated: expect.any(Date)
}

describe('saveDelinked', () => {
  const transaction = {}
  const delinkedCalculation = {
    calculationId: 'calculationReference1',
    applicationId: 'applicationReference1'
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should save the transformed delinked calculation successfully', async () => {
    db.delinkedCalculation.create.mockResolvedValue()

    await saveDelinked(delinkedCalculation, transaction)

    expect(db.delinkedCalculation.create).toHaveBeenCalledWith(expectedPayload, {
      transaction,
      raw: true
    })
  })

  test('should throw an error if saving fails', async () => {
    const errorMessage = 'Database error'
    db.delinkedCalculation.create.mockRejectedValue(new Error(errorMessage))

    await expect(saveDelinked(delinkedCalculation, transaction)).rejects.toThrow('Database error')
  })

  test('should transform delinkedCalculation correctly', async () => {
    db.delinkedCalculation.create.mockResolvedValue()

    await saveDelinked(delinkedCalculation, transaction)

    expect(db.delinkedCalculation.create).toHaveBeenCalledWith(expectedPayload, {
      transaction,
      raw: true
    })
  })

  test('should not contain calculationReference and applicationReference after transformation', async () => {
    db.delinkedCalculation.create.mockResolvedValue()

    await saveDelinked(delinkedCalculation, transaction)

    const callArgs = db.delinkedCalculation.create.mock.calls[0][0]
    expect(callArgs).not.toHaveProperty('calculationReference')
    expect(callArgs).not.toHaveProperty('applicationReference')
  })
})
