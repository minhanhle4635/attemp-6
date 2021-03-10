const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/User')
// const mongoose = require('mongoose')
const {Login, Logout} = require('../Login')
const passport = require('passport')

router.get('/',(req,res)=>{
    res.render('index')
})

router.post('/', Login, (req,res,next)=>{
    passport.authenticate('local', {
        failureFlash: true
    }) (req,res,next)
})

router.get('/register',(req,res)=>{
    res.render('register')
})

router.post('/register', async (req,res)=>{
    try{
        const ExistedUser = await User.findOne({username : req.body.username})
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const newUser = new User({
            name : req.body.name,
            username: req.body.username,
            password: hashedPassword
        })
        // await newUser.save()
        // res.redirect('/')
        if(ExistedUser == null){
            await newUser.save()
            res.redirect('/')
        } else{
            res.render('register', {
                errorMessage: 'Username has been used'
            })
        }
    } catch(err){
        console.log(err)
        res.redirect('/register')
    }
})

module.exports = router