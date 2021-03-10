const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/User')
const Faculty = require('../models/Faculty')
const {Logout} = require('../Login')

router.get('/', isAdmin,(req,res) => {
    res.render('admin/index')
})

//User function

router.get('/user',async (req,res)=>{
    let query = User.find()
    if(req.query.name != null && req.query.name != '') {
        query = query.regex('name', new RegExp(req.query.name, 'i'))
    }
    try{
        const user = await query.exec()
        res.render('admin/user',{
            user: user,
            searchOptions: req.query
        })
    }catch(err){
        console.log(err)
        res.redirect('/admin')
    }
})

router.get('/user/new', isAdmin, async (req,res) =>{
    const faculty = await Faculty.find({})
    res.render('admin/register',{
        faculty : faculty
    })
})

router.post('/user/new', isAdmin, async (req,res) =>{
    try{
        const ExistedUser = await User.findOne({username : req.body.username})
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const newUser = new User({
            name : req.body.name,
            username: req.body.username,
            password: hashedPassword,
            role : req.body.role,
            faculty : req.body.faculty
        })
        if(ExistedUser == null){
            await newUser.save()
            res.redirect('/admin')
        } else{
            res.render('admin/register', {
                errorMessage: 'Username has been used'
            })
        }
    } catch(err){
        console.log(err)
        res.redirect('/admin/user/new')
    }
})

router.get('/user/:id', isAdmin, async (req,res)=>{
    try{
        const user = await User.findById(req.params.id).populate('Faculty').exec()
        res.render('admin/showUser',{
            user: user
        })
    }catch(err){
        console.log(err)
        res.redirect('/admin/user')
    }   
})

router.get('/user/:id/edit', isAdmin, async(req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        const params = {
            user: user
        }
        res.render('admin/editUser', params)
    }catch(err){
        console.log(err)
        res.redirect('/admin/user/:id')
    }
})

router.put('/user/:id/edit', isAdmin, async (req,res)=>{
    let user
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        user = await User.findById(req.params.id)
        user.username = req.body.username
        user.password = hashedPassword
        user.role = req.body.role
        await user.save()
        res.redirect(`/admin/user/:id`)
    }catch(err){
        console.log(err)
        if(faculty != null){
            res.render('admin/editUser',{
                errorMessage: 'Cannot edit this faculty'
            })
        } else {
            res.redirect('/admin/user/:id')
        }
    }
})

router.delete('/user/:id', isAdmin, async(req,res)=>{
    let user
    try{
        user = await User.findById(req.params.id)
        await user.remove()
        res.redirect('/admin/user')
    }catch{
        if(faculty != null){
            res.render('admin/showUser', {
                faculty : faculty,
                errorMessage: 'Could not delete the user'
            })
        }else{
            res.redirect('/user/:id')
        }
    }
})

//Faculty Function

router.get('/faculty', isAdmin, async (req,res)=>{
    let query = Faculty.find()
    if(req.query.name != null && req.query.name != '') {
        query = query.regex('name', new RegExp(req.query.name, 'i'))
    }
    try{
        const faculty = await query.exec()
        res.render('admin/faculty',{
            faculty : faculty,
            searchOptions: req.query
        })
    }catch(err){
        console.log(err)
        res.redirect('/admin')
    }
    
})

router.get('/faculty/new', isAdmin, (req,res)=>{
    res.render('admin/newFaculty')
})

router.post('/faculty/new', async (req,res)=>{
    try{
        const existedFaculty = await Faculty.findOne({ name: req.body.name })
        const newFaculty = new Faculty({
            name: req.body.name,
            description: req.body.description
        })
        if(existedFaculty == null){
            await newFaculty.save()
            res.redirect('/admin/faculty')
        } else{
            res.render('admin/newFaculty', {
                errorMessage: 'Faculty Existed'
            })
        }
    }catch (err){
        console.log(err)
        res.redirect('/admin/faculty')
    }
})

router.get('/faculty/:id', isAdmin, async (req,res)=>{
    try{
        const faculty = await Faculty.findById(req.params.id)
        res.render('admin/showFaculty',{
            faculty: faculty
        })
    }catch(err){
        console.log(err)
        res.redirect('/admin/faculty')
    }   
})

router.get('/faculty/:id/edit', isAdmin, async(req,res)=>{
    try{
        const faculty = await Faculty.findById(req.params.id)
        const params = {
            faculty: faculty
        }
        res.render('admin/editFaculty', params)
    }catch(err){
        console.log(err)
        res.redirect('/admin/faculty/:id')
    }
})

router.put('/faculty/:id/edit', isAdmin, async (req,res)=>{
    let faculty
    try{
        faculty = await Faculty.findById(req.params.id)
        faculty.name = req.body.name
        faculty.description = req.body.description
        await faculty.save()
        res.redirect(`/admin/faculty/:id`)
    }catch(err){
        console.log(err)
        if(faculty != null){
            res.render('admin/editFaculty',{
                errorMessage: 'Cannot edit this faculty'
            })
        } else {
            res.redirect('/admin/faculty/:id')
        }
    }
})

router.delete('/faculty/:id', isAdmin, async(req,res)=>{
    let faculty
    try{
        faculty = await Faculty.findById(req.params.id)
        await faculty.remove()
        res.redirect('/admin/faculty')
    }catch{
        if(faculty != null){
            res.render('admin/showFaculty', {
                faculty : faculty,
                errorMessage: 'Could not delete the faculty'
            })
        }else{
            res.redirect('/faculty/:id')
        }
    }
})

function isAdmin(req,res,next){
    console.log(req.session)
    if(req.session.isAdmin === true){next()}
    else if(req.session.isCoordinator === true){return res.redirect('/coordinator')}
    else if(req.session.isUser === true) {return res.redirect('/user')}
    else{res.redirect('/')}
}

router.get('/logout', Logout)

module.exports = router