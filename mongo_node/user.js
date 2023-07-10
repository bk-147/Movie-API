const express = require('express')
const router = express.Router()
const path = require('path');


const mongoose = require('mongoose')
const Movie = require('./schemas/movieSchema')
const User = require('./schemas/userSchema')
const bcrypt = require('bcryptjs');
const { AssertionError } = require('assert');



const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
//uname user
//pwd  1234


//admin login
router.get('/login', async (req, res) => {
    res.sendFile(path.join(__dirname + '/static/userLogin.html'))
});
//admin logOut
router.get('/logout', async (req, res) => {

    console.log('user logged out')

    return res.json({ message: 'user logged out' })
});

router.post('/validate', async (req, res) => {
    let given_credentials = req.body
    // bcrypt.genSalt(10, function (err, salt) {
    //     bcrypt.hash(given_credentials.pass, salt, function (err, hash) {
    //         console.log(hash)
    //     });
    // });

    // const data = await client.db("myNewDatabase").collection("admins").findOne({ uname: given_credentials.uname })

    const data = await User.findOne({ uname: given_credentials.uname })
    if (data !== null) {
        let hash = data.pass

        bcrypt.compare(given_credentials.pass, hash, (err, result) => {
            if (result == true) {

                console.log('user logged in')

                let token;
                try {
                    //Creating jwt token
                    token = jwt.sign(
                        { userId: data.uname },
                        process.env.TOKEN_SECRET2,
                        { expiresIn: "1m" }
                    );
                } catch (err) {
                    console.log(err);
                    const error = new Error("Error! Something went wrong.");
                    return next(error);
                }

                res
                    .status(200)
                    .json({
                        success: true,
                        data: {
                            userId: data.id,
                            token: token,
                        },
                    });
            }
            else {

                return res.redirect('/user/login');
            }
        })

    }
    else {

        return res.redirect('/user/login');
    }
});


//add more users
router.post('/addUser', async (req, res) => {
    var data = req.body

    const hash = await bcrypt.hash(req.body.pass, 10);



    try {
        data.pass = hash
        console.log(data)
        const result = await User.create(data)
    } catch (e) {
        console.log(e.message)
    }
    res.send("Inserted")

})

//get all movies
router.get('/', authenticateToken, async (req, res) => {

    const result = await Movie.find()

    res.send(result)


});

//get with id
router.get('/:id', authenticateToken, async (req, res) => {

    const id = req.query.qid
    const result = await Movie.find({ id: parseInt(id) })
    res.send(result)


});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.TOKEN_SECRET2, (err, user) => {
        // console.log(err)

        if (err) return res.sendStatus(403)

        req.user = user

        next()
    })
}




module.exports = router