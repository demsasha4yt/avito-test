const {
    Messages,
    Chats
} = require('../modules/mysql')
const Chat = require('./Chat')

module.exports = {
    createMessage: async (req, res, next) => {
        try {
            const data = req.body
            if (data == null) {
                throw new Error(`Expected body`)
            }
            if (data.chat == null || isNaN(parseInt(data.chat))) {
                throw new Error('Expected chat id')
            }
            if (data.author == null || isNaN(parseInt(data.author))) {
                throw new Error('expected user id')
            }
            if (data.text == null) {
                throw new Error("Expected text")
            }

            const message = await Messages.create({
                text: data.text,
                author: data.author,
                chat: data.chat
            })

            Chats.update({
                last_message: message.id
            },{
                where: {
                    id: data.chat
                }
            })

            res.status(201).send(`${message.id}`)
        } catch (e) {
            console.error(e)
            res.status(500).json({
                message: `${e.message}`
            })
        }
    },

    findMessagesByChat: async (req, res, next) => {
        try {
            const data = req.body
            if (data == null) {
                throw new Error('Expected body')
            }
            if (data.chat == null || isNaN(data.chat)) {
                throw new Error('Expected chat')
            }
            const messages = await Messages.findAll({
                where: {chat: data.chat},
                order: [
                    ['created_at', 'ASC']
                ]
            })
            res.status(200).json(messages)
        } catch (e) {
            res.status(500).json({
                message: `${e.message}`
            })
        }
    }
}