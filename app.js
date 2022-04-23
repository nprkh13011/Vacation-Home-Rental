const express = require('express');

const app = express();
const session = require('express-session');
const configRoutes = require('./routes');
const static = express.static(__dirname + '/public');
const exphbs = require('express-handlebars');

app.use('/public', static);
app.use(express.json());
app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.urlencoded({extended: true}));

// app.use(session({
//   name: 'AuthCookie',
//   secret: 'some secret string!',
//   resave: false,
//   saveUninitialized: true
// }));

// // app.use('/', (req, res, next) => {
// //   // console.log(req.session.id);
// //   if (req.session.user) { // if they are authenticated
// //     return res.redirect('/private');
// //   } else {
// //     next();
// //   }
// // });

// app.use('/private', (req, res, next) => {
//   // console.log(req.session.id);
//   if (!req.session.user) {
//     return res.redirect('/');
//   } else {
//     next();
//   }
// });
// app.use('/signup', (req, res, next) => {
//   // console.log(req.session.id);
//   if (req.session.user) { // if user is authenticated
//     return res.redirect('/private');
//   } else {
//     next();
//   }
// });

// app.use('/login', (req, res, next) => {
//   if (req.session.user) {
//     return res.redirect('/private');
//   } else {
//     //here I',m just manually setting the req.method to post since it's usually coming from a form
//     req.method = 'POST';
//     next();
//   }
// });

//   //logging middleware?
//   app.use('*', (req, res, next) => {
//     let auth = req.session.user ? "Authenticated User" : "Non-Authenticated User";
//     console.log("[" + new Date().toUTCString() + "]: " + req.method + " " + req.originalUrl + ` ${auth}`);
//     next();
//   });

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
