const express = require('express')
const router = express.Router();
const ResponseHelper = require('../helper/api.response');
const User = require('../models/User')
const bcrypt = require('bcrypt');
const TokenService = require('../helper/token.generator');

const authorizeMiddleware = require('../middleware/authorize.middleware');

router.post('/login', async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return ResponseHelper.responseUnauthorized(res);
    }

    const findUser = await User.findOne({username}).exec();
    if (!findUser) {
        return ResponseHelper.responseUnauthorized(res);
    }

    const isMatchPassword = await bcrypt.compare(password, findUser.password);
    if (!isMatchPassword) {
        return ResponseHelper.responseUnauthorized(res);
    }

    const token = TokenService.generate(findUser._id, username, findUser.role);
    const toObject = findUser.toJSON();
    // remove password from response object
    delete toObject.password;

    return ResponseHelper.response200(res, {
        token: token,
        user: toObject
    })
})

router.get('/authorize-status', [authorizeMiddleware], (req, res) => {
    console.log(req.userId);
    res.json({
        status: 'OK'
    })
})

module.exports = router;
