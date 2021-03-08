const User = require('../models/User')
/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 * @constructor
 */
async function LogMiddleware(req, res, next) {
    console.log(req.query);
    const {abc} = req.query;
    const a = await User.findOne({username: 1}).exec();
    console.log(a);
    if (abc) {
        console.log(new Date())
        return next();
    }
    console.log('Does not have ABC');
    return next();
}

module.exports = LogMiddleware
