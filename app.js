const express = require('express');
const app = express();
app.use(express.json());
const loginRouter = require('./routes/loginRoutes')
const profileRouter = require('./routes/profileRoutes')
const borrowRouter = require('./routes/borrowRouter')
const notificationRouter = require('./routes/notificationRoutes')


app.use('/login', loginRouter);
app.use('/profile', profileRouter);
app.use('/borrow', borrowRouter);
app.use('/notification', notificationRouter);


app.listen(5000, () => {
    console.log("app is listening on the port 5000");
});

// const con = mysql.createConnection({
//   connectionLimit: 10,
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "CommuniCraft",
// });

// con.connect((err) => {
//   if (err) {
//     console.log(err);
//   } else console.log("Connected");
// });
// const jwt = require('jsonwebtoken');

// //// Middleware to parse JSON bodies
// app.use(express.json());

// app.post('/login', (req, res) => {

//       const { email , password } = req.body; 
    

//       const secretKey = '1234';

//     // Find the user in the database
//     const query = 'SELECT * FROM users WHERE email = ?';
//     con.query(query, [email], (err, results) => {
//       if (err) {
//         console.error('Error executing query', err);
//         res.status(500).json({ error: 'Internal server error' });
//         return;
//       }
  
//       if (results.length === 0) {
//         res.status(401).json({ error: 'Invalid username or password' }); // invalid username 
//         return;
//       }
  
//       const user = results[0];
  
//       // Compare the provided password with the password in the database
//       if (password != user.password) {
//         res.status(401).json({ error: 'Invalid username or password' }); // invalid password 
//         return;
//       }
  
//       // Create a JWT token
//       const token = jwt.sign({ id: user.id, email: user.email }, secretKey);
  
//       // Send the token back to the client
//       res.json({ token });
//     });
//   });


