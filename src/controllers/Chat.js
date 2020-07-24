const {
    Chats,
    Users,
} = require('../modules/mysql')
const mysql = require('../modules/mysql')

function hasDuplicates(arr) {
    return new Set(arr).size !== arr.length
}

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
            if (data.users.length == 0) {
                throw new Error('Expected at least 1 user')
            }
            if (hasDuplicates(data.users)) {
                throw new Error('Duplicates in user array are forbidden')
            }
            let max = Math.max(...data.users) // Поскольку мы не удаляем юзеров, достаточно проверить последний ID.
            const validateUser = await Users.count({
                where: {
                    id: max
                }
            })
            if (validateUser == 0) {
                throw new Error(`User with id ${max} doesn't exists`)
            }

            try {
                const chat = await Chats.create({
                    name: data.name,
                    last_message: 0,
                    Users: data.use
                })
                await chat.addUsers(data.users)
                res.status(201).send(`${chat.id}`)
            } catch (e) {
                if (e.message = 'Validation error') {
                    throw new Error(`Chat ${data.name} already exists`)
                }
                throw new Error(e.message)
            }

        } catch (e) {
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
                order: [
                    ['last_message', 'DESC']
                ],
                include: {
                    model: Users,
                    as: 'users'
                }
            })
            res.status(200).json(chats)
        } catch (e) {
            res.status(500).json({
                message: `${e.message}`
            })
        }
    }
}