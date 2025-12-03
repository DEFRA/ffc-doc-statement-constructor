const delinkedCalculationDB = (sequelize, DataTypes) => {
  const zeroValue = 0
  const maxFRN = 16
  const maxSBI = 38

  const delinkedCalculation = sequelize.define('delinkedCalculation', {
    calculationId: { type: DataTypes.INTEGER(), primaryKey: true, allowNull: false },
    applicationId: { type: DataTypes.INTEGER(), allowNull: false },
    sbi: { type: DataTypes.NUMBER(maxSBI, zeroValue), allowNull: false },
    frn: { type: DataTypes.STRING(maxFRN), allowNull: false },
    paymentBand1: { type: DataTypes.STRING, allowNull: false },
    paymentBand2: { type: DataTypes.STRING, allowNull: false },
    paymentBand3: { type: DataTypes.STRING, allowNull: false },
    paymentBand4: { type: DataTypes.STRING, allowNull: false },
    percentageReduction1: { type: DataTypes.STRING, allowNull: false },
    percentageReduction2: { type: DataTypes.STRING, allowNull: false },
    percentageReduction3: { type: DataTypes.STRING, allowNull: false },
    percentageReduction4: { type: DataTypes.STRING, allowNull: false },
    progressiveReductions1: { type: DataTypes.STRING, allowNull: true },
    progressiveReductions2: { type: DataTypes.STRING, allowNull: true },
    progressiveReductions3: { type: DataTypes.STRING, allowNull: true },
    progressiveReductions4: { type: DataTypes.STRING, allowNull: true },
    referenceAmount: { type: DataTypes.STRING, allowNull: true },
    totalProgressiveReduction: { type: DataTypes.STRING, allowNull: true },
    totalDelinkedPayment: { type: DataTypes.STRING, allowNull: true },
    paymentAmountCalculated: { type: DataTypes.STRING, allowNull: false },
    datePublished: { type: DataTypes.DATE, allowNull: true },
    updated: { type: DataTypes.DATE, allowNull: true }
  }, {
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

module.exports = delinkedCalculationDB
