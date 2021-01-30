const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const data = require('../helpers/data.json');

router.post('/auth', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (Object.keys(data).includes(username)) {
        const auth_token = crypto.createHash('sha1').update(username + password).digest('hex');
        res.cookie('username', username);
        res.cookie('auth_token', auth_token);
        res.status(302).header({ Location: '/home.html' }).send({});
    }
    else {
        res.status(302).header({ Location: '/index.html' }).send({});
    }
});

const auth = (req, res, next) => {
    const cookies = req.cookies;
    fs.readFile(path.join(__dirname, '../helpers/user.json'), (err, data) => {
        if (err) throw err;
        const password = (JSON.parse(data))[cookies.username].password;
        const auth_token = crypto.createHash('sha1').update(cookies.username + password).digest('hex');
        if (cookies.username && cookies.auth_token === auth_token) {
            next();
        }
        else {
            res.status(302).send({ "location": '/index.html' });
        }
    })
};

router.get('/user', auth, (req, res) => {
    res.header({ 'Content-Type': 'application/json' })
    const cookies = req.cookies;
    fs.readFile(path.join(__dirname, '../helpers/user.json'), (err, data) => {
        if (err) throw err;
        res.send(JSON.stringify((JSON.parse(data))[cookies.username]));
    });
});

router.get('/posts', auth, (req, res) => {
    res.header({ 'Content-Type': 'application/json' })
    const cookies = req.cookies;
    fs.readFile(path.join(__dirname, '../helpers/data.json'), (err, data) => {
        if (err) throw err;
        res.send(JSON.stringify((JSON.parse(data))[cookies.username]));
    })
})

router.post('/posts/new', auth, (req, res) => {
    res.header({ 'Content-Type': 'application/json' })
    const newpost = req.body.post;
    const cookies = req.cookies;
    fs.readFile(path.join(__dirname, '../helpers/data.json'), (err, data) => {
        if (err) return res.send("Failure");
        const obj = JSON.parse(data);
        obj[cookies.username].post.push(newpost);
        fs.writeFile(path.join(__dirname, '../helpers/data.json'), JSON.stringify(obj), (err) => {
            if (err) return res.send("Failure");
            return res.send("Success");
        })
    })
})

module.exports = router;