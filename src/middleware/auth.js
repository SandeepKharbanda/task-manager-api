var jwt = require('jsonwebtoken');
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        if(!user) {
            res.status(401).send({ error: 'Authorization failed' })
        }
        req.user = user
        req.token = token
        next()

    }
    catch (err) {
        res.status(401).send({ error: 'Authorization failed' })
    }
    // console.log('Auth middleware')
    // next();
}

module.exports = auth;