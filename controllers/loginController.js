const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const con = require('../config/dataBase');


function login(req, res) {
  const { email, password } = req.body;
  const secretKey = '1234';

  const query = 'SELECT * FROM user WHERE email = ?';
  con.query(query, [email], async (err, results) => {
      if (err) {
          console.error('Error executing query', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
      }

      if (results.length === 0) {
          res.status(401).json({ error: 'Invalid username or password' });
          return;
      }

      const user = results[0];
      // Compare the provided password with the hashed password in the database
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
          res.status(401).json({ error: 'Invalid username or password' });
          return;
      }

      // Create a JWT token
      const token = jwt.sign({ id: user.user_id, email: user.email }, secretKey);

      // Send the token back to the client
      res.json({ token });
  });
}
 
 module.exports = login;