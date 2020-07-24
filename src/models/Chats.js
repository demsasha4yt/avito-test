module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Chats', {
        id: {
          type: DataTypes.INTEGER(11),
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false
        },
        last_message: {
          type: DataTypes.INTEGER(11),
          allowNull: false,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW
        }
      }, {
        underscored: true,
        tableName: 'chats'
      });
}