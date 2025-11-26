const d365DB = (sequelize, DataTypes) => {
  const paymentReferenceChars = 30
  const paymentPeriodLength = 200
  const marketingYearMin = 2023
  const marketingYearMax = 2050

  const d365 = sequelize.define('d365', {
    paymentReference: {
      type: DataTypes.STRING(paymentReferenceChars),
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    calculationId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    paymentPeriod: {
      type: DataTypes.STRING(paymentPeriodLength),
      allowNull: true
    },
    marketingYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: marketingYearMin,
        max: marketingYearMax
      }
    },
    paymentAmount: {
      type: DataTypes.NUMERIC,
      allowNull: false
    },
    transactionDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    datePublished: {
      type: DataTypes.DATE,
      allowNull: true
    },
    startPublish: {
      type: DataTypes.DATE,
      allowNull: true
    },
    completePublish: {
      type: DataTypes.DATE,
      allowNull: true
    },
    lastProcessAttempt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'd365',
    freezeTableName: true,
    timestamps: false
  })

  d365.associate = function (models) {
    d365.belongsTo(models.delinkedCalculation, {
      foreignKey: 'calculationId',
      as: 'delinkedCalculation'
    })
  }

  return d365
}

module.exports = d365DB
