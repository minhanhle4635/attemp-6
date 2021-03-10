const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/User')
// const mongoose = require('mongoose')
const { Login, Logout } = require('../Login')
const passport = require('passport')

router.get('/', (req, res) => {
    res.render('index')
})

// router.post('/', (req, res, next) => {
//     passport.authenticate('local', function (err, user, info) {
//         if (err) { return next(err); }

//         if (!user) {
//             return res.redirect('/'); 
//         }
        
//         req.logIn(user, function (err) {
//             if (err) { return next(err); }

//             if (user.role === "admin") {
//                 return res.redirect('/admin')
//             } else if (user.role === "coordinator") {
//                 return res.redirect('/coordinator')
//             } else if (user.role === "user") {
//                 return res.redirect('/user')
//             }
//         });
//     })(req, res, next)
// })

router.post('/', Login)

router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', async (req, res) => {
    try {
        const ExistedUser = await User.findOne({ username: req.body.username })
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const newUser = new User({
            name: req.body.name,
            username: req.body.username,
            password: hashedPassword
        })
        // await newUser.save()
        // res.redirect('/')
        if (ExistedUser == null) {
            await newUser.save()
            res.redirect('/')
        } else {
            res.render('register', {
                errorMessage: 'Username has been used'
            })
        }
    } catch (err) {
        console.log(err)
        res.redirect('/register')
    }
})

module.exports = router