const mongoose = require('mongoose')

const articleSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
    description:{
        type: String
    },
    coverImage:{
        type: Buffer,
        required: true
    },
    coverImageType: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Topic'
    }
})

module.exports = mongoose.model('Article', articleSchema)