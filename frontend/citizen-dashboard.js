const API_BASE_URL = "http://localhost:5000";

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

const trackButton = document.getElementById("trackBtn");
const complaintSearch = document.getElementById("complaintSearch");
const trackingResult = document.getElementById("trackingResult");
const trackingTimeline = document.getElementById("trackingTimeline");

function formatDate(value) {
    if (!value) return "-";

    // SQLite CURRENT_TIMESTAMP is UTC and has no timezone suffix.
    // Explicitly mark that format as UTC, then display it in the browser's local timezone.
    const timestamp = typeof value === "string" &&
        /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)
        ? value.replace(" ", "T") + "Z"
        : value;

    const date = new Date(timestamp);

    return isNaN(date.getTime()) ? value : date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });
}

function renderTracking(complaint) {
    const status = complaint.status || "Submitted";

    trackingResult.innerHTML = `
        <div class="track-summary">
            <div>
                <span>Complaint ID</span>
                <strong>${complaint.complaintId}</strong>
            </div>
            <div>
                <span>Status</span>
                <strong class="status-badge ${status.toLowerCase().replace(/\\s+/g, "-")}">${status}</strong>
            </div>
            <div>
                <span>Category</span>
                <strong>${complaint.category || "-"}</strong>
            </div>
            <div>
                <span>Priority</span>
                <strong>${complaint.priority || "Normal"}</strong>
            </div>
        </div>
        <div class="track-details">
            <p><strong>Subject:</strong> ${complaint.title || "-"}</p>
            <p><strong>Location:</strong> ${complaint.location || [complaint.villageCity, complaint.district, complaint.state].filter(Boolean).join(", ") || "-"}</p>
            <p><strong>Submitted:</strong> ${formatDate(complaint.createdAt)}</p>
        </div>
    `;

    const steps = ["Submitted", "Received", "Under Review", "Assigned", "In Progress", "Resolved"];
    const statusIndex = {
        "Submitted": 0,
        "Pending": 2,
        "Received": 1,
        "Under Review": 2,
        "Assigned": 3,
        "In Progress": 4,
        "Resolved": 5
    }[status] ?? 0;

    trackingTimeline.innerHTML = steps.map((step, index) => `
        <div class="timeline-item ${index <= statusIndex ? "completed" : ""}">
            <div class="timeline-dot"></div>
            <div>
                <strong>${step}</strong>
                <span>${index <= statusIndex ? "Completed" : "Waiting"}</span>
            </div>
        </div>
    `).join("");
}

async function trackComplaint() {
    const complaintId = complaintSearch.value.trim().toUpperCase();

    if (!complaintId) {
        trackingResult.textContent = "Please enter a Complaint ID.";
        trackingTimeline.innerHTML = "";
        return;
    }

    trackingResult.textContent = "Loading complaint...";
    trackingTimeline.innerHTML = "";

    try {
        const response = await fetch(API_BASE_URL + "/api/complaints/track/" + encodeURIComponent(complaintId));
        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Complaint not found.");
        }

        renderTracking(data.complaint);
    } catch (error) {
        trackingResult.innerHTML = `<strong>${error.message || "Unable to track complaint."}</strong>`;
    }
}

if (trackButton) trackButton.addEventListener("click", trackComplaint);

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


/* ================= REAL COMPLAINT DATA ================= */

let complaints = [];

async function loadDashboardData() {
    if (!userData || !userData.id) return;

    try {
        const complaintsResponse = await fetch(
            API_BASE_URL + "/api/complaints/user/" + userData.id
        );

        const complaintsData = await complaintsResponse.json();

        if (!complaintsResponse.ok || !complaintsData.success) {
            throw new Error(
                complaintsData.message || "Could not load complaints."
            );
        }

        complaints = complaintsData.complaints || [];

        renderRecentComplaints();
        renderMyCases();
        renderRecentActivity();

        try {
            const statsResponse = await fetch(
                API_BASE_URL + "/api/complaints/stats/" + userData.id
            );

            const statsData = await statsResponse.json();

            renderDashboardStats(
                statsResponse.ok && statsData.success
                    ? statsData.stats
                    : null
            );
        } catch (statsError) {
            console.error("Complaint stats error:", statsError);
            renderDashboardStats(null);
        }

    } catch (error) {
        console.error("Dashboard data error:", error);
    }
}

function renderDashboardStats(stats) {
    const total = stats?.total ?? complaints.length;
    const pending = (stats?.submitted ?? 0) + (stats?.pending ?? 0);
    const progress = stats?.inProgress ?? complaints.filter(item => item.status === "In Progress").length;
    const resolved = stats?.resolved ?? complaints.filter(item => item.status === "Resolved").length;

    document.getElementById("totalComplaints").textContent = total;
    document.getElementById("pendingComplaints").textContent = pending;
    document.getElementById("progressComplaints").textContent = progress;
    document.getElementById("resolvedComplaints").textContent = resolved;

    document.getElementById("chartPending").textContent = pending;
    document.getElementById("chartProgress").textContent = progress;
    document.getElementById("chartResolved").textContent = resolved;

    const totalForChart = total || 1;
    document.getElementById("pendingBar").style.width = (pending / totalForChart * 100) + "%";
    document.getElementById("progressBar").style.width = (progress / totalForChart * 100) + "%";
    document.getElementById("resolvedBar").style.width = (resolved / totalForChart * 100) + "%";
}

function renderRecentComplaints() {
    const box = document.getElementById("recentComplaints");
    if (!box) return;

    if (!complaints.length) {
        box.innerHTML = `
            <div class="empty-state">
                <div>📋</div>
                <h3>No complaints yet</h3>
                <p>Your submitted complaints will appear here.</p>
                <button class="primary-btn" id="emptyComplaintBtn">Submit Your First Complaint</button>
            </div>`;
        document.getElementById("emptyComplaintBtn")?.addEventListener("click", openNewComplaint);
        return;
    }

    box.innerHTML = complaints.slice(0, 4).map(item => `
        <div class="complaint-list-item">
            <div>
                <strong>${item.complaintId}</strong>
                <span>${item.title}</span>
                <small>${item.category} · ${formatDate(item.createdAt)}</small>
            </div>
            <span class="status-badge ${(item.status || "Submitted").toLowerCase().replace(/\\s+/g, "-")}">${item.status || "Submitted"}</span>
        </div>`).join("");
}

function renderMyCases() {
    const box = document.getElementById("allComplaints");
    if (!box) return;

    if (!complaints.length) {
        box.innerHTML = `
            <div class="empty-state">
                <div>📂</div>
                <h3>No complaints found</h3>
                <p>You haven't submitted any complaints yet.</p>
            </div>`;
        return;
    }

    box.innerHTML = `
        <div class="cases-table-wrap">
            <table class="cases-table">
                <thead>
                    <tr>
                        <th>Complaint ID</th>
                        <th>Category</th>
                        <th>Location</th>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${complaints.map(item => `
                        <tr>
                            <td><strong>${item.complaintId}</strong></td>
                            <td>${item.category || "-"}</td>
                            <td>${item.location || [item.villageCity, item.district].filter(Boolean).join(", ") || "-"}</td>
                            <td>${formatDate(item.createdAt)}</td>
                            <td><span class="status-badge ${(item.status || "Submitted").toLowerCase().replace(/\\s+/g, "-")}">${item.status || "Submitted"}</span></td>
                        </tr>`).join("")}
                </tbody>
            </table>
        </div>`;
}

function renderRecentActivity() {
    const box = document.getElementById("activityList");
    if (!box) return;

    if (!complaints.length) {
        box.innerHTML = `<div class="activity-empty"><span>🕒</span> No complaint activity yet.</div>`;
        return;
    }

    box.innerHTML = complaints.slice(0, 5).map(item => `
        <div class="activity-item">
            <span class="activity-icon">•</span>
            <div>
                <strong>${item.complaintId}</strong>
                <p>${item.title} · Status: ${item.status || "Submitted"}</p>
                <small>${formatDate(item.updatedAt || item.createdAt)}</small>
            </div>
        </div>`).join("");
}

/* ================= CONSOLE ================= */

console.log("JanSeva Citizen Dashboard loaded.");
console.log("Logged in user:", userData);


/* ================= NEW COMPLAINT FORM ================= */

const complaintForm = document.getElementById("complaintForm");
const complaintCategory = document.getElementById("complaintCategory");
const complaintSubCategory = document.getElementById("complaintSubCategory");
const complaintDescription = document.getElementById("complaintDescription");
const descriptionCount = document.getElementById("descriptionCount");
const complaintPhotos = document.getElementById("complaintPhotos");
const photoPreview = document.getElementById("photoPreview");
const useLocationBtn = document.getElementById("useLocationBtn");
const locationStatus = document.getElementById("locationStatus");
const latitudeValue = document.getElementById("latitudeValue");
const longitudeValue = document.getElementById("longitudeValue");
const complaintFormMessage = document.getElementById("complaintFormMessage");
const complaintSuccess = document.getElementById("complaintSuccess");
const generatedComplaintId = document.getElementById("generatedComplaintId");
const clearComplaintBtn = document.getElementById("clearComplaintBtn");
const submitAnotherBtn = document.getElementById("submitAnotherBtn");
const viewMyCasesBtn = document.getElementById("viewMyCasesBtn");

const complaintSubCategories = {
    "Road & Infrastructure": [
        "Potholes",
        "Damaged road",
        "Broken bridge",
        "Footpath issue"
    ],
    "Water & Sanitation": [
        "Water leakage",
        "No water supply",
        "Drainage",
        "Garbage"
    ],
    "Electricity": [
        "Streetlight",
        "Power issue",
        "Fallen electric pole"
    ],
    "Public Safety": [
        "Unsafe area",
        "Traffic issue",
        "Open manhole"
    ],
    "Healthcare": [
        "Government hospital",
        "Ambulance",
        "Medicine availability"
    ],
    "Other": [
        "Other public issue"
    ]
};

let complaintLatitude = "";
let complaintLongitude = "";


/* Fill registered details */

if (userData) {
    document.getElementById("complaintFirstName").value = userData.firstName || "";
    document.getElementById("complaintLastName").value = userData.lastName || "";
    document.getElementById("complaintEmail").value = userData.email || "";
    document.getElementById("complaintPhone").value = userData.mobile || "";
    document.getElementById("complaintState").value = userData.state || "";
    document.getElementById("complaintDistrict").value = userData.district || "";
}


/* Category -> sub-category */

if (complaintCategory) {
    complaintCategory.addEventListener("change", function () {

        const category = complaintCategory.value;
        const options = complaintSubCategories[category] || [];

        complaintSubCategory.innerHTML =
            '<option value="">Select sub-category</option>';

        options.forEach(function (item) {
            const option = document.createElement("option");
            option.value = item;
            option.textContent = item;
            complaintSubCategory.appendChild(option);
        });

        complaintSubCategory.disabled = options.length === 0;
    });
}


/* Description counter */

if (complaintDescription) {
    complaintDescription.addEventListener("input", function () {
        descriptionCount.textContent = complaintDescription.value.length;
    });
}


/* GPS */

if (useLocationBtn) {
    useLocationBtn.addEventListener("click", function () {

        if (!navigator.geolocation) {
            locationStatus.textContent = "Your browser does not support location access.";
            return;
        }

        useLocationBtn.disabled = true;
        useLocationBtn.textContent = "📍 Verifying Location...";

        navigator.geolocation.getCurrentPosition(
            async function (position) {

                complaintLatitude = position.coords.latitude.toFixed(6);
                complaintLongitude = position.coords.longitude.toFixed(6);

                latitudeValue.textContent = complaintLatitude;
                longitudeValue.textContent = complaintLongitude;
                locationStatus.textContent = "Checking your real location and pincode...";

                try {
                    const response = await fetch(
                        API_BASE_URL +
                        "/api/location/reverse?lat=" +
                        encodeURIComponent(complaintLatitude) +
                        "&lon=" +
                        encodeURIComponent(complaintLongitude)
                    );

                    const data = await response.json();

                    if (!response.ok || !data.success) {
                        throw new Error(data.message || "Could not verify this location.");
                    }

                    const location = data.location;

                    document.getElementById("complaintState").value = location.state || "";
                    document.getElementById("complaintDistrict").value = location.district || "";
                    document.getElementById("complaintArea").value = location.villageCity || "";
                    document.getElementById("complaintTown").value = location.nearestTown || "";
                    document.getElementById("complaintPincode").value = location.pincode || "";
                    document.getElementById("complaintStreet").value = location.streetArea || "";

                    locationStatus.textContent =
                        "Location verified. Pincode " + location.pincode +
                        " matches your current GPS location.";

                    useLocationBtn.textContent = "✓ Location Verified";
                } catch (error) {
                    complaintLatitude = "";
                    complaintLongitude = "";
                    latitudeValue.textContent = "Not set";
                    longitudeValue.textContent = "Not set";
                    document.getElementById("complaintPincode").value = "";
                    locationStatus.textContent = error.message;
                    useLocationBtn.textContent = "📍 Verify My Current Location";
                } finally {
                    useLocationBtn.disabled = false;
                }
            },
            function () {
                complaintLatitude = "";
                complaintLongitude = "";
                locationStatus.textContent =
                    "Location permission was not granted. Current location is required.";
                useLocationBtn.disabled = false;
                useLocationBtn.textContent = "📍 Verify My Current Location";
            },
            {
                enableHighAccuracy: true,
                timeout: 10000
            }
        );
    });
}


/* Photo preview */

if (complaintPhotos) {
    complaintPhotos.addEventListener("change", function () {
        photoPreview.innerHTML = "";
        const files = Array.from(complaintPhotos.files);

        if (files.length > 6) {
            complaintFormMessage.textContent = "Choose up to 6 photos only.";
            complaintPhotos.value = "";
            return;
        }

        for (const file of files) {
            if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 2 * 1024 * 1024) {
                complaintFormMessage.textContent = "Each photo must be JPG, PNG or WEBP and smaller than 2 MB.";
                complaintPhotos.value = "";
                photoPreview.innerHTML = "";
                return;
            }

            const reader = new FileReader();
            reader.onload = function (event) {
                const item = document.createElement("div");
                item.className = "photo-preview-item";
                const image = document.createElement("img");
                image.src = event.target.result;
                image.alt = "Complaint evidence";
                item.appendChild(image);
                photoPreview.appendChild(item);
            };
            reader.readAsDataURL(file);
        }
        complaintFormMessage.textContent = "";
    });
}


/* Reset complaint form */

function resetComplaintForm() {

    complaintForm.reset();

    document.getElementById("complaintState").value =
        userData?.state || "";

    document.getElementById("complaintDistrict").value =
        userData?.district || "";

    complaintSubCategory.innerHTML =
        '<option value="">Select category first</option>';

    complaintSubCategory.disabled = true;

    descriptionCount.textContent = "0";
    photoPreview.innerHTML = "";
    complaintFormMessage.textContent = "";

    complaintLatitude = "";
    complaintLongitude = "";

    latitudeValue.textContent = "Not set";
    longitudeValue.textContent = "Not set";

    locationStatus.textContent =
        "Current GPS location is required. Verify your location before submitting.";
}


/* Submit complaint */

if (complaintForm) {
    complaintForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        complaintFormMessage.textContent = "";

        if (!complaintLatitude || !complaintLongitude) {
            complaintFormMessage.textContent = "Please verify your current GPS location before submitting.";
            return;
        }

        if (!/^\d{6}$/.test(document.getElementById("complaintPincode").value.trim())) {
            complaintFormMessage.textContent = "Please use the verified 6-digit pincode shown after location verification.";
            return;
        }

        if (!userData || !userData.id) {
            complaintFormMessage.textContent =
                "Your login session is missing. Please login again.";
            return;
        }

        const submitButton =
            document.getElementById("submitComplaintBtn");

        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";

        const street = document.getElementById("complaintStreet").value.trim();
        const area = document.getElementById("complaintArea").value.trim();
        const town = document.getElementById("complaintTown").value.trim();
        const pincode = document.getElementById("complaintPincode").value.trim();

        const locationParts = [
            street,
            area,
            town,
            pincode,
            complaintLatitude ? "Lat: " + complaintLatitude : "",
            complaintLongitude ? "Lng: " + complaintLongitude : ""
        ].filter(Boolean);

        const evidencePhotos = await Promise.all(
            Array.from(complaintPhotos.files).map(file => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve({ type: file.type, data: reader.result });
                reader.onerror = () => reject(new Error("Could not read an evidence photo."));
                reader.readAsDataURL(file);
            }))
        );

        const payload = {
            evidencePhotos,
            userId: userData.id,
            category: complaintCategory.value,
            subCategory: complaintSubCategory.value,
            title: document.getElementById("complaintTitle").value.trim(),
            description: complaintDescription.value.trim(),
            state: document.getElementById("complaintState").value.trim(),
            district: document.getElementById("complaintDistrict").value.trim(),
            villageCity: area,
            nearestTown: town,
            pincode: pincode,
            streetArea: street,
            location: locationParts.join(", "),
            latitude: complaintLatitude,
            longitude: complaintLongitude,
            priority: document.querySelector('input[name="priority"]:checked')?.value || "Normal"
        };

        try {

            const response = await fetch(API_BASE_URL + "/api/complaints", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Could not submit complaint.");
            }

            generatedComplaintId.textContent = data.complaintId;

            complaintForm.style.display = "none";
            complaintSuccess.classList.add("show");

            openNewComplaint();

            await loadDashboardData();

            setTimeout(function () {
                complaintSuccess.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }, 50);

            return;

        } catch (error) {

            complaintFormMessage.textContent =
                error.message || "Unable to connect to the backend.";

        } finally {

            submitButton.disabled = false;
            submitButton.textContent = "Submit Complaint";
        }
    });
}


/* Clear */

if (clearComplaintBtn) {
    clearComplaintBtn.addEventListener("click", function () {
        resetComplaintForm();
    });
}


/* Submit another */

if (submitAnotherBtn) {
    submitAnotherBtn.addEventListener("click", function () {

        complaintSuccess.classList.remove("show");
        complaintForm.style.display = "flex";
        resetComplaintForm();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}


/* View cases */

if (viewMyCasesBtn) {
    viewMyCasesBtn.addEventListener("click", function () {

        const targetNav =
            document.querySelector('[data-section="myCases"]');

        if (targetNav) targetNav.click();

    });
}



/* ================= ADMIN / OFFICER COMPLAINT MANAGEMENT ================= */

const adminComplaintsNav = document.getElementById("adminComplaintsNav");
const adminAccessMessage = document.getElementById("adminAccessMessage");
const adminComplaintsList = document.getElementById("adminComplaintsList");
const refreshAdminComplaints = document.getElementById("refreshAdminComplaints");

const isStaffUser = userData && ["Admin", "Officer"].includes(userData.role);

if (isStaffUser && adminComplaintsNav) {
    adminComplaintsNav.hidden = false;

    document.title = (userData.role === "Admin" ? "Admin Workspace" : "Officer Workspace") + " | JanSeva Portal";

    const portalRoleLabel = document.getElementById("portalRoleLabel");
    const profileRoleLabel = document.getElementById("profileRoleLabel");
    const sidebarWelcomeText = document.getElementById("sidebarWelcomeText");

    if (portalRoleLabel) portalRoleLabel.textContent = userData.role + " Workspace";
    if (profileRoleLabel) profileRoleLabel.textContent = userData.role;
    if (sidebarWelcomeText) sidebarWelcomeText.textContent = "Review and manage citizen complaints";

    navItems.forEach(item => {
        if (!["adminComplaints", "settings"].includes(item.dataset.section)) {
            item.hidden = true;
        }
    });

    sections.forEach(section => {
        if (!["adminComplaints", "settings"].includes(section.id)) {
            section.classList.remove("active-section");
            section.hidden = true;
        }
    });

    const staffHeading = document.querySelector("#adminComplaints .page-heading .page-label");
    if (staffHeading) staffHeading.textContent = userData.role.toUpperCase() + " WORKSPACE";

    if (adminComplaintsNav) {
        navItems.forEach(item => item.classList.remove("active"));
        adminComplaintsNav.classList.add("active");
        const staffSection = document.getElementById("adminComplaints");
        if (staffSection) staffSection.classList.add("active-section");
    }
}

async function loadAdminComplaints() {
    if (!userData || !["Admin", "Officer"].includes(userData.role)) {
        if (adminAccessMessage) adminAccessMessage.textContent = "This section is available only to Admin and Officer accounts.";
        return;
    }

    if (adminAccessMessage) adminAccessMessage.textContent = "Loading complaints...";
    if (adminComplaintsList) adminComplaintsList.innerHTML = "";

    try {
        const response = await fetch(
            API_BASE_URL + "/api/admin/complaints?userId=" + encodeURIComponent(userData.id)
        );
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.message || "Could not load complaints.");

        if (adminAccessMessage) adminAccessMessage.textContent = data.complaints.length + " complaint(s) found.";

        if (!adminComplaintsList) return;
        if (!data.complaints.length) {
            adminComplaintsList.innerHTML = '<div class="empty-state"><h3>No complaints found</h3><p>New citizen complaints will appear here.</p></div>';
            return;
        }

        const statusOptions = ["Submitted", "Received", "Under Review", "Assigned", "In Progress", "Resolved"];
        adminComplaintsList.innerHTML = `
            <div class="cases-table-wrap">
                <table class="cases-table">
                    <thead><tr>
                        <th>Complaint ID</th><th>Citizen</th><th>Complaint</th><th>Location</th><th>Priority</th><th>Status</th><th>Update</th>
                    </tr></thead>
                    <tbody>
                        ${data.complaints.map(item => `
                            <tr>
                                <td><strong>${item.complaintId}</strong><br><small>${formatDate(item.createdAt)}</small></td>
                                <td>${item.firstName || ""} ${item.lastName || ""}<br><small>${item.mobile || item.email || ""}</small></td>
                                <td>${item.title}<br><small>${item.category} · ${item.subCategory || "General"}</small><br><small>${item.description}</small></td>
                                <td>${item.location || [item.villageCity, item.district, item.pincode].filter(Boolean).join(", ") || "-"}</td>
                                <td>${item.priority || "Normal"}</td>
                                <td><span class="status-badge">${item.status || "Submitted"}</span></td>
                                <td>
                                    <select class="admin-status-select" data-complaint-id="${item.complaintId}" aria-label="Status for ${item.complaintId}">
                                        ${statusOptions.map(status => `<option value="${status}" ${status === item.status ? "selected" : ""}>${status}</option>`).join("")}
                                    </select>
                                    <button class="primary-btn admin-save-status" data-complaint-id="${item.complaintId}">Save</button>
                                </td>
                            </tr>`).join("")}
                    </tbody>
                </table>
            </div>`;

        adminComplaintsList.querySelectorAll(".admin-save-status").forEach(button => {
            button.addEventListener("click", async function () {
                const complaintId = button.dataset.complaintId;
                const select = adminComplaintsList.querySelector('.admin-status-select[data-complaint-id="' + complaintId + '"]');
                button.disabled = true;
                button.textContent = "Saving...";
                try {
                    const updateResponse = await fetch(
                        API_BASE_URL + "/api/admin/complaints/" + encodeURIComponent(complaintId) + "/status",
                        {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ userId: userData.id, status: select.value })
                        }
                    );
                    const updateData = await updateResponse.json();
                    if (!updateResponse.ok || !updateData.success) throw new Error(updateData.message || "Status update failed.");
                    if (adminAccessMessage) adminAccessMessage.textContent = complaintId + " status updated to " + select.value + ".";
                    await loadAdminComplaints();
                    await loadDashboardData();
                } catch (error) {
                    if (adminAccessMessage) adminAccessMessage.textContent = error.message;
                } finally {
                    button.disabled = false;
                    button.textContent = "Save";
                }
            });
        });
    } catch (error) {
        if (adminAccessMessage) adminAccessMessage.textContent = error.message || "Could not load complaints.";
    }
}

if (refreshAdminComplaints) {
    refreshAdminComplaints.addEventListener("click", loadAdminComplaints);
}

if (adminComplaintsNav) {
    adminComplaintsNav.addEventListener("click", loadAdminComplaints);
}

/* ================= INITIAL DASHBOARD LOAD ================= */

if (isStaffUser) {
    loadAdminComplaints();
} else if (userData && userData.role === "Citizen") {
    loadDashboardData();
} else {
    alert("This account role is not permitted to access the portal.");
    localStorage.removeItem("jansevaUser");
    window.location.href = "index.html";
}
