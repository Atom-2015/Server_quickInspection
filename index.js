require('dotenv').config();
const express = require('express');
// const cookieparser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const db = require('./config/mongoose');
const helmet = require('helmet');


// const session = require('express-session');
// const passport = require('passport');

// app.use(cookieparser());

// app.use('/uploads', express.static(__dirname + '/uploads'));


const app = express();
app.use(express.json({ limit: '20mb' })); 
// app.use(express.json());
app.use(helmet())


const PORT = process.env.PORT || 3001;


// app.use(session({
//   name: 'connect',
//   // TODO change the secret before deployment in production mode
//   //adiya is the key to encrypt the cookie
//   secret: process.env.SECRET_KEY,
//   saveUninitialized: false,
//   resave: false,
//   cookie: {
//      //what is age of cookie to expire the session ya mili second ma hota hai 
//       maxAge: (1000 * 60 * 100)
//   }
// }));

// app.use(passport.initialize());
// app.use(passport.session());
// app.use(passport.setAuthenticatedUser);





app.use('/api' , require('./routes'));



   

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});