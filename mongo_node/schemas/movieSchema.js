const { Double, Decimal128 } = require('mongodb')
const mongoose = require('mongoose')

mongoose.connect("mongodb://127.0.0.1/myNewDatabase")

const movieSchema = new mongoose.Schema({

    id: Number,
    title: String,
    rating: Decimal128,
    release_year: Number
}, { collection: 'movies' })

module.exports = mongoose.model("Movie", movieSchema)