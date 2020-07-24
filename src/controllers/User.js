const {
    Users,
    UserChat
} = require('../modules/mysql')

module.exports = {
    createUser: async (req, res, next) => {
        try {
            const data = req.body
            if (data.username == null) {
                throw new Error("Expected username")
            }
            try {
                const user = await Users.create({
                    username: data.username
                })
            } catch (e) {
                if (e.message = 'Validation error') {
                    throw new Error(`User ${data.username} already exists`)
                }                
                throw new Error(e.message)
            }
            res.status(201).send(`${user.id}`)
        } catch (e) {
            res.status(500).json({
                message: `${e.message}`
            })
        }
    },
}