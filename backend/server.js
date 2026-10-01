const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const db = require("./database");

const app = express();

app.use(cors());
app.use(express.json());


/* ================= HOME ================= */

app.get("/", (req, res) => {

    res.json({
        message: "JanSeva Portal Backend is Running!"
    });

});


/* ================= REGISTER ================= */

app.post("/api/register", async (req, res) => {

    try {

        const {
            role,
            firstName,
            lastName,
            email,
            mobile,
            state,
            district,
            password
        } = req.body;


        if (
            !role ||
            !firstName ||
            !lastName ||
            !email ||
            !mobile ||
            !state ||
            !district ||
            !password
        ) {

            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });

        }


        const existingUser = await new Promise((resolve, reject) => {

            db.get(
                `
                SELECT id
                FROM users
                WHERE email = ? OR mobile = ?
                `,
                [email, mobile],
                (err, row) => {

                    if (err) {
                        reject(err);
                    } else {
                        resolve(row);
                    }

                }
            );

        });


        if (existingUser) {

            return res.status(409).json({
                success: false,
                message: "Email or mobile number already registered."
            });

        }


        const hashedPassword =
            await bcrypt.hash(password, 10);


        await new Promise((resolve, reject) => {

            db.run(
                `
                INSERT INTO users
                (
                    role,
                    firstName,
                    lastName,
                    email,
                    mobile,
                    state,
                    district,
                    password
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    role,
                    firstName,
                    lastName,
                    email,
                    mobile,
                    state,
                    district,
                    hashedPassword
                ],
                function (err) {

                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }

                }
            );

        });


        res.status(201).json({

            success: true,

            message:
                "Registration successful! You can now login."

        });


    } catch (error) {

        console.error(
            "Registration error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Server error. Please try again later."

        });

    }

});


/* ================= LOGIN ================= */

app.post("/api/login", async (req, res) => {

    try {

        const {
            identifier,
            password,
            role
        } = req.body;


        if (
            !identifier ||
            !password ||
            !role
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please enter all login details."

            });

        }


        const user = await new Promise((resolve, reject) => {

            db.get(
                `
                SELECT *
                FROM users
                WHERE
                    (email = ? OR mobile = ?)
                    AND role = ?
                `,
                [
                    identifier,
                    identifier,
                    role
                ],
                (err, row) => {

                    if (err) {
                        reject(err);
                    } else {
                        resolve(row);
                    }

                }
            );

        });


        if (!user) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email/mobile, password, or role."

            });

        }


        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email/mobile or password."

            });

        }


        res.json({

            success: true,

            message:
                "Login successful!",

            user: {

                id: user.id,

                role: user.role,

                firstName: user.firstName,

                lastName: user.lastName,

                email: user.email,

                mobile: user.mobile

            }

        });


    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Server error. Please try again later."

        });

    }

});
/* ================= LOGIN ================= */

app.post("/api/login", async (req, res) => {
    try {
        const { identifier, password, role } = req.body;

        if (!identifier || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Please enter all login details."
            });
        }

        const user = await new Promise((resolve, reject) => {
            db.get(
                `
                SELECT *
                FROM users
                WHERE (email = ? OR mobile = ?)
                AND role = ?
                `,
                [identifier, identifier, role],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email/mobile, password, or role."
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email/mobile or password."
            });
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

        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
});


/* ================= SERVER ================= */

const PORT = 5000;

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});