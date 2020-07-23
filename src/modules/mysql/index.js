const Sequelize = require('sequelize')
const fs = require('fs')
const path = require('path')

const mysql = {}

const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD, {
        dialect: 'mysql',
        host: process.env.MYSQL_URL || 'localhost',
        logging: console.log,
        define: {
            timestamps: false
        },
        pool: {
            max: 2,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
)

fs.readdirSync(path.join(__dirname, '..', '..', 'models'))
    .forEach(file => {
        const model = require(path.join(__dirname, '..', '..', 'models', file))(sequelize, Sequelize.DataTypes)
        mysql[model.name] = model
    })

mysql['Users'].belongsToMany(mysql['Chats'], { through: mysql['UserChat'] });
mysql['Chats'].belongsToMany(mysql['Users'], { through: mysql['UserChat'] });
mysql['Messages'].belongsTo(mysql['Users'])
mysql['Messages'].belongsTo(mysql['Chats'])

console.log(mysql)
mysql.Sequelize = Sequelize
mysql.sequelize = sequelize


module.exports = mysql