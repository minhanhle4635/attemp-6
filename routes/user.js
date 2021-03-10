const express = require('express')
const router = express.Router()
const {Logout} = require('../Login')

router.get('/', isUser, (req,res)=>{
    res.render('user/index')
})

router.get('/logout',Logout)

function isUser(req,res,next){
    if(!req.session.user){return res.redirect('/')}
    else if(req.session.isCoordinator === 'true') {return res.redirect('/coordinator')}
    else{next()}
}

module.exports = router