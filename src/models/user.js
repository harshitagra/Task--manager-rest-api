const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) throw new Error('Entered Email is incorrect') 
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if(value.toLowerCase().includes('password')) throw new Error('Password is too predictive')
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0 ) throw new Error('Age cannot be negative')  
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.methods.getauthorToken = async function() {
    const user = this
    const token = jwt.sign({_id: user._id.toString()} ,'secretToken')
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}
userSchema.statics.findbyCredentials = async (email, password) => {
    const user = await User.findOne({email}) 
    if(!user) {
        throw new Error('Wrong Credentials')
    }   
    const isCorrect = await bcrypt.compare(password, user.password)
    if(!isCorrect) throw new Error('Wrong Credentials')
    return user
}

userSchema.pre('save', async function(next) {
    const user = this
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})
const User = mongoose.model('User', userSchema)

module.exports = User