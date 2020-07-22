const mongoose = require('mongoose')

const Task = mongoose.model('Task',{
    Description: {
        type: String,
        required: true,
        trim: true
    },
    Completed: {
        type: Boolean,
        default: false
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

module.exports = Task