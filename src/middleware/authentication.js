const jwt = require('jsonwebtoken')
const User = require('../models/user') 
const authentication = async (req, res, next) => {
    try {
        const token = req.header('Authentication').replace('Bearer ','')

        const decode = jwt.verify(token, 'secretToken')
        const user = await User.findOne({_id: decode._id, 'tokens.token': token})
        if(!user) throw new Error

        req.user = user
        next()
    } catch(e) {
        res.status(401).send('Invalid Authentication!')
    }
}

module.exports = authentication