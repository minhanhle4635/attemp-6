const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        min: 5
    },
    username: {
        type: String,
        required: true,
        min: 7
    },
    password: {
        type: String,
        required: true,
        min: 7
    },
    role:{
        type: String,
        enum: ['admin','coordinator','user'],
        default: 'user'
    }
})

module.exports = mongoose.model( 'User',userSchema )