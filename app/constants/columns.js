const TABLES = require('./tables')

const PRIMARY_KEYS = {
  [TABLES.d365]: 'd365Id',
  [TABLES.documents]: 'documentId',
  [TABLES.documentTypes]: 'documentTypeId',
  [TABLES.excludedPaymentReferences]: 'excludedPaymentReferenceId',
  [TABLES.schemes]: 'schemeId'
}

const COLUMNS = {
  [TABLES.actions]: [
    'actionId',
    'calculationId',
    'fundingCode',
    'groupName',
    'actionCode',
    'actionName',
    'rate',
    'landArea',
    'uom',
    'annualValue',
    'quarterlyValue',
    'overDeclarationPenalty',
    'quarterlyPaymentAmount'
  ],
  [TABLES.d365]: [
    'd365Id',
    'paymentReference',
    'calculationId',
    'paymentPeriod',
    'paymentAmount',
    'transactionDate',
    'datePublished',
    'startPublish',
    'completePublish',
    'lastProcessAttempt',
    'marketingYear'
  ],
  [TABLES.dax]: [
    'paymentReference',
    'calculationId',
    'paymentPeriod',
    'paymentAmount',
    'transactionDate',
    'datePublished',
    'daxId',
    'startPublish',
    'completePublish',
    'lastProcessAttempt'
  ],
  [TABLES.delinkedCalculations]: [
    'calculationId',
    'applicationId',
    'sbi',
    'frn',
    'paymentBand1',
    'paymentBand2',
    'paymentBand3',
    'paymentBand4',
    'percentageReduction1',
    'percentageReduction2',
    'percentageReduction3',
    'percentageReduction4',
    'paymentAmountCalculated',
    'progressiveReductions1',
    'progressiveReductions2',
    'progressiveReductions3',
    'progressiveReductions4',
    'referenceAmount',
    'totalProgressiveReduction',
    'totalDelinkedPayment',
    'datePublished',
    'updated'
  ],
  [TABLES.documents]: [
    'documentId',
    'documentTypeId',
    'documentSourceReference'
  ],
  [TABLES.documentTypes]: [
    'documentTypeId',
    'code',
    'name',
    'description'
  ],
  [TABLES.excludedPaymentReferences]: [
    'excludedPaymentReferenceId',
    'frn',
    'paymentReference'
  ],
  [TABLES.organisations]: [
    'sbi',
    'addressLine1',
    'addressLine2',
    'addressLine3',
    'city',
    'county',
    'emailAddress',
    'frn',
    'name',
    'postcode',
    'updated'
  ],
  [TABLES.schemes]: [
    'schemeId',
    'name',
    'code'
  ],
  [TABLES.totals]: [
    'calculationId',
    'claimId',
    'sbi',
    'frn',
    'agreementNumber',
    'schemeType',
    'calculationDate',
    'invoiceNumber',
    'agreementStart',
    'agreementEnd',
    'totalAdditionalPayments',
    'totalActionPayments',
    'totalPayments',
    'updated',
    'datePublished'
  ]
}

const pickColumns = (record, table) => {
  return Object.fromEntries(
    Object.entries(record)
      .filter(([column]) => COLUMNS[table].includes(column))
      .filter(([column]) => column !== PRIMARY_KEYS[table])
  )
}

module.exports = {
  PRIMARY_KEYS,
  COLUMNS,
  pickColumns
}
