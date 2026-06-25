const THROUGHPUT_LOG_INTERVAL_MS = 30000

const state = {
  counts: {},
  windowStart: Date.now()
}

const record = (type) => {
  state.counts[type] = (state.counts[type] || 0) + 1
  const elapsed = Date.now() - state.windowStart
  if (elapsed >= THROUGHPUT_LOG_INTERVAL_MS) {
    const seconds = elapsed / 1000
    const summary = Object.entries(state.counts)
      .map(([t, c]) => `${t}: ${c} (${(c / seconds).toFixed(1)}/s)`)
      .join(', ')
    const total = Object.values(state.counts).reduce((a, b) => a + b, 0)
    console.info(`Throughput [${seconds.toFixed(0)}s window] — ${summary} — total: ${total} (${(total / seconds).toFixed(1)}/s)`)
    state.counts = {}
    state.windowStart = Date.now()
  }
}

module.exports = { record, state, THROUGHPUT_LOG_INTERVAL_MS }
