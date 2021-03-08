const User = require('./models/User')
const bcrypt = require('bcrypt')

const Login = (req,res,next) => {
    console.log(req.body)
    const {username, password} = req.body
    console.log(username)
    User.findOne({ username: username}).exec((err, user)=>{
        if(err){
            console.log(err)
            return res.redirect('/')
        } else if(!user){
            return res.redirect('/')
        } else if(user){
            bcrypt.compare(password, user.password, (err, same) =>{
                if(same){
                    req.session.userId = user._id
                    req.session.isAdmin = user.role === "admin" ? true : false
                    req.session.isCoordinator = user.role === "coordinator" ? true : false
                    req.session.isUser = user.role === "user" ? true : false
                
                    if(user.role === "admin"){
                        return res.redirect(`/admin`)
                    } else if(user.role === "coordinator") {
                        return res.redirect(`/coordinator`)
                    } else if(user.role === "user"){
                        return res.redirect(`/user`)
                    } else {
                        return res.redirect(`/`)
                    }
                }
            })
        }  else{
            return res.redirect('/')
        }
    })
}

const Logout = (req,res,next)=>{
    if(req.session){
        req.session.destroy((err)=>{
            if(err){
                return next(err)
            } else{
                return res.redirect('/')
            }
        })
    }
}


module.exports = { Login, Logout }