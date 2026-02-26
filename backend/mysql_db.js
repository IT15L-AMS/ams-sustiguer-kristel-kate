const Mysql = require("mysql2");

const Db = Mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ams_db",
});

Db.connect((Err) => {
  if (Err) {
    console.error("MySQL connection failed:", Err);
  } else {
    console.log("Connected to MySQL database");
  }
});

module.exports = Db;