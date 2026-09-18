const config = require('../config')
const { Database } = require('ffc-database')

const dbConfig = config.dbConfig[config.env]

// Table names come from the Liquibase changelog and are the single declaration
// of this service's schema surface. Each becomes an accessor on the exported
// object, e.g. organisations(), d365(transaction).
const tables = {
  actions: 'actions',
  calculations: 'calculations',
  d365: 'd365',
  dax: 'dax',
  delinkedCalculations: 'delinkedCalculation',
  documents: 'documents',
  documentTypes: 'documentTypes',
  excludedPaymentReferences: 'excludedPaymentReferences',
  organisations: 'organisations',
  schemes: 'schemes',
  totals: 'totals'
}

const database = new Database({ ...dbConfig, tables })

module.exports = database.connect()
