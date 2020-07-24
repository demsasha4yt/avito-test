module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Messages', {
        id: {
          type: DataTypes.INTEGER(11),
          primaryKey: true,
          autoIncrement: true
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW
        }
      }, {
        underscored: true,
        tableName: 'messages'
      });
}