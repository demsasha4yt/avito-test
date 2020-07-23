const {
    Chats,
    UserChat,
    Users,
    Messages
} = require('../modules/mysql')
const mysql = require('../modules/mysql')

module.exports = {
    createChat: async (req, res, next) => {
        try {
            const data = req.body
            if (data == null) {
                throw new Error(`Expected body`)
            }

            if (data.name == null) {
                throw new Error(`Expected name`)
            }

            if (data.users == null || !Array.isArray(data.users)) {
                throw new Error(`Expected user ids array`)
            }

            const chat = await Chats.create({
                name: data.name,
                Users: data.use
            })

            await chat.addUsers(data.users)
            res.status(201).send(`${chat.id}`)
        } catch (e) {
            console.error(e)
            res.status(500).json({
                message: `${e.message}`
            })
        }
    },

    findChatsByUser: async (req, res, next) => {
        try {
            const data = req.body
            if (data == null) {
                throw new Error('Expected body')
            }
            if (data.user == null || isNaN(parseInt(data.user))) {
                throw new Error('Expected user')
            }
            const chats = await Chats.findAll({
                where: {
                    '$Users.id$': data.user
                },
                include: [Users]
            })
            res.status(200).json(chats)
        } catch (e) {
            console.error(e)
            res.status(500).json({
                message: `${e.message}`
            })
        }
    }
}