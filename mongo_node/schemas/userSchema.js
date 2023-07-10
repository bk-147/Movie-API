const mongoose = require('mongoose')

mongoose.connect("mongodb://127.0.0.1/myNewDatabase")

const userSchema = new mongoose.Schema({

    uname: String,
    pass: String
}, { collection: 'users' })

module.exports = mongoose.model("User", userSchema)