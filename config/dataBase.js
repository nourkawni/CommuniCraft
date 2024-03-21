
const mysql = require("mysql");

const con = mysql.createConnection({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
<<<<<<< HEAD
  database: "communicraft",
=======
  database: "communiCraft",
>>>>>>> ab12dc6880962d54bc78324f21cb38b93c91da8f
});

con.connect((err) => {
  if (err) {
    console.log(err);
  } else console.log("Connected");
});

module.exports =con
