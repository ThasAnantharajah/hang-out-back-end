const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    email:String,
    username:String,
    password:String,
    token:String,
    profilUrl: String,
    
    friends: [{
        userId: String,
        profile : String,
    }]
})

const User = mongoose.model('users', userSchema)

module.exports = User

