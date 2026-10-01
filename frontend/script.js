const roles = document.querySelectorAll(".role");
const loginButton = document.querySelector("#loginButton");
const registerButton = document.querySelector("#registerNow");
const guideButton = document.querySelector("#howToRegister");

let selectedRole = "Citizen";


/* ================= ROLE SELECTION ================= */

roles.forEach(function (role) {

    role.addEventListener("click", function () {

        roles.forEach(function (item) {
            item.classList.remove("active");
        });

        role.classList.add("active");

        if (role.dataset.role) {
            selectedRole = role.dataset.role;
        }
        else if (role.innerText.includes("Citizen")) {
            selectedRole = "Citizen";
        }
        else if (role.innerText.includes("Officer")) {
            selectedRole = "Officer";
        }
        else {
            selectedRole = "Admin";
        }

    });

});


/* ================= LOGIN ================= */

loginButton.addEventListener("click", async function () {

    const identifier =
        document.getElementById("loginIdentifier").value.trim();

    const password =
        document.getElementById("loginPassword").value;

    if (!identifier || !password) {

        alert("Please enter email/mobile and password.");

        return;
    }

    loginButton.disabled = true;
    loginButton.textContent = "Logging in...";

    try {

        const response = await fetch(
            "http://localhost:5000/api/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    identifier: identifier,
                    password: password,
                    role: selectedRole
                })
            }
        );

        const data = await response.json().catch(function () {
            return {
                success: false,
                message: "Login service is not available yet."
            };
        });

        if (data.success) {
            localStorage.setItem("jansevaUser", JSON.stringify(data.user));

            alert("Login successful! Welcome " + data.user.firstName);

            window.location.href = "citizen-dashboard.html";
        }
        else {

            alert(
                data.message ||
                "Invalid login details."
            );

        }

    }
    catch (error) {

        console.error(
            "Login error:",
            error
        );

        alert(
            "Unable to connect to backend. " +
            "Please make sure the server is running."
        );

    }
    finally {

        loginButton.disabled = false;
        loginButton.textContent = "Login";

    }

});


/* ================= REGISTER BUTTON ================= */

registerButton.addEventListener("click", function () {

    showRegistrationForm();

});


/* ================= HOW TO REGISTER ================= */

guideButton.addEventListener("click", function () {

    alert(
        "How to Register?\n\n" +
        "1. Choose your role\n" +
        "2. Enter your personal details\n" +
        "3. Select your State and District\n" +
        "4. Create a secure password\n" +
        "5. Agree to Terms & Conditions\n" +
        "6. Click Create Account"
    );

});


/* ================= STATE → DISTRICT DATA ================= */

const stateDistricts = {

    "Andhra Pradesh": [
        "Alluri Sitharama Raju",
        "Anakapalli",
        "Anantapur",
        "Annamayya",
        "Bapatla",
        "Chittoor",
        "Dr. B.R. Ambedkar Konaseema",
        "East Godavari",
        "Eluru",
        "Guntur",
        "Kakinada",
        "Krishna",
        "Kurnool",
        "Nandyal",
        "NTR",
        "Palnadu",
        "Parvathipuram Manyam",
        "Prakasam",
        "Srikakulam",
        "Sri Sathya Sai",
        "Tirupati",
        "Visakhapatnam",
        "Vizianagaram",
        "West Godavari",
        "YSR Kadapa"
    ],

    "Arunachal Pradesh": [
        "Anjaw",
        "Bichom",
        "Changlang",
        "Dibang Valley",
        "East Kameng",
        "East Siang",
        "Itanagar Capital Complex",
        "Kamle",
        "Keyi Panyor",
        "Kra Daadi",
        "Kurung Kumey",
        "Lepa Rada",
        "Lohit",
        "Longding",
        "Lower Dibang Valley",
        "Lower Siang",
        "Lower Subansiri",
        "Namsai",
        "Pakke Kessang",
        "Papum Pare",
        "Shi Yomi",
        "Siang",
        "Tawang",
        "Tirap",
        "Upper Siang",
        "Upper Subansiri",
        "West Kameng",
        "West Siang"
    ],

    "Assam": [
        "Baksa",
        "Bajali",
        "Barpeta",
        "Biswanath",
        "Bongaigaon",
        "Cachar",
        "Charaideo",
        "Chirang",
        "Darrang",
        "Dhemaji",
        "Dhubri",
        "Dibrugarh",
        "Dima Hasao",
        "Goalpara",
        "Golaghat",
        "Hailakandi",
        "Hojai",
        "Jorhat",
        "Kamrup",
        "Kamrup Metropolitan",
        "Karbi Anglong",
        "Karimganj",
        "Kokrajhar",
        "Lakhimpur",
        "Majuli",
        "Morigaon",
        "Nagaon",
        "Nalbari",
        "Sivasagar",
        "Sonitpur",
        "South Salmara-Mankachar",
        "Tamulpur",
        "Tinsukia",
        "Udalguri",
        "West Karbi Anglong"
    ],

    "Bihar": [
        "Araria",
        "Arwal",
        "Aurangabad",
        "Banka",
        "Begusarai",
        "Bhagalpur",
        "Bhojpur",
        "Buxar",
        "Darbhanga",
        "East Champaran",
        "Gaya",
        "Gopalganj",
        "Jamui",
        "Jehanabad",
        "Kaimur",
        "Katihar",
        "Khagaria",
        "Kishanganj",
        "Lakhisarai",
        "Madhepura",
        "Madhubani",
        "Munger",
        "Muzaffarpur",
        "Nalanda",
        "Nawada",
        "Patna",
        "Purnia",
        "Rohtas",
        "Saharsa",
        "Samastipur",
        "Saran",
        "Sheikhpura",
        "Sheohar",
        "Sitamarhi",
        "Siwan",
        "Supaul",
        "Vaishali",
        "West Champaran"
    ],

    "Chhattisgarh": [
        "Balod",
        "Baloda Bazar",
        "Balrampur",
        "Bastar",
        "Bemetara",
        "Bijapur",
        "Bilaspur",
        "Dantewada",
        "Dhamtari",
        "Durg",
        "Gariaband",
        "Gaurela-Pendra-Marwahi",
        "Janjgir-Champa",
        "Jashpur",
        "Kabirdham",
        "Kanker",
        "Kondagaon",
        "Korba",
        "Koriya",
        "Mahasamund",
        "Manendragarh-Chirmiri-Bharatpur",
        "Mohla-Manpur-Ambagarh Chowki",
        "Mungeli",
        "Narayanpur",
        "Raigarh",
        "Raipur",
        "Rajnandgaon",
        "Sakti",
        "Sarangarh-Bilaigarh",
        "Sukma",
        "Surajpur",
        "Surguja"
    ],

    "Goa": [
        "North Goa",
        "South Goa"
    ],

    "Gujarat": [
        "Ahmedabad",
        "Amreli",
        "Anand",
        "Aravalli",
        "Banaskantha",
        "Bharuch",
        "Bhavnagar",
        "Botad",
        "Chhota Udaipur",
        "Dahod",
        "Dang",
        "Devbhumi Dwarka",
        "Gandhinagar",
        "Gir Somnath",
        "Jamnagar",
        "Junagadh",
        "Kheda",
        "Kutch",
        "Mahisagar",
        "Mehsana",
        "Morbi",
        "Narmada",
        "Navsari",
        "Panchmahal",
        "Patan",
        "Porbandar",
        "Rajkot",
        "Sabarkantha",
        "Surat",
        "Surendranagar",
        "Tapi",
        "Vadodara",
        "Valsad"
    ],

    "Haryana": [
        "Ambala",
        "Bhiwani",
        "Charkhi Dadri",
        "Faridabad",
        "Fatehabad",
        "Gurugram",
        "Hisar",
        "Jhajjar",
        "Jind",
        "Kaithal",
        "Karnal",
        "Kurukshetra",
        "Mahendragarh",
        "Nuh",
        "Palwal",
        "Panchkula",
        "Panipat",
        "Rewari",
        "Rohtak",
        "Sirsa",
        "Sonipat",
        "Yamunanagar"
    ],

    "Himachal Pradesh": [
        "Bilaspur",
        "Chamba",
        "Hamirpur",
        "Kangra",
        "Kinnaur",
        "Kullu",
        "Lahaul and Spiti",
        "Mandi",
        "Shimla",
        "Sirmaur",
        "Solan",
        "Una"
    ],

    "Jharkhand": [
        "Bokaro",
        "Chatra",
        "Deoghar",
        "Dhanbad",
        "Dumka",
        "East Singhbhum",
        "Garhwa",
        "Giridih",
        "Godda",
        "Gumla",
        "Hazaribagh",
        "Jamtara",
        "Khunti",
        "Koderma",
        "Latehar",
        "Lohardaga",
        "Pakur",
        "Palamu",
        "Ramgarh",
        "Ranchi",
        "Sahebganj",
        "Seraikela Kharsawan",
        "Simdega",
        "West Singhbhum"
    ],

    "Karnataka": [
        "Bagalkot",
        "Ballari",
        "Belagavi",
        "Bengaluru Rural",
        "Bengaluru Urban",
        "Bidar",
        "Chamarajanagar",
        "Chikkaballapur",
        "Chikkamagaluru",
        "Chitradurga",
        "Dakshina Kannada",
        "Davanagere",
        "Dharwad",
        "Gadag",
        "Hassan",
        "Haveri",
        "Kalaburagi",
        "Kodagu",
        "Kolar",
        "Koppal",
        "Mandya",
        "Mysuru",
        "Raichur",
        "Ramanagara",
        "Shivamogga",
        "Tumakuru",
        "Udupi",
        "Uttara Kannada",
        "Vijayapura",
        "Yadgir"
    ],

    "Kerala": [
        "Alappuzha",
        "Ernakulam",
        "Idukki",
        "Kannur",
        "Kasaragod",
        "Kollam",
        "Kottayam",
        "Kozhikode",
        "Malappuram",
        "Palakkad",
        "Pathanamthitta",
        "Thiruvananthapuram",
        "Thrissur",
        "Wayanad"
    ],

    "Madhya Pradesh": [
        "Agar Malwa",
        "Alirajpur",
        "Anuppur",
        "Ashoknagar",
        "Balaghat",
        "Barwani",
        "Betul",
        "Bhind",
        "Bhopal",
        "Burhanpur",
        "Chhatarpur",
        "Chhindwara",
        "Damoh",
        "Datia",
        "Dewas",
        "Dhar",
        "Dindori",
        "Guna",
        "Gwalior",
        "Harda",
        "Indore",
        "Jabalpur",
        "Jhabua",
        "Katni",
        "Khandwa",
        "Khargone",
        "Maihar",
        "Mandla",
        "Mandsaur",
        "Mauganj",
        "Morena",
        "Narmadapuram",
        "Narsinghpur",
        "Neemuch",
        "Niwari",
        "Panna",
        "Raisen",
        "Rajgarh",
        "Ratlam",
        "Rewa",
        "Sagar",
        "Satna",
        "Sehore",
        "Seoni",
        "Shahdol",
        "Shajapur",
        "Sheopur",
        "Shivpuri",
        "Sidhi",
        "Singrauli",
        "Tikamgarh",
        "Ujjain",
        "Umaria",
        "Vidisha"
    ],

    "Maharashtra": [
        "Ahmednagar",
        "Akola",
        "Amravati",
        "Beed",
        "Bhandara",
        "Buldhana",
        "Chandrapur",
        "Chhatrapati Sambhajinagar",
        "Dhule",
        "Gadchiroli",
        "Gondia",
        "Hingoli",
        "Jalgaon",
        "Jalna",
        "Kolhapur",
        "Latur",
        "Mumbai City",
        "Mumbai Suburban",
        "Nagpur",
        "Nanded",
        "Nandurbar",
        "Nashik",
        "Dharashiv",
        "Palghar",
        "Parbhani",
        "Pune",
        "Raigad",
        "Ratnagiri",
        "Sangli",
        "Satara",
        "Sindhudurg",
        "Solapur",
        "Thane",
        "Wardha",
        "Washim",
        "Yavatmal"
    ],

    "Manipur": [
        "Bishnupur",
        "Chandel",
        "Churachandpur",
        "Imphal East",
        "Imphal West",
        "Jiribam",
        "Kakching",
        "Kamjong",
        "Kangpokpi",
        "Noney",
        "Pherzawl",
        "Senapati",
        "Tamenglong",
        "Tengnoupal",
        "Thoubal",
        "Ukhrul"
    ],

    "Meghalaya": [
        "East Garo Hills",
        "East Jaintia Hills",
        "East Khasi Hills",
        "Eastern West Khasi Hills",
        "North Garo Hills",
        "Ri Bhoi",
        "South Garo Hills",
        "South West Garo Hills",
        "South West Khasi Hills",
        "West Garo Hills",
        "West Jaintia Hills",
        "West Khasi Hills"
    ],

    "Mizoram": [
        "Aizawl",
        "Champhai",
        "Hnahthial",
        "Khawzawl",
        "Kolasib",
        "Lawngtlai",
        "Lunglei",
        "Mamit",
        "Saiha",
        "Saitual",
        "Serchhip"
    ],

    "Nagaland": [
        "Chumoukedima",
        "Dimapur",
        "Kiphire",
        "Kohima",
        "Longleng",
        "Mokokchung",
        "Mon",
        "Niuland",
        "Noklak",
        "Peren",
        "Phek",
        "Shamator",
        "Tuensang",
        "Wokha",
        "Zunheboto"
    ],

    "Odisha": [
        "Angul",
        "Balangir",
        "Balasore",
        "Bargarh",
        "Bhadrak",
        "Boudh",
        "Cuttack",
        "Deogarh",
        "Dhenkanal",
        "Gajapati",
        "Ganjam",
        "Jagatsinghpur",
        "Jajpur",
        "Jharsuguda",
        "Kalahandi",
        "Kandhamal",
        "Kendrapara",
        "Kendujhar",
        "Khordha",
        "Koraput",
        "Malkangiri",
        "Mayurbhanj",
        "Nabarangpur",
        "Nayagarh",
        "Nuapada",
        "Puri",
        "Rayagada",
        "Sambalpur",
        "Subarnapur",
        "Sundargarh"
    ],

    "Punjab": [
        "Amritsar",
        "Barnala",
        "Bathinda",
        "Faridkot",
        "Fatehgarh Sahib",
        "Fazilka",
        "Ferozepur",
        "Gurdaspur",
        "Hoshiarpur",
        "Jalandhar",
        "Kapurthala",
        "Ludhiana",
        "Malerkotla",
        "Mansa",
        "Moga",
        "Pathankot",
        "Patiala",
        "Rupnagar",
        "Sahibzada Ajit Singh Nagar",
        "Sangrur",
        "Shaheed Bhagat Singh Nagar",
        "Sri Muktsar Sahib",
        "Tarn Taran"
    ],

    "Rajasthan": [
        "Ajmer",
        "Alwar",
        "Anupgarh",
        "Balotra",
        "Banswara",
        "Baran",
        "Barmer",
        "Beawar",
        "Bharatpur",
        "Bhilwara",
        "Bikaner",
        "Bundi",
        "Chittorgarh",
        "Churu",
        "Dausa",
        "Deeg",
        "Dholpur",
        "Didwana-Kuchamana",
        "Dudu",
        "Dungarpur",
        "Ganganagar",
        "Gangapur City",
        "Hanumangarh",
        "Jaipur",
        "Jaisalmer",
        "Jalore",
        "Jhalawar",
        "Jhunjhunu",
        "Jodhpur",
        "Karauli",
        "Kekri",
        "Khairthal-Tijara",
        "Kota",
        "Kotputli-Behror",
        "Nagaur",
        "Neem Ka Thana",
        "Pali",
        "Phalodi",
        "Pratapgarh",
        "Rajsamand",
        "Salumbar",
        "Sawai Madhopur",
        "Shahpura",
        "Sikar",
        "Sirohi",
        "Tonk",
        "Udaipur"
    ],

    "Sikkim": [
        "Gangtok",
        "Gyalshing",
        "Mangan",
        "Namchi",
        "Pakyong",
        "Soreng"
    ],

    "Tamil Nadu": [
        "Ariyalur",
        "Chengalpattu",
        "Chennai",
        "Coimbatore",
        "Cuddalore",
        "Dharmapuri",
        "Dindigul",
        "Erode",
        "Kallakurichi",
        "Kancheepuram",
        "Karur",
        "Krishnagiri",
        "Madurai",
        "Mayiladuthurai",
        "Nagapattinam",
        "Namakkal",
        "Nilgiris",
        "Perambalur",
        "Pudukkottai",
        "Ramanathapuram",
        "Ranipet",
        "Salem",
        "Sivaganga",
        "Tenkasi",
        "Thanjavur",
        "Theni",
        "Thoothukudi",
        "Tiruchirappalli",
        "Tirunelveli",
        "Tirupathur",
        "Tiruppur",
        "Tiruvallur",
        "Tiruvannamalai",
        "Tiruvarur",
        "Vellore",
        "Viluppuram",
        "Virudhunagar"
    ],

    "Telangana": [
        "Adilabad",
        "Bhadradri Kothagudem",
        "Hanamkonda",
        "Hyderabad",
        "Jagtial",
        "Jangaon",
        "Jayashankar Bhupalpally",
        "Jogulamba Gadwal",
        "Kamareddy",
        "Karimnagar",
        "Khammam",
        "Komaram Bheem Asifabad",
        "Mahabubabad",
        "Mahbubnagar",
        "Mancherial",
        "Medak",
        "Medchal-Malkajgiri",
        "Mulugu",
        "Nagarkurnool",
        "Nalgonda",
        "Narayanpet",
        "Nirmal",
        "Nizamabad",
        "Peddapalli",
        "Rajanna Sircilla",
        "Rangareddy",
        "Sangareddy",
        "Siddipet",
        "Suryapet",
        "Vikarabad",
        "Wanaparthy",
        "Warangal",
        "Yadadri Bhuvanagiri"
    ],

    "Tripura": [
        "Dhalai",
        "Gomati",
        "Khowai",
        "North Tripura",
        "Sepahijala",
        "South Tripura",
        "Unakoti",
        "West Tripura"
    ],

    "Uttar Pradesh": [
        "Agra",
        "Aligarh",
        "Ambedkar Nagar",
        "Amethi",
        "Amroha",
        "Auraiya",
        "Ayodhya",
        "Azamgarh",
        "Baghpat",
        "Bahraich",
        "Ballia",
        "Balrampur",
        "Banda",
        "Barabanki",
        "Bareilly",
        "Basti",
        "Bhadohi",
        "Bijnor",
        "Budaun",
        "Bulandshahr",
        "Chandauli",
        "Chitrakoot",
        "Deoria",
        "Etah",
        "Etawah",
        "Farrukhabad",
        "Fatehpur",
        "Firozabad",
        "Gautam Buddha Nagar",
        "Ghaziabad",
        "Ghazipur",
        "Gonda",
        "Gorakhpur",
        "Hamirpur",
        "Hapur",
        "Hardoi",
        "Hathras",
        "Jalaun",
        "Jaunpur",
        "Jhansi",
        "Kannauj",
        "Kanpur Dehat",
        "Kanpur Nagar",
        "Kasganj",
        "Kaushambi",
        "Kheri",
        "Kushinagar",
        "Lalitpur",
        "Lucknow",
        "Maharajganj",
        "Mahoba",
        "Mainpuri",
        "Mathura",
        "Mau",
        "Meerut",
        "Mirzapur",
        "Moradabad",
        "Muzaffarnagar",
        "Pilibhit",
        "Pratapgarh",
        "Prayagraj",
        "Raebareli",
        "Rampur",
        "Saharanpur",
        "Sambhal",
        "Sant Kabir Nagar",
        "Shahjahanpur",
        "Shamli",
        "Shravasti",
        "Siddharthnagar",
        "Sitapur",
        "Sonbhadra",
        "Sultanpur",
        "Unnao",
        "Varanasi"
    ],

    "Uttarakhand": [
        "Almora",
        "Bageshwar",
        "Chamoli",
        "Champawat",
        "Dehradun",
        "Haridwar",
        "Nainital",
        "Pauri Garhwal",
        "Pithoragarh",
        "Rudraprayag",
        "Tehri Garhwal",
        "Udham Singh Nagar",
        "Uttarkashi"
    ],

    "West Bengal": [
        "Alipurduar",
        "Bankura",
        "Paschim Bardhaman",
        "Purba Bardhaman",
        "Birbhum",
        "Cooch Behar",
        "Dakshin Dinajpur",
        "Darjeeling",
        "Hooghly",
        "Howrah",
        "Jalpaiguri",
        "Jhargram",
        "Kalimpong",
        "Kolkata",
        "Maldah",
        "Murshidabad",
        "Nadia",
        "North 24 Parganas",
        "South 24 Parganas",
        "Paschim Medinipur",
        "Purba Medinipur",
        "Uttar Dinajpur"
    ],

    "Andaman and Nicobar Islands": [
        "Nicobar",
        "North and Middle Andaman",
        "South Andaman"
    ],

    "Chandigarh": [
        "Chandigarh"
    ],

    "Dadra and Nagar Haveli and Daman and Diu": [
        "Dadra and Nagar Haveli",
        "Daman",
        "Diu"
    ],

    "Delhi": [
        "Central Delhi",
        "East Delhi",
        "New Delhi",
        "North Delhi",
        "North East Delhi",
        "North West Delhi",
        "Shahdara",
        "South Delhi",
        "South East Delhi",
        "South West Delhi",
        "West Delhi"
    ],

    "Jammu and Kashmir": [
        "Anantnag",
        "Bandipora",
        "Baramulla",
        "Budgam",
        "Doda",
        "Ganderbal",
        "Jammu",
        "Kathua",
        "Kishtwar",
        "Kulgam",
        "Kupwara",
        "Poonch",
        "Pulwama",
        "Rajouri",
        "Ramban",
        "Reasi",
        "Samba",
        "Shopian",
        "Srinagar",
        "Udhampur"
    ],

    "Ladakh": [
        "Kargil",
        "Leh"
    ],

    "Lakshadweep": [
        "Lakshadweep"
    ],

    "Puducherry": [
        "Karaikal",
        "Mahe",
        "Puducherry",
        "Yanam"
    ]

};


/* ================= SHOW REGISTRATION FORM ================= */

function showRegistrationForm() {

    const loginContent =
        document.querySelector(".login-content");

    const registrationForm =
        document.querySelector(".registration-form");


    if (loginContent) {
        loginContent.style.display = "none";
    }


    if (registrationForm) {
        registrationForm.style.display = "block";
    }


    const registerRole =
        document.getElementById("registerRole");

    if (registerRole) {

        if (
            selectedRole === "Citizen" ||
            selectedRole === "Officer"
        ) {

            registerRole.value = selectedRole;

        }

    }


    initializeRegistration();

}


/* ================= REGISTRATION INITIALIZATION ================= */

function initializeRegistration() {

    const stateSelect =
        document.getElementById("state");

    const districtSelect =
        document.getElementById("district");

    const togglePassword =
        document.getElementById("togglePassword");

    const passwordInput =
        document.getElementById("password");

    const confirmPassword =
        document.getElementById("confirmPassword");

    const createAccountButton =
        document.getElementById("createAccountBtn");

    const backToLogin =
        document.getElementById("backToLogin");


    /* ================= STATE → DISTRICT ================= */

    if (stateSelect && districtSelect) {

        stateSelect.addEventListener(
            "change",
            function () {

                const selectedState =
                    stateSelect.value;

                districtSelect.innerHTML = `
                    <option value="">
                        Select District
                    </option>
                `;


                if (
                    selectedState &&
                    stateDistricts[selectedState]
                ) {

                    stateDistricts[selectedState].forEach(
                        function (district) {

                            const option =
                                document.createElement("option");

                            option.value = district;
                            option.textContent = district;

                            districtSelect.appendChild(option);

                        }
                    );

                }

            }
        );

    }


    /* ================= PASSWORD EYE ================= */

    if (
        togglePassword &&
        passwordInput
    ) {

        togglePassword.addEventListener(
            "click",
            function () {

                if (
                    passwordInput.type === "password"
                ) {

                    passwordInput.type = "text";

                    togglePassword.title =
                        "Hide password";

                    togglePassword.innerHTML = `
                        <svg
                            viewBox="0 0 24 24"
                            width="20"
                            height="20"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.8"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >

                            <path d="M3 3l18 18"></path>

                            <path
                                d="M2 12s3.5-7 10-7c1.6 0 3.1.4 4.4 1"
                            ></path>

                            <path
                                d="M21 12s-3.5 7-10 7c-1.6 0-3.1-.4-4.4-1"
                            ></path>

                        </svg>
                    `;

                }
                else {

                    passwordInput.type = "password";

                    togglePassword.title =
                        "Show password";

                    togglePassword.innerHTML = `
                        <svg
                            viewBox="0 0 24 24"
                            width="20"
                            height="20"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.8"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >

                            <path
                                d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"
                            ></path>

                            <circle
                                cx="12"
                                cy="12"
                                r="2.8"
                            ></circle>

                        </svg>
                    `;

                }

            }
        );


        togglePassword.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    togglePassword.click();

                }

            }
        );

    }


    /* ================= BACK TO LOGIN ================= */

    if (backToLogin) {

        backToLogin.addEventListener(
            "click",
            function () {

                location.reload();

            }
        );

    }


    /* ================= CREATE ACCOUNT ================= */

    if (createAccountButton) {

        createAccountButton.addEventListener(
            "click",
            validateRegistration
        );

    }


    /* ================= CONFIRM PASSWORD ENTER ================= */

    if (confirmPassword) {

        confirmPassword.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {

                    event.preventDefault();

                    if (createAccountButton) {
                        createAccountButton.click();
                    }

                }

            }
        );

    }

}


/* ================= REGISTRATION VALIDATION ================= */

async function validateRegistration() {

    const role =
        document.getElementById("registerRole").value.trim();

    const firstName =
        document.getElementById("firstName").value.trim();

    const lastName =
        document.getElementById("lastName").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const phone =
        document.getElementById("mobile").value.trim();

    const state =
        document.getElementById("state").value.trim();

    const district =
        document.getElementById("district").value.trim();

    const password =
        document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    const terms =
        document.getElementById("terms").checked;


    /* ================= ROLE ================= */

    if (role === "") {

        alert("Please select your role.");

        return;

    }


    /* ================= NAME ================= */

    if (
        firstName === "" ||
        lastName === ""
    ) {

        alert(
            "Please enter your first name and last name."
        );

        return;

    }


    if (
        !/^[\p{L} ]+$/u.test(firstName)
    ) {

        alert(
            "First name should contain only letters."
        );

        return;

    }


    if (
        !/^[\p{L} ]+$/u.test(lastName)
    ) {

        alert(
            "Last name should contain only letters."
        );

        return;

    }


    /* ================= EMAIL ================= */

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailPattern.test(email)) {

        alert(
            "Please enter a valid email address."
        );

        return;

    }


    /* ================= MOBILE ================= */

    if (
        !/^[6-9]\d{9}$/.test(phone)
    ) {

        alert(
            "Please enter a valid 10-digit Indian mobile number."
        );

        return;

    }


    /* ================= STATE ================= */

    if (state === "") {

        alert(
            "Please select your State / Union Territory."
        );

        return;

    }


    /* ================= DISTRICT ================= */

    if (district === "") {

        alert(
            "Please select your District."
        );

        return;

    }


    /* ================= PASSWORD ================= */

    if (password.length < 8) {

        alert(
            "Password must contain at least 8 characters."
        );

        return;

    }


    if (password !== confirmPassword) {

        alert(
            "Passwords do not match."
        );

        return;

    }


    /* ================= TERMS ================= */

    if (!terms) {

        alert(
            "Please agree to the Terms & Conditions."
        );

        return;

    }


    const createAccountButton =
        document.getElementById("createAccountBtn");


    createAccountButton.disabled = true;

    createAccountButton.textContent =
        "Creating Account...";


    try {

        const response = await fetch(
            "http://localhost:5000/api/register",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    role: role,

                    firstName: firstName,

                    lastName: lastName,

                    email: email.toLowerCase(),

                    mobile: phone,

                    state: state,

                    district: district,

                    password: password

                })

            }
        );


        const data =
            await response.json().catch(
                function () {

                    return {
                        success: false,
                        message:
                            "Invalid response from server."
                    };

                }
            );


        if (!response.ok) {

            alert(
                data.message ||
                "Registration failed."
            );

            return;

        }


        alert(
            data.message ||
            "Registration successful!"
        );


        location.reload();

    }
    catch (error) {

        console.error(
            "Registration error:",
            error
        );

        alert(
            "Unable to connect to the backend. " +
            "Please make sure the server is running on port 5000."
        );

    }
    finally {

        createAccountButton.disabled = false;

        createAccountButton.textContent =
            "Create Account";

    }

}


/* ================= LANGUAGE SELECTION ================= */

const languageSelect =
    document.getElementById("languageSelect");

if (languageSelect) {

    languageSelect.addEventListener(
        "change",
        function () {

            const selectedLanguage =
                languageSelect.value;

            if (
                selectedLanguage !== "English"
            ) {

                alert(
                    selectedLanguage +
                    " language support will be connected in the next phase."
                );

            }

        }
    );

}


/* ================= MOBILE NUMBER ================= */

document.addEventListener(
    "input",
    function (event) {

        if (
            event.target.id === "mobile"
        ) {

            event.target.value =
                event.target.value.replace(
                    /\D/g,
                    ""
                );

        }

    }
);


/* ================= LOGIN INPUT ================= */

document.addEventListener(
    "input",
    function (event) {

        if (
            event.target.id === "loginIdentifier"
        ) {

            event.target.value =
                event.target.value.trim();

        }

    }
);


/* ================= PASSWORD ENTER ================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter"
        ) {

            const activeElement =
                document.activeElement;


            if (
                activeElement &&
                (
                    activeElement.id ===
                    "loginIdentifier" ||
                    activeElement.id ===
                    "loginPassword"
                )
            ) {

                loginButton.click();

            }

        }

    }
);


/* ================= INITIALIZATION ================= */

console.log(
    "JanSeva Portal initialized successfully."
);

console.log(
    "Selected role:",
    selectedRole
);