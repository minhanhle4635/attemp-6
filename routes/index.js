const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/User')
// const mongoose = require('mongoose')
const { Login, Logout } = require('../Login')
const Article = require('../models/Article')
const path = require('path')
const uploadPath = path.join('public', Article.fileBasePath)

const { registerValidation } = require('../validation')

router.get('/download/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id)
        const pathToFile = path.join(uploadPath, article.fileName);
        res.download(pathToFile, article.fileName)
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

router.get('/login', (req,res) => {
    res.render('login')
})

router.post('/login', Login)

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

//show Article
router.get('/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id).populate("topic").exec()
        res.render('showArticle', { article: article })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

router.get('/', async (req, res) => {
    try {
        let query = Article.find({ status: 'true' })
        if (req.query.name != null && req.query.name != '') {
            query = query.regex('name', new RegExp(req.query.name, 'i'))
        }
        const article = await query.exec()
        res.render('index', {
            articles: article,
            searchOptions: req.query

        })
    } catch (error) {
        console.log(error)
    }
})
// vi route "/" thuc ra la parent cua "/user" nên
// thằng login này sẽ catch route trên. tôi suggest là nên
// đổi route thành /login
// ông là server thì ông vẫn có quyền quyết định API hoặc endpoint như thế nào
// client phải theo ông.
// cái route kiểu "/" này nguy hiểm lắm nên xài cẩn thận
// nó xài nhưng bên trong nó chia route nhỏ hơn
// vd "/" = index
// trong index thì sẽ có "/user" => user.js, "/faculty..."
// còn route mà chỉ có "/" thì sẽ đặt cuối cùng.


module.exports = router