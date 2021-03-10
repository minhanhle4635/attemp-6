const express = require('express')
const { Logout } = require('../Login')
const Topic = require('../models/Topic')
const router = express.Router()
const User = require('../models/User')
const Faculty = require('../models/Faculty')

router.get('/', isCoordinator, async (req, res) => {
    const user = await User.findById(req.session.userId).populate("faculty").exec()
    res.render('coordinator/index', {
        user: user
    })
})

router.get('/topic', isCoordinator, async (req, res) => {
    let query = Topic.find()
    if (req.query.name != null && req.query.name != '') {
        query = query.regex('name', new RegExp(req.query.name, 'i'))
    }
    try {
        const user = await User.findById(req.session.userId)
        const topic = await Topic.find({ faculty: user.faculty })

        res.render('coordinator/topic', {
            topic: topic,
            searchOptions: req.query
        })
    } catch (error) {
        console.log(error)
        res.redirect('/coordinator')

    }
})

router.get('/topic/new', isCoordinator, (req, res) => {
    res.render('coordinator/newTopic')
})

router.post('/topic/new', isCoordinator, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId)
        const existedTopic = await Topic.findOne({ name: req.body.name })
        const newTopic = new Topic({
            name: req.body.name,
            expiredDate: req.body.expiredDate,
            description: req.body.description,
            faculty: user.faculty
        })
        if (existedTopic == null) {
            await newTopic.save()
            res.redirect('/coordinator/topic')
        } else {
            res.render('coordinator/newTopic', {
                errorMessage: 'Topic is existed'
            })
        }
    } catch (error) {
        console.log(error)
        res.redirect('/coordinator')
    }
})

router.get('/topic/:id', isCoordinator, async (req, res) => {
    try {
        const topic = await Topic.findById(req.params.id).exec()
        res.render('coordinator/showTopic', {
            topic: topic
        })
    } catch (error) {
        console.log(error)
        res.redirect('/coordinator/topic')
    }
})

router.get('/topic/:id/edit', isCoordinator, async (req, res) => {
    try {
        const topic = await Topic.findById(req.params.id)
        const params = {
            topic: topic
        }
        res.render('coordinator/editTopic', params)
    } catch (error) {
        console.log(error)
        res.redirect(`/coordinator/topic/${topic._id}`)
    }
})

router.put('/topic/:id/edit', isCoordinator, async (req, res) => {
    let topic
    try {
        topic = await Topic.findById(req.params.id)
        topic.name = req.body.name
        topic.expiredDate = req.body.expiredDate
        topic.description = req.body.description
        await topic.save()
        res.redirect(`/coordinator/topic/${topic._id}`)
    } catch (error) {
        console.log(error)
        if (topic != null) {
            res.render('coordinator/editTopic', {
                errorMessage: 'Cannot edit this topic'
            })
        } else {
            res.redirect('/coordinator/topic')
        }
    }
})

router.delete('/topic/:id', isCoordinator, async (req, res) => {
    let topic
    try {
        topic = await Topic.findById(req.params.id)
        await topic.remove()
        res.redirect('/coordinator/topic')
    } catch (error) {
        console.log(error)
        if (topic != null) {
            res.render('coordinator/showTopic', {
                topic: topic,
                errorMessage: 'Could not delete this topic'
            })
        } else {
            res.redirect(`/topic/${topic._id}`)
        }
    }
})

router.get('/logout', Logout)

function isCoordinator(req, res, next) {
    console.log(req.session)
    if (req.session.isCoordinator === true || req.session.isAdmin === true) {
        next()
    } else if (req.session.isUser === true) {
        return res.redirect('/user')
    } else {
        return res.redirect('/')
    }
}



module.exports = router