const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const db = require("./database");

const app = express();
app.use(cors());
app.use(express.json({ limit: '18mb' }));

app.get("/", (req, res) => {
    res.json({ message: "JanSeva Portal Backend is Running!" });
});

app.get("/api/location/reverse", async (req, res) => {
    try {
        const lat = Number(req.query.lat);
        const lon = Number(req.query.lon);

        if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < 6 || lat > 38 || lon < 68 || lon > 98) {
            return res.status(400).json({ success: false, message: "Invalid location. Please use your current location in India." });
        }

        const url = "https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&zoom=18&lat=" +
            encodeURIComponent(lat) + "&lon=" + encodeURIComponent(lon);

        const response = await fetch(url, {
            headers: { "User-Agent": "JanSevaPortal/1.0" }
        });

        if (!response.ok) throw new Error("Location service unavailable.");

        const data = await response.json();
        const a = data.address || {};
        const pincodeResponse = await fetch(
            "https://livingatlas.esri.in/server1/rest/services/India/Pincode_Boundary_2025/MapServer/0/query?" +
            new URLSearchParams({
                geometry: lon + "," + lat,
                geometryType: "esriGeometryPoint",
                inSR: "4326",
                spatialRel: "esriSpatialRelIntersects",
                outFields: "pin_code,fname,state",
                returnGeometry: "false",
                f: "json"
            }).toString()
        );

        if (!pincodeResponse.ok) {
            throw new Error("India PIN boundary service unavailable.");
        }

        const pincodeData = await pincodeResponse.json();
        const pincodeFeature = pincodeData.features && pincodeData.features[0];
        const pincode = pincodeFeature?.attributes?.pin_code || "";

        if (!/^\d{6}$/.test(String(pincode))) {
            return res.status(422).json({
                success: false,
                message: "Official India PIN boundary could not determine a valid pincode for this location."
            });
        }

        res.json({
            success: true,
            location: {
                latitude: lat,
                longitude: lon,
                state: a.state || "",
                district: a.state_district || a.district || a.county || "",
                villageCity: a.city || a.town || a.village || a.municipality || a.suburb || "",
                nearestTown: a.town || a.city || a.municipality || "",
                pincode: pincode,
                streetArea: a.road || a.suburb || a.neighbourhood || ""
            }
        });
    } catch (error) {
        console.error("Reverse geocoding error:", error);
        res.status(503).json({
            success: false,
            message: "Could not verify the current location right now."
        });
    }
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
        const { userId, category, subCategory, title, description, state, district, villageCity, nearestTown, pincode, streetArea, latitude, longitude, location, priority, evidencePhotos = [] } = req.body;

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
        if (!Array.isArray(evidencePhotos) || evidencePhotos.length > 6) {
            return res.status(400).json({ success: false, message: "You can upload a maximum of 6 evidence photos." });
        }

        const allowedPhotoTypes = ["image/jpeg", "image/png", "image/webp"];
        for (const photo of evidencePhotos) {
            if (!photo || !allowedPhotoTypes.includes(photo.type) || typeof photo.data !== "string" ||
                !photo.data.startsWith("data:" + photo.type + ";base64,") ||
                photo.data.length > 2800000) {
                return res.status(400).json({ success: false, message: "Each photo must be JPG, PNG or WEBP and smaller than 2 MB." });
            }
        }

        if (!latitude || !longitude || !/^\d{6}$/.test(String(pincode || ""))) {
            return res.status(400).json({
                success: false,
                message: "Current GPS location and a valid 6-digit pincode are required."
            });
        }

        const pincodeResponse = await fetch(
            "https://livingatlas.esri.in/server1/rest/services/India/Pincode_Boundary_2025/MapServer/0/query?" +
            new URLSearchParams({
                geometry: Number(longitude) + "," + Number(latitude),
                geometryType: "esriGeometryPoint",
                inSR: "4326",
                spatialRel: "esriSpatialRelIntersects",
                outFields: "pin_code,fname,state",
                returnGeometry: "false",
                f: "json"
            }).toString()
        );

        if (!pincodeResponse.ok) {
            return res.status(503).json({
                success: false,
                message: "Current location could not be verified from the India PIN boundary service. Complaint was not submitted."
            });
        }

        const pincodeData = await pincodeResponse.json();
        const pincodeFeature = pincodeData.features && pincodeData.features[0];
        const verifiedPincode = pincodeFeature?.attributes?.pin_code || "";

        if (!/^\d{6}$/.test(String(verifiedPincode)) || String(pincode) !== String(verifiedPincode)) {
            return res.status(400).json({
                success: false,
                message: "Pincode does not match your current GPS location. Complaint was not submitted.",
                verifiedPincode
            });
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
            db.run("INSERT INTO complaints (complaintId, userId, category, subCategory, title, description, state, district, villageCity, nearestTown, pincode, streetArea, latitude, longitude, location, status, priority, evidencePhotos) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [complaintId, userId, category, subCategory || "", title, description, state, district, villageCity || "", nearestTown || "", pincode || "", streetArea || "", latitude || "", longitude || "", location || "", "Submitted", priority || "Normal", JSON.stringify(evidencePhotos)],
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
            db.get("SELECT id, complaintId, category, subCategory, title, description, state, district, villageCity, nearestTown, pincode, streetArea, latitude, longitude, location, status, priority, evidencePhotos, createdAt, updatedAt FROM complaints WHERE complaintId = ?",
                [req.params.complaintId],
                (err, row) => err ? reject(err) : resolve(row));
        });

        if (!complaint) {
            return res.status(404).json({ success: false, message: "Complaint not found." });
        }

        complaint.evidencePhotos = JSON.parse(complaint.evidencePhotos || "[]");
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


async function getStaffRole(userId) {
    return new Promise((resolve, reject) => {
        db.get("SELECT role FROM users WHERE id = ?", [userId],
            (err, row) => err ? reject(err) : resolve(row?.role || null));
    });
}

app.get("/api/admin/complaints", async (req, res) => {
    try {
        const role = await getStaffRole(req.query.userId);
        if (!["Admin", "Officer"].includes(role)) {
            return res.status(403).json({ success: false, message: "Admin or Officer access required." });
        }

        const complaints = await new Promise((resolve, reject) => {
            db.all("SELECT c.id, c.complaintId, c.category, c.subCategory, c.title, c.description, c.state, c.district, c.villageCity, c.nearestTown, c.pincode, c.streetArea, c.latitude, c.longitude, c.location, c.status, c.priority, c.createdAt, c.updatedAt, u.firstName, u.lastName, u.email, u.mobile FROM complaints c LEFT JOIN users u ON u.id = c.userId ORDER BY c.createdAt DESC",
                [], (err, rows) => err ? reject(err) : resolve(rows));
        });
        res.json({ success: true, complaints });
    } catch (error) {
        console.error("Admin complaints error:", error);
        res.status(500).json({ success: false, message: "Could not load complaints." });
    }
});

app.patch("/api/admin/complaints/:complaintId/status", async (req, res) => {
    try {
        const role = await getStaffRole(req.body.userId);
        if (!["Admin", "Officer"].includes(role)) {
            return res.status(403).json({ success: false, message: "Admin or Officer access required." });
        }

        const allowedStatuses = ["Submitted", "Received", "Under Review", "Assigned", "In Progress", "Resolved"];
        const status = String(req.body.status || "");
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid complaint status." });
        }

        const result = await new Promise((resolve, reject) => {
            db.run("UPDATE complaints SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE complaintId = ?",
                [status, req.params.complaintId], function (err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                });
        });

        if (!result) {
            return res.status(404).json({ success: false, message: "Complaint not found." });
        }

        res.json({ success: true, message: "Complaint status updated.", status });
    } catch (error) {
        console.error("Update complaint status error:", error);
        res.status(500).json({ success: false, message: "Could not update complaint status." });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
