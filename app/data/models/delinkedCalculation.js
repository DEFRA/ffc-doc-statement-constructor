module.exports = (sequelize, DataTypes) => {
  const zeroValue = 0
  const maxFRN = 16
  const maxSBI = 38

  const commonStringField = { type: DataTypes.STRING, allowNull: false }

  const delinkedCalculation = sequelize.define('delinkedCalculation', {
    calculationId: { type: DataTypes.INTEGER(), primaryKey: true, allowNull: false },
    applicationId: { type: DataTypes.INTEGER(), allowNull: false },
    sbi: { type: DataTypes.NUMBER(maxSBI, zeroValue), allowNull: false },
    frn: { type: DataTypes.STRING(maxFRN), allowNull: false },
    paymentBand1: commonStringField,
    paymentBand2: commonStringField,
    paymentBand3: commonStringField,
    paymentBand4: commonStringField,
    percentageReduction1: commonStringField,
    percentageReduction2: commonStringField,
    percentageReduction3: commonStringField,
    percentageReduction4: commonStringField,
    progressiveReductions1: commonStringField,
    progressiveReductions2: commonStringField,
    progressiveReductions3: commonStringField,
    progressiveReductions4: commonStringField,
    referenceAmount: commonStringField,
    totalProgressiveReduction: commonStringField,
    totalDelinkedPayment: commonStringField,
    paymentAmountCalculated: commonStringField,
    datePublished: { type: DataTypes.DATE },
    updated: { type: DataTypes.DATE }
  },
  {
    tableName: 'delinkedCalculation',
    freezeTableName: true,
    timestamps: false
  })

  delinkedCalculation.associate = function (models) {
    delinkedCalculation.hasMany(models.d365, {
      foreignKey: 'calculationId',
      as: 'delinkedCalculation'
    })
    delinkedCalculation.belongsTo(models.organisation, {
      foreignKey: 'sbi',
      as: 'organisations'
    })
  }

  return delinkedCalculation
}
