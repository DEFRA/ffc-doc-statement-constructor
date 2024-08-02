module.exports = (sequelize, DataTypes) => {
  const excludedPaymentReference = sequelize.define('excludedPaymentReference', {
    excludedPaymentReferenceId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    frn: DataTypes.BIGINT,
    paymentReference: DataTypes.STRING
  },
  {
    tableName: 'excludedPaymentReferences',
    freezeTableName: true,
    timestamps: false
  })
  return excludedPaymentReference
}
