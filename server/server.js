let express = require('express');

let TwitterStrategy = require('passport-twitter').Strategy;
let passport = require('passport');

require('dotenv').config();

passport.use(new TwitterStrategy({
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: process.env.TWITTER_CALLBACK_URL
    },
    function (token, tokenSecret, profile, done) {
        done(null, profile);
    }
));

passport.serializeUser(function (user, done) {
    done(null, user);
    console.log('seriialized user');
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

let app = express();


app.use(express.static('pub'));

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/../views');
app.set('view engine', 'ejs');


// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({extended: true}));

let session = require('express-session');
let FileStore = require('session-file-store')(session);

let fileStore = new FileStore({
    path: '/tmp/sessions'
});

app.use(session({
    store: fileStore,
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

app.get('/login',
    function (req, res) {
        res.render('login');
    });

app.get('/login/twitter',
    passport.authenticate('twitter'));

app.get('/login/twitter/return',
    passport.authenticate('twitter', {failureRedirect: '/login'}),
    function (req, res) {
        res.redirect('/profile');
    });

app.get('/profile',
    require('connect-ensure-login').ensureLoggedIn(),
    function (req, res) {
        // console.log(req.user);
        res.render('profile', {user: req.user, sid: req.sessionID});
    });


let server = require('http').createServer(app);
let io = require('socket.io')(server);

let AuthUsers = require('./autUsers');
let authUsers = new AuthUsers();

server.listen(3000);

io.on('connection', function (socket) {
    console.log('connection');

    let authenticatedUsers = {};

    socket.emit('all users', authUsers.list);

    socket.on('authenticate', (sid) => {
        console.log('authenticate', sid);
        fileStore.get(sid, (error, session) => {
            if (error) {
                console.log('auth error', sid);
                socket.emit('auth error');
                return;
            }

            if (!('passport' in session && 'user' in session.passport)) {
                socket.emit('auth error');
                return;
            }
            let user = session.passport.user;

            if (!authUsers.userExists(user)) {
                io.emit('new user', user);
            }
            authUsers.addUser(session.passport.user, socket);
            socket.emit('authenticated', {sid: sid, profile: user});

            socket.on('new message', (text)=>{
                console.log('new message', text);
                io.emit('new message', {username: user.username, text: text});
            })

        })



    });

    socket.on('disconnect', (event) => {
        let user = authUsers.getUserBySocket(socket);
        if (user) {
            authUsers.removeSocket(socket);
            if (!authUsers.userExists(user)) {
                io.emit('user gone', user.id);
            }
        }
    });


});

