/* ================= USER DATA ================= */

const userData = JSON.parse(
    localStorage.getItem("jansevaUser") || "null"
);


/* ================= CHECK LOGIN ================= */

if (!userData) {
    alert("Please login first.");
    window.location.href = "index.html";
}


/* ================= DISPLAY USER ================= */

if (userData) {

    const fullName =
        `${userData.firstName || ""} ${userData.lastName || ""}`.trim();

    const firstName =
        userData.firstName || "Citizen";

    document.getElementById("profileName").textContent = fullName || "Citizen";
    document.getElementById("welcomeName").textContent = firstName;
    document.getElementById("headingName").textContent = firstName;

    document.getElementById("profileAvatar").textContent =
        firstName.charAt(0).toUpperCase();

    document.getElementById("largeAvatar").textContent =
        firstName.charAt(0).toUpperCase();

    document.getElementById("profileFullName").textContent =
        fullName || "Citizen";

    document.getElementById("profileEmail").textContent =
        userData.email || "Not available";

    document.getElementById("profileFirstName").textContent =
        userData.firstName || "-";

    document.getElementById("profileLastName").textContent =
        userData.lastName || "-";

    document.getElementById("profileEmailDetails").textContent =
        userData.email || "-";

    document.getElementById("profileMobile").textContent =
        userData.mobile || "-";

    document.getElementById("profileState").textContent =
        userData.state || "-";

    document.getElementById("profileDistrict").textContent =
        userData.district || "-";
}


/* ================= NAVIGATION ================= */

const navItems = document.querySelectorAll(".nav-item");
const sections = document.querySelectorAll(".content-section");

navItems.forEach(function (item) {

    item.addEventListener("click", function () {

        const sectionName = item.dataset.section;

        navItems.forEach(function (nav) {
            nav.classList.remove("active");
        });

        item.classList.add("active");

        sections.forEach(function (section) {
            section.classList.remove("active-section");
        });

        const selectedSection =
            document.getElementById(sectionName);

        if (selectedSection) {
            selectedSection.classList.add("active-section");
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

});


/* ================= NEW COMPLAINT BUTTONS ================= */

function openNewComplaint() {

    navItems.forEach(function (nav) {
        nav.classList.remove("active");
    });

    const complaintNav =
        document.querySelector('[data-section="newComplaint"]');

    if (complaintNav) {
        complaintNav.classList.add("active");
    }

    sections.forEach(function (section) {
        section.classList.remove("active-section");
    });

    document.getElementById("newComplaint")
        .classList.add("active-section");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


const newComplaintBtn =
    document.getElementById("newComplaintBtn");

const emptyComplaintBtn =
    document.getElementById("emptyComplaintBtn");


if (newComplaintBtn) {
    newComplaintBtn.addEventListener(
        "click",
        openNewComplaint
    );
}


if (emptyComplaintBtn) {
    emptyComplaintBtn.addEventListener(
        "click",
        openNewComplaint
    );
}


/* ================= VIEW ALL ================= */

document.querySelectorAll(".text-btn").forEach(function (button) {

    button.addEventListener("click", function () {

        const sectionName =
            button.dataset.section;

        if (!sectionName) return;

        navItems.forEach(function (nav) {
            nav.classList.remove("active");
        });

        const targetNav =
            document.querySelector(
                `[data-section="${sectionName}"]`
            );

        if (targetNav) {
            targetNav.classList.add("active");
        }

        sections.forEach(function (section) {
            section.classList.remove("active-section");
        });

        const targetSection =
            document.getElementById(sectionName);

        if (targetSection) {
            targetSection.classList.add("active-section");
        }

    });

});


/* ================= TRACK COMPLAINT ================= */

const trackButton =
    document.getElementById("trackBtn");

const complaintSearch =
    document.getElementById("complaintSearch");

const trackingResult =
    document.getElementById("trackingResult");


if (trackButton) {

    trackButton.addEventListener("click", function () {

        const complaintId =
            complaintSearch.value.trim();

        if (!complaintId) {

            trackingResult.textContent =
                "Please enter a Complaint ID.";

            return;
        }

        trackingResult.innerHTML = `
            <strong>Complaint ID:</strong> ${complaintId}
            <br><br>
            <strong>Status:</strong> No complaint found.
            <br><br>
            Complaint tracking will be connected to the backend
            after the complaint system is created.
        `;

    });

}


/* ================= ENTER TO TRACK ================= */

if (complaintSearch) {

    complaintSearch.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {
                trackButton.click();
            }

        }
    );

}


/* ================= LOGOUT ================= */

const logoutBtn =
    document.getElementById("logoutBtn");


if (logoutBtn) {

    logoutBtn.addEventListener("click", function () {

        const confirmLogout =
            confirm("Are you sure you want to logout?");

        if (!confirmLogout) return;

        localStorage.removeItem("jansevaUser");

        window.location.href = "index.html";

    });

}


/* ================= INITIAL DATA ================= */

/*
   Complaints backend lo create ayyaka
   ikkada real data load chestham.
*/

const complaints = [];


/* ================= DASHBOARD COUNTS ================= */

function updateDashboardCounts() {

    const total =
        complaints.length;

    const pending =
        complaints.filter(
            item => item.status === "Pending"
        ).length;

    const progress =
        complaints.filter(
            item => item.status === "In Progress"
        ).length;

    const resolved =
        complaints.filter(
            item => item.status === "Resolved"
        ).length;


    document.getElementById("totalComplaints")
        .textContent = total;

    document.getElementById("pendingComplaints")
        .textContent = pending;

    document.getElementById("progressComplaints")
        .textContent = progress;

    document.getElementById("resolvedComplaints")
        .textContent = resolved;


    document.getElementById("chartPending")
        .textContent = pending;

    document.getElementById("chartProgress")
        .textContent = progress;

    document.getElementById("chartResolved")
        .textContent = resolved;


    const totalForChart =
        total || 1;


    document.getElementById("pendingBar")
        .style.width =
        `${(pending / totalForChart) * 100}%`;

    document.getElementById("progressBar")
        .style.width =
        `${(progress / totalForChart) * 100}%`;

    document.getElementById("resolvedBar")
        .style.width =
        `${(resolved / totalForChart) * 100}%`;
}


updateDashboardCounts();


/* ================= CONSOLE ================= */

console.log("JanSeva Citizen Dashboard loaded.");
console.log("Logged in user:", userData);