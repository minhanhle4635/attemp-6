const User = require('./models/User')
const bcrypt = require('bcrypt')

const Login = async (req,res,next) => {
    console.log(req.body)
    const {username, password} = req.body
    console.log(username)
    // khi them "select" trong schema thi can than thieu field password (vi no bi exclude khoi model tra ve luon). de them vao model
    // trong tra ve thi them `select([<ten field>]) vao. su dung `+` (de them) hoac `-` de khong select.
    const user = await User.findOne({ username: username}).select(['+password']).exec()
    if(!user){
        return res.redirect('/')
    } else if(user){
        // khong co password
        // ok con gi nua k
        bcrypt.compare(password, user.password, (err, same) =>{
            if(same){
                req.session.userId = user._id;
                req.session.isAdmin = user.role === 'admin';
                req.session.isCoordinator = user.role === 'coordinator';
                req.session.isUser = user.role === 'user';
            
                if(user.role === "admin"){
                    return res.redirect('/admin')
                } else if(user.role === "coordinator") {
                    return res.redirect('/coordinator')
                } else if(user.role === "user"){
                    return res.redirect('/user')
                }
            } else {
                console.log(err)
                return res.redirect('/')
            }
        })
    }  else{
        return res.redirect('/')
    }
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