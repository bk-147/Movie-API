const express = require('express')
const app = express()
const port = 3000

const admin = require('./admin')
const user = require('./user')
const path = require('path');


app.use(express.json());


app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {

    res.sendFile(path.join(__dirname, '/static/redirect.html'))
})
app.use("/admin", admin)
app.use("/user", user)

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})