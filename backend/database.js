const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./janseva.db", (err) => {

    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("JanSeva database connected.");
    }

});


db.run(`
    CREATE TABLE IF NOT EXISTS users (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        role TEXT NOT NULL,

        firstName TEXT NOT NULL,

        lastName TEXT NOT NULL,

        email TEXT UNIQUE NOT NULL,

        mobile TEXT UNIQUE NOT NULL,

        state TEXT NOT NULL,

        district TEXT NOT NULL,

        password TEXT NOT NULL,

        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP

    )
`, (err) => {

    if (err) {
        console.error(
            "Users table creation failed:",
            err.message
        );
    } else {
        console.log("Users table ready.");
    }

});


module.exports = db;