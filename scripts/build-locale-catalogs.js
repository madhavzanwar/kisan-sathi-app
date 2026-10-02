const fs = require('fs');
const path = require('path');

const localesDir = path.resolve(__dirname, '../frontend/src/i18n/locales');

// ==========================================
// 1. DASHBOARD
// ==========================================
const dashboardEn = {
  header: {
    eyebrow: "Precision Agronomy Suite",
    title: "Smart Farming Dashboard",
    titleAccent: "Dashboard",
    subtitle: "Select a specialized agronomic tool below to diagnose crop diseases, calculate exact fertilizer requirements, or access real-time microclimate intelligence."
  },
  telemetry: {
    title: "System Telemetry",
    status: "PyTorch & Scikit-Learn Active"
  },
  toolsHeading: "Agronomy Tools",
  toolsSubtitle: "Click any card to launch tool",
  home: "Home",
  exitDashboard: "Exit Dashboard",
  returnToLanding: "Return to Landing Page",
  quickTools: "Quick Tools",
  language: "Language / भाषा",
  specs: {
    title: "AI Model Specifications",
    item1: "• PyTorch ResNet18 (38 disease classes)",
    item2: "• Scikit-Learn Multiclass Fertilizer Regressor",
    item3: "• Copernicus Sentinel-2 Level-2A BOA"
  },
  tabs: {
    heal: {
      name: "Heal Your Crop",
      subtitle: "Leaf Pathology & Diagnosis",
      badge: "PyTorch AI"
    },
    fertilizer: {
      name: "Fertilizer Calculator",
      subtitle: "NPK Soil & Dosage Balancing",
      badge: "Exact kg"
    },
    yieldPest: {
      name: "Yield & Pest Forecast",
      subtitle: "Sentinel-2 Satellite Telemetry",
      badge: "NDVI Vision"
    },
    guide: {
      name: "Cultivation Guides",
      subtitle: "Lifecycle Agronomic Protocols",
      badge: "6 Crops"
    },
    weather: {
      name: "Live Weather",
      subtitle: "Hyper-local Microclimate",
      badge: "GPS Telemetry"
    }
  }
};

const dashboardHi = {
  header: {
    eyebrow: "सटीक कृषि सुइट",
    title: "स्मार्ट फार्मिंग डैशबोर्ड",
    titleAccent: "डैशबोर्ड",
    subtitle: "फसलों के रोगों का निदान करने, सटीक उर्वरक मात्रा की गणना करने या लाइव मौसम की जानकारी प्राप्त करने के लिए नीचे दिए गए कृषि उपकरण चुनें।"
  },
  telemetry: {
    title: "सिस्टम टेलीमेट्री",
    status: "पाइटॉर्च व साइकिट-लर्न सक्रिय"
  },
  toolsHeading: "कृषि उपकरण",
  toolsSubtitle: "उपकरण शुरू करने के लिए कार्ड पर क्लिक करें",
  home: "होम",
  exitDashboard: "डैशबोर्ड से बाहर जाएं",
  returnToLanding: "मुख्य पृष्ठ पर वापस जाएं",
  quickTools: "त्वरित उपकरण",
  language: "भाषा / Language",
  specs: {
    title: "एआई मॉडल विवरण",
    item1: "• पाइटॉर्च ResNet18 (38 रोग श्रेणियां)",
    item2: "• साइकिट-लर्न मल्टीक्लास उर्वरक मॉडल",
    item3: "• कोपरनिकस सेंटिनल-2 उपग्रह टेलीमेट्री"
  },
  tabs: {
    heal: {
      name: "फसल रोग निदान",
      subtitle: "पत्ती रोग पहचान व उपचार",
      badge: "पाइटॉर्च एआई"
    },
    fertilizer: {
      name: "उर्वरक कैलकुलेटर",
      subtitle: "एनपीके खाद संतुलन व मात्रा",
      badge: "सटीक किलो"
    },
    yieldPest: {
      name: "उपज व कीट पूर्वानुमान",
      subtitle: "सेंटिनल-2 उपग्रह टेलीमेट्री",
      badge: "एनडीवीआई विज़न"
    },
    guide: {
      name: "फसल जीवनचक्र गाइड",
      subtitle: "बुवाई से कटाई तक मार्गदर्शन",
      badge: "6 फसलें"
    },
    weather: {
      name: "लाइव मौसम",
      subtitle: "खेत स्तर सूक्ष्म जलवायु",
      badge: "जीपीएस टेलीमेट्री"
    }
  }
};

const dashboardMr = {
  header: {
    eyebrow: "अचूक कृषी सुइट",
    title: "स्मार्ट शेती डॅशबोर्ड",
    titleAccent: "डॅशबोर्ड",
    subtitle: "पिकांवरील रोगांचे निदान करण्यासाठी, खतांची अचूक मात्रा काढण्यासाठी किंवा थेट हवामानाची माहिती पाहण्यासाठी खालील कृषी साधने वापरा."
  },
  telemetry: {
    title: "प्रणाली स्थिती",
    status: "पायटॉर्च आणि सायकिट-लर्न सक्रिय"
  },
  toolsHeading: "कृषी साधने",
  toolsSubtitle: "साधन उघडण्यासाठी कार्डवर क्लिक करा",
  home: "मुख्यपृष्ठ",
  exitDashboard: "डॅशबोर्डमधून बाहेर पडा",
  returnToLanding: "मुख्य पानावर परत जा",
  quickTools: "जलद साधने",
  language: "भाषा / Language",
  specs: {
    title: "एआय मॉडेल माहिती",
    item1: "• पायटॉर्च ResNet18 (38 पीक रोग प्रकार)",
    item2: "• सायकिट-लर्न खत मात्रा मॉडेल",
    item3: "• कोपर्निकस सेंटिनेल-२ उपग्रह माहिती"
  },
  tabs: {
    heal: {
      name: "पीक रोग निदान",
      subtitle: "पानावरील रोग व उपाय",
      badge: "पायटॉर्च एआय"
    },
    fertilizer: {
      name: "खत गणकयंत्र",
      subtitle: "एनपीके माती व खत संतुलन",
      badge: "अचूक किलो"
    },
    yieldPest: {
      name: "उत्पादन व कीड अंदाज",
      subtitle: "सेंटिनेल-२ उपग्रह माहिती",
      badge: "एनडीव्हीआय तंत्र"
    },
    guide: {
      name: "पीक लागवड मार्गदर्शक",
      subtitle: "मशागतीपासून काढणीपर्यंत माहिती",
      badge: "६ पिके"
    },
    weather: {
      name: "थेट हवामान",
      subtitle: "स्थानिक शेत पातळीवरील हवामान",
      badge: "जीपीएस माहिती"
    }
  }
};

// ==========================================
// 2. HEAL (Leaf Disease Diagnosis)
// ==========================================
const healEn = {
  eyebrow: "AI Leaf Pathology",
  title: "Heal Your Crop",
  titleAccent: "Crop",
  description: "Upload a clear, well-lit photo of the affected crop leaf to detect disease pathogens and generate scientific treatment plans.",
  steps: {
    step1: "Upload Leaf Photo",
    step2: "Neural Analysis",
    step3: "Treatment Plan"
  },
  dropzone: {
    title: "Click or drag a leaf photograph here",
    subtitle: "Supports JPG, PNG, WEBP • Max file size 15MB",
    browse: "Browse Files",
    ariaLabel: "Upload leaf image"
  },
  scanning: {
    message: "PyTorch ResNet18 is analyzing leaf pathology...",
    subtext: "Evaluating 38 disease categories and nutritional deficiencies"
  },
  results: {
    severityLabel: "Severity: {{severity}}",
    severityNone: "None",
    severityModerate: "Moderate",
    severityHigh: "High",
    diagnosticMatch: "Diagnostic Match",
    chemicalTitle: "Chemical Treatment",
    organicTitle: "Organic / Bio Alternative",
    scanAnother: "Scan Another Leaf"
  },
  errors: {
    invalidType: "Invalid file type. Please upload a valid crop leaf image (JPG, PNG, or WEBP).",
    exceedsSize: "File size exceeds the 15 MB limit. Please upload a standard photo.",
    apiError: "Failed to connect to backend diagnosis service. If the server is sleeping on Render free tier, please wait 30 seconds and retry."
  },
  diseases: {
    tomatoEarlyBlight: "Tomato Early Blight",
    cottonAphids: "Cotton Aphids",
    wheatRust: "Wheat Rust",
    healthyCrop: "Healthy Crop",
    defaultDisease: "Crop Disease"
  },
  treatments: {
    chemicalDefault: "Consult local agricultural extension for optimal chemical dosage.",
    organicDefault: "Ensure proper spacing and use neem-based bio-pesticides if necessary.",
    earlyBlightChemical: "Spray Mancozeb 75% WP @ 2g/L or Chlorothalonil @ 2g/L of water at 10-day intervals.",
    earlyBlightOrganic: "Apply 5% neem seed kernel extract (NSKE) or Trichoderma viride spray @ 5g/L.",
    cottonAphidsChemical: "Spray Imidacloprid 17.8% SL @ 0.3ml/L or Acetamiprid 20% SP @ 0.2g/L.",
    cottonAphidsOrganic: "Spray 5% neem oil emulsion with soap solution or release Chrysoperla predators.",
    wheatRustChemical: "Spray Propiconazole 25% EC (Tilt) @ 1ml/L of water immediately upon detection.",
    wheatRustOrganic: "Dust sulfur powder @ 25 kg/ha or spray cow urine extract mixed with neem leaves.",
    healthyCropChemical: "No chemical fungicide or bactericide required. Continue balanced nutrition.",
    healthyCropOrganic: "Maintain routine soil organic matter application and preventive biological teas."
  }
};

const healHi = {
  eyebrow: "एआई पत्ती रोग विज्ञान",
  title: "फसल रोग निदान",
  titleAccent: "निदान",
  description: "रोग के कीटाणुओं और फंगस की पहचान कर सटीक उपचार योजना पाने के लिए प्रभावित पत्ती की स्पष्ट फोटो अपलोड करें।",
  steps: {
    step1: "पत्ती की फोटो अपलोड करें",
    step2: "न्यूरल विश्लेषण",
    step3: "उपचार योजना"
  },
  dropzone: {
    title: "यहाँ पत्ती की फोटो क्लिक करें या खींचकर लाएँ",
    subtitle: "JPG, PNG, WEBP समर्थित • अधिकतम फ़ाइल आकार 15MB",
    browse: "फ़ाइल चुनें",
    ariaLabel: "पत्ती की छवि अपलोड करें"
  },
  scanning: {
    message: "पाइटॉर्च ResNet18 पत्ती के रोग का विश्लेषण कर रहा है...",
    subtext: "38 रोग श्रेणियों और पोषण की कमी का मूल्यांकन किया जा रहा है"
  },
  results: {
    severityLabel: "गंभीरता: {{severity}}",
    severityNone: "सामान्य / कोई नहीं",
    severityModerate: "मध्यम",
    severityHigh: "गंभीर",
    diagnosticMatch: "रोग मिलान संभावना",
    chemicalTitle: "रासायनिक उपचार",
    organicTitle: "जैविक / देशी विकल्प",
    scanAnother: "अन्य पत्ती की जांच करें"
  },
  errors: {
    invalidType: "अमान्य फ़ाइल प्रकार। कृपया वैध पत्ती की फोटो (JPG, PNG या WEBP) अपलोड करें।",
    exceedsSize: "फ़ाइल का आकार 15 MB सीमा से अधिक है। कृपया सामान्य फोटो अपलोड करें।",
    apiError: "निदान सेवा से कनेक्ट करने में विफल। यदि रेंडर सर्वर स्लीप मोड में है, तो कृपया 30 सेकंड प्रतीक्षा कर पुनः प्रयास करें।"
  },
  diseases: {
    tomatoEarlyBlight: "टमाटर का अगेती झुलसा रोग (अर्ली ब्लाइट)",
    cottonAphids: "कपास का माहू/चेपा कीट",
    wheatRust: "गेहूं का रतुआ/तांबेरा रोग",
    healthyCrop: "स्वस्थ फसल (कोई रोग नहीं)",
    defaultDisease: "फसल रोग"
  },
  treatments: {
    chemicalDefault: "सटीक रासायनिक दवा और मात्रा के लिए नजदीकी कृषि विज्ञान केंद्र से संपर्क करें।",
    organicDefault: "उचित दूरी बनाए रखें और आवश्यकता पड़ने पर नीम आधारित जैविक कीटनाशक का छिड़काव करें।",
    earlyBlightChemical: "मैनकोज़ेब 75% WP @ 2 ग्राम प्रति लीटर पानी में मिलाकर 10 दिन के अंतराल पर छिड़कें।",
    earlyBlightOrganic: "5% नीम बीज अर्क (NSKE) या ट्राइकोडर्मा विरिडी @ 5 ग्राम प्रति लीटर पानी का छिड़काव करें।",
    cottonAphidsChemical: "इमिडाक्लोप्रिड 17.8% SL @ 0.3 मिली प्रति लीटर पानी में मिलाकर छिड़काव करें।",
    cottonAphidsOrganic: "5% नीम तेल को साबुन के घोल के साथ मिलाकर छिड़कें अथवा क्राइसोपरला मित्र कीट छोड़ें।",
    wheatRustChemical: "रोग दिखते ही प्रोपिकोनाज़ोल 25% EC @ 1 मिली प्रति लीटर पानी में घोलकर छिड़कें।",
    wheatRustOrganic: "सल्फर पाउडर @ 25 किग्रा प्रति हेक्टेयर बुरकें अथवा गोमूत्र व नीम की पत्ती का अर्क छिड़कें।",
    healthyCropChemical: "किसी फफूंदनाशक या कीटनाशक की आवश्यकता नहीं है। संतुलित पोषण जारी रखें।",
    healthyCropOrganic: "नियमित जैविक खाद व जीवामृत का उपयोग जारी रखें।"
  }
};

const healMr = {
  eyebrow: "एआय पान रोगशास्त्र",
  title: "पीक रोग निदान",
  titleAccent: "निदान",
  description: "रोगाचे अचूक निदान आणि शास्त्रीय उपाययोजना मिळवण्यासाठी बाधित पिकाच्या पानाचा स्पष्ट फोटो अपलोड करा.",
  steps: {
    step1: "पानाचा फोटो अपलोड करा",
    step2: "न्यूरल पृथक्करण",
    step3: "उपचार योजना"
  },
  dropzone: {
    title: "येथे पानाचा फोटो निवडा किंवा ओढून आणा",
    subtitle: "JPG, PNG, WEBP समर्थित • कमाल फाईल आकार 15MB",
    browse: "फाईल निवडा",
    ariaLabel: "पानाचा फोटो अपलोड करा"
  },
  scanning: {
    message: "पायटॉर्च ResNet18 पानावरील रोगाचे विश्लेषण करत आहे...",
    subtext: "३८ रोग प्रकार आणि पोषण घटकांची तपासणी सुरू आहे"
  },
  results: {
    severityLabel: "तीव्रता: {{severity}}",
    severityNone: "काही नाही / निरोगी",
    severityModerate: "मध्यम",
    severityHigh: "तीव्र",
    diagnosticMatch: "रोग जुळणी प्रमाण",
    chemicalTitle: "रासायनिक औषधोपचार",
    organicTitle: "सेंद्रिय / जैविक पर्याय",
    scanAnother: "दुसऱ्या पानाची तपासणी करा"
  },
  errors: {
    invalidType: "अवैध फाईल प्रकार. कृपया पिकाच्या पाण्याचे योग्य छायाचित्र (JPG, PNG किंवा WEBP) अपलोड करा.",
    exceedsSize: "फाईलचा आकार १५ MB पेक्षा जास्त आहे. कृपया सामान्य फोटो अपलोड करा.",
    apiError: "निदान प्रणालीशी संपर्क होऊ शकला नाही. सर्व्हर सुरू होत असल्यास ३० सेकंद थांबा आणि पुन्हा प्रयत्न करा."
  },
  diseases: {
    tomatoEarlyBlight: "टोमॅटोवरील लवकर येणारा करपा (अगेती झुलसा)",
    cottonAphids: "कापसावरील मावा कीड",
    wheatRust: "गव्हावरील तांबेरा रोग",
    healthyCrop: "निरोगी पीक (कोणताही रोग नाही)",
    defaultDisease: "पीक रोग"
  },
  treatments: {
    chemicalDefault: "अचूक रासायनिक मात्रा आणि फवारणीसाठी स्थानिक कृषी तज्ज्ञांचा सल्ला घ्यावा.",
    organicDefault: "झाडांमध्ये योग्य अंतर ठेवा आणि आवश्यक असल्यास निंबोळी अर्क/दशपर्णी अर्काची फवारणी करा.",
    earlyBlightChemical: "मँकोझेब ७५% WP @ २ ग्रॅम प्रति लिटर पाण्यात मिसळून १० दिवसांच्या अंतराने फवारणी करावी.",
    earlyBlightOrganic: "५% निंबोळी अर्क (NSKE) किंवा ट्रायकोडर्मा व्हिरिडी @ ५ ग्रॅम प्रति लिटर फवारावे.",
    cottonAphidsChemical: "इमिडाक्लोप्रिड १७.८% SL @ ०.३ मिली प्रति लिटर पाण्यात मिसळून फवारावे.",
    cottonAphidsOrganic: "५% निंबोळी तेल साबणाच्या द्रावणात मिसळून फवारावे किंवा क्रायसोपर्ला मित्रकीटक वापरावेत.",
    wheatRustChemical: "तांबेरा दिसताच प्रोपिकोनाझोल २५% EC @ १ मिली प्रति लिटर पाण्यात मिसळून फवारणी करावी.",
    wheatRustOrganic: "गंधक भुकटी (सल्फर) @ २५ किलो प्रति हेक्टरी धुरळावी किंवा गोमूत्र-दशपर्णी अर्क फवारावा.",
    healthyCropChemical: "कोणत्याही रासायनिक औषधाची गरज नाही. योग्य खत व पाणी व्यवस्थापन सुरू ठेवावे.",
    healthyCropOrganic: "नियमित शेणखत, जिवामृत आणि जैविक खतांचा वापर सुरू ठेवावा."
  }
};

// ==========================================
// 3. FERTILIZER CALCULATOR
// ==========================================
const fertilizerEn = {
  eyebrow: "Soil Chemistry & Nutrition",
  title: "Smart Fertilizer Calculator",
  titleAccent: "Calculator",
  description: "Calculate balanced N-P-K nutrient requirements and organic compost based on soil tests, crop growth stage, and plot acreage.",
  form: {
    farmSize: "Farm Size (Acres)",
    farmSizeAria: "Farm Size in Acres",
    soilType: "Soil Type",
    soilTypeAria: "Soil Type",
    cropStage: "Crop Growth Stage",
    cropStageAria: "Crop Growth Stage",
    phLevel: "Soil pH Level",
    phLevelAria: "Soil pH Level",
    nitrogen: "Nitrogen (N) Content",
    nitrogenAria: "Nitrogen (N) Content in kg per hectare",
    phosphorus: "Phosphorus (P) Content",
    phosphorusAria: "Phosphorus (P) Content in kg per hectare",
    potassium: "Potassium (K) Content",
    potassiumAria: "Potassium (K) Content in kg per hectare",
    calculateBtn: "Calculate Fertilizer Dosage",
    calculatingBtn: "Computing Chemistry Model...",
    kgHaUnit: "kg/ha"
  },
  soil: {
    black: "Black Soil (Regur)",
    red: "Red Soil",
    alluvial: "Alluvial Soil",
    clayey: "Clayey Soil",
    sandy: "Sandy Soil"
  },
  stage: {
    vegetative: "Vegetative Growth",
    sowing: "Sowing / Basal",
    flowering: "Flowering / Tillering",
    maturity: "Ripening / Maturity"
  },
  loading: {
    message: "Computing precision NPK formulation...",
    subtext: "Mapping soil chemistry, crop requirements, and plot acreage"
  },
  results: {
    formulationMatch: "Formulation Match",
    recommended: "Recommended:",
    balancedRatio: "Balanced NPK Ratio",
    forAcreage: "For {{count}} Acres",
    ureaLabel: "Urea (46-0-0)",
    dapLabel: "DAP (18-46-0)",
    mopLabel: "MOP / Potash",
    compostLabel: "Organic Manure",
    kgUnit: "kg",
    tonsUnit: "tons"
  },
  errors: {
    invalidFarmSize: "Please enter a valid farm size greater than 0 acres.",
    invalidPh: "Please enter a valid soil pH level between 3.0 and 10.0.",
    invalidNpk: "Please ensure Nitrogen, Phosphorus, and Potassium values are non-negative numbers.",
    apiError: "Failed to connect to the fertilizer calculator service. If the server is sleeping on Render free tier, please wait 30 seconds and retry."
  }
};

const fertilizerHi = {
  eyebrow: "मृदा रसायन व पोषण प्रबंधन",
  title: "स्मार्ट उर्वरक कैलकुलेटर",
  titleAccent: "कैलकुलेटर",
  description: "मिट्टी परीक्षण, फसल विकास चरण और खेत के रकबे के आधार पर संतुलित एन-पी-के पोषक तत्वों और जैविक खाद की मात्रा जानें।",
  form: {
    farmSize: "खेत का आकार (एकड़)",
    farmSizeAria: "खेत का आकार एकड़ में",
    soilType: "मिट्टी का प्रकार",
    soilTypeAria: "मिट्टी का प्रकार",
    cropStage: "फसल विकास चरण",
    cropStageAria: "फसल विकास चरण",
    phLevel: "मिट्टी का पीएच मान (pH)",
    phLevelAria: "मिट्टी का पीएच मान",
    nitrogen: "नाइट्रोजन (N) मात्रा",
    nitrogenAria: "नाइट्रोजन मात्रा किलोग्राम प्रति हेक्टेयर",
    phosphorus: "फास्फोरस (P) मात्रा",
    phosphorusAria: "फास्फोरस मात्रा किलोग्राम प्रति हेक्टेयर",
    potassium: "पोटेशियम (K) मात्रा",
    potassiumAria: "पोटेशियम मात्रा किलोग्राम प्रति हेक्टेयर",
    calculateBtn: "उर्वरक मात्रा की गणना करें",
    calculatingBtn: "रसायन मॉडल गणना कर रहा है...",
    kgHaUnit: "किग्रा/हेक्टेयर"
  },
  soil: {
    black: "काली मिट्टी (रेगुर)",
    red: "लाल मिट्टी",
    alluvial: "जलोढ़ दोमट मिट्टी",
    clayey: "चिकनी मटियार मिट्टी",
    sandy: "बलुई रेतीली मिट्टी"
  },
  stage: {
    vegetative: "वानस्पतिक वृद्धि (फुटाव)",
    sowing: "बुवाई / बेसल खुराक",
    flowering: "फूल / कल्ले निकलते समय",
    maturity: "दाना भराव / परिपक्वता"
  },
  loading: {
    message: "सटीक एनपीके खाद की गणना जारी है...",
    subtext: "मिट्टी के प्रकार, फसल जरूरत और खेत के रकबे का मिलान किया जा रहा है"
  },
  results: {
    formulationMatch: "उर्वरक फॉर्मूलेशन मिलान",
    recommended: "अनुशंसित खाद:",
    balancedRatio: "संतुलित एनपीके अनुपात",
    forAcreage: "{{count}} एकड़ के लिए",
    ureaLabel: "यूरिया (46-0-0)",
    dapLabel: "डीएपी (18-46-0)",
    mopLabel: "एमओपी / पोटाश (0-0-60)",
    compostLabel: "सड़ी गोबर की खाद",
    kgUnit: "किग्रा",
    tonsUnit: "टन"
  },
  errors: {
    invalidFarmSize: "कृपया 0 एकड़ से अधिक मान्य खेत का आकार दर्ज करें।",
    invalidPh: "कृपया 3.0 से 10.0 के बीच मान्य मिट्टी पीएच मान दर्ज करें।",
    invalidNpk: "कृपया सुनिश्चित करें कि नाइट्रोजन, फास्फोरस और पोटाश मान गैर-ऋणात्मक संख्याएँ हैं।",
    apiError: "उर्वरक कैलकुलेटर सेवा से कनेक्ट करने में विफल। यदि सर्वर स्लीप मोड में है, तो कृपया 30 सेकंड प्रतीक्षा कर पुनः प्रयास करें।"
  }
};

const fertilizerMr = {
  eyebrow: "माती रसायन व पोषण व्यवस्थापन",
  title: "स्मार्ट खत गणकयंत्र",
  titleAccent: "गणकयंत्र",
  description: "माती परीक्षण अहवाल, पिकाची वाढीची अवस्था आणि जमिनीच्या क्षेत्रफळानुसार संतुलित एन-पी-के आणि सेंद्रिय खतांची अचूक मात्रा काढा.",
  form: {
    farmSize: "शेताचे क्षेत्र (एकर)",
    farmSizeAria: "शेताचे क्षेत्र एकरमध्ये",
    soilType: "मातीचा प्रकार",
    soilTypeAria: "मातीचा प्रकार",
    cropStage: "पिकाची वाढीची अवस्था",
    cropStageAria: "पिकाची वाढीची अवस्था",
    phLevel: "मातीचा सामू (pH)",
    phLevelAria: "मातीचा सामू",
    nitrogen: "नत्र (N) प्रमाण",
    nitrogenAria: "नत्र प्रमाण किलो प्रति हेक्टरी",
    phosphorus: "स्फुरद (P) प्रमाण",
    phosphorusAria: "स्फुरद प्रमाण किलो प्रति हेक्टरी",
    potassium: "पालाश (K) प्रमाण",
    potassiumAria: "पालाश प्रमाण किलो प्रति हेक्टरी",
    calculateBtn: "खतांची मात्रा काढा",
    calculatingBtn: "खत प्रमाण मोजत आहे...",
    kgHaUnit: "किलो/हेक्टर"
  },
  soil: {
    black: "काळी कसदार माती (रेगूर)",
    red: "तांबडी माती",
    alluvial: "गाळाची सुपीक माती",
    clayey: "चिकण माती",
    sandy: "रेताड हलकी माती"
  },
  stage: {
    vegetative: "शाकीय वाढीची अवस्था",
    sowing: "पेरणी / पायाभूत खते",
    flowering: "फुलोरा / फुटवे येण्याची वेळ",
    maturity: "दाणे भरणे / पक्वता"
  },
  loading: {
    message: "अचूक एनपीके खत प्रमाण काढत आहे...",
    subtext: "मातीचे गुणधर्म, पिकाची गरज आणि क्षेत्राचे गणित केले जात आहे"
  },
  results: {
    formulationMatch: "खत प्रमाण शिफारस",
    recommended: "शिफारस केलेले खत:",
    balancedRatio: "संतुलित एनपीके प्रमाण",
    forAcreage: "{{count}} एकरासाठी",
    ureaLabel: "युरिया (46-0-0)",
    dapLabel: "डीएपी (18-46-0)",
    mopLabel: "एमओपी / पालाश (0-0-60)",
    compostLabel: "चांगले कुजलेले शेणखत",
    kgUnit: "किलो",
    tonsUnit: "टन"
  },
  errors: {
    invalidFarmSize: "कृपया ० एकरापेक्षा जास्त योग्य क्षेत्रफळ टाका.",
    invalidPh: "कृपया ३.० ते १०.० दरम्यान योग्य मातीचा सामू (pH) टाका.",
    invalidNpk: "कृपया नत्र, स्फुरद आणि पालाशची मूल्ये योग्य संख्या असल्याची खात्री करा.",
    apiError: "खत गणकयंत्र प्रणालीशी संपर्क होऊ शकला नाही. सर्व्हर सुरू होत असल्यास ३० सेकंद थांबा आणि पुन्हा प्रयत्न करा."
  }
};

// ==========================================
// 4. CULTIVATION GUIDES
// ==========================================
const guidesEn = {
  eyebrow: "Agronomic Knowledge",
  title: "Cultivation Lifecycle Guides",
  titleAccent: "Guides",
  subtitle: "Step-by-step scientific management protocols for high-yield commercial crops in India.",
  selectCrop: "Select Crop:",
  growthStagesCount: "6 Growth Stages",
  stages: {
    landPrep: "Land Preparation",
    sowing: "Sowing & Germination",
    vegetative: "Vegetative Growth",
    flowering: "Flowering & Fruiting",
    pestMgmt: "Pest & Disease Management",
    harvesting: "Harvesting"
  },
  expandAll: "Expand All Stages",
  collapseAll: "Collapse All Stages"
};

const guidesHi = {
  eyebrow: "कृषि विज्ञान ज्ञान",
  title: "फसल जीवनचक्र गाइड",
  titleAccent: "गाइड",
  subtitle: "भारत में अधिक पैदावार देने वाली व्यावसायिक फसलों के लिए चरणबद्ध वैज्ञानिक कृषि प्रबंधन।",
  selectCrop: "फसल चुनें:",
  growthStagesCount: "6 विकास चरण",
  stages: {
    landPrep: "खेत की तैयारी व जुताई",
    sowing: "बीज बुवाई व अंकुरण",
    vegetative: "वानस्पतिक वृद्धि व फुटाव",
    flowering: "फूल व फल विकास",
    pestMgmt: "कीट व रोग प्रबंधन",
    harvesting: "फसल कटाई व गहाई"
  },
  expandAll: "सभी चरण खोलें",
  collapseAll: "सभी चरण समेटें"
};

const guidesMr = {
  eyebrow: "कृषी तंत्रज्ञान माहिती",
  title: "पीक लागवड मार्गदर्शक",
  titleAccent: "मार्गदर्शक",
  subtitle: "भारतातील प्रमुख पिकांच्या भरघोस उत्पादनासाठी टप्प्याटप्प्याने शास्त्रीय व्यवस्थापन पद्धती.",
  selectCrop: "पीक निवडा:",
  growthStagesCount: "६ वाढीच्या पायऱ्या",
  stages: {
    landPrep: "जमिनीची मशागत व तयारी",
    sowing: "बियाणे पेरणी व उगवण",
    vegetative: "शाकीय वाढ व फुटवे",
    flowering: "फुलोरा व फळधारणा",
    pestMgmt: "कीड व रोग नियंत्रण",
    harvesting: "काढणी व साठवणूक"
  },
  expandAll: "सर्व टप्पे उघडा",
  collapseAll: "सर्व टप्पे बंद करा"
};

// ==========================================
// 5. CHAT / ASSISTANT
// ==========================================
const chatEn = {
  tooltip: "Ask KisanSathi AI",
  title: "KisanSathi AI Assistant",
  badge: "Gemini 1.5 Pro",
  greeting: "Hello! I am your KisanSathi AI assistant. How can I help you with your crops today?",
  placeholder: "Ask about crop diseases, fertilizers, weather...",
  listeningPlaceholder: "Listening to your voice...",
  listeningActive: "Listening...",
  speakPrompt: "Click to speak (voice enabled)",
  clearChat: "Clear conversation",
  sendAria: "Send message",
  micAria: "Toggle voice input",
  closeAria: "Close assistant",
  openAria: "Open assistant",
  aiThinking: "KisanSathi is analyzing agronomy database...",
  networkError: "Network connection error. Please try again.",
  chipsHeading: "Suggested questions for this tool:"
};

const chatHi = {
  tooltip: "किसान साथी एआई से पूछें",
  title: "किसान साथी एआई सहायक",
  badge: "जेमिनी 1.5 प्रो",
  greeting: "नमस्ते किसान भाई! मैं आपका किसान साथी एआई सहायक हूँ। आज आपकी खेती में क्या सहायता कर सकता हूँ?",
  placeholder: "फसल के रोग, खाद, सिंचाई या मौसम के बारे में पूछें...",
  listeningPlaceholder: "आपकी आवाज़ सुनी जा रही है...",
  listeningActive: "सुन रहा हूँ...",
  speakPrompt: "बोलने के लिए माइक दबाएँ (वॉइस समर्थित)",
  clearChat: "बातचीत साफ़ करें",
  sendAria: "संदेश भेजें",
  micAria: "वॉइस इनपुट शुरू करें",
  closeAria: "सहायक बंद करें",
  openAria: "सहायक खोलें",
  aiThinking: "किसान साथी कृषि डेटाबेस की जांच कर रहा है...",
  networkError: "नेटवर्क संपर्क त्रुटि। कृपया पुनः प्रयास करें।",
  chipsHeading: "इस उपकरण के लिए सुझाए गए प्रश्न:"
};

const chatMr = {
  tooltip: "किसान साथी एआयला विचारा",
  title: "किसान साथी एआय मदतनीस",
  badge: "जेमिनी १.५ प्रो",
  greeting: "नमस्कार शेतकरी मित्रहो! मी आपला किसान साथी एआय मदतनीस आहे. आज आपल्या शेतीकामात मी काय मदत करू शकतो?",
  placeholder: "पिकांवरील रोग, खते, पाणी किंवा हवामानाविषयी विचारा...",
  listeningPlaceholder: "आपला आवाज ऐकत आहे...",
  listeningActive: "ऐकत आहे...",
  speakPrompt: "बोलण्यासाठी माइक दाबा (आवाज सुविधा उपलब्ध)",
  clearChat: "संभाषण पुसून टाका",
  sendAria: "संदेश पाठवा",
  micAria: "व्हॉइस इनपुट सुरू करा",
  closeAria: "मदतनीस बंद करा",
  openAria: "मदतनीस उघडा",
  aiThinking: "किसान साथी कृषी माहितीची तपासणी करत आहे...",
  networkError: "इंटरनेट संपर्कात अडचण. कृपया पुन्हा प्रयत्न करा.",
  chipsHeading: "या साधनावरील उपयुक्त प्रश्न:"
};

// ==========================================
// 6. ERRORS & FALLBACKS
// ==========================================
const errorsEn = {
  coldStartTitle: "Waking up AI engine...",
  coldStartMessage: "Demonstration backend container is starting up on Render. First request takes ~40s, subsequent requests respond in sub-seconds.",
  serverOffline: "Unable to reach server. Please check your internet connection.",
  unknownError: "An unexpected error occurred. Please refresh the page.",
  retryBtn: "Retry Action"
};

const errorsHi = {
  coldStartTitle: "एआई इंजन शुरू हो रहा है...",
  coldStartMessage: "डेमो बैकएंड कंटेनर रेंडर पर शुरू हो रहा है। पहले अनुरोध में ~40 सेकंड का समय लग सकता है, इसके बाद तुरंत उत्तर मिलेगा।",
  serverOffline: "सर्वर से संपर्क नहीं हो पा रहा है। कृपया अपना इंटरनेट कनेक्शन जांचें।",
  unknownError: "अनपेक्षित त्रुटि हुई। कृपया पृष्ठ को रीफ़्रेश करें।",
  retryBtn: "पुनः प्रयास करें"
};

const errorsMr = {
  coldStartTitle: "एआय इंजिन सुरू होत आहे...",
  coldStartMessage: "डेमो सर्व्हर सुरू होत आहे. पहिल्या विनंतीला सुमारे ४० सेकंद लागू शकतात, नंतरच्या सर्व क्रिया त्वरित होतील.",
  serverOffline: "सर्व्हरशी संपर्क होऊ शकत नाही. कृपया आपले इंटरनेट तपासा.",
  unknownError: "काहीतरी त्रुटी झाली आहे. कृपया पान रीफ्रेश करा.",
  retryBtn: "पुन्हा प्रयत्न करा"
};

// WRITE ALL FILES
const catalogs = [
  { ns: 'dashboard', en: dashboardEn, hi: dashboardHi, mr: dashboardMr },
  { ns: 'heal', en: healEn, hi: healHi, mr: healMr },
  { ns: 'fertilizer', en: fertilizerEn, hi: fertilizerHi, mr: fertilizerMr },
  { ns: 'guides', en: guidesEn, hi: guidesHi, mr: guidesMr },
  { ns: 'chat', en: chatEn, hi: chatHi, mr: chatMr },
  { ns: 'errors', en: errorsEn, hi: errorsHi, mr: errorsMr },
];

for (const cat of catalogs) {
  fs.writeFileSync(path.join(localesDir, 'en', `${cat.ns}.json`), JSON.stringify(cat.en, null, 2), 'utf8');
  fs.writeFileSync(path.join(localesDir, 'hi', `${cat.ns}.json`), JSON.stringify(cat.hi, null, 2), 'utf8');
  fs.writeFileSync(path.join(localesDir, 'mr', `${cat.ns}.json`), JSON.stringify(cat.mr, null, 2), 'utf8');
  console.log(`Generated catalogs for namespace: [${cat.ns}]`);
}

console.log('All catalogs built successfully.');
