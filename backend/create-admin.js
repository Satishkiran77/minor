const readline = require("readline");
const bcrypt = require("bcryptjs");
const db = require("./database");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(question) {
    return new Promise(resolve => rl.question(question, answer => resolve(answer.trim())));
}

async function main() {
    try {
        console.log("\nJanSeva Portal - Create Initial Admin Account\n");

        const firstName = await ask("First name: ");
        const lastName = await ask("Last name: ");
        const email = (await ask("Admin email: ")).toLowerCase();
        const mobile = await ask("Mobile (10 digits): ");
        const state = await ask("State/UT: ");
        const district = await ask("District: ");
        const password = await ask("Create admin password (minimum 8 characters): ");

        if (!firstName || !lastName || !email || !state || !district ||
            !/^\d{10}$/.test(mobile) || password.length < 8) {
            throw new Error("Invalid details. Mobile must be 10 digits and password at least 8 characters.");
        }

        const existing = await new Promise((resolve, reject) => {
            db.get("SELECT id FROM users WHERE email = ? OR mobile = ?", [email, mobile],
                (err, row) => err ? reject(err) : resolve(row));
        });

        if (existing) {
            throw new Error("This email or mobile is already registered. Use different details or contact your database administrator.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await new Promise((resolve, reject) => {
            db.run(
                "INSERT INTO users (role, firstName, lastName, email, mobile, state, district, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                ["Admin", firstName, lastName, email, mobile, state, district, hashedPassword],
                function (err) { err ? reject(err) : resolve(); }
            );
        });

        console.log("\nAdmin account created successfully.");
        console.log("Login using the Admin tab, your email/mobile, and the password you just created.");
    } catch (error) {
        console.error("\nAdmin setup failed:", error.message);
        process.exitCode = 1;
    } finally {
        rl.close();
        db.close();
    }
}

main();
