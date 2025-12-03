const documentStatusDB = (sequelize, DataTypes) => {
  const documentStatus = sequelize.define('document', {
    documentId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    documentTypeId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    documentSourceReference: {
      type: DataTypes.STRING,
      allowNull: true
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
