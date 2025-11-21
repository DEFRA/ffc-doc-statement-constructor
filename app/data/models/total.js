const totalDB = (sequelize, DataTypes) => {
  const number2 = 2
  const number15 = 15
  const number20 = 20
  const number50 = 50
  const total = sequelize.define('total', {
    calculationId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, comment: 'Example Output: 120240820 Source: SitiAgri. Used on Statement? No, Used for ETL Logic, ID of calculation details and used to join data. -' },
    sbi: { type: DataTypes.INTEGER, allowNull: false, comment: 'Example Output: 200820241 Source: SitiAgri. Used on Statement? Yes, Customer details at top of statement, Customer identifier, standard format on all systems. - ' },
    frn: { type: DataTypes.INTEGER, allowNull: false, comment: 'Example Output: 2024082011 Source: SitiAgri. Used on Statement? Yes, Filename, Customer identifier, standard format on all systems' },
    agreementNumber: { type: DataTypes.INTEGER, allowNull: false, comment: 'Example Output: 2420081 Source: SitiAgri. Used on Statement? Yes, Your SFI 2023 agreement section. Could be used for payment schedules. - ' },
    claimId: { type: DataTypes.INTEGER, allowNull: false, comment: 'Example Output: 241608 Source: SitiAgri. Used on Statement? No, Used for ETL Logic. Useful for matching records and troubleshooting' },
    schemeType: { type: DataTypes.STRING(number50), allowNull: false, comment: 'Example Output: SFI-23 Source: SitiAgri. Used on Statement? No, Used to determine statement template. Field used to filter between different schemes' },
    calculationDate: { type: DataTypes.DATE, allowNull: false, comment: 'Example Output: 2024-02-02 00:00:00 Source: SitiAgri. Used on Statement? No. Retained in case we show calculations in future.' },
    invoiceNumber: { type: DataTypes.STRING(number20), allowNull: false, comment: 'Example Output: SFIA0103195 Source: SitiAgri. Used on Statement? No. Useful for matching records and troubleshooting' },
    agreementStart: { type: DataTypes.DATE, allowNull: false, comment: 'Example Output: 2023-11-01 00:00:00 Source: SitiAgri. Used on Statement? Yes, Your SFI 2023 agreement section. Could be used for payment schedules.' },
    agreementEnd: { type: DataTypes.DATE, allowNull: false, comment: 'Example Output: 2026-10-31 00:00:00 Source: SitiAgri. Used on Statement? Yes, Your SFI 2023 agreement section. Could be used for payment schedules.' },
    totalAdditionalPayments: { type: DataTypes.DECIMAL(number15, number2), allowNull: false, comment: 'Example Output: 1000.00 Source: SitiAgri. Used on Statement? No. Retained in case we show calculations in future.' },
    totalActionPayments: { type: DataTypes.DECIMAL(number15, number2), allowNull: false, comment: 'Example Output: 1000.00 Source: SitiAgri. Used on Statement? No.  Retained in case we show calculations in future.' },
    totalPayments: { type: DataTypes.DECIMAL(number15, number2), allowNull: false, comments: 'Example Output: 2000.00 Source: SitiAgri. Used on Statement? No. Retained in case we show calculations in future.' },
    updated: { type: DataTypes.DATE, comment: 'Example Output: 2024-02-29 00:00:00 Source: Documents. Used on Statement? No, Used for ETL Logic. Used to show when data changes.' },
    datePublished: { type: DataTypes.DATE, allowNull: true, comment: 'Example Output: 2025-05-12 15:08:08. Source: Documents. Used on Statement? No, Used for ETL Logic. Used to determine if a statement has been generated. - ' }
  },
  {
    tableName: 'totals',
    freezeTableName: true,
    timestamps: false
  })
  total.associate = function (models) {
    total.hasMany(models.dax, {
      foreignKey: 'calculationId',
      as: 'daxEntries'
    })
    total.hasMany(models.action, {
      foreignKey: 'calculationId',
      as: 'actions'
    })
    total.belongsTo(models.organisation, {
      foreignKey: 'sbi',
      as: 'organisations'
    })
  }
  return total
}

module.exports = totalDB
