module.exports = function(sequelize, DataTypes) {
    return sequelize.define('UserChat', {
    id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    }
    }, {
        underscored: true,
        tableName: 'userchat'
    });
};