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


/* ================= NEW COMPLAINT FORM ================= */

const API_BASE_URL = "http://localhost:5000";

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
            locationStatus.textContent =
                "Your browser does not support location access.";
            return;
        }

        useLocationBtn.disabled = true;
        useLocationBtn.textContent = "📍 Getting Location...";

        navigator.geolocation.getCurrentPosition(
            function (position) {

                complaintLatitude =
                    position.coords.latitude.toFixed(6);

                complaintLongitude =
                    position.coords.longitude.toFixed(6);

                latitudeValue.textContent = complaintLatitude;
                longitudeValue.textContent = complaintLongitude;

                locationStatus.textContent =
                    "Current location captured successfully.";

                useLocationBtn.disabled = false;
                useLocationBtn.textContent = "✓ Location Captured";
            },
            function () {

                locationStatus.textContent =
                    "Location permission was not granted. You can continue with manual address details.";

                useLocationBtn.disabled = false;
                useLocationBtn.textContent = "📍 Use My Current Location";
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

        Array.from(complaintPhotos.files).slice(0, 6).forEach(function (file) {

            if (!file.type.startsWith("image/")) return;

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
        });
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
        "GPS location is optional. You can enter the address manually.";
}


/* Submit complaint */

if (complaintForm) {
    complaintForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        complaintFormMessage.textContent = "";

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

        const payload = {
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
