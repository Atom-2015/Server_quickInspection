// require('dotenv').config();
// const express = require('express');
// // const cookieparser = require('cookie-parser');
// const jwt = require('jsonwebtoken');
// const db = require('./config/mongoose');
// const helmet = require('helmet');


// // const session = require('express-session');
// // const passport = require('passport');

// // app.use(cookieparser());

// // app.use('/uploads', express.static(__dirname + '/uploads'));


// const app = express();
// app.use(express.json({ limit: '20mb' })); 
// // app.use(express.json());
// app.use(helmet())


// // const whitelist = ['http://localhost:3000'];

// // const corsOptions = {
// //   origin: (origin, callback) => {
// //     if (!origin || whitelist.includes(origin)) {
// //       callback(null, true); // Allow request
// //     } else {
// //       callback(new Error('Not allowed by CORS')); // Deny request
// //     }
// //   }
// // };


// // app.use(cors(corsOptions));


// const PORT = process.env.PORT || 3001;


// // app.use(session({
// //   name: 'connect',
// //   // TODO change the secret before deployment in production mode
// //   //adiya is the key to encrypt the cookie
// //   secret: process.env.SECRET_KEY,
// //   saveUninitialized: false,
// //   resave: false,
// //   cookie: {
// //      //what is age of cookie to expire the session ya mili second ma hota hai 
// //       maxAge: (1000 * 60 * 100)
// //   }
// // }));

// // app.use(passport.initialize());
// // app.use(passport.session());
// // app.use(passport.setAuthenticatedUser);





// app.use('/api' , require('./routes'));



   

// app.listen(PORT, () => {
//   console.log(`Server is running at ${PORT}`);
// });
















 
const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('./config/mongoose');
const helmet = require('helmet');
const cors = require('cors'); // Import CORS

const app = express();

// Middleware
app.use(express.json({ limit: '20mb' })); 
app.use(helmet());

// const whitelist = ['http://localhost:3000']; // Add the front-end domain here
// const corsOptions = {
//   // origin: (origin, callback) => {
//   //   if (!origin || whitelist.includes(origin)) {
//   //     callback(null, true); // Allow request from the frontend
//   //   } else {
//   //     callback(new Error('Not allowed by CORS')); // Deny the request if not from the whitelist
//   //   }
//   // },
//   origin: '*',
// };

app.use(cors({origin:'*'})); // Apply the CORS middleware


// Routes
app.use('/api', require('./routes'));

// Server setup
const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0",() => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
