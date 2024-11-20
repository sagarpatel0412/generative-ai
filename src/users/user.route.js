const express = require('express')
const router = express.Router()
const passport = require('../auth/passport')
const { registerSchema, loginSchema, forgetPassSchema } = require('../validator/user-validator')
const { UsersModel } = require('./user.model')
const { signJWTToken } = require('../auth/auth-methods')
const crypto = require('crypto')

function hashPassword(password) {
    return crypto
        .createHash('sha256')
        .update(`${password}${process.env.SALT}`)
        .digest('base64');
}

router.post('/register', async (req, res) => {
    const { error, value } = registerSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({ errors: error.details });
    }

    const finduser = await UsersModel.findOne({ where: { email: value.email } })

    if (!finduser) {
        const createUser = await UsersModel.create({
            email: value.email,
            password: value.password,
            firstname: value.firstname,
            lastname: value.lastname,
            address1: value.address1,
            address2: value.address2,
            state: value.state,
            username: value.username,
            country: value.country,
            city: value.city,
        })
        return res.status(201).json({ success: true, message: `User with email ${createUser.email} registered successfully` })
    } else {
        return res.status(500).json({ success: false, message: `Something went wrong!!!` })
    }
})

router.post('/login', async (req, res) => {
    const { error, value } = loginSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({ errors: error.details });
    }

    const finduser = await UsersModel.findOne({ where: { email: value.email } })

    if (!finduser) {
        return res.status(404).json({ success: false, message: `User not Found` })
    } else {
        const password = hashPassword(value.password)
        if (password !== finduser.password) {
            return res.status(500).json({ success: false, message: `Password is incorrect` })
        } else {
            const userPayload = {
                sub: finduser.id,
                username: finduser.username,
                email: finduser.email
            }

            const getToken = signJWTToken(userPayload)
            const { password: user_password, ...userDataWithoutPassword } = finduser.dataValues;

            const userResponse = {
                ...userDataWithoutPassword,
                token: getToken,
            }

            return res.status(201).json({ success: true, data: userResponse, message: `User Authenticated Successfully` })
        }
    }
})

router.post('/forget-password', async (req, res) => {
    const { error, value } = forgetPassSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({ errors: error.details });
    }

    const finduser = await UsersModel.findOne({ where: { email: value.email } })

    if (!finduser) {
        return res.status(404).json({ success: false, message: `User not Found` })
    } else {
        const password = hashPassword(value.new_password)
        if (password !== finduser.password) {
            await UsersModel.update({
                password: password
            }, { where: { email: value.email } })
            return res.status(201).json({ success: true, message: `Password changed successfully` })
        } else {
            return res.status(409).json({ success: false, message: `You cannot use same password` })
        }
    }
})

router.get('/me', passport.customAuthenticate('jwt'), async (req, res) => {

    try {
        const userdetails = await UsersModel.findOne({ where: { id: req.user.sub }, attributes: { exclude: ['password'] } })
        if(userdetails !== null){
            return res.status(201).json({ success: true, data: userdetails.dataValues, message: "User details" })
        } else {
            return res.status(404).json({ success: false, message: "User Not Found" })
        }
        
    } catch (error) {
        console.log(error)
        return res.status(500).status({ status: false, message: "Something went Wrong" })
    }

})

router.delete('/delete', passport.customAuthenticate('jwt'), async (req, res) => {

    try {
        const userdetails = await UsersModel.findOne({ where: { id: req.user.sub }, attributes: { exclude: ['password'] } })
        if(userdetails !== null){
            const userdelete = await UsersModel.destroy({ where: { id: req.user.sub } })
            console.log("userdetails.dataValues",userdelete )
            return res.status(201).json({ success: true, data: userdetails.dataValues,deleted:userdelete, message: "User details" })
        } else {
            return res.status(404).json({ success: false, message: "User Not Found" })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).status({ status: false, message: "Something went Wrong" })
    }

})

module.exports = router