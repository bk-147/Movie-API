const mongoose = require('mongoose')

mongoose.connect("mongodb://127.0.0.1/myNewDatabase")

const adminSchema = new mongoose.Schema({

    uname: String,
    pass: String
}, { collection: 'admins' })

module.exports = mongoose.model("Admin", adminSchema)