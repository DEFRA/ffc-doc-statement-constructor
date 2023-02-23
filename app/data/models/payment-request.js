const { reverseEngineerInvoiceNumber } = require('../../utility')

module.exports = (sequelize, DataTypes) => {
  const paymentRequest = sequelize.define('paymentRequest', {
    paymentRequestId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    invoiceNumber: DataTypes.STRING,
    schemeId: DataTypes.INTEGER,
    agreementNumber: DataTypes.STRING,
    contractNumber: DataTypes.STRING,
    paymentRequestNumber: DataTypes.INTEGER,
    correlationId: DataTypes.UUID,
    currency: DataTypes.STRING,
    debtType: DataTypes.STRING,
    deliveryBody: DataTypes.STRING,
    dueDate: DataTypes.STRING,
    frn: DataTypes.BIGINT,
    ledger: DataTypes.STRING,
    marketingYear: DataTypes.INTEGER,
    received: DataTypes.DATE,
    recoveryDate: DataTypes.STRING,
    referenceId: DataTypes.UUID,
    reversedInvoiceNumber: {
      type: DataTypes.VIRTUAL,
      get () {
        return reverseEngineerInvoiceNumber(this.invoiceNumber)
      }
    },
    schedule: DataTypes.STRING,
    sourceSystem: DataTypes.STRING,
    status: DataTypes.STRING,
    value: DataTypes.INTEGER
  },
  {
    tableName: 'paymentRequests',
    freezeTableName: true,
    timestamps: false
  })
  paymentRequest.associate = function (models) {
    paymentRequest.hasMany(models.invoiceLine, {
      foreignKey: 'paymentRequestId',
      as: 'invoiceLines'
    })
    paymentRequest.hasMany(models.settlement, {
      foreignKey: 'paymentRequestId',
      as: 'settlements'
    })
    paymentRequest.hasMany(models.settlement, {
      sourceKey: 'invoiceNumber',
      foreignKey: 'invoiceNumber',
      as: 'settlementsByInvoiceNumber'
    })
    paymentRequest.hasOne(models.calculation, {
      foreignKey: 'paymentRequestId',
      as: 'calculations'
    })
    paymentRequest.belongsTo(models.scheme, {
      foreignKey: 'schemeId',
      as: 'schemes'
    })
    paymentRequest.belongsTo(models.invoiceNumber, {
      foreignKey: 'invoiceNumber',
      as: 'invoiceNumbers'
    })
  }
  return paymentRequest
}
