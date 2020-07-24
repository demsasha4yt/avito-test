const express = require('express');
const bodyParser = require('body-parser')

const {
    sequelize
} = require('./modules/mysql')
const configure = require('./configure')

const app = express();

app.use((req, res, next) => {
    if (configure.chat_loaded == false) {
        res.send('Чат не загружен')
        return
    }
    next()
})

app.use(bodyParser.json())

app.post('/users/add', require('./controllers/User').createUser)
app.post('/chats/add', require('./controllers/Chat').createChat)
app.post('/messages/add', require('./controllers/Message').createMessage)
app.post('/chats/get', require('./controllers/Chat').findChatsByUser)
app.post('/messages/get', require('./controllers/Message').findMessagesByChat)

app.use((req, res, send) => {
    res.status(404).json({
        message: 'Not fo'
    })
})

const APP_PORT = process.env.APP_PORT || 9000;
app.listen(APP_PORT, () => {
    console.log(`Server listening on port ${APP_PORT}`);
});

(async () => {
    try {
        console.log(`[MYSQL]: Connecting to mysql...`)
        // await sequelize.authenticate()
        await sequelize.sync()
        console.log('[MYSQL]: Connection Success')
        configure.chat_loaded = true
    } catch (e) {
        console.log('[MYSQL]: Connection filed')
        console.log(e)
    }
})()