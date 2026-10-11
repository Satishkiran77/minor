(function () {
    const translations = {
        "JanSeva Portal": { hi: "जनसेवा पोर्टल", ta: "ஜன்சேவா போர்டல்", te: "జనసేవా పోర్టల్" },
        "Your Voice. Our Priority.": { hi: "आपकी आवाज़, हमारी प्राथमिकता", ta: "உங்கள் குரல், எங்கள் முன்னுரிமை", te: "మీ గొంతు మా ప్రాధాన్యత" },
        "Easy Complaint Filing": { hi: "आसानी से शिकायत दर्ज करें", ta: "எளிதாக புகார் பதிவு", te: "సులభంగా ఫిర్యాదు నమోదు" },
        "Track in Real-time": { hi: "रीयल-टाइम में ट्रैक करें", ta: "நிகழ்நேரத்தில் கண்காணிக்கவும்", te: "రియల్ టైమ్‌లో ట్రాక్ చేయండి" },
        "Government Services": { hi: "सरकारी सेवाएँ", ta: "அரசு சேவைகள்", te: "ప్రభుత్వ సేవలు" },
        "Services Across India": { hi: "पूरे भारत में सेवाएँ", ta: "இந்தியா முழுவதும் சேவைகள்", te: "భారతదేశం అంతటా సేవలు" },
        "Citizen Login": { hi: "नागरिक लॉगिन", ta: "குடிமக்கள் உள்நுழைவு", te: "పౌరుల లాగిన్" },
        "Officer Login": { hi: "अधिकारी लॉगिन", ta: "அதிகாரி உள்நுழைவு", te: "అధికారి లాగిన్" },
        "Admin Login": { hi: "एडमिन लॉगिन", ta: "நிர்வாகி உள்நுழைவு", te: "అడ్మిన్ లాగిన్" },
        "Welcome Back!": { hi: "वापसी पर स्वागत है!", ta: "மீண்டும் வரவேற்கிறோம்!", te: "తిరిగి స్వాగతం!" },
        "Login to your account to continue": { hi: "जारी रखने के लिए लॉगिन करें", ta: "தொடர உங்கள் கணக்கில் உள்நுழையவும்", te: "కొనసాగించడానికి మీ ఖాతాలోకి లాగిన్ అవ్వండి" },
        "Email or Mobile Number": { hi: "ईमेल या मोबाइल नंबर", ta: "மின்னஞ்சல் அல்லது கைபேசி எண்", te: "ఇమెయిల్ లేదా మొబైల్ నంబర్" },
        "Enter email or mobile number": { hi: "ईमेल या मोबाइल नंबर दर्ज करें", ta: "மின்னஞ்சல் அல்லது கைபேசி எண்ணை உள்ளிடவும்", te: "ఇమెయిల్ లేదా మొబైల్ నంబర్ నమోదు చేయండి" },
        "Password": { hi: "पासवर्ड", ta: "கடவுச்சொல்", te: "పాస్‌వర్డ్" },
        "Enter password": { hi: "पासवर्ड दर्ज करें", ta: "கடவுச்சொல்லை உள்ளிடவும்", te: "పాస్‌వర్డ్ నమోదు చేయండి" },
        "Remember me": { hi: "मुझे याद रखें", ta: "என்னை நினைவில் கொள்ளுங்கள்", te: "నన్ను గుర్తుంచుకోండి" },
        "Forgot Password?": { hi: "पासवर्ड भूल गए?", ta: "கடவுச்சொல் மறந்துவிட்டதா?", te: "పాస్‌వర్డ్ మర్చిపోయారా?" },
        "Login": { hi: "लॉगिन", ta: "உள்நுழை", te: "లాగిన్" },
        "New to JanSeva Portal?": { hi: "जनसेवा पोर्टल पर नए हैं?", ta: "ஜன்சேவா போர்டலுக்கு புதியவரா?", te: "జనసేవా పోర్టల్‌కు కొత్తవారా?" },
        "Register Now": { hi: "अभी पंजीकरण करें", ta: "இப்போது பதிவு செய்யவும்", te: "ఇప్పుడే నమోదు చేసుకోండి" },
        "How to Register?": { hi: "पंजीकरण कैसे करें?", ta: "எப்படி பதிவு செய்வது?", te: "ఎలా నమోదు చేసుకోవాలి?" },
        "Create Your Account": { hi: "अपना खाता बनाएँ", ta: "உங்கள் கணக்கை உருவாக்கவும்", te: "మీ ఖాతాను సృష్టించండి" },
        "Register on JanSeva Portal to access citizen services": { hi: "नागरिक सेवाओं के लिए पंजीकरण करें", ta: "குடிமக்கள் சேவைகளைப் பெற பதிவு செய்யவும்", te: "పౌర సేవల కోసం నమోదు చేసుకోండి" },
        "Select Role": { hi: "भूमिका चुनें", ta: "பங்கைத் தேர்ந்தெடுக்கவும்", te: "పాత్రను ఎంచుకోండి" },
        "Confirm Password": { hi: "पासवर्ड की पुष्टि करें", ta: "கடவுச்சொல்லை உறுதிப்படுத்தவும்", te: "పాస్‌వర్డ్‌ను నిర్ధారించండి" },
        "Create Account": { hi: "खाता बनाएँ", ta: "கணக்கை உருவாக்கவும்", te: "ఖాతా సృష్టించండి" },
        "Back to Login": { hi: "लॉगिन पर वापस जाएँ", ta: "உள்நுழைவுக்குத் திரும்பு", te: "లాగిన్‌కు తిరిగి వెళ్ళండి" },
        "Secure & Reliable": { hi: "सुरक्षित और विश्वसनीय", ta: "பாதுகாப்பான மற்றும் நம்பகமான", te: "సురక్షితమైన మరియు నమ్మదగిన" },
        "24/7 Support": { hi: "24/7 सहायता", ta: "24/7 ஆதரவு", te: "24/7 సహాయం" },
        "For Every Citizen": { hi: "हर नागरिक के लिए", ta: "ஒவ்வொரு குடிமகனுக்கும்", te: "ప్రతి పౌరుడి కోసం" },
        "Logout": { hi: "लॉगआउट", ta: "வெளியேறு", te: "లాగ్ అవుట్" },
        "Dashboard": { hi: "डैशबोर्ड", ta: "முகப்புப் பலகை", te: "డ్యాష్‌బోర్డ్" },
        "New Complaint": { hi: "नई शिकायत", ta: "புதிய புகார்", te: "కొత్త ఫిర్యాదు" },
        "Track Complaint": { hi: "शिकायत ट्रैक करें", ta: "புகாரைக் கண்காணி", te: "ఫిర్యాదును ట్రాక్ చేయండి" },
        "My Cases": { hi: "मेरे मामले", ta: "எனது புகார்கள்", te: "నా కేసులు" },
        "Notifications": { hi: "सूचनाएँ", ta: "அறிவிப்புகள்", te: "నోటిఫికేషన్లు" },
        "Profile": { hi: "प्रोफ़ाइल", ta: "சுயவிவரம்", te: "ప్రొఫైல்" },
        "Settings": { hi: "सेटिंग्स", ta: "அமைப்புகள்", te: "సెట్టింగ్స్" },
        "WELCOME": { hi: "स्वागत है", ta: "வரவேற்கிறோம்", te: "స్వాగతం" },
        "Manage your complaints": { hi: "अपनी शिकायतें प्रबंधित करें", ta: "உங்கள் புகார்களை நிர்வகிக்கவும்", te: "మీ ఫిర్యాదులను నిర్వహించండి" },
        "Manage and track your submitted complaints.": { hi: "अपनी शिकायतों को प्रबंधित और ट्रैक करें।", ta: "சமர்ப்பித்த புகார்களை நிர்வகித்து கண்காணிக்கவும்.", te: "మీ ఫిర్యాదులను నిర్వహించండి, ట్రాక్ చేయండి." },
        "Total Complaints": { hi: "कुल शिकायतें", ta: "மொத்த புகார்கள்", te: "మొత్తం ఫిర్యాదులు" },
        "Pending": { hi: "लंबित", ta: "நிலுவையில்", te: "పెండింగ్" },
        "In Progress": { hi: "प्रगति में", ta: "செயல்பாட்டில்", te: "పురోగతిలో" },
        "Resolved": { hi: "हल हो गया", ta: "தீர்க்கப்பட்டது", te: "పరిష్కరించబడింది" },
        "Average Resolution Time": { hi: "औसत समाधान समय", ta: "சராசரி தீர்வு நேரம்", te: "సగటు పరిష్కార సమయం" },
        "Submit New Complaint": { hi: "नई शिकायत दर्ज करें", ta: "புதிய புகாரைச் சமர்ப்பிக்கவும்", te: "కొత్త ఫిర్యాదు సమర్పించండి" },
        "Category Breakdown": { hi: "श्रेणी के अनुसार", ta: "வகை விவரம்", te: "వర్గాల వివరాలు" },
        "Recent Activity": { hi: "हाल की गतिविधि", ta: "சமீபத்திய செயல்பாடு", te: "ఇటీవలి కార్యకలాపాలు" },
        "Recent Complaints": { hi: "हाल की शिकायतें", ta: "சமீபத்திய புகார்கள்", te: "ఇటీవలి ఫిర్యాదులు" },
        "Complaint Management": { hi: "शिकायत प्रबंधन", ta: "புகார் மேலாண்மை", te: "ఫిర్యాదు నిర్వహణ" },
        "Review citizen complaints and update their status.": { hi: "नागरिक शिकायतों की समीक्षा करें और स्थिति अपडेट करें।", ta: "குடிமக்கள் புகார்களை ஆய்வு செய்து நிலையைப் புதுப்பிக்கவும்.", te: "పౌరుల ఫిర్యాదులను సమీక్షించి స్థితిని నవీకరించండి." },
        "Refresh": { hi: "रीफ़्रेश", ta: "புதுப்பி", te: "రిఫ్రెష్" },
        "Complaint ID": { hi: "शिकायत आईडी", ta: "புகார் எண்", te: "ఫిర్యాదు ID" },
        "Citizen": { hi: "नागरिक", ta: "குடிமகன்", te: "పౌరుడు" },
        "Complaint": { hi: "शिकायत", ta: "புகார்", te: "ఫిర్యాదు" },
        "Location": { hi: "स्थान", ta: "இடம்", te: "ప్రదేశం" },
        "Priority": { hi: "प्राथमिकता", ta: "முன்னுரிமை", te: "ప్రాధాన్యత" },
        "Status": { hi: "स्थिति", ta: "நிலை", te: "స్థితి" },
        "Update": { hi: "अपडेट", ta: "புதுப்பி", te: "నవీకరణ" },
        "Save": { hi: "सहेजें", ta: "சேமி", te: "సేవ్" },
        "Submitted": { hi: "जमा किया गया", ta: "சமர்ப்பிக்கப்பட்டது", te: "సమర్పించబడింది" },
        "Received": { hi: "प्राप्त हुआ", ta: "பெறப்பட்டது", te: "స్వీకరించబడింది" },
        "Under Review": { hi: "समीक्षाधीन", ta: "மதிப்பாய்வில்", te: "పరిశీలనలో ఉంది" },
        "Assigned": { hi: "सौंपा गया", ta: "ஒதுக்கப்பட்டது", te: "కేటాయించబడింది" },
        "Resolved": { hi: "हल हो गया", ta: "தீர்க்கப்பட்டது", te: "పరిష్కరించబడింది" },
        "Need Help?": { hi: "मदद चाहिए?", ta: "உதவி வேண்டுமா?", te: "సహాయం కావాలా?" },
        "We're here to help you with your complaints.": { hi: "हम आपकी शिकायतों में मदद के लिए यहाँ हैं।", ta: "உங்கள் புகார்களுக்கு உதவ நாங்கள் இருக்கிறோம்.", te: "మీ ఫిర్యాదుల విషయంలో సహాయం చేయడానికి మేమున్నాం." },
        "Contact Support": { hi: "सहायता से संपर्क करें", ta: "ஆதரவைத் தொடர்புகொள்ளவும்", te: "సహాయాన్ని సంప్రదించండి" },
        "My Complaints": { hi: "मेरी शिकायतें", ta: "எனது புகார்கள்", te: "నా ఫిర్యాదులు" },
        "View all complaints submitted by you.": { hi: "आपके द्वारा दर्ज सभी शिकायतें देखें।", ta: "நீங்கள் சமர்ப்பித்த அனைத்து புகார்களையும் பார்க்கவும்.", te: "మీరు సమర్పించిన అన్ని ఫిర్యాదులను చూడండి." },
        "Track Complaint": { hi: "शिकायत ट्रैक करें", ta: "புகாரைக் கண்காணி", te: "ఫిర్యాదును ట్రాక్ చేయండి" },
        "Email Notifications": { hi: "ईमेल सूचनाएँ", ta: "மின்னஞ்சல் அறிவிப்புகள்", te: "ఇమెయిల్ నోటిఫికేషన్లు" },
        "Complaint Updates": { hi: "शिकायत अपडेट", ta: "புகார் புதுப்பிப்புகள்", te: "ఫిర్యాదు నవీకరణలు" }
    };

    const languageNames = {
        English: "en", "हिन्दी": "hi", "தமிழ்": "ta", "తెలుగు": "te",
        "ಕನ್ನಡ": "kn", "മലയാളം": "ml", "বাংলা": "bn", "मराठी": "mr",
        "ગુજરાતી": "gu", "ਪੰਜਾਬੀ": "pa", "ଓଡ଼ିଆ": "or", "অসমীয়া": "as"
    };
    const supported = new Set(["en", "hi", "ta", "te"]);
    const storageKey = "jansevaLanguage";

    function languageCode() {
        const select = document.getElementById("languageSelect");
        const chosen = select ? languageNames[select.value] : localStorage.getItem(storageKey);
        return supported.has(chosen) ? chosen : "en";
    }

    function translated(original, code) {
        if (code === "en") return original;
        return translations[original] && translations[original][code] || original;
    }

    function translateTextNode(node, code) {
        const current = node.nodeValue;
        const trimmed = current.trim();
        if (!trimmed) return;
        let original = trimmed;
        for (const [english, values] of Object.entries(translations)) {
            if (Object.values(values).includes(trimmed)) {
                original = english;
                break;
            }
        }
        const next = translated(original, code);
        if (next !== trimmed) {
            const leading = current.match(/^\s*/)[0];
            const trailing = current.match(/\s*$/)[0];
            node.nodeValue = leading + next + trailing;
        }
    }

    function applyLanguage(code) {
        if (!supported.has(code)) code = "en";
        localStorage.setItem(storageKey, code);
        document.documentElement.lang = code;
        document.querySelectorAll("input[placeholder], textarea[placeholder]").forEach(el => {
            const original = el.dataset.languageOriginalPlaceholder || el.placeholder;
            if (!el.dataset.languageOriginalPlaceholder) el.dataset.languageOriginalPlaceholder = original;
            el.placeholder = translated(original, code);
        });
        document.querySelectorAll("input[aria-label], button[aria-label]").forEach(el => {
            const original = el.dataset.languageOriginalAria || el.getAttribute("aria-label");
            if (!el.dataset.languageOriginalAria) el.dataset.languageOriginalAria = original;
            el.setAttribute("aria-label", translated(original, code));
        });
        document.querySelectorAll("option").forEach(option => {
            const original = option.dataset.languageOriginalText || option.textContent.trim();
            if (!option.dataset.languageOriginalText) option.dataset.languageOriginalText = original;
            if (!languageNames[original]) option.textContent = translated(original, code);
        });
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        nodes.forEach(node => translateTextNode(node, code));
        document.querySelectorAll("[title]").forEach(el => {
            const original = el.dataset.languageOriginalTitle || el.getAttribute("title");
            if (!el.dataset.languageOriginalTitle) el.dataset.languageOriginalTitle = original;
            el.setAttribute("title", translated(original, code));
        });
        const select = document.getElementById("languageSelect");
        if (select) {
            const value = Object.keys(languageNames).find(name => languageNames[name] === code);
            if (value) select.value = value;
        }
    }

    function setup() {
        const select = document.getElementById("languageSelect");
        const saved = localStorage.getItem(storageKey) || "en";
        if (select) {
            const initialName = Object.keys(languageNames).find(name => languageNames[name] === saved);
            if (initialName) select.value = initialName;
            select.addEventListener("change", () => {
                const chosen = languageNames[select.value] || "en";
                if (!supported.has(chosen)) {
                    select.value = "English";
                    applyLanguage("en");
                    alert("Full translation for this language is not available yet. English, Hindi, Tamil and Telugu are currently supported.");
                    return;
                }
                applyLanguage(chosen);
            });
        }
        applyLanguage(saved);
        const observer = new MutationObserver(() => {
            const code = languageCode();
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
            const nodes = [];
            while (walker.nextNode()) nodes.push(walker.currentNode);
            nodes.forEach(node => translateTextNode(node, code));
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", setup, { once: true });
    } else {
        setup();
    }
})();