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

        // Public registration is Citizen-only. Officer accounts are provisioned by Admin.
        if (role !== "Citizen") {
            return res.status(403).json({ success: false, message: "Public registration is for Citizen accounts only. Contact an administrator for an Officer account." });
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


async function createComplaintNotification(userId, complaintId, title, message, type = "info") {
    return new Promise((resolve, reject) => {
        db.run(
            "INSERT INTO notifications (userId, complaintId, title, message, type) VALUES (?, ?, ?, ?, ?)",
            [userId, complaintId, title, message, type],
            err => err ? reject(err) : resolve()
        );
    });
}

app.get("/api/notifications/:userId", async (req, res) => {
    try {
        const notifications = await new Promise((resolve, reject) => {
            db.all(
                "SELECT id, complaintId, title, message, type, isRead, createdAt FROM notifications WHERE userId = ? ORDER BY createdAt DESC, id DESC LIMIT 100",
                [req.params.userId],
                (err, rows) => err ? reject(err) : resolve(rows)
            );
        });
        res.json({ success: true, notifications, unreadCount: notifications.filter(item => !item.isRead).length });
    } catch (error) {
        console.error("Notifications fetch error:", error);
        res.status(500).json({ success: false, message: "Could not load notifications." });
    }
});

app.patch("/api/notifications/:notificationId/read", async (req, res) => {
    try {
        const userId = req.body.userId;
        const result = await new Promise((resolve, reject) => {
            db.run(
                "UPDATE notifications SET isRead = 1 WHERE id = ? AND userId = ?",
                [req.params.notificationId, userId],
                function (err) { err ? reject(err) : resolve(this.changes); }
            );
        });
        if (!result) return res.status(404).json({ success: false, message: "Notification not found." });
        res.json({ success: true, message: "Notification marked as read." });
    } catch (error) {
        console.error("Mark notification read error:", error);
        res.status(500).json({ success: false, message: "Could not update notification." });
    }
});

app.patch("/api/notifications/read-all", async (req, res) => {
    try {
        const userId = req.body.userId;
        if (!userId) return res.status(400).json({ success: false, message: "User ID is required." });
        await new Promise((resolve, reject) => {
            db.run("UPDATE notifications SET isRead = 1 WHERE userId = ?", [userId], err => err ? reject(err) : resolve());
        });
        res.json({ success: true, message: "All notifications marked as read." });
    } catch (error) {
        console.error("Mark all notifications read error:", error);
        res.status(500).json({ success: false, message: "Could not update notifications." });
    }
});

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

        await createComplaintNotification(
            userId,
            complaintId,
            "Complaint submitted successfully",
            "Your complaint " + complaintId + " has been registered and is awaiting review.",
            "success"
        );

        // Notify every Admin when a citizen submits a new complaint.
        const adminUsers = await new Promise((resolve, reject) => {
            db.all("SELECT id FROM users WHERE role = 'Admin'", [], (err, rows) => err ? reject(err) : resolve(rows || []));
        });
        for (const adminUser of adminUsers) {
            await createComplaintNotification(
                adminUser.id,
                complaintId,
                "New citizen complaint received",
                "A new complaint " + complaintId + " (" + title + ") was submitted and is awaiting review/assignment.",
                "info"
            );
        }

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
            db.all("SELECT id, complaintId, category, subCategory, title, description, state, district, villageCity, nearestTown, pincode, streetArea, latitude, longitude, location, status, priority, assignedOfficerId, createdAt, updatedAt FROM complaints WHERE userId = ? ORDER BY createdAt DESC",
                [req.params.userId],
                (err, rows) => err ? reject(err) : resolve(rows));
        });

        res.json({ success: true, complaints });
    } catch (error) {
        console.error("Get complaints error:", error);
        res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
});

app.post("/api/complaints/:complaintId/reminder", async (req, res) => {
    try {
        const citizenId = Number(req.body.userId);
        if (!citizenId) return res.status(400).json({ success: false, message: "Please login again to send a reminder." });

        const citizen = await new Promise((resolve, reject) => {
            db.get("SELECT id, role FROM users WHERE id = ?", [citizenId],
                (err, row) => err ? reject(err) : resolve(row || null));
        });
        if (!citizen || citizen.role !== "Citizen") {
            return res.status(403).json({ success: false, message: "Only the complaint owner can send a reminder." });
        }

        const complaint = await new Promise((resolve, reject) => {
            db.get("SELECT complaintId, title, userId, assignedOfficerId, status FROM complaints WHERE complaintId = ?",
                [req.params.complaintId], (err, row) => err ? reject(err) : resolve(row || null));
        });
        if (!complaint || Number(complaint.userId) !== citizenId) {
            return res.status(404).json({ success: false, message: "Your complaint could not be found." });
        }
        if (complaint.status === "Resolved") {
            return res.status(400).json({ success: false, message: "This complaint is already resolved. A reminder is not needed." });
        }
        if (!complaint.assignedOfficerId) {
            return res.status(409).json({ success: false, message: "No Officer has been assigned yet. Please contact the help desk or wait for assignment." });
        }

        const officer = await new Promise((resolve, reject) => {
            db.get("SELECT id FROM users WHERE id = ? AND role = 'Officer'", [complaint.assignedOfficerId],
                (err, row) => err ? reject(err) : resolve(row || null));
        });
        if (!officer) return res.status(409).json({ success: false, message: "The assigned Officer account is unavailable. Please contact the administrator." });

        const recentReminder = await new Promise((resolve, reject) => {
            db.get("SELECT id FROM notifications WHERE userId = ? AND complaintId = ? AND type = 'reminder' AND createdAt >= datetime('now', '-1 day') LIMIT 1",
                [officer.id, complaint.complaintId], (err, row) => err ? reject(err) : resolve(row || null));
        });
        if (recentReminder) {
            return res.status(429).json({ success: false, message: "A reminder was already sent for this complaint in the last 24 hours. Please try again later." });
        }

        await createComplaintNotification(
            officer.id,
            complaint.complaintId,
            "Citizen reminder: pending complaint",
            "The citizen has sent a reminder for complaint " + complaint.complaintId + " (" + complaint.title + "). Please review the complaint and provide an update.",
            "reminder"
        );
        res.json({ success: true, message: "Reminder sent to the assigned Officer. Your original complaint remains unchanged." });
    } catch (error) {
        console.error("Citizen complaint reminder error:", error);
        res.status(500).json({ success: false, message: "Could not send the reminder. Please try again." });
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
            db.get(
                "SELECT COUNT(*) AS total, " +
                "SUM(CASE WHEN status IN ('Submitted','Pending','Received','Under Review','Assigned') THEN 1 ELSE 0 END) AS pending, " +
                "SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) AS inProgress, " +
                "SUM(CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END) AS resolved, " +
                "AVG(CASE WHEN status = 'Resolved' AND julianday(updatedAt) >= julianday(createdAt) " +
                "THEN julianday(updatedAt) - julianday(createdAt) END) AS averageResolutionDays " +
                "FROM complaints WHERE userId = ?",
                [req.params.userId],
                (err, row) => err ? reject(err) : resolve(row || {})
            );
        });

        res.json({
            success: true,
            stats: {
                total: Number(stats.total) || 0,
                pending: Number(stats.pending) || 0,
                inProgress: Number(stats.inProgress) || 0,
                resolved: Number(stats.resolved) || 0,
                averageResolutionDays: stats.averageResolutionDays == null
                    ? null
                    : Number(stats.averageResolutionDays)
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


function verificationQuery(sql, params = []) {
    return new Promise((resolve, reject) => db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows)));
}
function verificationChange(sql, params = []) {
    return new Promise((resolve, reject) => db.run(sql, params, function (err) {
        err ? reject(err) : resolve({ changes: this.changes, lastID: this.lastID });
    }));
}
function validateVerificationPhotos(photos) {
    if (!Array.isArray(photos) || photos.length < 1 || photos.length > 6) return false;
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    return photos.every(photo => photo && allowed.includes(photo.type) &&
        typeof photo.data === "string" && photo.data.startsWith("data:" + photo.type + ";base64,") &&
        photo.data.length <= 2800000);
}

app.get("/api/complaints/verification/pending", async (req, res) => {
    try {
        const userId = Number(req.query.userId);
        if (await getStaffRole(userId) !== "Citizen") return res.status(403).json({ success: false, message: "Citizen access required." });
        const complaints = await verificationQuery(
            "SELECT c.complaintId,c.title,c.category,c.description,c.location,c.status,c.evidencePhotos,c.createdAt,v.id AS verificationId,v.workDescription,v.afterPhotos,v.submittedAt " +
            "FROM complaints c JOIN complaint_verifications v ON v.complaintId=c.complaintId " +
            "WHERE c.userId=? AND c.status='Awaiting Verification' AND v.verificationStatus='Pending' " +
            "AND v.id=(SELECT MAX(v2.id) FROM complaint_verifications v2 WHERE v2.complaintId=c.complaintId) ORDER BY v.submittedAt DESC", [userId]);
        complaints.forEach(item => {
            try { item.evidencePhotos = JSON.parse(item.evidencePhotos || "[]"); } catch (_) { item.evidencePhotos = []; }
            try { item.afterPhotos = JSON.parse(item.afterPhotos || "[]"); } catch (_) { item.afterPhotos = []; }
        });
        res.json({ success: true, complaints });
    } catch (error) {
        console.error("Pending verification fetch error:", error);
        res.status(500).json({ success: false, message: "Could not load complaints awaiting verification." });
    }
});

app.post("/api/admin/complaints/:complaintId/verification", async (req, res) => {
    try {
        const officerId = Number(req.body.userId);
        const role = await getStaffRole(officerId);
        if (!["Admin", "Officer"].includes(role)) return res.status(403).json({ success: false, message: "Officer or Admin access required." });
        const workDescription = String(req.body.workDescription || "").trim().slice(0, 1500);
        const afterPhotos = req.body.afterPhotos;
        if (workDescription.length < 5) return res.status(400).json({ success: false, message: "Please describe the completed repair (at least 5 characters)." });
        if (!validateVerificationPhotos(afterPhotos)) return res.status(400).json({ success: false, message: "Upload 1 to 6 JPG, PNG or WEBP photos, each smaller than 2 MB." });
        const complaint = (await verificationQuery("SELECT complaintId,userId,status FROM complaints WHERE complaintId=?", [req.params.complaintId]))[0];
        if (!complaint) return res.status(404).json({ success: false, message: "Complaint not found." });
        if (complaint.status !== "In Progress") return res.status(409).json({ success: false, message: "Only complaints marked In Progress can be submitted for citizen verification." });
        await verificationChange("INSERT INTO complaint_verifications (complaintId,officerUserId,workDescription,afterPhotos,verificationStatus) VALUES (?,?,?,?,'Pending')",
            [req.params.complaintId, officerId, workDescription, JSON.stringify(afterPhotos)]);
        await verificationChange("UPDATE complaints SET status='Awaiting Verification',resolvedAt=NULL,updatedAt=CURRENT_TIMESTAMP WHERE complaintId=?", [req.params.complaintId]);
        await createComplaintNotification(complaint.userId, req.params.complaintId, "Repair completed - please verify",
            "The officer submitted after-work photos for " + req.params.complaintId + ". Compare the photos and accept or request rework.", "info");
        await verificationChange("INSERT INTO audit_logs (actorUserId,actorRole,action,complaintId,details) VALUES (?,?,?,?,?)",
            [officerId, role, "AFTER_PHOTOS_SUBMITTED", req.params.complaintId, workDescription]);
        res.status(201).json({ success: true, message: "After-work photos submitted. Waiting for citizen verification." });
    } catch (error) {
        console.error("Submit after-work photos error:", error);
        res.status(500).json({ success: false, message: "Could not submit after-work photos." });
    }
});

app.patch("/api/complaints/:complaintId/verification", async (req, res) => {
    try {
        const citizenId = Number(req.body.userId);
        if (await getStaffRole(citizenId) !== "Citizen") return res.status(403).json({ success: false, message: "Citizen access required." });
        const decision = String(req.body.decision || "");
        const comment = String(req.body.comment || "").trim().slice(0, 1000);
        if (!["Accepted", "Rejected"].includes(decision)) return res.status(400).json({ success: false, message: "Choose Accept or Request Rework." });
        if (decision === "Rejected" && comment.length < 5) return res.status(400).json({ success: false, message: "Please explain why the repair needs more work (at least 5 characters)." });
        const complaint = (await verificationQuery("SELECT complaintId,userId,status FROM complaints WHERE complaintId=?", [req.params.complaintId]))[0];
        if (!complaint || Number(complaint.userId) !== citizenId) return res.status(404).json({ success: false, message: "Complaint not found for this citizen." });
        if (complaint.status !== "Awaiting Verification") return res.status(409).json({ success: false, message: "This complaint is not waiting for verification." });
        const latest = (await verificationQuery("SELECT id,officerUserId FROM complaint_verifications WHERE complaintId=? AND verificationStatus='Pending' ORDER BY id DESC LIMIT 1", [req.params.complaintId]))[0];
        if (!latest) return res.status(409).json({ success: false, message: "No pending photo verification was found." });
        await verificationChange("UPDATE complaint_verifications SET verificationStatus=?,citizenComment=?,reviewedAt=CURRENT_TIMESTAMP WHERE id=?",
            [decision, comment || null, latest.id]);
        if (decision === "Accepted") {
            await verificationChange("UPDATE complaints SET status='Resolved',resolvedAt=CURRENT_TIMESTAMP,updatedAt=CURRENT_TIMESTAMP WHERE complaintId=?", [req.params.complaintId]);
        } else {
            await verificationChange("UPDATE complaints SET status='In Progress',resolvedAt=NULL,updatedAt=CURRENT_TIMESTAMP WHERE complaintId=?", [req.params.complaintId]);
        }
        await createComplaintNotification(latest.officerUserId, req.params.complaintId,
            decision === "Accepted" ? "Citizen verified completed work" : "Citizen requested more work",
            decision === "Accepted" ? req.params.complaintId + " was accepted by the citizen and is now resolved." :
                req.params.complaintId + " needs rework. Citizen feedback: " + comment,
            decision === "Accepted" ? "success" : "warning");
        await verificationChange("INSERT INTO audit_logs (actorUserId,actorRole,action,complaintId,details) VALUES (?,?,?,?,?)",
            [citizenId, "Citizen", decision === "Accepted" ? "WORK_VERIFIED" : "REWORK_REQUESTED", req.params.complaintId, comment]);
        res.json({ success: true, message: decision === "Accepted" ? "Thank you. The complaint is now resolved." : "Rework requested. The officer has been notified.", status: decision === "Accepted" ? "Resolved" : "In Progress" });
    } catch (error) {
        console.error("Citizen work verification error:", error);
        res.status(500).json({ success: false, message: "Could not save your verification decision." });
    }
});

app.get("/api/admin/complaints", async (req, res) => {
    try {
        const role = await getStaffRole(req.query.userId);
        if (!["Admin", "Officer"].includes(role)) {
            return res.status(403).json({ success: false, message: "Admin or Officer access required." });
        }

        // Officers share the incoming complaint queue; Admin assignment is not required.
        const complaintFilter = "";
        const complaintParams = [];
        const complaints = await new Promise((resolve, reject) => {
            db.all("SELECT c.id, c.complaintId, c.category, c.subCategory, c.title, c.description, c.state, c.district, c.villageCity, c.nearestTown, c.pincode, c.streetArea, c.latitude, c.longitude, c.location, c.status, c.priority, c.evidencePhotos, c.assignedOfficerId, c.dueAt, c.feedbackRating, c.feedbackComment, c.createdAt, c.updatedAt, (SELECT v.afterPhotos FROM complaint_verifications v WHERE v.complaintId=c.complaintId ORDER BY v.id DESC LIMIT 1) AS latestAfterPhotos, (SELECT v.citizenComment FROM complaint_verifications v WHERE v.complaintId=c.complaintId ORDER BY v.id DESC LIMIT 1) AS latestCitizenComment, u.firstName, u.lastName, u.email, u.mobile FROM complaints c LEFT JOIN users u ON u.id = c.userId" + complaintFilter + " ORDER BY c.createdAt DESC",
                complaintParams, (err, rows) => err ? reject(err) : resolve(rows));
        });
        complaints.forEach(complaint => {
            try { complaint.evidencePhotos = JSON.parse(complaint.evidencePhotos || "[]"); }
            catch (_) { complaint.evidencePhotos = []; }
            try { complaint.latestAfterPhotos = JSON.parse(complaint.latestAfterPhotos || "[]"); }
            catch (_) { complaint.latestAfterPhotos = []; }
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

        // Officers can update complaints in the shared incoming queue without prior assignment.
        const allowedStatuses = ["Submitted", "Received", "Under Review", "Assigned", "In Progress"];
        const status = String(req.body.status || "");
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid complaint status." });
        }

        const result = await new Promise((resolve, reject) => {
            db.run("UPDATE complaints SET status = ?, resolvedAt = NULL, updatedAt = CURRENT_TIMESTAMP WHERE complaintId = ?",
                [status, req.params.complaintId], function (err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                });
        });

        if (!result) {
            return res.status(404).json({ success: false, message: "Complaint not found." });
        }

        const complaintDetails = await new Promise((resolve, reject) => {
            db.get("SELECT userId, assignedOfficerId FROM complaints WHERE complaintId = ?", [req.params.complaintId],
                (err, row) => err ? reject(err) : resolve(row || null));
        });
        const complaintOwner = complaintDetails?.userId || null;
        const assignedOfficerId = complaintDetails?.assignedOfficerId || null;

        const statusMessages = {
            "Submitted": "Your complaint has been submitted.",
            "Received": "The department has received your complaint.",
            "Under Review": "Your complaint is now under review.",
            "Assigned": "Your complaint has been assigned to the concerned team.",
            "In Progress": "Work on your complaint is in progress.",
            "Resolved": "Your complaint has been marked as resolved."
        };

        if (complaintOwner) {
            await createComplaintNotification(
                complaintOwner,
                req.params.complaintId,
                "Complaint status updated",
                req.params.complaintId + ": " + statusMessages[status],
                status === "Resolved" ? "success" : "info"
            );
        }

        // Keep the assigned Officer informed when an Admin changes complaint status.
        const actingUserId = Number(req.body.userId);
        if (assignedOfficerId && Number(assignedOfficerId) !== actingUserId) {
            await createComplaintNotification(
                assignedOfficerId,
                req.params.complaintId,
                "Assigned complaint status updated",
                req.params.complaintId + " status changed to " + status + ". Please review the latest update.",
                status === "Resolved" ? "success" : "info"
            );
        }

        res.json({ success: true, message: "Complaint status updated and relevant users notified.", status });
    } catch (error) {
        console.error("Update complaint status error:", error);
        res.status(500).json({ success: false, message: "Could not update complaint status." });
    }
});


/* ADMIN FEATURE API */
function adminQuery(sql, params = []) { return new Promise((resolve, reject) => db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows))); }
function adminChange(sql, params = []) { return new Promise((resolve, reject) => db.run(sql, params, function(err) { err ? reject(err) : resolve({ changes: this.changes, lastID: this.lastID }); })); }
async function adminActor(userId) { const rows=await adminQuery("SELECT id,role FROM users WHERE id=?", [userId]); return rows[0] && ["Admin","Officer"].includes(rows[0].role) ? rows[0] : null; }
async function adminAudit(actor, action, complaintId, details) { await adminChange("INSERT INTO audit_logs (actorUserId,actorRole,action,complaintId,details) VALUES (?,?,?,?,?)", [actor.id,actor.role,action,complaintId||null,details||""]); }
app.get("/api/admin/analytics", async (req,res) => { try {
 const actor=await adminActor(req.query.userId); if(!actor||actor.role!=="Admin") return res.status(403).json({success:false,message:"Admin access required."});
 const [totals,categories,monthly,overdue,officerWorkload]=await Promise.all([
 adminQuery("SELECT COUNT(*) total,SUM(CASE WHEN status IN ('Submitted','Pending','Received','Under Review','Assigned') THEN 1 ELSE 0 END) pending,SUM(CASE WHEN status='In Progress' THEN 1 ELSE 0 END) inProgress,SUM(CASE WHEN status='Resolved' THEN 1 ELSE 0 END) resolved,AVG(CASE WHEN status='Resolved' THEN (julianday(COALESCE(resolvedAt,updatedAt))-julianday(createdAt))*24 END) avgHours FROM complaints"),
 adminQuery("SELECT category name,COUNT(*) count FROM complaints GROUP BY category ORDER BY count DESC LIMIT 8"),
 adminQuery("SELECT strftime('%Y-%m',createdAt) month,COUNT(*) count FROM complaints WHERE createdAt>=datetime('now','-5 months') GROUP BY month ORDER BY month"),
 adminQuery("SELECT COUNT(*) count FROM complaints WHERE status!='Resolved' AND ((dueAt IS NOT NULL AND datetime(dueAt)<datetime('now')) OR (dueAt IS NULL AND julianday('now')-julianday(createdAt)>7))"),
 adminQuery("SELECT u.id,u.firstName,u.lastName,COUNT(c.id) assignedCount,SUM(CASE WHEN c.status='Resolved' THEN 1 ELSE 0 END) resolvedCount FROM users u LEFT JOIN complaints c ON c.assignedOfficerId=u.id WHERE u.role='Officer' GROUP BY u.id ORDER BY assignedCount DESC")]);
 res.json({success:true,totals:totals[0]||{},categories,monthly,overdue:overdue[0]?.count||0,officerWorkload});
 } catch(e) { console.error(e); res.status(500).json({success:false,message:"Could not load analytics."}); } });
app.get("/api/admin/officers", async (req,res) => { try { const actor=await adminActor(req.query.userId); if(!actor||actor.role!=="Admin") return res.status(403).json({success:false,message:"Admin access required."}); res.json({success:true,officers:await adminQuery("SELECT id,firstName,lastName,email,mobile,state,district FROM users WHERE role='Officer' ORDER BY firstName,lastName")}); } catch(e) { res.status(500).json({success:false,message:"Could not load officers."}); } });
app.post("/api/admin/officers", async (req,res) => {
 try {
  const actor=await adminActor(req.body.userId);
  if(!actor||actor.role!=="Admin") return res.status(403).json({success:false,message:"Only Admin can create Officer accounts."});
  const firstName=String(req.body.firstName||"").trim();
  const lastName=String(req.body.lastName||"").trim();
  const email=String(req.body.email||"").trim().toLowerCase();
  const mobile=String(req.body.mobile||"").replace(/\s+/g,"");
  const state=String(req.body.state||"").trim();
  const district=String(req.body.district||"").trim();
  const password=String(req.body.password||"");
  if(!firstName||!lastName||!email||!mobile||!state||!district||!password) return res.status(400).json({success:false,message:"Please fill all Officer details."});
  if(firstName.length>80||lastName.length>80||state.length>100||district.length>100) return res.status(400).json({success:false,message:"Name, state or district is too long."});
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254) return res.status(400).json({success:false,message:"Enter a valid email address."});
  if(!/^[6-9]\d{9}$/.test(mobile)) return res.status(400).json({success:false,message:"Enter a valid 10-digit Indian mobile number."});
  if(password.length<8||password.length>72) return res.status(400).json({success:false,message:"Temporary password must be 8 to 72 characters."});
  const duplicate=await adminQuery("SELECT id FROM users WHERE lower(email)=lower(?) OR mobile=?",[email,mobile]);
  if(duplicate.length) return res.status(409).json({success:false,message:"Email or mobile number is already registered."});
  const hashedPassword=await bcrypt.hash(password,10);
  const created=await adminChange("INSERT INTO users (role,firstName,lastName,email,mobile,state,district,password) VALUES ('Officer',?,?,?,?,?,?,?)",[firstName,lastName,email,mobile,state,district,hashedPassword]);
  await adminAudit(actor,"OFFICER_ACCOUNT_CREATED",null,"Created Officer account #"+created.lastID+" ("+email+")");
  res.status(201).json({success:true,message:"Officer account created successfully.",officer:{id:created.lastID,firstName,lastName,email,mobile,state,district}});
 } catch(e) {
  console.error("Create Officer account error:",e);
  if(String(e.message||"").includes("UNIQUE constraint failed")) return res.status(409).json({success:false,message:"Email or mobile number is already registered."});
  res.status(500).json({success:false,message:"Could not create Officer account."});
 }
});
app.patch("/api/admin/complaints/:complaintId/assign", async (req,res) => {
 try {
  const actor=await adminActor(req.body.userId);
  if(!actor) return res.status(403).json({success:false,message:"Staff access required."});
  if(actor.role!=="Admin") return res.status(403).json({success:false,message:"Only Admin can assign officers."});
  const officerId=req.body.officerId?Number(req.body.officerId):null;
  if(officerId && !(await adminQuery("SELECT id FROM users WHERE id=? AND role='Officer'",[officerId])).length) {
   return res.status(400).json({success:false,message:"Select a valid officer."});
  }
  const complaintRows=await adminQuery("SELECT complaintId,title,userId,assignedOfficerId FROM complaints WHERE complaintId=?",[req.params.complaintId]);
  const complaint=complaintRows[0];
  if(!complaint) return res.status(404).json({success:false,message:"Complaint not found."});
  const result=await adminChange(
   "UPDATE complaints SET assignedOfficerId=?,status=CASE WHEN ? IS NOT NULL AND status='Submitted' THEN 'Assigned' ELSE status END,updatedAt=CURRENT_TIMESTAMP WHERE complaintId=?",
   [officerId,officerId,req.params.complaintId]
  );
  if(!result.changes) return res.status(404).json({success:false,message:"Complaint not found."});
  if(officerId && officerId !== Number(complaint.assignedOfficerId)) {
   await createComplaintNotification(
    officerId,req.params.complaintId,"New complaint assigned to you",
    "Complaint "+req.params.complaintId+" ("+complaint.title+") has been assigned to you. Please review and take action.","info"
   );
  }
  if(complaint.assignedOfficerId && Number(complaint.assignedOfficerId)!==officerId) {
   await createComplaintNotification(
    Number(complaint.assignedOfficerId),req.params.complaintId,"Complaint assignment changed",
    "Complaint "+req.params.complaintId+" is no longer assigned to you.","warning"
   );
  }
  await adminAudit(actor,officerId?"OFFICER_ASSIGNED":"OFFICER_UNASSIGNED",req.params.complaintId,officerId?"Officer ID "+officerId:"Assignment removed");
  res.json({success:true,message:officerId?"Officer assigned and notification sent.":"Officer assignment removed."});
 } catch(e) {
  console.error("Assign officer error:",e);
  res.status(500).json({success:false,message:"Could not assign officer."});
 }
});
app.get("/api/admin/overdue", async (req,res) => { try { const actor=await adminActor(req.query.userId); if(!actor) return res.status(403).json({success:false,message:"Staff access required."}); const complaints=await adminQuery("SELECT complaintId,title,status,priority,state,district,createdAt,dueAt FROM complaints WHERE status!='Resolved' AND ((dueAt IS NOT NULL AND datetime(dueAt)<datetime('now')) OR (dueAt IS NULL AND julianday('now')-julianday(createdAt)>7)) ORDER BY createdAt ASC"); res.json({success:true,complaints}); } catch(e) { res.status(500).json({success:false,message:"Could not load overdue complaints."}); } });
app.get("/api/admin/users", async (req,res) => { try { const actor=await adminActor(req.query.userId); if(!actor||actor.role!=="Admin") return res.status(403).json({success:false,message:"Admin access required."}); res.json({success:true,users:await adminQuery("SELECT id,role,firstName,lastName,email,mobile,state,district,createdAt FROM users ORDER BY createdAt DESC LIMIT 500")}); } catch(e) { res.status(500).json({success:false,message:"Could not load users."}); } });
app.get("/api/admin/audit-logs", async (req,res) => { try { const actor=await adminActor(req.query.userId); if(!actor||actor.role!=="Admin") return res.status(403).json({success:false,message:"Admin access required."}); res.json({success:true,logs:await adminQuery("SELECT a.id,a.actorUserId,a.actorRole,a.action,a.complaintId,a.details,a.createdAt,u.firstName,u.lastName FROM audit_logs a LEFT JOIN users u ON u.id=a.actorUserId ORDER BY a.createdAt DESC,a.id DESC LIMIT 100")}); } catch(e) { res.status(500).json({success:false,message:"Could not load audit logs."}); } });
app.get("/api/admin/feedback", async (req,res) => { try { const actor=await adminActor(req.query.userId); if(!actor||actor.role!=="Admin") return res.status(403).json({success:false,message:"Admin access required."}); res.json({success:true,feedback:await adminQuery("SELECT c.complaintId,c.title,c.feedbackRating,c.feedbackComment,c.updatedAt,u.firstName,u.lastName FROM complaints c LEFT JOIN users u ON u.id=c.userId WHERE c.feedbackRating IS NOT NULL ORDER BY c.updatedAt DESC LIMIT 200")}); } catch(e) { res.status(500).json({success:false,message:"Could not load feedback."}); } });
app.post("/api/complaints/:complaintId/feedback", async (req,res) => { try { const userId=Number(req.body.userId),rating=Number(req.body.rating); if(!userId||!Number.isInteger(rating)||rating<1||rating>5) return res.status(400).json({success:false,message:"Choose a rating from 1 to 5."}); const result=await adminChange("UPDATE complaints SET feedbackRating=?,feedbackComment=? WHERE complaintId=? AND userId=? AND status='Resolved'",[rating,String(req.body.comment||"").slice(0,1000),req.params.complaintId,userId]); if(!result.changes) return res.status(400).json({success:false,message:"Only the owner of a resolved complaint can submit feedback."}); res.json({success:true,message:"Thank you for your feedback."}); } catch(e) { res.status(500).json({success:false,message:"Could not save feedback."}); } });

const PORT = 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
