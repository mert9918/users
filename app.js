require("dotenv").config();
const express = require('express');
const axios = require('axios');
const session = require('express-session');
const db = require("pro.db")
const app = express();
const port = 3000;
const {CODE, c, uri} = process.env;
app.use(session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: true
}));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

function parseHeaders() {
    try {
        return JSON.parse(process.env.HEADERS);
    } catch (error) {
        console.error('Error parsing headers:', error.message);
        return {};
    }
}

function getRandomString(length, characters) {
    let randomString = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }
    return randomString;
}

const isAuthenticated = (req, res, next) => {
    const isLoggedIn = req.session && req.session.authenticated;
    if (isLoggedIn) {
        next();
    } else {
        res.redirect('/');
    }
};

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/login', (req, res) => {
    const { code } = req.body;
    if (code === CODE) {
        req.session.authenticated = true;
        res.redirect('/sub');
    } else {
        res.redirect('/');
    }
});

app.get('/sub', isAuthenticated, (req, res) => {
    res.render('sub');
});

app.get('/api/getuser/:num', (req, res) => {
    console.log("test")
    db.push('sub1',0)
    let a = db.get("sub1")
    if (a.length > 5) return res.json({err: 'انتهى اشتراكك'})
    const num = req.params.num;
    let u = null;
    async function start() {
        let username = getRandomString(num, c);
        const options = {
            method: 'GET',
            url: `${uri}${username}`,
            headers: parseHeaders()
          };
        try {
            const response = await axios.request(options);
            if (response.ok){
                console.log(username)
                res.json({username, a: true})
            }else{
                res.json({username, a: true})
            }
        } catch (error) {
            console.log(error)
            res.json({username, a: false})
        }
    }
    start();
})

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
