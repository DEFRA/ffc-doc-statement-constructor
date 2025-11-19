const documentStatusDB = (sequelize, DataTypes) => {
  const documentStatus = sequelize.define('document', {
    documentId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, comment: 'Example Output: Source: Documents Used on Statement? No, used to pass configuration details to the CRM to allow integration between the two systems' },
    documentTypeId: { type: DataTypes.INTEGER, comment: 'Example Output: Source: Documents Used on Statement? No, used to pass configuration details to the CRM to allow integration between the two systems' },
    documentSourceReference: { type: DataTypes.STRING, comment: 'Example Output: Source: Documents Used on Statement? No, used to pass configuration details to the CRM to allow integration between the two systems' }
  },
  {
    tableName: 'documents',
    freezeTableName: true,
    timestamps: false
  })
  documentStatus.associate = function (models) {
    documentStatus.belongsTo(models.documentType, {
      foreignKey: 'documentTypeId',
      as: 'documentTypes'
    })
  }
  return documentStatus
}

module.exports = documentStatusDB
