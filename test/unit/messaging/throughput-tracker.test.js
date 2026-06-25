const { record, state, THROUGHPUT_LOG_INTERVAL_MS } = require('../../../app/messaging/throughput-tracker')

describe('throughput-tracker', () => {
  let infoSpy

  beforeEach(() => {
    state.counts = {}
    state.windowStart = Date.now()
    infoSpy = jest.spyOn(console, 'info').mockImplementation()
  })

  afterEach(() => {
    infoSpy.mockRestore()
  })

  test('increments count for a given type', () => {
    record('organisation')
    expect(state.counts.organisation).toBe(1)
  })

  test('accumulates counts across multiple calls for the same type', () => {
    record('organisation')
    record('organisation')
    record('organisation')
    expect(state.counts.organisation).toBe(3)
  })

  test('tracks counts independently per type', () => {
    record('organisation')
    record('total')
    record('total')
    expect(state.counts.organisation).toBe(1)
    expect(state.counts.total).toBe(2)
  })

  test('does not log before the interval has elapsed', () => {
    record('organisation')
    expect(infoSpy).not.toHaveBeenCalled()
  })

  test('logs throughput and resets state when interval has elapsed', () => {
    state.windowStart = Date.now() - THROUGHPUT_LOG_INTERVAL_MS - 1
    state.counts = { organisation: 10, total: 5 }

    record('organisation')

    expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('organisation'))
    expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('total'))
    expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('/s'))
    expect(state.counts).toEqual({})
  })

  test('resets windowStart after logging', () => {
    const before = Date.now()
    state.windowStart = before - THROUGHPUT_LOG_INTERVAL_MS - 1

    record('organisation')

    expect(state.windowStart).toBeGreaterThanOrEqual(before)
  })

  test('log message includes total across all types', () => {
    state.windowStart = Date.now() - THROUGHPUT_LOG_INTERVAL_MS - 1
    state.counts = { organisation: 30, total: 20 }

    record('delinked')

    expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('total: 51'))
  })

  test('logs correct format with window duration', () => {
    const startTime = Date.now()
    state.windowStart = startTime - 30000
    state.counts = { organisation: 10 }

    record('organisation')

    const callArgs = infoSpy.mock.calls[0][0]
    expect(callArgs).toMatch(/Throughput \[\d+s window\]/)
  })

  test('logs each type with count and rate per second', () => {
    state.windowStart = Date.now() - 30000
    state.counts = { organisation: 15, total: 10 }

    record('organisation')

    const callArgs = infoSpy.mock.calls[0][0]
    expect(callArgs).toMatch(/organisation: 16 \(\d+\.\d+\/s\)/)
    expect(callArgs).toMatch(/total: 10 \(\d+\.\d+\/s\)/)
  })

  test('logs total count and overall rate', () => {
    state.windowStart = Date.now() - 30000
    state.counts = { organisation: 12, total: 8 }

    record('delinked')

    const callArgs = infoSpy.mock.calls[0][0]
    expect(callArgs).toMatch(/— total: 21 \(\d+\.\d+\/s\)/)
  })

  test('logs rates accurately for 30 second window', () => {
    state.windowStart = Date.now() - 30000
    state.counts = { organisation: 10 }

    record('organisation')

    const callArgs = infoSpy.mock.calls[0][0]
    expect(callArgs).toMatch(/organisation: 11 \(\d+\.\d+\/s\)/)
    expect(callArgs).toMatch(/total: 11 \(\d+\.\d+\/s\)/)
  })

  test('logs multiple types in a single message', () => {
    state.windowStart = Date.now() - THROUGHPUT_LOG_INTERVAL_MS - 1
    state.counts = { organisation: 8, total: 5, delinked: 3, dax: 2, d365: 1 }

    record('organisation')

    const callArgs = infoSpy.mock.calls[0][0]
    expect(callArgs).toContain('organisation:')
    expect(callArgs).toContain('total:')
    expect(callArgs).toContain('delinked:')
    expect(callArgs).toContain('dax:')
    expect(callArgs).toContain('d365:')
    expect(callArgs).toMatch(/— total: 20 \(\d+\.\d+\/s\)$/)
  })

  test('only calls console.info once when threshold is crossed', () => {
    state.windowStart = Date.now() - THROUGHPUT_LOG_INTERVAL_MS - 1
    state.counts = { organisation: 5 }

    record('organisation')

    expect(infoSpy).toHaveBeenCalledTimes(1)
  })
})
