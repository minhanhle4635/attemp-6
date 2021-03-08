const jwt = require('jsonwebtoken');
const secret = process.env.SECRET || 'secret';

function GenAuthenticateToken(id, username, role) {
    return jwt.sign({
        user: {
            _id: id,
            username,
            role
        },
        iat: Math.floor(Date.now() / 1000),
    }, secret);
}

function VerifyAuthenticateToken(token) {
    let decoded;
    try {
        decoded = jwt.verify(token, secret);
    } catch (err) {
        // err
        console.error(err);
        return false;
    }

    if (decoded && decoded._id) {
        return true;
    }
}

module.exports = {
    generate: GenAuthenticateToken,
    verify: VerifyAuthenticateToken
}
