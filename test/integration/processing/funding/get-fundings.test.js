const db = require('../../../../app/data')

const getFundings = require('../../../../app/processing/funding/get-fundings')

let fundings

describe('get and transform fundings object for building a statement object', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {
    const schemes = JSON.parse(JSON.stringify(require('../../../../app/constants/schemes')))
    const {
      SFI_FIRST_PAYMENT: invoiceNumber,
      SFI_FIRST_PAYMENT_ORIGINAL: originalInvoiceNumber
    } = JSON.parse(JSON.stringify(require('../../../mock-components/mock-invoice-number')))
    const fundingOptions = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-funding-options')))
    const calculation = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-calculation')))
    const organisation = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-organisation')))
    const paymentRequest = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').submitPaymentRequest))
    fundings = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-fundings')))

    await db.scheme.bulkCreate(schemes)
    await db.fundingOption.bulkCreate(fundingOptions)
    await db.organisation.create({ ...organisation, sbi: calculation.sbi })
    await db.invoiceNumber.create({ invoiceNumber, originalInvoiceNumber })
    await db.paymentRequest.create(paymentRequest)
    await db.calculation.create(calculation)
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

  test('should return list of all matching record when called with calculationId and all matching records are valid', async () => {
    const calculationId = 1
    await db.funding.bulkCreate(fundings.map(x => { return { ...x, calculationId } }))

    const result = await getFundings(calculationId)

    expect(result.length).toBe(fundings.length)
  })

  test('should return valid when called with calculationId and a returned record has null rate but with name equal Moorland: Additional', async () => {
    const calculationId = 1
    fundings[0].rate = null
    await db.funding.bulkCreate(fundings.map(x => { return { ...x, calculationId } }))

    const result = await getFundings(calculationId)

    expect(result.length).toBe(fundings.length)
  })

  test('should return valid when called with calculationId and a returned record has null areaClaimed but with name equal Moorland: Additional', async () => {
    const calculationId = 1
    fundings[0].areaClaimed = null
    await db.funding.bulkCreate(fundings.map(x => { return { ...x, calculationId } }))

    const result = await getFundings(calculationId)

    expect(result.length).toBe(fundings.length)
  })

  test('should return valid when called with calculationId and a returned record has null rate and null areaClaimed but with name equal Moorland: Additional', async () => {
    const calculationId = 1
    fundings[0].rate = null
    fundings[0].areaClaimed = null
    await db.funding.bulkCreate(fundings.map(x => { return { ...x, calculationId } }))

    const result = await getFundings(calculationId)

    expect(result.length).toBe(fundings.length)
  })

  test('should return invalid when called with calculationId and a returned record has null rate but with name equal Arable and horticultural soils: Introductory', async () => {
    const calculationId = 1
    fundings[1].rate = null
    await db.funding.bulkCreate(fundings.map(x => { return { ...x, calculationId } }))

    const wrapper = async () => {
      await getFundings(calculationId)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should return invalid when called with calculationId and a returned record has null areaClaimed but with name equal Arable and horticultural soils: Introductory', async () => {
    const calculationId = 1
    fundings[1].areaClaimed = null
    await db.funding.bulkCreate(fundings.map(x => { return { ...x, calculationId } }))

    const wrapper = async () => {
      await getFundings(calculationId)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should return invalid when called with calculationId and a returned record has null rate but with name equal Common land: Additional', async () => {
    const calculationId = 1
    fundings[2].rate = null
    await db.funding.bulkCreate(fundings.map(x => { return { ...x, calculationId } }))

    const wrapper = async () => {
      await getFundings(calculationId)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should return invalid when called with calculationId and a returned record has null areaClaimed but with name equal Common land: Additional', async () => {
    const calculationId = 1
    fundings[2].areaClaimed = null
    await db.funding.bulkCreate(fundings.map(x => { return { ...x, calculationId } }))

    const wrapper = async () => {
      await getFundings(calculationId)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should return invalid when called with calculationId and a returned record has null rate but with name equal Hedgerow', async () => {
    const calculationId = 1
    fundings[3].rate = null
    await db.funding.bulkCreate(fundings.map(x => { return { ...x, calculationId } }))

    const wrapper = async () => {
      await getFundings(calculationId)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should return invalid when called with calculationId and a returned record has null areaClaimed but with name equal Hedgerow', async () => {
    const calculationId = 1
    fundings[3].areaClaimed = null
    await db.funding.bulkCreate(fundings.map(x => { return { ...x, calculationId } }))

    const wrapper = async () => {
      await getFundings(calculationId)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should return invalid when called with calculationId and a returned record has null rate but with name equal Moorland: Additional', async () => {
    const calculationId = 1
    fundings[4].rate = null
    await db.funding.bulkCreate(fundings.map(x => { return { ...x, calculationId } }))

    const wrapper = async () => {
      await getFundings(calculationId)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should return invalid when called with calculationId and a returned record has null areaClaimed but with name equal Moorland: Additional', async () => {
    const calculationId = 1
    fundings[4].areaClaimed = null
    await db.funding.bulkCreate(fundings.map(x => { return { ...x, calculationId } }))

    const wrapper = async () => {
      await getFundings(calculationId)
    }

    expect(wrapper).rejects.toThrow(Error)
  })
})
