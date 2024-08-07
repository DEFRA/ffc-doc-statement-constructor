module.exports = (sequelize, DataTypes) => {
  const scale0 = 0
  const precision11 = 11
  const maxFRN = 16
  const maxSBI = 38
  const delinkedCalculation = sequelize.define('delinkedCalculation', {
    applicationId: { type: DataTypes.NUMBER(precision11, scale0), allowNull: false },
    calculationId: { type: DataTypes.NUMBER(precision11, scale0), primaryKey: true, allowNull: false },
    sbi: { type: DataTypes.NUMBER(maxSBI, scale0), allowNull: false },
    frn: { type: DataTypes.STRING(maxFRN), allowNull: false },
    paymentBand1: { type: DataTypes.STRING, allowNull: false },
    paymentBand2: { type: DataTypes.STRING, allowNull: false },
    paymentBand3: { type: DataTypes.STRING, allowNull: false },
    paymentBand4: { type: DataTypes.STRING, allowNull: false },
    percentageReduction1: { type: DataTypes.STRING, allowNull: false },
    percentageReduction2: { type: DataTypes.STRING, allowNull: false },
    percentageReduction3: { type: DataTypes.STRING, allowNull: false },
    percentageReduction4: { type: DataTypes.STRING, allowNull: false },
    progressiveReductions1: { type: DataTypes.STRING, allowNull: false },
    progressiveReductions2: { type: DataTypes.STRING, allowNull: false },
    progressiveReductions3: { type: DataTypes.STRING, allowNull: false },
    progressiveReductions4: { type: DataTypes.STRING, allowNull: false },
    referenceAmount: { type: DataTypes.STRING, allowNull: false },
    totalProgressiveReduction: { type: DataTypes.STRING, allowNull: false },
    totalDelinkedPayment: { type: DataTypes.STRING, allowNull: false },
    paymentAmountCalculated: { type: DataTypes.STRING, allowNull: false },
    datePublished: { type: DataTypes.DATE, allowNull: false }
  },
  {
    tableName: 'delinkedCalculation',
    freezeTableName: true,
    timestamps: false
  })
  delinkedCalculation.associate = function (models) {
    delinkedCalculation.hasMany(models.dax, {
      foreignKey: 'calculationId',
      as: 'daxEntries'
    })
    delinkedCalculation.belongsTo(models.organisation, {
      foreignKey: 'sbi',
      as: 'organisations'
    })
  }
  return delinkedCalculation
}
