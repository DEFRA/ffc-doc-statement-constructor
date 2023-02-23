module.exports = (sequelize, DataTypes) => {
  const calculation = sequelize.define('calculation', {
    calculationId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    paymentRequestId: DataTypes.INTEGER,
    sbi: DataTypes.INTEGER,
    calculationDate: DataTypes.DATE,
    calculationReference: DataTypes.INTEGER,
    invoiceNumber: DataTypes.STRING,
    updated: DataTypes.DATE
  },
  {
    tableName: 'calculations',
    freezeTableName: true,
    timestamps: false
  })
  calculation.associate = function (models) {
    calculation.hasMany(models.funding, {
      foreignKey: 'calculationId',
      as: 'fundings'
    })
    calculation.belongsTo(models.paymentRequest, {
      foreignKey: 'paymentRequestId',
      as: 'paymentRequests'
    })
    calculation.belongsTo(models.organisation, {
      foreignKey: 'sbi',
      as: 'organisations'
    })
  }
  return calculation
}
