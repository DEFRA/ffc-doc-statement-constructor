/**
 * @jest-environment ./test/e2e/environments/sfi23-quarterly-statement.js
 */
/* All mocking should be done in the custom environment, doiung it here as a quick and dirty hack to see what mocking is needed */
const SequelizeMock = require("sequelize-mock")
const db = require("../../app/data")
const processSfi23QuarterlyStatement = require('../../app/processing/process-sfi-23-quarterly-statements')
const { Client } = require('pg')

/**
 * The following error is happening and I cannot figure out what this validation routine is supposed to be doing 
 * Error: Total with the CalculationId: undefined does not have the required details data: The field calculationReference is not present but it is required. The field agreementNumber is not present but it is required. The field claimReference is not present but it is required. The field sbi is not present but it is required. The field schemeCode is not present but it is required. The field calculationDate is not present but it is required. The field invoiceNumber is not present but it is required. The field agreementStart is not present but it is required. The field agreementEnd is not present but it is required. The field totalAdditionalPayments is not present but it is required. The field totalActionPayments is not present but it is required. The field totalPayments is not present but it is required. "options" is not allowed. "_values" is not allowed. "dataValues" is not allowed. "hasPrimaryKeys" is not allowed. "__validationErrors" is not allowed
        at validateTotal (/workspaces/ffc-doc-statement-constructor/app/processing/sfi-23-quarterly-statement/total/validate-total.js:9:11)
        at validateTotal (/workspaces/ffc-doc-statement-constructor/app/processing/sfi-23-quarterly-statement/total/get-total.js:6:10)
        at getSfi23QuarterlyStatementByPaymentReference (/workspaces/ffc-doc-statement-constructor/app/processing/sfi-23-quarterly-statement/get-sfi-23-quarterly-statement-by-payment-reference.js:18:17)
        at processSfi23QuarterlyStatement (/workspaces/ffc-doc-statement-constructor/app/processing/process-sfi-23-quarterly-statements.js:21:39)
 *
 * The schema does not match the data model defined so I have no idea what the intention is here
 */


const daxes = [
  { paymentReference: 'PY2066810', calculationId: 1, paymentPeriod: 'Q3-24', paymentAmount: 16147.61, transactionDate: '2024-06-19 00:00:00', datePublished: null, daxId: 1, startPublish: null, completePublish: null, lastProcessAttempt: null },
  { paymentReference: 'PY2066811', calculationId: 2, paymentPeriod: 'Q3-24', paymentAmount: 6251.00, transactionDate: '2024-06-19 00:00:00', datePublished: null, daxId: 2, startPublish: null, completePublish: null, lastProcessAttempt: null },
  { paymentReference: 'PY2066814', calculationId: 3, paymentPeriod: 'Q3-24', paymentAmount: 2051.17, transactionDate: '2024-06-19 00:00:00', datePublished: null, daxId: 3, startPublish: null, completePublish: null, lastProcessAttempt: null },
  { paymentReference: 'PY2066817', calculationId: 4, paymentPeriod: 'Q3-24', paymentAmount: 6451.39, transactionDate: '2024-06-19 00:00:00', datePublished: null, daxId: 4, startPublish: null, completePublish: null, lastProcessAttempt: null },
  { paymentReference: 'PY2066818', calculationId: 5, paymentPeriod: 'Q3-24', paymentAmount: 3790.82, transactionDate: '2024-06-19 00:00:00', datePublished: null, daxId: 5, startPublish: null, completePublish: null, lastProcessAttempt: null },
  { paymentReference: 'PY2066819', calculationId: 6, paymentPeriod: 'Q3-24', paymentAmount: 107.17, transactionDate: '2024-06-19 00:00:00', datePublished: null, daxId: 6, startPublish: null, completePublish: null, lastProcessAttempt: null },
  { paymentReference: 'PY2066823', calculationId: 7, paymentPeriod: 'Q3-24', paymentAmount: 2163.32, transactionDate: '2024-06-19 00:00:00', datePublished: null, daxId: 7, startPublish: null, completePublish: null, lastProcessAttempt: null },
  { paymentReference: 'PY2066826', calculationId: 8, paymentPeriod: 'Q3-24', paymentAmount: 2499.13, transactionDate: '2024-06-19 00:00:00', datePublished: null, daxId: 8, startPublish: null, completePublish: null, lastProcessAttempt: null },
  { paymentReference: 'PY2066849', calculationId: 9, paymentPeriod: 'Q3-24', paymentAmount: 16147.61, transactionDate: '2024-06-19 00:00:00', datePublished: null, daxId: 9, startPublish: null, completePublish: null, lastProcessAttempt: null },
  { paymentReference: 'PY2066851', calculationId: 10, paymentPeriod: 'Q3-24', paymentAmount: 6251.00, transactionDate: '2024-06-19 00:00:00', datePublished: null, daxId: 10, startPublish: null, completePublish: null, lastProcessAttempt: null },
  { paymentReference: 'PY2066854', calculationId: 11, paymentPeriod: 'Q3-24', paymentAmount: 2051.17, transactionDate: '2024-06-19 00:00:00', datePublished: null, daxId: 11, startPublish: null, completePublish: null, lastProcessAttempt: null },
  { paymentReference: 'PY2066857', calculationId: 12, paymentPeriod: 'Q3-24', paymentAmount: 11084.32, transactionDate: '2024-06-19 00:00:00', datePublished: null, daxId: 12, startPublish: null, completePublish: null, lastProcessAttempt: null },
  { paymentReference: 'PY2066858', calculationId: 13, paymentPeriod: 'Q3-24', paymentAmount: 6451.39, transactionDate: '2024-06-19 00:00:00', datePublished: null, daxId: 13, startPublish: null, completePublish: null, lastProcessAttempt: null },
  { paymentReference: 'PY2066859', calculationId: 14, paymentPeriod: 'Q3-24', paymentAmount: 3790.82, transactionDate: '2024-06-19 00:00:00', datePublished: null, daxId: 14, startPublish: null, completePublish: null, lastProcessAttempt: null },
  { paymentReference: 'PY2066860', calculationId: 15, paymentPeriod: 'Q3-24', paymentAmount: 107.17, transactionDate: '2024-06-19 00:00:00', datePublished: null, daxId: 15, startPublish: null, completePublish: null, lastProcessAttempt: null },
  { paymentReference: 'PY2066865', calculationId: 16, paymentPeriod: 'Q3-24', paymentAmount: 2163.32, transactionDate: '2024-06-19 00:00:00', datePublished: null, daxId: 16, startPublish: null, completePublish: null, lastProcessAttempt: null },
  { paymentReference: 'PY2066868', calculationId: 17, paymentPeriod: 'Q3-24', paymentAmount: 2499.13, transactionDate: '2024-06-19 00:00:00', datePublished: null, daxId: 17, startPublish: null, completePublish: null, lastProcessAttempt: null },
  { paymentReference: 'PY2066869', calculationId: 18, paymentPeriod: 'Q3-24', paymentAmount: 1362.34, transactionDate: '2024-06-19 00:00:00', datePublished: null, daxId: 18, startPublish: null, completePublish: null, lastProcessAttempt: null },
  { paymentReference: 'PY2066870', calculationId: 19, paymentPeriod: 'Q3-24', paymentAmount: 16147.61, transactionDate: '2024-06-19 00:00:00', datePublished: null, daxId: 19, startPublish: null, completePublish: null, lastProcessAttempt: null },
  { paymentReference: 'PY2066871', calculationId: 20, paymentPeriod: 'Q3-24', paymentAmount: 6251.00, transactionDate: '2024-06-19 00:00:00', datePublished: null, daxId: 20, startPublish: null, completePublish: null, lastProcessAttempt: null },
  { paymentReference: 'PY2066872', calculationId: 21, paymentPeriod: 'Q3-24', paymentAmount: 2051.17, transactionDate: '2024-06-19 00:00:00', datePublished: null, daxId: 21, startPublish: null, completePublish: null, lastProcessAttempt: null },
  { paymentReference: 'PY2066873', calculationId: 22, paymentPeriod: 'Q3-24', paymentAmount: 11084.32, transactionDate: '2024-06-19 00:00:00', datePublished: null, daxId: 22, startPublish: null, completePublish: null, lastProcessAttempt: null },
  { paymentReference: 'PY2066874', calculationId: 23, paymentPeriod: 'Q3-24', paymentAmount: 6451.39, transactionDate: '2024-06-19 00:00:00', datePublished: null, daxId: 23, startPublish: null, completePublish: null, lastProcessAttempt: null },
  { paymentReference: 'PY2066875', calculationId: 24, paymentPeriod: 'Q3-24', paymentAmount: 3790.82, transactionDate: '2024-06-19 00:00:00', datePublished: null, daxId: 24, startPublish: null, completePublish: null, lastProcessAttempt: null },
  { paymentReference: 'PY2066876', calculationId: 25, paymentPeriod: 'Q3-24', paymentAmount: 107.17, transactionDate: '2024-06-19 00:00:00', datePublished: null, daxId: 25, startPublish: null, completePublish: null, lastProcessAttempt: null },
  { paymentReference: 'PY2066879', calculationId: 26, paymentPeriod: 'Q3-24', paymentAmount: 2163.32, transactionDate: '2024-06-19 00:00:00', datePublished: null, daxId: 26, startPublish: null, completePublish: null, lastProcessAttempt: null },
  { paymentReference: 'PY2066880', calculationId: 27, paymentPeriod: 'Q3-24', paymentAmount: 2499.13, transactionDate: '2024-06-19 00:00:00', datePublished: null, daxId: 27, startPublish: null, completePublish: null, lastProcessAttempt: null },  
  { paymentReference: 'PY2066881', calculationId: 28, paymentPeriod: 'Q3-24', paymentAmount: 1362.34, transactionDate: '2024-06-19 00:00:00', datePublished: null, daxId: 28, startPublish: null, completePublish: null, lastProcessAttempt: null },
  { paymentReference: 'PY2066885', calculationId: 29, paymentPeriod: 'Q4-24', paymentAmount: 16147.61, transactionDate: '2024-06-19 00:00:00', datePublished: null, daxId: 29, startPublish: null, completePublish: null, lastProcessAttempt: null },
  { paymentReference: 'PY2066886', calculationId: 30, paymentPeriod: 'Q4-24', paymentAmount: 7049.01, transactionDate: '2024-06-19 00:00:00', datePublished: null, daxId: 30, startPublish: null, completePublish: null, lastProcessAttempt: null },
  { paymentReference: 'PY2066887', calculationId: 31, paymentPeriod: 'Q4-24', paymentAmount: 11084.31, transactionDate: '2024-06-19 00:00:00', datePublished: null, daxId: 31, startPublish: null, completePublish: null, lastProcessAttempt: null },
  { paymentReference: 'PY2066888', calculationId: 32, paymentPeriod: 'Q4-24', paymentAmount: 6451.40, transactionDate: '2024-06-19 00:00:00', datePublished: null, daxId: 32, startPublish: null, completePublish: null, lastProcessAttempt: null },
  { paymentReference: 'PY2066889', calculationId: 33, paymentPeriod: 'Q4-24', paymentAmount: 4987.80, transactionDate: '2024-06-19 00:00:00', datePublished: null, daxId: 33, startPublish: null, completePublish: null, lastProcessAttempt: null },
  { paymentReference: 'PY2066890', calculationId: 34, paymentPeriod: 'Q4-24', paymentAmount: 107.15, transactionDate: '2024-06-19 00:00:00', datePublished: null, daxId: 34, startPublish: null, completePublish: null, lastProcessAttempt: null },
  { paymentReference: 'PY2066892', calculationId: 35, paymentPeriod: 'Q4-24', paymentAmount: 1362.35, transactionDate: '2024-06-19 00:00:00', datePublished: null, daxId: 35, startPublish: null, completePublish: null, lastProcessAttempt: null }
]

const totals = [
  { "calculationId": 18, "sbi": 200314332, "frn": 1104642379, "agreementNumber": 1693515, "claimId": 1694746, "schemeType": "SFI-23", "calculationDate": "2024-09-10 14:11:51.524572", "invoiceNumber": "N/A", "agreementStart": "2024-02-01 00:00:00", "agreementEnd": "2027-01-31 00:00:00", "totalAdditionalPayments": 1362.34, "totalActionPayments": 1362.34, "updated": null, "datePublished": null, "totalPayments": 1362.34 },
  { "calculationId": 28, "sbi": 200314332, "frn": 1104642379, "agreementNumber": 1693515, "claimId": 1694746, "schemeType": "SFI-23", "calculationDate": "2024-09-10 14:11:51.524572", "invoiceNumber": "N/A", "agreementStart": "2024-02-01 00:00:00", "agreementEnd": "2027-01-31 00:00:00", "totalAdditionalPayments": 1362.34, "totalActionPayments": 1362.34, "updated": null, "datePublished": null, "totalPayments": 1362.34 },
  { "calculationId": 35, "sbi": 200314332, "frn": 1104642379, "agreementNumber": 1693515, "claimId": 1694746, "schemeType": "SFI-23", "calculationDate": "2024-09-10 14:11:51.524572", "invoiceNumber": "N/A", "agreementStart": "2024-02-01 00:00:00", "agreementEnd": "2027-01-31 00:00:00", "totalAdditionalPayments": 1362.35, "totalActionPayments": 1362.35, "updated": null, "datePublished": null, "totalPayments": 1362.35 },  
  { "calculationId": 14, "sbi": 106679243, "frn": 1102259195, "agreementNumber": 1714132, "claimId": 1729163, "schemeType": "SFI-23", "calculationDate": "2024-09-10 14:11:51.524572", "invoiceNumber": "N/A", "agreementStart": "2024-04-01 00:00:00", "agreementEnd": "2027-03-31 00:00:00", "totalAdditionalPayments": 3790.82, "totalActionPayments": 3790.82, "updated": null, "datePublished": null, "totalPayments": 3790.82 },
  { "calculationId": 33, "sbi": 106679243, "frn": 1102259195, "agreementNumber": 1714132, "claimId": 1729163, "schemeType": "SFI-23", "calculationDate": "2024-09-10 14:11:51.524572", "invoiceNumber": "N/A", "agreementStart": "2024-04-01 00:00:00", "agreementEnd": "2027-03-31 00:00:00", "totalAdditionalPayments": 4978.80, "totalActionPayments": 4978.80, "updated": null, "datePublished": null, "totalPayments": 4978.80 },
  { "calculationId": 5, "sbi": 106679243, "frn": 1102259195, "agreementNumber": 1714132, "claimId": 1729163, "schemeType": "SFI-23", "calculationDate": "2024-09-10 14:11:51.524572", "invoiceNumber": "N/A", "agreementStart": "2024-04-01 00:00:00", "agreementEnd": "2027-03-31 00:00:00", "totalAdditionalPayments": 3790.82, "totalActionPayments": 3790.82, "updated": null, "datePublished": null, "totalPayments": 3790.82 },
  { "calculationId": 24, "sbi": 106679243, "frn": 1102259195, "agreementNumber": 1714132, "claimId": 1729163, "schemeType": "SFI-23", "calculationDate": "2024-09-10 14:11:51.524572", "invoiceNumber": "N/A", "agreementStart": "2024-04-01 00:00:00", "agreementEnd": "2027-03-31 00:00:00", "totalAdditionalPayments": 3790.82, "totalActionPayments": 3790.82, "updated": null, "datePublished": null, "totalPayments": 3790.82 },
  { "calculationId": 19, "sbi": 106379104, "frn": 1101049898, "agreementNumber": 1715840, "claimId": 1729160, "schemeType": "SFI-23", "calculationDate": "2024-09-10 14:11:51.524572", "invoiceNumber": "N/A", "agreementStart": "2024-04-01 00:00:00", "agreementEnd": "2027-03-31 00:00:00", "totalAdditionalPayments": 16147.61, "totalActionPayments": 16147.61, "updated": null, "datePublished": null, "totalPayments": 16147.61 },
  { "calculationId": 1, "sbi": 106379104, "frn": 1101049898, "agreementNumber": 1715840, "claimId": 1729160, "schemeType": "SFI-23", "calculationDate": "2024-09-10 14:11:51.524572", "invoiceNumber": "N/A", "agreementStart": "2024-04-01 00:00:00", "agreementEnd": "2027-03-31 00:00:00", "totalAdditionalPayments": 16147.61, "totalActionPayments": 16147.61, "updated": null, "datePublished": null, "totalPayments": 16147.61 },
  { "calculationId": 9, "sbi": 106379104, "frn": 1101049898, "agreementNumber": 1715840, "claimId": 1729160, "schemeType": "SFI-23", "calculationDate": "2024-09-10 14:11:51.524572", "invoiceNumber": "N/A", "agreementStart": "2024-04-01 00:00:00", "agreementEnd": "2027-03-31 00:00:00", "totalAdditionalPayments": 16147.61, "totalActionPayments": 16147.61, "updated": null, "datePublished": null, "totalPayments": 16147.61 },
  { "calculationId": 29, "sbi": 106379104, "frn": 1101049898, "agreementNumber": 1715840, "claimId": 1729160, "schemeType": "SFI-23", "calculationDate": "2024-09-10 14:11:51.524572", "invoiceNumber": "N/A", "agreementStart": "2024-04-01 00:00:00", "agreementEnd": "2027-03-31 00:00:00", "totalAdditionalPayments": 16147.61, "totalActionPayments": 16147.61, "updated": null, "datePublished": null, "totalPayments": 16147.61 },
  { "calculationId": 25, "sbi": 106303330, "frn": 1102321524, "agreementNumber": 1721325, "claimId": 1729161, "schemeType": "SFI-23", "calculationDate": "2024-09-10 14:11:51.524572", "invoiceNumber": "N/A", "agreementStart": "2024-04-01 00:00:00", "agreementEnd": "2027-03-31 00:00:00", "totalAdditionalPayments": 107.17, "totalActionPayments": 107.17, "updated": null, "datePublished": null, "totalPayments": 107.17 },
  { "calculationId": 34, "sbi": 106303330, "frn": 1102321524, "agreementNumber": 1721325, "claimId": 1729161, "schemeType": "SFI-23", "calculationDate": "2024-09-10 14:11:51.524572", "invoiceNumber": "N/A", "agreementStart": "2024-04-01 00:00:00", "agreementEnd": "2027-03-31 00:00:00", "totalAdditionalPayments": 107.15, "totalActionPayments": 107.15, "updated": null, "datePublished": null, "totalPayments": 107.15 },
  { "calculationId": 6, "sbi": 106303330, "frn": 1102321524, "agreementNumber": 1721325, "claimId": 1729161, "schemeType": "SFI-23", "calculationDate": "2024-09-10 14:11:51.524572", "invoiceNumber": "N/A", "agreementStart": "2024-04-01 00:00:00", "agreementEnd": "2027-03-31 00:00:00", "totalAdditionalPayments": 107.17, "totalActionPayments": 107.17, "updated": null, "datePublished": null, "totalPayments": 107.17 },
  { "calculationId": 15, "sbi": 106303330, "frn": 1102321524, "agreementNumber": 1721325, "claimId": 1729161, "schemeType": "SFI-23", "calculationDate": "2024-09-10 14:11:51.524572", "invoiceNumber": "N/A", "agreementStart": "2024-04-01 00:00:00", "agreementEnd": "2027-03-31 00:00:00", "totalAdditionalPayments": 107.17, "totalActionPayments": 107.17, "updated": null, "datePublished": null, "totalPayments": 107.17 },
  { "calculationId": 31, "sbi": 106308039, "frn": 1102206555, "agreementNumber": 1697309, "claimId": 1729159, "schemeType": "SFI-23", "calculationDate": "2024-09-10 14:11:51.524572", "invoiceNumber": "N/A", "agreementStart": "2024-04-01 00:00:00", "agreementEnd": "2027-03-31 00:00:00", "totalAdditionalPayments": 11084.31, "totalActionPayments": 11084.31, "updated": null, "datePublished": null, "totalPayments": 11084.31 },
  { "calculationId": 12, "sbi": 106308039, "frn": 1102206555, "agreementNumber": 1697309, "claimId": 1729159, "schemeType": "SFI-23", "calculationDate": "2024-09-10 14:11:51.524572", "invoiceNumber": "N/A", "agreementStart": "2024-04-01 00:00:00", "agreementEnd": "2027-03-31 00:00:00", "totalAdditionalPayments": 11084.32, "totalActionPayments": 11084.32, "updated": null, "datePublished": null, "totalPayments": 11084.32 },
  { "calculationId": 22, "sbi": 106308039, "frn": 1102206555, "agreementNumber": 1697309, "claimId": 1729159, "schemeType": "SFI-23", "calculationDate": "2024-09-10 14:11:51.524572", "invoiceNumber": "N/A", "agreementStart": "2024-04-01 00:00:00", "agreementEnd": "2027-03-31 00:00:00", "totalAdditionalPayments": 11084.32, "totalActionPayments": 11084.32, "updated": null, "datePublished": null, "totalPayments": 11084.32 },
  { "calculationId": 26, "sbi": 106699236, "frn": 1102597651, "agreementNumber": 1726167, "claimId": 1729211, "schemeType": "SFI-23", "calculationDate": "2024-09-10 14:11:51.524572", "invoiceNumber": "N/A", "agreementStart": "2024-04-01 00:00:00", "agreementEnd": "2027-03-31 00:00:00", "totalAdditionalPayments": 2163.32, "totalActionPayments": 2163.32, "updated": null, "datePublished": null, "totalPayments": 2163.32 },
  { "calculationId": 7, "sbi": 106699236, "frn": 1102597651, "agreementNumber": 1726167, "claimId": 1729211, "schemeType": "SFI-23", "calculationDate": "2024-09-10 14:11:51.524572", "invoiceNumber": "N/A", "agreementStart": "2024-04-01 00:00:00", "agreementEnd": "2027-03-31 00:00:00", "totalAdditionalPayments": 2163.32, "totalActionPayments": 2163.32, "updated": null, "datePublished": null, "totalPayments": 2163.32 },
  { "calculationId": 16, "sbi": 106699236, "frn": 1102597651, "agreementNumber": 1726167, "claimId": 1729211, "schemeType": "SFI-23", "calculationDate": "2024-09-10 14:11:51.524572", "invoiceNumber": "N/A", "agreementStart": "2024-04-01 00:00:00", "agreementEnd": "2027-03-31 00:00:00", "totalAdditionalPayments": 2163.32, "totalActionPayments": 2163.32, "updated": null, "datePublished": null, "totalPayments": 2163.32 },
  { "calculationId": 32, "sbi": 106507234, "frn": 1102231559, "agreementNumber": 1725532, "claimId": 1729165, "schemeType": "SFI-23", "calculationDate": "2024-09-10 14:11:51.524572", "invoiceNumber": "N/A", "agreementStart": "2024-04-01 00:00:00", "agreementEnd": "2027-03-31 00:00:00", "totalAdditionalPayments": 6451.40, "totalActionPayments": 6451.40, "updated": null, "datePublished": null, "totalPayments": 6451.40 },
  { "calculationId": 4, "sbi": 106507234, "frn": 1102231559, "agreementNumber": 1725532, "claimId": 1729165, "schemeType": "SFI-23", "calculationDate": "2024-09-10 14:11:51.524572", "invoiceNumber": "N/A", "agreementStart": "2024-04-01 00:00:00", "agreementEnd": "2027-03-31 00:00:00", "totalAdditionalPayments": 6451.39, "totalActionPayments": 6451.39, "updated": null, "datePublished": null, "totalPayments": 6451.39 },
  { "calculationId": 13, "sbi": 106507234, "frn": 1102231559, "agreementNumber": 1725532, "claimId": 1729165, "schemeType": "SFI-23", "calculationDate": "2024-09-10 14:11:51.524572", "invoiceNumber": "N/A", "agreementStart": "2024-04-01 00:00:00", "agreementEnd": "2027-03-31 00:00:00", "totalAdditionalPayments": 6451.39, "totalActionPayments": 6451.39, "updated": null, "datePublished": null, "totalPayments": 6451.39 },
  { "calculationId": 23, "sbi": 106507234, "frn": 1102231559, "agreementNumber": 1725532, "claimId": 1729165, "schemeType": "SFI-23", "calculationDate": "2024-09-10 14:11:51.524572", "invoiceNumber": "N/A", "agreementStart": "2024-04-01 00:00:00", "agreementEnd": "2027-03-31 00:00:00", "totalAdditionalPayments": 6451.39, "totalActionPayments": 6451.39, "updated": null, "datePublished": null, "totalPayments": 6451.39 },
  { "calculationId": 2, "sbi": 106675751, "frn": 1101380632, "agreementNumber": 1726773, "claimId": 1729164, "schemeType": "SFI-23", "calculationDate": "2024-09-10 14:11:51.524572", "invoiceNumber": "N/A", "agreementStart": "2024-04-01 00:00:00", "agreementEnd": "2027-03-31 00:00:00", "totalAdditionalPayments": 6251.00, "totalActionPayments": 6251.00, "updated": null, "datePublished": null, "totalPayments": 6251.00 },
  { "calculationId": 30, "sbi": 106675751, "frn": 1101380632, "agreementNumber": 1726773, "claimId": 1729164, "schemeType": "SFI-23", "calculationDate": "2024-09-10 14:11:51.524572", "invoiceNumber": "N/A", "agreementStart": "2024-04-01 00:00:00", "agreementEnd": "2027-03-31 00:00:00", "totalAdditionalPayments": 7049.01, "totalActionPayments": 7049.01, "updated": null, "datePublished": null, "totalPayments": 7049.01 },
  { "calculationId": 10, "sbi": 106675751, "frn": 1101380632, "agreementNumber": 1726773, "claimId": 1729164, "schemeType": "SFI-23", "calculationDate": "2024-09-10 14:11:51.524572", "invoiceNumber": "N/A", "agreementStart": "2024-04-01 00:00:00", "agreementEnd": "2027-03-31 00:00:00", "totalAdditionalPayments": 6251.00, "totalActionPayments": 6251.00, "updated": null, "datePublished": null, "totalPayments": 6251.00 },
  { "calculationId": 20, "sbi": 106675751, "frn": 1101380632, "agreementNumber": 1726773, "claimId": 1729164, "schemeType": "SFI-23", "calculationDate": "2024-09-10 14:11:51.524572", "invoiceNumber": "N/A", "agreementStart": "2024-04-01 00:00:00", "agreementEnd": "2027-03-31 00:00:00", "totalAdditionalPayments": 6251.00, "totalActionPayments": 6251.00, "updated": null, "datePublished": null, "totalPayments": 6251.00 },
  { "calculationId": 21, "sbi": 107604121, "frn": 1102129658, "agreementNumber": 1713618, "claimId": 1729176, "schemeType": "SFI-23", "calculationDate": "2024-09-10 14:11:51.524572", "invoiceNumber": "N/A", "agreementStart": "2024-04-01 00:00:00", "agreementEnd": "2027-03-31 00:00:00", "totalAdditionalPayments": 2051.17, "totalActionPayments": 2051.17, "updated": null, "datePublished": null, "totalPayments": 2051.17 },
  { "calculationId": 11, "sbi": 107604121, "frn": 1102129658, "agreementNumber": 1713618, "claimId": 1729176, "schemeType": "SFI-23", "calculationDate": "2024-09-10 14:11:51.524572", "invoiceNumber": "N/A", "agreementStart": "2024-04-01 00:00:00", "agreementEnd": "2027-03-31 00:00:00", "totalAdditionalPayments": 2051.17, "totalActionPayments": 2051.17, "updated": null, "datePublished": null, "totalPayments": 2051.17 },
  { "calculationId": 3, "sbi": 107604121, "frn": 1102129658, "agreementNumber": 1713618, "claimId": 1729176, "schemeType": "SFI-23", "calculationDate": "2024-09-10 14:11:51.524572", "invoiceNumber": "N/A", "agreementStart": "2024-04-01 00:00:00", "agreementEnd": "2027-03-31 00:00:00", "totalAdditionalPayments": 2051.17, "totalActionPayments": 2051.17, "updated": null, "datePublished": null, "totalPayments": 2051.17 },
  { "calculationId": 27, "sbi": 200244838, "frn": 1104468964, "agreementNumber": 1720991, "claimId": 1729166, "schemeType": "SFI-23", "calculationDate": "2024-09-10 14:11:51.524572", "invoiceNumber": "N/A", "agreementStart": "2024-04-01 00:00:00", "agreementEnd": "2027-03-31 00:00:00", "totalAdditionalPayments": 2499.13, "totalActionPayments": 2499.13, "updated": null, "datePublished": null, "totalPayments": 2499.13 },
  { "calculationId": 8, "sbi": 200244838, "frn": 1104468964, "agreementNumber": 1720991, "claimId": 1729166, "schemeType": "SFI-23", "calculationDate": "2024-09-10 14:11:51.524572", "invoiceNumber": "N/A", "agreementStart": "2024-04-01 00:00:00", "agreementEnd": "2027-03-31 00:00:00", "totalAdditionalPayments": 2499.13, "totalActionPayments": 2499.13, "updated": null, "datePublished": null, "totalPayments": 2499.13 },
  { "calculationId": 17, "sbi": 200244838, "frn": 1104468964, "agreementNumber": 1720991, "claimId": 1729166, "schemeType": "SFI-23", "calculationDate": "2024-09-10 14:11:51.524572", "invoiceNumber": "N/A", "agreementStart": "2024-04-01 00:00:00", "agreementEnd": "2027-03-31 00:00:00", "totalAdditionalPayments": 2499.13, "totalActionPayments": 2499.13, "updated": null, "datePublished": null, "totalPayments": 2499.13 }
]

const organisations = [
  {sbi: 106379104, addressLine1: 'Rosendo Garden', addressLine2: '169 Weston Manor', addressLine3: '', city: 'Port Ollie', county: 'Berkshire', postcode: 'GU15 4PQ', emailAddress: 'Ceasar.Cormier12@hotmail.com', frn: 1101049898, name: 'Murray, Reinger and Prohaska Farm',  updated: '2024-09-10 14:11:51.524572' },
  {sbi: 107604121, addressLine1: 'Jacobson Heights', addressLine2: '2952 Weber Knoll', addressLine3: '', city: 'North Kody', county: 'Avon', postcode: 'B49 9GH', emailAddress: 'Griffin.Von9@yahoo.com', frn: 1102129658, name: 'Runolfsson smallholding',  updated: '2024-09-10 14:11:51.524572' },
  {sbi: 106308039, addressLine1: 'Lakin Cape', addressLine2: '271 Kovacek Plaza', addressLine3: '', city: 'East Alyceborough', county: 'Bedfordshire', postcode: 'B49 9GH', emailAddress: 'Elinore.Rogahn47@yahoo.com', frn: 1102206555, name: 'King LLC',  updated: '2024-09-10 14:11:51.524572' },
  {sbi: 106679243, addressLine1: 'Darwin Flats', addressLine2: '793 Stiedemann Ridges', addressLine3: '', city: 'New Ariannamouth', county: 'Avon', postcode: 'CV37 0HT', emailAddress: 'Eliezer.Blanda57@yahoo.com', frn: 1102259195, name: 'Von Ducks Poultry',  updated: '2024-09-10 14:11:51.524572' },
  {sbi: 106303330, addressLine1: 'Brittany Unions', addressLine2: '588 Lizeth Turnpike', addressLine3: '', city: 'Noemiefurt', county: 'Buckinghamshire', postcode: 'HP10 0DG', emailAddress: 'Ollie.OConner@yahoo.com', frn: 1102321524, name: 'Tremblay Farm',  updated: '2024-09-10 14:11:51.524572' },
  {sbi: 106699236, addressLine1: 'Lexus Cliffs', addressLine2: '8529 McCullough Dale', addressLine3: '', city: 'Port Brennan', county: 'Berkshire', postcode: 'GU15 4PQ', emailAddress: 'Vicenta.Armstrong81@hotmail.com', frn: 1102597651, name: 'Prosacco & Son',  updated: '2024-09-10 14:11:51.524572' },
  {sbi: 200244838, addressLine1: 'Rogers Ridges', addressLine2: '02670 Blanda Corners', addressLine3: '', city: 'Ryanton', county: 'Bedfordshire', postcode: 'MK40 1AA', emailAddress: 'Amir_Wisoky59@gmail.com', frn: 1104468964, name: 'Gorczany and Ullrich Farm',  updated: '2024-09-10 14:11:51.524572' },
  {sbi: 200314332, addressLine1: 'Wyman Trace', addressLine2: '007 Emerson Throughway', addressLine3: '', city: 'Derekport', county: 'Buckinghamshire', postcode: 'HP19 0FX', emailAddress: 'Giovanna79@gmail.com', frn: 1104642379, name: 'Twisting Heathers Farm',  updated: '2024-09-10 14:11:51.524572' },
  {sbi: 106507234, addressLine1: 'Hansen Brook', addressLine2: '127 Adriel Motorway', addressLine3: '', city: 'McLaughlinburgh', county: 'Berkshire', postcode: 'RG2 8SS', emailAddress: 'Rhett_Reichel65@yahoo.com', frn: 1102231559, name: 'Little Tractor Farm',  updated: '2024-09-10 14:11:51.524572' },
  {sbi: 106675751, addressLine1: 'Eleonore Glens', addressLine2: '1380 Kamryn Gateway', addressLine3: '', city: 'South Sidport', county: 'Avon', postcode: 'RG2 8SS', emailAddress: 'Mckenzie98@hotmail.com', frn: 1101380632, name: 'Casper LLC',  updated: '2024-09-10 14:11:51.524572' }
]

jest.mock('pg', () => {
  const mClient = {
    connection2: jest.fn().mockResolvedValue({
      once: jest.fn()
    }),
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
  };
  return { Client: jest.fn(() => mClient) };
});

let sequelizeMock = new SequelizeMock()

describe('SFI32 e2e test', () => {
  /* All of this should be moved to the custom environment */
  /* I was doing it here to remove one of the many unknowns to get the mocking working first */
  beforeEach(()=>{
    db.sequelize.transaction = jest.fn().mockResolvedValue({
      rollback: jest.fn().mockResolvedValue(true),
      commit: jest.fn().mockResolvedValue(true)
    })
    db.sequelize.connectionManager ={
        getConnection: jest.fn(),
        releaseConnection: jest.fn()
    }
    db.dax = sequelizeMock.define('dax')
    db.excludedPaymentReference = sequelizeMock.define('excludedPaymentReference')
    db.total = sequelizeMock.define('total')
    db.organisation = sequelizeMock.define('organisation')
    db.action = sequelizeMock.define('action')
    db.documentType = sequelizeMock.define('documentType')
    db.document = sequelizeMock.define('document')

    db.dax.$queryInterface.$useHandler((query, queryOptions) => {
      if(query === 'findOne'){
        return db.dax.build(daxes.filter(dx => dx.paymentReference === queryOptions['0'].where.paymentReference )[0])
      }
      return daxes.map((d) => db.dax.build(d))
    })
    db.dax.count = () => daxes.length
    db.total.$queryInterface.$useHandler((query, queryOptions) => {
      if(query === 'findOne'){
        const total = totals.filter(tx => tx.calculationId === queryOptions['0'].where.calculationId )[0]
        Object.assign(total, {
            calculationReference: total.calculationId,
            claimReference: total.claimId,
            schemeCode: total.schemeType
        })
        delete total.calculationId
        delete total.frn
        delete total.claimId
        delete total.datePublished
        delete total.schemeType
        delete total.updated
        return total
      }
      return totals.map((t) => db.total.build(t))
    })
    db.organisation.$queryInterface.$useHandler((query, queryOptions) => {
      if(query === 'findOne'){
        const organisation = organisations.filter(org => org.sbi === queryOptions['0'].where.sbi )[0]
        delete organisation.updated
        return organisation
      }
      return organisations.map((o) => db.organisation.build(o))
    })
    db.action.$queryInterface.$useHandler((query, queryOptions) => {
      if(query === 'findOne'){
        return {}
      }
      return []
    })
    db.documentType.$queryInterface.$useHandler((query, queryOptions) => {
      if(query === 'findOne'){
        return {}
      }
      return []
    })
})

  it('should work', (done) => {
    //const sqlzmock = new SequelizeMock()
    processSfi23QuarterlyStatement().then(() => {
      console.log("Processed")
      done()
    })
  //   const app = require('../../app').then((result)=> {
  //     console.log(result)
  //     done()
  // })
    // const daxes = db.dax.findAll({})
    //   .then(result => {
    //     //console.log(result)
    //     done()
    //   })
  });
});