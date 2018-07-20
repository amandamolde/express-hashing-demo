var express = require("express");
var path = require("path");
var app = express();
const session = require('express-session')
var bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const morgan = require('morgan');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "./static")));
app.use(express.static(__dirname + '/front/dist'));
app.use(session({
    secret: "keepitsecretkeepitsafe",
    saveUninitialized: false
}))
app.use(morgan('short'));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
require('./db/db');

const User = require('./models/user');
app.get('/', (req, res)=>{
    let message = ""
    if(req.session.message){
        message = req.session.message
    }
    res.render('index.ejs', {message: message})
});

app.post('/register', async (req, res)=>{
    try {
        await User.create(req.body)
        res.redirect('/success')
    } catch (err) {
        console.log(err)
        req.session.message = err.message
        res.redirect('/')
    }
 
    
})

app.post('/login', async (req, res)=>{
    const userTryingToLogIn = await User.findOne({username: req.body.username})
    if(!userTryingToLogIn){
        await bcrypt.compare("bananas", "applesauce");
        req.session.message = "WRONG CREDENTIALS PAL"
        res.redirect("/")
    } else {
        const validLogin = await bcrypt.compare(req.body.password, userTryingToLogIn.password)
        if(!validLogin){
            req.session.message = "WRONG CREDENTIALS PAL"
            res.redirect("/")
        } else {
            res.redirect('/success')
        }
    }
})

app.get('/success', (req, res)=>{
    res.send("congratulaions")
})
app.listen(3000, ()=>{
    console.log("APP IS GO")
})