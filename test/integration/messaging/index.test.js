const db = require('../../../app/data')

const {
  processProcessingPaymentRequest,
  processStatementData,
  processSubmitPaymentRequest,
  processReturnSettlement
} = require('../../../app/inbound')

let calculation
let organisation
let paymentRequestInProgress
let paymentRequestCompleted
let settlement

describe('process messages off Topics', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {
    const schemes = JSON.parse(JSON.stringify(require('../../../app/constants/schemes')))
    const fundingOptions = JSON.parse(JSON.stringify(require('../../../app/constants/funding-options')))
    calculation = JSON.parse(JSON.stringify(require('../../mock-objects/mock-calculation')))
    organisation = JSON.parse(JSON.stringify(require('../../mock-objects/mock-organisation')))
    paymentRequestInProgress = require('../../mock-objects/mock-payment-request').processingPaymentRequest
    paymentRequestCompleted = require('../../mock-objects/mock-payment-request').submitPaymentRequest
    settlement = JSON.parse(JSON.stringify(require('../../mock-objects/mock-settlement')))

    await db.scheme.bulkCreate(schemes)
    await db.fundingOption.bulkCreate(fundingOptions)
  })

  afterEach(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  afterAll(async () => {
    await db.sequelize.close()
  })

  test('should not throw when processing happens in order: processing, submit, return, calculation, organisation', async () => {
    const wrapper = async () => {
      await processProcessingPaymentRequest(paymentRequestInProgress)
      await processSubmitPaymentRequest(paymentRequestCompleted)
      await processReturnSettlement(settlement)
      await processStatementData(calculation)
      await processStatementData(organisation)
    }

    await expect(wrapper()).resolves.not.toThrow()
  })

  test('should not throw when processing happens in order: submit, processing, return, calculation, organisation', async () => {
    const wrapper = async () => {
      await processSubmitPaymentRequest(paymentRequestCompleted)
      await processProcessingPaymentRequest(paymentRequestInProgress)
      await processReturnSettlement(settlement)
      await processStatementData(calculation)
      await processStatementData(organisation)
    }

    await expect(wrapper()).resolves.not.toThrow()
  })

  test('should not throw when processing happens in order: return, processing, submit, calculation, organisation', async () => {
    const wrapper = async () => {
      await processReturnSettlement(settlement)
      await processProcessingPaymentRequest(paymentRequestInProgress)
      await processSubmitPaymentRequest(paymentRequestCompleted)
      await processStatementData(calculation)
      await processStatementData(organisation)
    }

    await expect(wrapper()).resolves.not.toThrow()
  })

  test('should not throw when processing happens in order: submit, return, processing, calculation, organisation', async () => {
    const wrapper = async () => {
      await processSubmitPaymentRequest(paymentRequestCompleted)
      await processReturnSettlement(settlement)
      await processProcessingPaymentRequest(paymentRequestInProgress)
      await processStatementData(calculation)
      await processStatementData(organisation)
    }

    await expect(wrapper()).resolves.not.toThrow()
  })

  test('should not throw when processing happens in order: return, submit, processing, calculation, organisation', async () => {
    const wrapper = async () => {
      await processReturnSettlement(settlement)
      await processSubmitPaymentRequest(paymentRequestCompleted)
      await processProcessingPaymentRequest(paymentRequestInProgress)
      await processStatementData(calculation)
      await processStatementData(organisation)
    }

    await expect(wrapper()).resolves.not.toThrow()
  })

  test('should not throw when processing happens in order: processing, submit, return, organisation, calculation', async () => {
    const wrapper = async () => {
      await processProcessingPaymentRequest(paymentRequestInProgress)
      await processSubmitPaymentRequest(paymentRequestCompleted)
      await processReturnSettlement(settlement)
      await processStatementData(organisation)
      await processStatementData(calculation)
    }

    await expect(wrapper()).resolves.not.toThrow()
  })

  test('should not throw when processing happens in order: calculation, organisation, processing, submit, return', async () => {
    const wrapper = async () => {
      await processStatementData(calculation)
      await processStatementData(organisation)
      await processProcessingPaymentRequest(paymentRequestInProgress)
      await processSubmitPaymentRequest(paymentRequestCompleted)
      await processReturnSettlement(settlement)
    }

    await expect(wrapper()).resolves.not.toThrow()
  })

  test('should not throw when processing happens in order: organisation, calculation, processing, submit, return', async () => {
    const wrapper = async () => {
      await processStatementData(organisation)
      await processStatementData(calculation)
      await processProcessingPaymentRequest(paymentRequestInProgress)
      await processSubmitPaymentRequest(paymentRequestCompleted)
      await processReturnSettlement(settlement)
    }

    await expect(wrapper()).resolves.not.toThrow()
  })
})
