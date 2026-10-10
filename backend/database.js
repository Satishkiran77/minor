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

db.run("CREATE TABLE IF NOT EXISTS complaints (id INTEGER PRIMARY KEY AUTOINCREMENT, complaintId TEXT UNIQUE NOT NULL, userId INTEGER NOT NULL, category TEXT NOT NULL, subCategory TEXT, title TEXT NOT NULL, description TEXT NOT NULL, state TEXT NOT NULL, district TEXT NOT NULL, villageCity TEXT, nearestTown TEXT, pincode TEXT, streetArea TEXT, latitude TEXT, longitude TEXT, location TEXT, status TEXT NOT NULL DEFAULT 'Submitted', priority TEXT NOT NULL DEFAULT 'Normal', evidencePhotos TEXT, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (userId) REFERENCES users(id))", (err) => {
    if (err) console.error("Complaints table creation failed:", err.message);
    else console.log("Complaints table ready.");
});


// Add new complaint fields when an older database already exists.
const complaintColumns = [
    ["subCategory", "TEXT"],
    ["villageCity", "TEXT"],
    ["nearestTown", "TEXT"],
    ["pincode", "TEXT"],
    ["streetArea", "TEXT"],
    ["latitude", "TEXT"],
    ["longitude", "TEXT"],
    ["evidencePhotos", "TEXT"]
];

complaintColumns.forEach(([column, type]) => {
    db.run(`ALTER TABLE complaints ADD COLUMN ${column} ${type}`, (err) => {
        if (err && !err.message.includes("duplicate column name")) {
            console.error("Complaint column update failed:", err.message);
        }
    });
});

module.exports = db;
