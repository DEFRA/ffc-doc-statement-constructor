module.exports = (sequelize, DataTypes) => {
  const invoiceNumber = sequelize.define('invoiceNumber', {
    invoiceNumber: { type: DataTypes.STRING, primaryKey: true },
    originalInvoiceNumber: DataTypes.STRING
  },
  {
    tableName: 'invoiceNumbers',
    freezeTableName: true,
    timestamps: false
  })
  invoiceNumber.associate = function (models) {
    invoiceNumber.hasMany(models.paymentRequest, {
      foreignKey: 'invoiceNumber',
      as: 'invoiceNumbers'
    })
  }
  return invoiceNumber
}
