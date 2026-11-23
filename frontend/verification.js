(() => {
    const API = "http://localhost:5000";
    const user = JSON.parse(localStorage.getItem("jansevaUser") || "null");
    const section = document.getElementById("verification");
    const message = document.getElementById("verificationMessage");
    const staffList = document.getElementById("staffVerificationList");
    const citizenList = document.getElementById("citizenVerificationList");
    const refresh = document.getElementById("refreshVerification");
    if (!user || !section || !message || !staffList || !citizenList) return;

    const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({
        "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
    }[ch]));
    const photosHtml = (photos, label) => Array.isArray(photos) && photos.length
        ? '<div class="verification-photo-grid">' + photos.map((photo, index) =>
            photo && ["image/jpeg","image/png","image/webp"].includes(photo.type) &&
            typeof photo.data === "string" && photo.data.startsWith("data:" + photo.type + ";base64,")
                ? '<div class="verification-photo"><a href="' + esc(photo.data) + '" target="_blank" rel="noopener noreferrer"><img src="' + esc(photo.data) + '" alt="' + esc(label) + ' photo ' + (index + 1) + '"></a><small>' + esc(label) + ' photo ' + (index + 1) + '</small></div>'
                : "").join("") + '</div>'
        : '<p class="verification-meta">No photos were uploaded.</p>';

    async function request(path, options = {}) {
        const response = await fetch(API + path, options);
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.message || "Request failed.");
        return data;
    }
    const jsonOptions = (method, body) => ({
        method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
    });

    function renderStaff(complaints) {
        staffList.hidden = false;
        citizenList.hidden = true;
        const tasks = complaints.filter(item => ["In Progress", "Awaiting Verification"].includes(item.status));
        if (!tasks.length) {
            staffList.innerHTML = '<div class="empty-state"><h3>No work awaiting photo submission</h3><p>Complaints marked In Progress will appear here.</p></div>';
            return;
        }
        staffList.innerHTML = tasks.map(item => {
            const awaiting = item.status === "Awaiting Verification";
            return '<article class="verification-card" data-complaint-id="' + esc(item.complaintId) + '">' +
                '<h3>' + esc(item.title) + '</h3><div class="verification-meta">' + esc(item.complaintId) + ' · ' + esc(item.category) + ' · ' + esc(item.location || item.district || "") + '</div>' +
                '<span class="verification-status">' + esc(item.status) + '</span>' +
                '<h4>Citizen submitted (Before)</h4>' + photosHtml(item.evidencePhotos, "Before") +
                (item.latestCitizenComment ? '<div class="verification-note"><strong>Citizen requested rework:</strong> ' + esc(item.latestCitizenComment) + '</div>' : '') +
                (awaiting
                    ? '<div class="verification-note">After-work photos have been submitted. Waiting for the citizen to compare and respond.</div>' + photosHtml(item.latestAfterPhotos, "Submitted after")
                    : '<form class="verification-form"><label>Work completed description<textarea name="workDescription" minlength="5" maxlength="1500" required placeholder="Describe the repair or work completed"></textarea></label><label>Upload after-work photos (1–6, JPG/PNG/WEBP, max 2 MB each)<input name="afterPhotos" type="file" accept="image/jpeg,image/png,image/webp" multiple required></label><button class="verification-submit" type="submit">Submit for Citizen Verification</button></form>') +
                '</article>';
        }).join("");
    }

    function renderCitizen(complaints) {
        citizenList.hidden = false;
        staffList.hidden = true;
        if (!complaints.length) {
            citizenList.innerHTML = '<div class="empty-state"><h3>No complaints need your verification</h3><p>When an officer completes work and uploads proof photos, they will appear here.</p></div>';
            return;
        }
        citizenList.innerHTML = complaints.map(item =>
            '<article class="verification-card" data-complaint-id="' + esc(item.complaintId) + '">' +
            '<h3>' + esc(item.title) + '</h3><div class="verification-meta">' + esc(item.complaintId) + ' · ' + esc(item.category) + '</div>' +
            '<h4>Before — your original evidence</h4>' + photosHtml(item.evidencePhotos, "Before") +
            '<h4>After — officer repair evidence</h4>' + photosHtml(item.afterPhotos, "After") +
            '<p><strong>Officer work details:</strong> ' + esc(item.workDescription) + '</p>' +
            '<div class="verification-meta">Submitted: ' + esc(item.submittedAt || "") + '</div>' +
            '<div class="verification-form"><label>If work is not complete, explain what is still wrong<textarea name="citizenComment" maxlength="1000" placeholder="Required only when requesting rework"></textarea></label>' +
            '<div class="verification-actions"><button type="button" class="verification-accept" data-decision="Accepted">Accept — Mark Resolved</button><button type="button" class="verification-reject" data-decision="Rejected">Request Rework</button></div></div></article>'
        ).join("");
    }

    async function load() {
        message.textContent = "Loading verification tasks...";
        try {
            if (user.role === "Citizen") {
                const data = await request("/api/complaints/verification/pending?userId=" + encodeURIComponent(user.id));
                renderCitizen(data.complaints || []);
                message.textContent = (data.complaints || []).length + " complaint(s) waiting for your verification.";
            } else if (["Officer", "Admin"].includes(user.role)) {
                const data = await request("/api/admin/complaints?userId=" + encodeURIComponent(user.id));
                const tasks = (data.complaints || []).filter(item => ["In Progress", "Awaiting Verification"].includes(item.status));
                renderStaff(data.complaints || []);
                message.textContent = tasks.length + " complaint(s) in the work verification queue.";
            } else {
                message.textContent = "This feature is not available for this account.";
            }
        } catch (error) {
            message.textContent = error.message;
        }
    }

    function readPhoto(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve({ type: file.type, data: reader.result });
            reader.onerror = () => reject(new Error("Could not read " + file.name));
            reader.readAsDataURL(file);
        });
    }

    staffList.addEventListener("submit", async event => {
        const form = event.target.closest(".verification-form");
        if (!form) return;
        event.preventDefault();
        const card = form.closest("[data-complaint-id]");
        const files = Array.from(form.querySelector('[name="afterPhotos"]').files || []);
        const description = form.querySelector('[name="workDescription"]').value.trim();
        const submit = form.querySelector("button[type=submit]");
        if (files.length < 1 || files.length > 6 || files.some(file => !["image/jpeg","image/png","image/webp"].includes(file.type) || file.size > 2 * 1024 * 1024)) {
            message.textContent = "Choose 1 to 6 JPG, PNG or WEBP photos, each smaller than 2 MB.";
            return;
        }
        submit.disabled = true;
        submit.textContent = "Uploading...";
        try {
            const afterPhotos = await Promise.all(files.map(readPhoto));
            const data = await request("/api/admin/complaints/" + encodeURIComponent(card.dataset.complaintId) + "/verification",
                jsonOptions("POST", { userId: user.id, workDescription: description, afterPhotos }));
            message.textContent = data.message;
            await load();
        } catch (error) {
            message.textContent = error.message;
            submit.disabled = false;
            submit.textContent = "Submit for Citizen Verification";
        }
    });

    citizenList.addEventListener("click", async event => {
        const button = event.target.closest("button[data-decision]");
        if (!button) return;
        const card = button.closest("[data-complaint-id]");
        const decision = button.dataset.decision;
        const comment = card.querySelector('[name="citizenComment"]').value.trim();
        if (decision === "Rejected" && comment.length < 5) {
            message.textContent = "Please explain what is still wrong (at least 5 characters) before requesting rework.";
            return;
        }
        button.disabled = true;
        try {
            const data = await request("/api/complaints/" + encodeURIComponent(card.dataset.complaintId) + "/verification",
                jsonOptions("PATCH", { userId: user.id, decision, comment }));
            message.textContent = data.message;
            await load();
        } catch (error) {
            message.textContent = error.message;
            button.disabled = false;
        }
    });

    if (refresh) refresh.addEventListener("click", load);
    load();
})();
