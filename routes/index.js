const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/User')
// const mongoose = require('mongoose')
const { Login, Logout } = require('../Login')
const passport = require('passport')

const { registerValidation } = require('../validation')

router.get('/', (req, res) => {
    res.render('index')
})

router.post('/', Login)

router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', async (req, res) => {

    //Register Validation
    const { error } = registerValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    //checking if username is already used
    const ExistedUser = await User.findOne({ username: req.body.username })
    if (ExistedUser) return res.status(400).send('Username already exists')
    //hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    const newUser = new User({
        name: req.body.name,
        username: req.body.username,
        password: hashedPassword
    })
    try {
        await newUser.save()
        res.redirect('/')
    } catch (err) {
        console.log(err)
        res.redirect('/register')
    }
})

module.exports = router