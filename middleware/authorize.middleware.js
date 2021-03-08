const ResponseHelper = require('../helper/api.response');
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET || 'secret';

module.exports = (req, res, next) => {
    const headerAuthorize =  req.header('Authorization');

    if (!headerAuthorize) {
        return ResponseHelper.responseUnauthorized(res);
    }

    // token = Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Imlk...
    // split => ["Bearer", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Imlk..."]
    const token = headerAuthorize.split(/\s/)[1];
    if (!token) {
        return ResponseHelper.responseUnauthorized(res);
    }

    try {
        const decoded = jwt.verify(token, secret);
        req.userId = decoded.user._id; // => user._id
        return next();
    } catch(err) {
        return ResponseHelper.responseUnauthorized(res);
    }
}
