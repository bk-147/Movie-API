const express = require('express')
const router = express.Router()
const path = require('path');


const mongoose = require('mongoose')
const Movie = require('./schemas/movieSchema')
const Admin = require('./schemas/adminSchema')
const bcrypt = require('bcryptjs');
const { AssertionError } = require('assert');



const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { Hash } = require('crypto');
dotenv.config();

//uname admin
//pwd  1234


//admin login
router.get('/login', async (req, res) => {
    res.sendFile(path.join(__dirname + '/static/adminLogin.html'))
});
//admin logOut
router.get('/logout', async (req, res) => {

    console.log('admin logged out')
    return res.json({ message: 'admin logged out' })
});

router.post('/validate', async (req, res) => {
    let given_credentials = req.body

    const data = await Admin.findOne({ uname: given_credentials.uname })
    if (data !== null) {
        let hash = data.pass

        bcrypt.compare(given_credentials.pass, hash, (err, result) => {
            if (result == true) {

                console.log('admin logged in')

                let token;
                try {
                    //Creating jwt token
                    token = jwt.sign(
                        { userId: data.uname },
                        process.env.TOKEN_SECRET,
                        { expiresIn: "1h" }
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

                return res.redirect('/admin/login');
            }
        })

    }
    else {

        return res.redirect('/admin/login');
    }
});


//add more admins
router.post('/addAdmin', authenticateToken, async (req, res) => {
    var data = req.body

    const hash = await bcrypt.hash(req.body.pass, 10);



    try {
        data.pass = hash
        console.log(data)
        const result = await Admin.create(data)
    } catch (e) {
        console.log(e.message)
    }
    res.send("Inserted")

})




//get all movies
router.get('/', authenticateToken, async (req, res) => {

    const result = await Movie.find()

    res.send(result)
}


);

//get with id
router.get('/:id', authenticateToken, async (req, res) => {

    const id = req.params.id
    const result = await Movie.find({ id: parseInt(id) })
    res.send(result)


});

//insert 1 movie
router.post('/:id', authenticateToken, async (req, res) => {

    try {
        const result = await Movie.create(req.body)
    } catch (e) {
        console.log(e.message)
    }
    res.send("Inserted")



});

//insert many movies
router.post('/insertMany', authenticateToken, async (req, res) => {

    try {
        const result = await Movie.insertMany(req.body)
    } catch (e) {
        console.log(e.message)
    }
    res.send("Inserted")


});

//update a movie
router.put('/:id', authenticateToken, async (req, res) => {

    try {
        const result = await Movie.updateMany({ id: parseInt(id) }, req.body)
    } catch (e) {
        console.log(e.message)
    }
    res.send("Updated")


});

//delete a movie
router.delete('/:id', authenticateToken, async (req, res) => {

    try {
        const result = await Movie.delete({ id: parseInt(id) })
    } catch (e) {
        console.log(e.message)
    }
    res.send("Deleted")

});



function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    //console.log(authHeader)
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        // console.log(err)

        if (err) return res.sendStatus(403)

        req.user = user

        next()
    })
}



module.exports = router