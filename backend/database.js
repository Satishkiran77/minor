const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./janseva.db", (err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("JanSeva database connected.");
    }
});

db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, role TEXT NOT NULL, firstName TEXT NOT NULL, lastName TEXT NOT NULL, email TEXT UNIQUE NOT NULL, mobile TEXT UNIQUE NOT NULL, state TEXT NOT NULL, district TEXT NOT NULL, password TEXT NOT NULL, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)", (err) => {
    if (err) console.error("Users table creation failed:", err.message);
    else console.log("Users table ready.");
});

db.run("CREATE TABLE IF NOT EXISTS complaints (id INTEGER PRIMARY KEY AUTOINCREMENT, complaintId TEXT UNIQUE NOT NULL, userId INTEGER NOT NULL, category TEXT NOT NULL, title TEXT NOT NULL, description TEXT NOT NULL, state TEXT NOT NULL, district TEXT NOT NULL, location TEXT, status TEXT NOT NULL DEFAULT 'Submitted', priority TEXT NOT NULL DEFAULT 'Normal', createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (userId) REFERENCES users(id))", (err) => {
    if (err) console.error("Complaints table creation failed:", err.message);
    else console.log("Complaints table ready.");
});

module.exports = db;
