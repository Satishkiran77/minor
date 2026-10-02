const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const db = require("./database");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "JanSeva Portal Backend is Running!" });
});

app.post("/api/register", async (req, res) => {
    try {
        const { role, firstName, lastName, email, mobile, state, district, password } = req.body;

        if (!role || !firstName || !lastName || !email || !mobile || !state || !district || !password) {
            return res.status(400).json({ success: false, message: "Please fill all required fields." });
        }

        const existingUser = await new Promise((resolve, reject) => {
            db.get("SELECT id FROM users WHERE email = ? OR mobile = ?", [email, mobile],
                (err, row) => err ? reject(err) : resolve(row));
        });

        if (existingUser) {
            return res.status(409).json({ success: false, message: "Email or mobile number already registered." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await new Promise((resolve, reject) => {
            db.run("INSERT INTO users (role, firstName, lastName, email, mobile, state, district, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [role, firstName, lastName, email, mobile, state, district, hashedPassword],
                err => err ? reject(err) : resolve());
        });

        res.status(201).json({ success: true, message: "Registration successful! You can now login." });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
});

app.post("/api/login", async (req, res) => {
    try {
        const { identifier, password, role } = req.body;

        if (!identifier || !password || !role) {
            return res.status(400).json({ success: false, message: "Please enter all login details." });
        }

        const user = await new Promise((resolve, reject) => {
            db.get("SELECT * FROM users WHERE (email = ? OR mobile = ?) AND role = ?",
                [identifier, identifier, role],
                (err, row) => err ? reject(err) : resolve(row));
        });

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email/mobile, password, or role." });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: "Invalid email/mobile or password." });
        }

        res.json({
            success: true,
            message: "Login successful.",
            user: {
                id: user.id,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                mobile: user.mobile,
                state: user.state,
                district: user.district
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
});

function generateComplaintId() {
    const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase();
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    return "JS-" + datePart + "-" + randomPart;
}

app.post("/api/complaints", async (req, res) => {
    try {
        const { userId, category, subCategory, title, description, state, district, villageCity, nearestTown, pincode, streetArea, latitude, longitude, location, priority } = req.body;

        if (!userId || !category || !title || !description || !state || !district) {
            return res.status(400).json({ success: false, message: "Please fill all required complaint fields." });
        }

        const user = await new Promise((resolve, reject) => {
            db.get("SELECT id FROM users WHERE id = ?", [userId],
                (err, row) => err ? reject(err) : resolve(row));
        });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        let complaintId;

        for (let attempt = 0; attempt < 5; attempt++) {
            const candidate = generateComplaintId();

            const exists = await new Promise((resolve, reject) => {
                db.get("SELECT id FROM complaints WHERE complaintId = ?", [candidate],
                    (err, row) => err ? reject(err) : resolve(row));
            });

            if (!exists) {
                complaintId = candidate;
                break;
            }
        }

        if (!complaintId) {
            return res.status(500).json({ success: false, message: "Could not generate complaint ID." });
        }

        await new Promise((resolve, reject) => {
            db.run("INSERT INTO complaints (complaintId, userId, category, subCategory, title, description, state, district, villageCity, nearestTown, pincode, streetArea, latitude, longitude, location, status, priority) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [complaintId, userId, category, subCategory || "", title, description, state, district, villageCity || "", nearestTown || "", pincode || "", streetArea || "", latitude || "", longitude || "", location || "", "Submitted", priority || "Normal"],
                err => err ? reject(err) : resolve());
        });

        res.status(201).json({
            success: true,
            message: "Complaint submitted successfully.",
            complaintId
        });
    } catch (error) {
        console.error("Create complaint error:", error);
        res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
});

app.get("/api/complaints/user/:userId", async (req, res) => {
    try {
        const complaints = await new Promise((resolve, reject) => {
            db.all("SELECT id, complaintId, category, subCategory, title, description, state, district, villageCity, nearestTown, pincode, streetArea, latitude, longitude, location, status, priority, createdAt, updatedAt FROM complaints WHERE userId = ? ORDER BY createdAt DESC",
                [req.params.userId],
                (err, rows) => err ? reject(err) : resolve(rows));
        });

        res.json({ success: true, complaints });
    } catch (error) {
        console.error("Get complaints error:", error);
        res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
});

app.get("/api/complaints/track/:complaintId", async (req, res) => {
    try {
        const complaint = await new Promise((resolve, reject) => {
            db.get("SELECT id, complaintId, category, subCategory, title, description, state, district, villageCity, nearestTown, pincode, streetArea, latitude, longitude, location, status, priority, createdAt, updatedAt FROM complaints WHERE complaintId = ?",
                [req.params.complaintId],
                (err, row) => err ? reject(err) : resolve(row));
        });

        if (!complaint) {
            return res.status(404).json({ success: false, message: "Complaint not found." });
        }

        res.json({ success: true, complaint });
    } catch (error) {
        console.error("Track complaint error:", error);
        res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
});

app.get("/api/complaints/stats/:userId", async (req, res) => {
    try {
        const stats = await new Promise((resolve, reject) => {
            db.get("SELECT COUNT(*) AS total, SUM(CASE WHEN status IN ('Submitted','Pending') THEN 1 ELSE 0 END) AS pending, SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) AS inProgress, SUM(CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END) AS resolved FROM complaints WHERE userId = ?",
                [req.params.userId],
                (err, row) => err ? reject(err) : resolve(row));
        });

        res.json({
            success: true,
            stats: {
                total: stats.total || 0,
                pending: stats.pending || 0,
                inProgress: stats.inProgress || 0,
                resolved: stats.resolved || 0
            }
        });
    } catch (error) {
        console.error("Stats error:", error);
        res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
