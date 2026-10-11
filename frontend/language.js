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

    Object.assign(translations, {
        "JanSeva Portal": { kn:"ಜನಸೇವಾ ಪೋರ್ಟಲ್", ml:"ജനസേവാ പോർട്ടൽ", bn:"জনসেবা পোর্টাল", mr:"जनसेवा पोर्टल", gu:"જનસેવા પોર્ટલ", pa:"ਜਨਸੇਵਾ ਪੋਰਟਲ", or:"ଜନସେବା ପୋର୍ଟାଲ", as:"জনসেৱা পৰ্টেল" },
        "Your Voice. Our Priority.": { kn:"ನಿಮ್ಮ ಧ್ವನಿ, ನಮ್ಮ ಆದ್ಯತೆ", ml:"നിങ്ങളുടെ ശബ്ദം, ഞങ്ങളുടെ മുൻഗണന", bn:"আপনার কণ্ঠ, আমাদের অগ্রাধিকার", mr:"तुमचा आवाज, आमचे प्राधान्य", gu:"તમારો અવાજ, અમારી પ્રાથમિકતા", pa:"ਤੁਹਾਡੀ ਆਵਾਜ਼, ਸਾਡੀ ਤਰਜੀਹ", or:"ଆପଣଙ୍କ ସ୍ୱର, ଆମର ପ୍ରାଥମିକତା", as:"আপোনাৰ কণ্ঠ, আমাৰ অগ্ৰাধিকাৰ" },
        "Easy Complaint Filing": { kn:"ಸುಲಭವಾಗಿ ದೂರು ಸಲ್ಲಿಸಿ", ml:"എളുപ്പത്തിൽ പരാതി നൽകുക", bn:"সহজে অভিযোগ জমা দিন", mr:"सहज तक्रार नोंदवा", gu:"સરળતાથી ફરિયાદ નોંધાવો", pa:"ਆਸਾਨੀ ਨਾਲ ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ", or:"ସହଜରେ ଅଭିଯୋଗ ଦାଖଲ କରନ୍ତୁ", as:"সহজে অভিযোগ দাখিল কৰক" },
        "Track in Real-time": { kn:"ನೈಜ ಸಮಯದಲ್ಲಿ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ", ml:"തത്സമയം ട്രാക്ക് ചെയ്യുക", bn:"রিয়েল-টাইমে ট্র্যাক করুন", mr:"रिअल टाइममध्ये ट्रॅक करा", gu:"રીઅલ ટાઇમમાં ટ્રૅક કરો", pa:"ਰੀਅਲ-ਟਾਈਮ ਵਿੱਚ ਟ੍ਰੈਕ ਕਰੋ", or:"ରିଅଲ୍-ଟାଇମ୍‌ରେ ଟ୍ରାକ୍ କରନ୍ତୁ", as:"ৰিয়েল-টাইমত অনুসৰণ কৰক" },
        "Government Services": { kn:"ಸರ್ಕಾರಿ ಸೇವೆಗಳು", ml:"സർക്കാർ സേവനങ്ങൾ", bn:"সরকারি পরিষেবা", mr:"सरकारी सेवा", gu:"સરકારી સેવાઓ", pa:"ਸਰਕਾਰੀ ਸੇਵਾਵਾਂ", or:"ସରକାରୀ ସେବା", as:"চৰকাৰী সেৱাসমূহ" },
        "Services Across India": { kn:"ಭಾರತದಾದ್ಯಂತ ಸೇವೆಗಳು", ml:"ഇന്ത്യയിലുടനീളമുള്ള സേവനങ്ങൾ", bn:"সারা ভারতে পরিষেবা", mr:"संपूर्ण भारतात सेवा", gu:"સમગ્ર ભારતમાં સેવાઓ", pa:"ਪੂਰੇ ਭਾਰਤ ਵਿੱਚ ਸੇਵਾਵਾਂ", or:"ସମଗ୍ର ଭାରତରେ ସେବା", as:"সমগ্ৰ ভাৰতত সেৱা" },
        "Logout": { kn:"ಲಾಗ್ ಔಟ್", ml:"ലോഗ് ഔട്ട്", bn:"লগ আউট", mr:"लॉग आउट", gu:"લૉગ આઉટ", pa:"ਲੌਗ ਆਉਟ", or:"ଲଗ୍ ଆଉଟ୍", as:"লগ আউট" },
        "Dashboard": { kn:"ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", ml:"ഡാഷ്ബോർഡ്", bn:"ড্যাশবোর্ড", mr:"डॅशबोर्ड", gu:"ડેશબોર્ડ", pa:"ਡੈਸ਼ਬੋਰਡ", or:"ଡ୍ୟାସବୋର୍ଡ", as:"ডেশ্বব’ৰ্ড" },
        "New Complaint": { kn:"ಹೊಸ ದೂರು", ml:"പുതിയ പരാതി", bn:"নতুন অভিযোগ", mr:"नवीन तक्रार", gu:"નવી ફરિયાદ", pa:"ਨਵੀਂ ਸ਼ਿਕਾਇਤ", or:"ନୂତନ ଅଭିଯୋଗ", as:"নতুন অভিযোগ" },
        "Track Complaint": { kn:"ದೂರು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ", ml:"പരാതി ട്രാക്ക് ചെയ്യുക", bn:"অভিযোগ ট্র্যাক করুন", mr:"तक्रार ट्रॅक करा", gu:"ફરિયાદ ટ્રૅક કરો", pa:"ਸ਼ਿਕਾਇਤ ਟ੍ਰੈਕ ਕਰੋ", or:"ଅଭିଯୋଗ ଟ୍ରାକ୍ କରନ୍ତୁ", as:"অভিযোগ অনুসৰণ কৰক" },
        "My Cases": { kn:"ನನ್ನ ಪ್ರಕರಣಗಳು", ml:"എന്റെ കേസുകൾ", bn:"আমার অভিযোগ", mr:"माझी प्रकरणे", gu:"મારા કેસ", pa:"ਮੇਰੇ ਕੇਸ", or:"ମୋ ମାମଲା", as:"মোৰ গোচৰসমূহ" },
        "Notifications": { kn:"ಅಧಿಸೂಚನೆಗಳು", ml:"അറിയിപ്പുകൾ", bn:"বিজ্ঞপ্তি", mr:"सूचना", gu:"સૂચનાઓ", pa:"ਸੂਚਨਾਵਾਂ", or:"ବିଜ୍ଞପ୍ତି", as:"জাননীসমূহ" },
        "Profile": { kn:"ಪ್ರೊಫೈಲ್", ml:"പ്രൊഫൈൽ", bn:"প্রোফাইল", mr:"प्रोफाइल", gu:"પ્રોફાઇલ", pa:"ਪ੍ਰੋਫਾਈਲ", or:"ପ୍ରୋଫାଇଲ୍", as:"প্ৰ’ফাইল" },
        "Settings": { kn:"ಸೆಟ್ಟಿಂಗ್‌ಗಳು", ml:"ക്രമീകരണങ്ങൾ", bn:"সেটিংস", mr:"सेटिंग्ज", gu:"સેટિંગ્સ", pa:"ਸੈਟਿੰਗਾਂ", or:"ସେଟିଂସ୍", as:"ছেটিংছ" },
        "WELCOME": { kn:"ಸ್ವಾಗತ", ml:"സ്വാഗതം", bn:"স্বাগতম", mr:"स्वागत", gu:"સ્વાગત", pa:"ਜੀ ਆਇਆਂ ਨੂੰ", or:"ସ୍ୱାଗତ", as:"স্বাগতম" },
        "Total Complaints": { kn:"ಒಟ್ಟು ದೂರುಗಳು", ml:"ആകെ പരാതികൾ", bn:"মোট অভিযোগ", mr:"एकूण तक्रारी", gu:"કુલ ફરિયાદો", pa:"ਕੁੱਲ ਸ਼ਿਕਾਇਤਾਂ", or:"ମୋଟ ଅଭିଯୋଗ", as:"মুঠ অভিযোগ" },
        "Pending": { kn:"ಬಾಕಿ", ml:"തീർപ്പാക്കാത്തത്", bn:"বিচারাধীন", mr:"प्रलंबित", gu:"બાકી", pa:"ਬਕਾਇਆ", or:"ବିଚାରାଧୀନ", as:"বাকী" },
        "In Progress": { kn:"ಪ್ರಗತಿಯಲ್ಲಿದೆ", ml:"പുരോഗതിയിൽ", bn:"চলমান", mr:"प्रगतीत", gu:"પ્રગતિમાં", pa:"ਪ੍ਰਗਤੀ ਵਿੱਚ", or:"ପ୍ରଗତିରେ", as:"চলি আছে" },
        "Resolved": { kn:"ಪರಿಹರಿಸಲಾಗಿದೆ", ml:"പരിഹരിച്ചു", bn:"সমাধান হয়েছে", mr:"निकाली", gu:"ઉકેલાયેલ", pa:"ਹੱਲ ਕੀਤਾ", or:"ସମାଧାନ ହୋଇଛି", as:"সমাধান হৈছে" },
        "Average Resolution Time": { kn:"ಸರಾಸರಿ ಪರಿಹಾರ ಸಮಯ", ml:"ശരാശരി പരിഹാര സമയം", bn:"গড় সমাধানের সময়", mr:"सरासरी निराकरण वेळ", gu:"સરેરાશ ઉકેલ સમય", pa:"ਔਸਤ ਹੱਲ ਸਮਾਂ", or:"ହାରାହାରି ସମାଧାନ ସମୟ", as:"গড় সমাধানৰ সময়" },
        "Submit New Complaint": { kn:"ಹೊಸ ದೂರು ಸಲ್ಲಿಸಿ", ml:"പുതിയ പരാതി സമർപ്പിക്കുക", bn:"নতুন অভিযোগ জমা দিন", mr:"नवीन तक्रार सादर करा", gu:"નવી ફરિયાદ નોંધાવો", pa:"ਨਵੀਂ ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ", or:"ନୂତନ ଅଭିଯୋଗ ଦାଖଲ କରନ୍ତୁ", as:"নতুন অভিযোগ দাখিল কৰক" },
        "Category Breakdown": { kn:"ವರ್ಗಗಳ ವಿವರ", ml:"വിഭാഗങ്ങളുടെ വിശദാംശങ്ങൾ", bn:"বিভাগের বিবরণ", mr:"श्रेणीनुसार तपशील", gu:"શ્રેણી મુજબ વિગતો", pa:"ਸ਼੍ਰੇਣੀ ਅਨੁਸਾਰ ਵੇਰਵਾ", or:"ବର୍ଗ ବିବରଣୀ", as:"শ্ৰেণী অনুসৰি বিৱৰণ" },
        "Recent Activity": { kn:"ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ", ml:"സമീപകാല പ്രവർത്തനം", bn:"সাম্প্রতিক কার্যকলাপ", mr:"अलीकडील क्रियाकलाप", gu:"તાજેતરની પ્રવૃત્તિ", pa:"ਹਾਲੀਆ ਸਰਗਰਮੀ", or:"ସାମ୍ପ୍ରତିକ କାର୍ଯ୍ୟକଳାପ", as:"শেহতীয়া কাৰ্যকলাপ" },
        "Recent Complaints": { kn:"ಇತ್ತೀಚಿನ ದೂರುಗಳು", ml:"സമീപകാല പരാതികൾ", bn:"সাম্প্রতিক অভিযোগ", mr:"अलीकडील तक्रारी", gu:"તાજેતરની ફરિયાદો", pa:"ਹਾਲੀਆ ਸ਼ਿਕਾਇਤਾਂ", or:"ସାମ୍ପ୍ରତିକ ଅଭିଯୋଗ", as:"শেহতীয়া অভিযোগ" },
        "Complaint Management": { kn:"ದೂರು ನಿರ್ವಹಣೆ", ml:"പരാതി മാനേജ്മെന്റ്", bn:"অভিযোগ ব্যবস্থাপনা", mr:"तक्रार व्यवस्थापन", gu:"ફરિયાદ વ્યવસ્થાપન", pa:"ਸ਼ਿਕਾਇਤ ਪ੍ਰਬੰਧਨ", or:"ଅଭିଯୋଗ ପରିଚାଳନା", as:"অভিযোগ ব্যৱস্থাপনা" },
        "Review citizen complaints and update their status.": { kn:"ನಾಗರಿಕರ ದೂರುಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ಸ್ಥಿತಿಯನ್ನು ನವೀಕರಿಸಿ.", ml:"പൗരന്മാരുടെ പരാതികൾ പരിശോധിച്ച് നില പുതുക്കുക.", bn:"নাগরিকদের অভিযোগ পর্যালোচনা করে অবস্থা আপডেট করুন।", mr:"नागरिकांच्या तक्रारी तपासून स्थिती अद्यतनित करा.", gu:"નાગરિકોની ફરિયાદોની સમીક્ષા કરીને સ્થિતિ અપડેટ કરો.", pa:"ਨਾਗਰਿਕਾਂ ਦੀਆਂ ਸ਼ਿਕਾਇਤਾਂ ਦੀ ਸਮੀਖਿਆ ਕਰਕੇ ਸਥਿਤੀ ਅੱਪਡੇਟ ਕਰੋ।", or:"ନାଗରିକଙ୍କ ଅଭିଯୋଗ ସମୀକ୍ଷା କରି ସ୍ଥିତି ଅପଡେଟ୍ କରନ୍ତୁ।", as:"নাগৰিকৰ অভিযোগ পৰ্যালোচনা কৰি অৱস্থা আপডেট কৰক।" },
        "Refresh": { kn:"ರಿಫ್ರೆಶ್", ml:"പുതുക്കുക", bn:"রিফ্রেশ", mr:"रीफ्रेश", gu:"રિફ્રેશ", pa:"ਰਿਫ੍ਰੈਸ਼", or:"ରିଫ୍ରେଶ୍", as:"ৰিফ্ৰেছ" },
        "Complaint ID": { kn:"ದೂರು ಐಡಿ", ml:"പരാതി ഐഡി", bn:"অভিযোগ আইডি", mr:"तक्रार आयडी", gu:"ફરિયાદ ID", pa:"ਸ਼ਿਕਾਇਤ ID", or:"ଅଭିଯୋଗ ID", as:"অভিযোগ ID" },
        "Citizen": { kn:"ನಾಗರಿಕ", ml:"പൗരൻ", bn:"নাগরিক", mr:"नागरिक", gu:"નાગરિક", pa:"ਨਾਗਰਿਕ", or:"ନାଗରିକ", as:"নাগৰিক" },
        "Complaint": { kn:"ದೂರು", ml:"പരാതി", bn:"অভিযোগ", mr:"तक्रार", gu:"ફરિયાદ", pa:"ਸ਼ਿਕਾਇਤ", or:"ଅଭିଯୋଗ", as:"অভিযোগ" },
        "Location": { kn:"ಸ್ಥಳ", ml:"സ്ഥലം", bn:"অবস্থান", mr:"स्थान", gu:"સ્થાન", pa:"ਟਿਕਾਣਾ", or:"ସ୍ଥାନ", as:"স্থান" },
        "Priority": { kn:"ಆದ್ಯತೆ", ml:"മുൻഗണന", bn:"অগ্রাধিকার", mr:"प्राधान्य", gu:"પ્રાથમિકતા", pa:"ਤਰਜੀਹ", or:"ପ୍ରାଥମିକତା", as:"অগ্ৰাধিকাৰ" },
        "Status": { kn:"ಸ್ಥಿತಿ", ml:"നില", bn:"অবস্থা", mr:"स्थिती", gu:"સ્થિતિ", pa:"ਸਥਿਤੀ", or:"ସ୍ଥିତି", as:"অৱস্থা" },
        "Update": { kn:"ನವೀಕರಿಸಿ", ml:"പുതുക്കുക", bn:"আপডেট", mr:"अद्यतन", gu:"અપડેટ", pa:"ਅੱਪਡੇਟ", or:"ଅପଡେଟ୍", as:"আপডেট" },
        "Save": { kn:"ಉಳಿಸಿ", ml:"സേവ്", bn:"সংরক্ষণ করুন", mr:"जतन करा", gu:"સાચવો", pa:"ਸੇਵ ਕਰੋ", or:"ସେଭ୍ କରନ୍ତୁ", as:"সংৰক্ষণ কৰক" },
        "Submitted": { kn:"ಸಲ್ಲಿಸಲಾಗಿದೆ", ml:"സമർപ്പിച്ചു", bn:"জমা দেওয়া হয়েছে", mr:"सादर केले", gu:"સબમિટ કર્યું", pa:"ਜਮ੍ਹਾਂ ਕੀਤਾ", or:"ଦାଖଲ ହୋଇଛି", as:"দাখিল কৰা হৈছে" },
        "Received": { kn:"ಸ್ವೀಕರಿಸಲಾಗಿದೆ", ml:"ലഭിച്ചു", bn:"গৃহীত", mr:"प्राप्त", gu:"પ્રાપ્ત", pa:"ਪ੍ਰਾਪਤ", or:"ଗ୍ରହଣ କରାଗଲା", as:"গ্ৰহণ কৰা হৈছে" },
        "Under Review": { kn:"ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ", ml:"പരിശോധനയിലാണ്", bn:"পর্যালোচনাধীন", mr:"पुनरावलोकन सुरू", gu:"સમીક્ષા હેઠળ", pa:"ਸਮੀਖਿਆ ਅਧੀਨ", or:"ସମୀକ୍ଷାଧୀନ", as:"পৰ্যালোচনাধীন" },
        "Assigned": { kn:"ನಿಯೋಜಿಸಲಾಗಿದೆ", ml:"നിയോഗിച്ചു", bn:"বরাদ্দ করা হয়েছে", mr:"नेमून दिले", gu:"સોંપેલ", pa:"ਸੌਂਪਿਆ ਗਿਆ", or:"ନିଯୁକ୍ତ", as:"নিযুক্ত কৰা হৈছে" },
        "Need Help?": { kn:"ಸಹಾಯ ಬೇಕೇ?", ml:"സഹായം വേണോ?", bn:"সাহায্য দরকার?", mr:"मदत हवी आहे?", gu:"મદદ જોઈએ છે?", pa:"ਮਦਦ ਚਾਹੀਦੀ ਹੈ?", or:"ସାହାଯ୍ୟ ଦରକାର କି?", as:"সহায় লাগে নেকি?" },
        "We're here to help you with your complaints.": { kn:"ನಿಮ್ಮ ದೂರುಗಳಿಗೆ ಸಹಾಯ ಮಾಡಲು ನಾವು ಇದ್ದೇವೆ.", ml:"നിങ്ങളുടെ പരാതികളിൽ സഹായിക്കാൻ ഞങ്ങളുണ്ട്.", bn:"আপনার অভিযোগে সাহায্য করতে আমরা আছি।", mr:"तुमच्या तक्रारींसाठी आम्ही मदतीला आहोत.", gu:"તમારી ફરિયાદોમાં મદદ માટે અમે અહીં છીએ.", pa:"ਤੁਹਾਡੀਆਂ ਸ਼ਿਕਾਇਤਾਂ ਵਿੱਚ ਮਦਦ ਲਈ ਅਸੀਂ ਇੱਥੇ ਹਾਂ।", or:"ଆପଣଙ୍କ ଅଭିଯୋଗରେ ସାହାଯ୍ୟ ପାଇଁ ଆମେ ଅଛୁ।", as:"আপোনাৰ অভিযোগত সহায় কৰিবলৈ আমি আছোঁ।" },
        "Contact Support": { kn:"ಸಹಾಯ ಸಂಪರ್ಕಿಸಿ", ml:"സഹായ വിഭാഗവുമായി ബന്ധപ്പെടുക", bn:"সহায়তায় যোগাযোগ করুন", mr:"सहाय्याशी संपर्क साधा", gu:"સહાયનો સંપર્ક કરો", pa:"ਸਹਾਇਤਾ ਨਾਲ ਸੰਪਰਕ ਕਰੋ", or:"ସହାୟତା ସହ ଯୋଗାଯୋଗ କରନ୍ତୁ", as:"সহায়তাৰ সৈতে যোগাযোগ কৰক" },
        "Email Notifications": { kn:"ಇಮೇಲ್ ಅಧಿಸೂಚನೆಗಳು", ml:"ഇമെയിൽ അറിയിപ്പുകൾ", bn:"ইমেল বিজ্ঞপ্তি", mr:"ईमेल सूचना", gu:"ઈમેલ સૂચનાઓ", pa:"ਈਮੇਲ ਸੂਚਨਾਵਾਂ", or:"ଇମେଲ୍ ବିଜ୍ଞପ୍ତି", as:"ইমেইল জাননী" },
        "Complaint Updates": { kn:"ದೂರು ನವೀಕರಣಗಳು", ml:"പരാതി അപ്ഡേറ്റുകൾ", bn:"অভিযোগ আপডেট", mr:"तक्रार अद्यतने", gu:"ફરિયાદ અપડેટ્સ", pa:"ਸ਼ਿਕਾਇਤ ਅੱਪਡੇਟ", or:"ଅଭିଯୋଗ ଅପଡେଟ୍", as:"অভিযোগ আপডেট" }
    });

    const languageNames = {
        English: "en", "हिन्दी": "hi", "தமிழ்": "ta", "తెలుగు": "te",
        "ಕನ್ನಡ": "kn", "മലയാളം": "ml", "বাংলা": "bn", "मराठी": "mr",
        "ગુજરાતી": "gu", "ਪੰਜਾਬੀ": "pa", "ଓଡ଼ିଆ": "or", "অসমীয়া": "as"
    };
    const supported = new Set(["en", "hi", "ta", "te", "kn", "ml", "bn", "mr", "gu", "pa", "or", "as"]);
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
                if (!supported.has(chosen)) return;
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