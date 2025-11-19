const comment = 'Example Output: Source: Documents Used on Statement? No, used to pass configuration details to the CRM to allow integration between the two systems'

const documentStatusDB = (sequelize, DataTypes) => {
  const documentStatus = sequelize.define('document', {
    documentId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment
    },
    documentTypeId: {
      type: DataTypes.INTEGER,
      comment
    },
    documentSourceReference: {
      type: DataTypes.STRING,
      comment
    }
  }, {
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
