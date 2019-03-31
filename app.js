const config = require('./config')
const db = require('./database/queries');
const express = require('express');
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const app = express();
const port = 5000;

passport.use(new LocalStrategy(
    {usernameField: 'email'},
    (email, password, done) => {
        db.getUserByEmail(email, (user) => {
            if (user){
                bcrypt.compare(password, user.password, function(err, res) {
                    if(res) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Invalid credentials.' });
                    }
                });
            } else {
                return done(null, false, { message: 'Invalid credentials.' });
            }
        });
    }
));

passport.serializeUser((user, done) => {
    done(null, user.user_id);
});

passport.deserializeUser((id, done) => {
    db.getUserByEmail(id, (user) => {
        done(null, user);
    });
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
      extended: true,
  })
);

app.use(session({
    genid: (req) => {
        return uuid();
    },
    store: new FileStore(),
    secret: config.secret,
    resave: false,
    saveUninitialized: true,
    name: 'hhcookie'
}));

app.use(passport.initialize());
app.use(passport.session());

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', './views');

app.use(express.static('public'));

app.get('/', (req, res) => {
    if( !req.isAuthenticated() )
        res.render("index");
    else
        res.redirect('/home');
});

app.get('/login', (req, res) => {
    if( !req.isAuthenticated() )
        res.render("login");
    else
        res.redirect('/home');
});

app.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) {
            return res.render('login', {
            'message': '*Invalid credentials'
            });
        }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.redirect('/home');
        });
    })(req, res, next);
});

app.get('/signup', (req, res) => {
    if( !req.isAuthenticated() )
        res.render("signup");
    else
        res.redirect('/home');
});

app.post('/signup', db.createUser);

app.get('/home', (req, res) => {
    if(req.isAuthenticated()) {
        db.getUserByEmail(req.session.passport.user, (user) => {
            if (user){
                res.render("home", {
                    "fname": user.first_name,
                    "lname": user.last_name
                });
            }
        });
    } else {
        res.redirect('/')
    }
})

app.get('/logout', function (req, res) {
    req.session.destroy(function(err) {
        if (err) {
            console.error(err);
        } else {
            res.clearCookie('hhcookie');
            res.redirect('/');
        }
    });
});

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});
