module.exports = (sequelize, DataTypes) => {
  const invoiceLine = sequelize.define('invoiceLine', {
    invoiceLineId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fundingCode: DataTypes.STRING,
    paymentRequestId: DataTypes.INTEGER,
    accountCode: DataTypes.STRING,
    description: DataTypes.STRING,
    fundCode: DataTypes.STRING,
    value: DataTypes.INTEGER
  },
  {
    tableName: 'invoiceLines',
    freezeTableName: true,
    timestamps: false
  })
  invoiceLine.associate = function (models) {
    invoiceLine.belongsTo(models.paymentRequest, {
      foreignKey: 'paymentRequestId',
      as: 'paymentRequests'
    })
    invoiceLine.belongsTo(models.funding, {
      foreignKey: 'fundingCode',
      as: 'fundings'
    })
  }
  return invoiceLine
}
