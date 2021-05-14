const mongoose = require('mongoose');
const validator = require('validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const Task = require('./task')

const saltNumber = 8

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
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is not valid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 7,
        validate(value){
            if(value.includes('password')){
                throw new Error('Password can not contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 18,
        validate(value){
            if(value < 0){
                throw new Error('Age must be a positive number')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true,
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id', 
    foreignField: 'owner' 

})

userSchema.methods.toJSON = function () {
    const user = this

    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.methods.generateOAuthToken = async function () {
    const user = this
    var token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}
 
userSchema.statics.findByCredentials = async (email, password) => {
    try {
        const user = await User.findOne({ email })
        if(!user) {
            throw new Error('Email not found')
        }
        const isMatched = await bcrypt.compare(password, user.password)
        console.log('password, user.password', password, user.password, isMatched)
        if(!isMatched){
            throw new Error('Passsword is incorrect')
        }
        return user
    }
    catch (err){
        throw err
    }

}

userSchema.pre('save', async function(next) {
    var user = this; // this will be the individual user that about to be saved

    if(user.isModified('password')){
        const hashedPassword =  await bcrypt.hash(user.password, saltNumber)
        user.password = hashedPassword
    }

    next()

})

// Delete user tasks when user is deleted
userSchema.pre('remove', async function(next) {
    var user = this;
    await Task.deleteMany({owner: user._id})
    next()

})

const User = mongoose.model('User', userSchema);

module.exports = User;