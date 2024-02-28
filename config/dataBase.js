
const mysql = require("mysql");

const con = mysql.createConnection({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "CommuniCraft",
});

con.connect((err) => {
  if (err) {
    console.log(err);
  } else console.log("Connected");
});

module.exports =con
