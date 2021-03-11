const express = require('express')
const router = express.Router()
const { Logout } = require('../Login')
const Faculty = require('../models/Faculty')
const Topic = require('../models/Topic')

router.get('/', isUser, (req, res) => {
    res.render('user/index')
})

router.get('/topic', isUser, async (req, res) => {
    try {
        const topics = await Topic.find({}).populate('faculty');
        // cần phân loại các topics dựa trên faculty của nó
        // nên tôi tạo ra 1 "hash-map" - aka Object.
        const facultyList = {};

        topics.forEach(topic => {
            // điểm khác biệt của object với array là tôi có
            // thể phân biệt được "faculty" mà tôi check tại topic này
            // đã được phân loại chưa
            if(!facultyList[topic.faculty._id]) {
                // nếu trong trường hợp "chưa được phân loại"
                //
                // thì `facultyList.abc` = undefined;
                //
                // với `abc` là `topic.faculty._id`
                facultyList[topic.faculty._id] = {
                    name: topic.faculty.name,
                    topics: [],
                }
                // nếu chưa có faculty đó thì tôi tạo 1 object
                // chứa: name của faculty + các topic của nó.
                // vd:
                // facultyList = {
                //      abc: {
                //          name: "IT",
                //          topics: []  <- array topics của faculty
                //      }
                // }
                //
            }
            
            // sau đó tôi chỉ việc push cái thông tin topic
            // vào cái `topics` array bên trên.
            facultyList[topic.faculty._id].topics.push(topic);
        })
        res.render('user/topic', {
            faculties: facultyList
        })
    } catch {
        res.redirect('/user')
    }
})

router.get('/article', isUser, (req, res) => {
    res.render('user/article')
})

router.get('/article/new', isUser, (req, res) => {
    res.render('user/newArticle')
})

router.get('/logout', Logout)

function isUser(req, res, next) {
    if (!req.session.userId) { return res.redirect('/') }
    else if (req.session.isCoordinator === 'true') { return res.redirect('/coordinator') }
    else { next() }
}

module.exports = router