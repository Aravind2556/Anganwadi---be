const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    studentId: { type: String, required: true, unique: true },
    Angenid  :{type : Number , required : true},
    fullname: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    contact: { type: Number, required: true },
    dateOfBirth: { type: Date, required: true }, 
    address: { type: String, required: false } ,
    role: { type: String, required: true, default: 'User' },
    password: { type: String, required: true },
})

const userModel = mongoose.model('courtyard-shelter-student-users', userSchema)

module.exports = userModel