/**
 * KisanSathi / Kisan Sakhi Landing Page Content & Verified Metrics
 * All copy, image paths, FAQ entries, and feature configurations in one central file.
 */

export const LANDING_CONTENT = {
  brand: {
    name: 'KisanSathi',
    fullName: 'KisanSathi',
    tagline: 'Har kisan ka saccha sathi.',
    subtagline: 'AI-Powered Agritech Platform bridging agricultural science and everyday farming.',
  },

  nav: [
    { label: 'Home', path: '/', isHome: true },
    { label: 'Heal Your Crop', path: '/dashboard?tab=heal' },
    { label: 'Fertilizer Calc', path: '/dashboard?tab=fertilizer' },
    { label: 'Cultivation Guides', path: '/dashboard?tab=guide' },
    { label: 'Yield & Pest', path: '/dashboard?tab=yield-pest' },
    { label: 'AI Assistant', path: '/dashboard?tab=assistant' },
  ],

  hero: {
    headlineLine1: 'Smart Farming for',
    headlineAccent: 'Every Kisan',
    tagline: 'Har kisan ka saccha sathi.',
    subtext: 'Instant crop leaf disease diagnosis, dynamic NPK fertilizer dosage calculation, and a voice-enabled AI assistant for Indian farmers.',
    primaryCta: 'Explore AI Tools',
    secondaryCta: 'Learn How It Works',
    stats: {
      badge: 'PyTorch ResNet18',
      classesCount: '38 Disease Classes',
      cropsCount: '6 Guided Crops',
    }
  },

  statement: {
    eyebrow: 'Cultiva Legacy',
    beforePill: "KisanSathi puts crop science in every farmer's hands by delivering",
    afterPill: 'instant leaf disease diagnosis, precision fertilizer dosage, and agronomic guidance in seconds.',
    videoThumbnail: '/videos/hero-poster.webp',
  },

  featuresAccordion: {
    eyebrow: 'Core Capabilities',
    headingTitle: 'Smart Farming Solutions',
    headingAccent: 'That Deliver Real Results',
    description: 'Our intelligent agricultural algorithms help farmers increase yields while minimizing chemical overuse, soil degradation, and resource waste.',
    items: [
      {
        id: 'heal',
        title: 'Heal Your Crop (Disease Diagnosis)',
        description: 'Upload a leaf photo to identify 38 plant disease classes using our PyTorch ResNet18 model. Receive instant severity grading and dual chemical & organic bio-pesticide treatment plans.',
        tag: 'Computer Vision',
        path: '/dashboard?tab=heal',
        ctaText: 'Diagnose Leaf',
        image: '/images/features/heal-crop.jpg',
      },
      {
        id: 'fertilizer',
        title: 'Smart Fertilizer Calculator',
        description: 'Input your soil test N-P-K, pH, soil texture, crop, and acreage. Our scikit-learn model calculates exact kilograms of Urea, DAP, MOP, and compost required, preventing costly fertilizer runoff.',
        tag: 'Soil Chemistry',
        path: '/dashboard?tab=fertilizer',
        ctaText: 'Calculate NPK',
        image: '/images/features/fertilizer.jpg',
      },
      {
        id: 'yield-pest',
        title: 'Yield & Pest Risk Forecaster',
        description: 'Correlates Copernicus Sentinel-2 NDVI satellite indices with temperature and humidity to predict harvest yields and trigger early warnings for stem borers, aphids, and rust.',
        tag: 'Satellite & Telemetry',
        path: '/dashboard?tab=yield-pest',
        ctaText: 'Forecast Harvest',
        image: '/images/features/yield-pest.jpg',
      },
      {
        id: 'guide',
        title: 'Cultivation Lifecycle Guides',
        description: 'Comprehensive agronomic timelines for Tomato, Cotton, Wheat, Rice, Sugarcane, and Maize across 6 growth stages—from land tillage and seed treatment to harvesting.',
        tag: 'Agronomy Knowledge',
        path: '/dashboard?tab=guide',
        ctaText: 'Browse Guides',
        image: '/images/features/guides.jpg',
      }
    ]
  },

  howItWorks: {
    eyebrow: 'Interactive Workflow',
    headingTitle: 'From Field to Forecast',
    headingAccent: 'Simple and Intelligent',
    description: 'Connect your real crop observations with trained machine learning models to receive transparent, scientific farm recommendations.',
    tabs: [
      {
        id: 'heal',
        label: 'Heal Your Crop',
        subtitle: 'Leaf Disease Scan',
        location: '📍 Nashik, Maharashtra',
        image: '/images/features/heal-crop.jpg',
        sampleResultType: 'disease',
      },
      {
        id: 'fertilizer',
        label: 'Fertilizer Calculator',
        subtitle: 'NPK Dosage Optimization',
        location: '📍 Vidarbha, Maharashtra',
        image: '/images/features/fertilizer.jpg',
        sampleResultType: 'fertilizer',
      },
      {
        id: 'guide',
        label: 'Cultivation Guides',
        subtitle: '6-Stage Lifecycles',
        location: '📍 Karnal, Haryana',
        image: '/images/features/guides.jpg',
        sampleResultType: 'guide',
      },
      {
        id: 'assistant',
        label: 'AI Assistant',
        subtitle: 'Gemini 1.5 Pro Chat',
        location: '📍 Bellary, Karnataka',
        image: '/images/features/ai-assistant.jpg',
        sampleResultType: 'assistant',
      }
    ],
    sampleDiagnosis: {
      disease: 'Tomato Early Blight',
      pathogen: 'Alternaria solani',
      confidence: 94.8,
      severity: 'Moderate',
      treatment: 'Apply neem-based bio-spray (organic) or Mancozeb 75% WP @ 2g/L (chemical).',
    },
    sampleFertilizer: {
      crop: 'Wheat (Triticum aestivum)',
      area: '2.5 Acres',
      soil: 'Loamy Soil (pH 6.8)',
      urea: 125,
      dap: 60,
      mop: 35,
      compost: 2.5,
    }
  },

  solutionsCarousel: {
    eyebrow: 'Supported Crops',
    headingTitle: 'Smart Solutions for',
    headingAccent: 'Modern Farming',
    description: 'Click any crop card to launch its full lifecycle cultivation guide, tailored with regional pest advisories and irrigation milestones.',
    crops: [
      {
        name: 'Tomato',
        scientific: 'Solanum lycopersicum',
        description: 'Early Blight vigilance, staking methods, and blossom end rot calcium management.',
        stages: '6 Growth Stages',
        path: '/dashboard?tab=guide',
        image: '/images/crops/tomato.jpg',
      },
      {
        name: 'Cotton',
        scientific: 'Gossypium hirsutum',
        description: 'Bollworm scouting, square formation nutrition, and defoliation timing.',
        stages: '6 Growth Stages',
        path: '/dashboard?tab=guide',
        image: '/images/crops/cotton.jpg',
      },
      {
        name: 'Wheat',
        scientific: 'Triticum aestivum',
        description: 'Crown root initiation irrigation, tillering Nitrogen top-dressing, and rust defense.',
        stages: '6 Growth Stages',
        path: '/dashboard?tab=guide',
        image: '/images/crops/wheat.jpg',
      },
      {
        name: 'Rice (Paddy)',
        scientific: 'Oryza sativa',
        description: 'Nursery seedling management, panicle initiation water depth, and blast control.',
        stages: '6 Growth Stages',
        path: '/dashboard?tab=guide',
        image: '/images/crops/rice.jpg',
      },
      {
        name: 'Sugarcane',
        scientific: 'Saccharum officinarum',
        description: 'Sett furrow treatment, grand growth earthing up, and borer biological control.',
        stages: '6 Growth Stages',
        path: '/dashboard?tab=guide',
        image: '/images/crops/sugarcane.jpg',
      },
      {
        name: 'Maize (Corn)',
        scientific: 'Zea mays',
        description: 'Knee-high vegetative fertilization, Fall Armyworm monitoring, and tassel silking.',
        stages: '6 Growth Stages',
        path: '/dashboard?tab=guide',
        image: '/images/crops/maize.jpg',
      }
    ]
  },

  testimonials: {
    eyebrow: 'Sample Workflows',
    headingTitle: 'How Farmers Will Use',
    headingAccent: 'KisanSathi',
    description: 'Realistic farm scenarios demonstrating how instant diagnosis and NPK dosage calculation transform day-to-day agricultural operations.',
    scenarios: [
      {
        id: 'scenario-1',
        label: 'Sample Scenario • Leaf Pathology',
        quote: 'A farmer in Nashik noticed yellow concentric lesions on tomato leaves. Uploading a mobile photo confirmed Early Blight within 5 seconds, recommending organic neem bio-spray before the infection spread across the 2-acre plot.',
        farmer: 'Ramesh Shinde',
        location: 'Nashik, Maharashtra',
        crop: 'Tomato Cultivator',
        avatar: '/images/avatars/farmer1.jpg',
        featureUsed: 'Heal Your Crop',
      },
      {
        id: 'scenario-2',
        label: 'Sample Scenario • Soil Fertility',
        quote: 'Instead of purchasing generic fertilizer blends, a cotton grower input soil test N-P-K readings. The calculator reduced unnecessary DAP purchases by 35% and specified exact split schedules for squaring and boll formation.',
        farmer: 'Suresh Patel',
        location: 'Rajkot, Gujarat',
        crop: 'Cotton Grower',
        avatar: '/images/avatars/farmer2.jpg',
        featureUsed: 'Smart Fertilizer Calculator',
      },
      {
        id: 'scenario-3',
        label: 'Sample Scenario • Lifecycle Guidance',
        quote: 'A wheat farmer checked the Cultivation Guide for crown root initiation timing. Coordinating the first irrigation with satellite soil telemetry prevented root lodging and improved the productive tillering count.',
        farmer: 'Harpreet Singh',
        location: 'Ludhiana, Punjab',
        crop: 'Wheat Grower',
        avatar: '/images/avatars/farmer3.jpg',
        featureUsed: 'Cultivation Guides',
      }
    ]
  },

  faq: {
    eyebrow: 'FAQ',
    headingTitle: 'Common Farmer',
    headingAccent: 'Questions',
    description: 'Straightforward technical answers explaining our machine learning models, soil algorithms, and privacy standards.',
    items: [
      {
        question: 'How accurate is the leaf disease detection model?',
        answer: 'Our disease detection model is built on a PyTorch ResNet18 convolutional neural network trained on 38 distinct crop disease classes from the benchmark PlantVillage dataset. The model returns a confidence score (typically 85% to 99%) along with specific chemical and organic bio-pesticide treatment recommendations.',
      },
      {
        question: 'What inputs does the Smart Fertilizer Calculator need?',
        answer: 'The calculator takes 7 specific field parameters: soil Nitrogen (N), Phosphorus (P), and Potassium (K) in kg/ha, soil pH, Soil Type (Sandy, Loamy, Black, Red, or Clayey), Crop Type (Maize, Sugarcane, Wheat, Cotton, or Tomato), and farm size in acres. Our scikit-learn model maps these to exact kilograms of Urea, DAP, MOP, and organic compost.',
      },
      {
        question: 'Are my uploaded crop leaf photos stored on your servers?',
        answer: 'No. As verified in our FastAPI backend (/api/predict/disease), uploaded leaf images are read directly into memory as a temporary ByteStream using PIL and PyTorch tensors. Photos are evaluated in-memory and discarded immediately after inference. We do not store or persist user images to disk or database.',
      },
      {
        question: 'How does the AI Assistant provide personalized guidance?',
        answer: 'The floating AI Assistant is powered by Google Gemini 1.5 Pro. It dynamically receives contextual state from whichever tool you are active in (e.g. your active leaf diagnosis result, soil calculations, or crop guide stage) so its conversational advice is grounded directly in your current crop data.',
      },
      {
        question: 'Why does the initial AI diagnosis sometimes take up to a minute?',
        answer: 'Our demonstration backend is hosted on Render free tier. When the API has been idle, the container enters sleep mode. The first incoming request initiates a container cold start taking approximately 40 to 60 seconds, after which the server remains awake and responds in sub-second time.',
      }
    ]
  },

  finalCta: {
    headingLine1: 'Make farming smarter,',
    headingAccent: 'stronger, and simpler',
    subtext: 'Deploying PyTorch computer vision and precision soil science to diagnose plant diseases, calculate exact NPK dosage, and optimize agricultural yields.',
    buttonText: 'Open Farmer Dashboard',
    path: '/dashboard',
  },

  poweredBy: [
    { name: 'PyTorch', desc: 'ResNet18 Deep Learning' },
    { name: 'Google Gemini', desc: '1.5 Pro Multimodal AI' },
    { name: 'FastAPI', desc: 'High-Performance Python' },
    { name: 'Scikit-Learn', desc: 'Random Forest Regression' },
    { name: 'Copernicus', desc: 'Sentinel-2 Telemetry' }
  ],

  footer: {
    columns: [
      {
        title: 'AI Tools',
        links: [
          { label: 'Heal Your Crop (Disease)', path: '/dashboard?tab=heal' },
          { label: 'Smart Fertilizer Calculator', path: '/dashboard?tab=fertilizer' },
          { label: 'Yield & Pest Forecaster', path: '/dashboard?tab=yield-pest' },
          { label: 'Live Weather Telemetry', path: '/dashboard?tab=weather' },
        ]
      },
      {
        title: 'Crop Guides',
        links: [
          { label: 'Tomato Cultivation Guide', path: '/dashboard?tab=guide' },
          { label: 'Cotton Cultivation Guide', path: '/dashboard?tab=guide' },
          { label: 'Wheat Lifecycle Guide', path: '/dashboard?tab=guide' },
          { label: 'Rice & Sugarcane Guides', path: '/dashboard?tab=guide' },
        ]
      },
      {
        title: 'Platform',
        links: [
          { label: 'Farmer Dashboard', path: '/dashboard' },
          { label: 'AI Assistant Context', path: '/dashboard?tab=assistant' },
          { label: 'API Architecture', path: 'https://github.com/madhavzanwar/kisan-sathi-app', external: true },
          { label: 'MIT Open Source License', path: 'https://github.com/madhavzanwar/kisan-sathi-app/blob/main/LICENSE', external: true },
        ]
      }
    ],
    copyright: '© 2026 KisanSathi. Engineered for Indian Agriculture.',
  }
};

export default LANDING_CONTENT;
