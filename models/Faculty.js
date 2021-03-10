const mongoose = require('mongoose')

const facultySchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String
    },
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic'
    }
})

module.exports = mongoose.model('Faculty', facultySchema)