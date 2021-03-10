const mongoose = require('mongoose')

const topicSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    expiredDate: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('Topic', topicSchema)