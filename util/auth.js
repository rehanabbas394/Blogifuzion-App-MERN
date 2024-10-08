const JWT = require("jsonwebtoken")
const secret = "rehan1234"

async function CreateUserToken(user) {
    const payload = {
        _id : user._id,
        Fullname:user.Fullname,
        email:user.email,
        role:user.role,
        profileImageUrl:user.profileImageUrl
    }
    const token = JWT.sign(payload,secret)
    return token
}

async function validateToken(token){
    const payload = JWT.verify(token,secret)
    return payload
}

module.exports = { validateToken,CreateUserToken}