const jwt = require('jsonwebtoken');


function signJWTToken (payload) {
    console.log('JWT_EXPIRY:', process.env.JWT_EXPIRY);
    const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:parseInt(process.env.JWT_EXPIRY, 10)})
    return token
}

function decodeToken (token) {
    const details = jwt.decode(token);
    return details
}

function verifyToken (token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded
    } catch (err) {
        console.log('Token verification failed:', err.message);
        return "Unauthorized"
    }
}

module.exports = {signJWTToken, decodeToken, verifyToken}