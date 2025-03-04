const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    Angenid: {type: Number, required: true, trim: true},
    fullname: { type: String, required: true, trim: true },  
    email: { type: String, required: true, lowercase: true, trim: true },  
    contact: { type: Number, required: true},  
    role: {type: String, required: true ,default : 'admin' },
    password: {type: String, required: true}
})

const userModel = mongoose.model('courtyard-shelter-users', userSchema)

module.exports = userModel