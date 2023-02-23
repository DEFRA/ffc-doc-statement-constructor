const { convertToPounds } = require('../../../app/utility')

describe('convert integer pence to string decimal pounds', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return "567.89" when 56789 is given', async () => {
    const result = await convertToPounds(56789)
    expect(result).toBe('567.89')
  })

  test('should return "0.00" when 0 is given', async () => {
    const result = await convertToPounds(0)
    expect(result).toBe('0.00')
  })

  test('should return "0.01" when 1 is given', async () => {
    const result = await convertToPounds(1)
    expect(result).toBe('0.01')
  })

  test('should return "0.10" when 10 is given', async () => {
    const result = await convertToPounds(10)
    expect(result).toBe('0.10')
  })

  test('should return "1.00" when 100 is given', async () => {
    const result = await convertToPounds(100)
    expect(result).toBe('1.00')
  })

  test('should return "1.01" when 101 is given', async () => {
    const result = await convertToPounds(101)
    expect(result).toBe('1.01')
  })

  test('should return "1.10" when 110 is given', async () => {
    const result = await convertToPounds(110)
    expect(result).toBe('1.10')
  })

  test('should return "1.11" when 111 is given', async () => {
    const result = await convertToPounds(111)
    expect(result).toBe('1.11')
  })

  test('should return "10.00" when 1000 is given', async () => {
    const result = await convertToPounds(1000)
    expect(result).toBe('10.00')
  })

  test('should return "10.01" when 1001 is given', async () => {
    const result = await convertToPounds(1001)
    expect(result).toBe('10.01')
  })

  test('should return "10.10" when 1010 is given', async () => {
    const result = await convertToPounds(1010)
    expect(result).toBe('10.10')
  })

  test('should return "10.11" when 1011 is given', async () => {
    const result = await convertToPounds(1011)
    expect(result).toBe('10.11')
  })

  test('should return "11.00" when 1100 is given', async () => {
    const result = await convertToPounds(1100)
    expect(result).toBe('11.00')
  })

  test('should return "11.02" when 1101.1 is given', async () => {
    const result = await convertToPounds(1101.1)
    expect(result).toBe('11.02')
  })

  test('should return "11.02" when 1101.5 is given', async () => {
    const result = await convertToPounds(1101.1)
    expect(result).toBe('11.02')
  })

  test('should return "11.02" when 1101.9 is given', async () => {
    const result = await convertToPounds(1101.1)
    expect(result).toBe('11.02')
  })

  test('should return "0.00" when undefined', async () => {
    const result = await convertToPounds(undefined)
    expect(result).toBe('0.00')
  })

  test('should return "0.00" when null', async () => {
    const result = await convertToPounds(null)
    expect(result).toBe('0.00')
  })
})
