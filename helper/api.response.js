function ResponseUnauthenticated(res) {
    return res.status(401).json({
        message: 'UNAUTHORIZED'
    });
}

function Response200(res, data) {
    return res.status(200).json({
        data: data
    })
}

module.exports = {
    responseUnauthorized: ResponseUnauthenticated,
    response200: Response200
}
