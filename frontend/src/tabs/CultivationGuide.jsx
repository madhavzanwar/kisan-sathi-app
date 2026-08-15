import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, Droplet, Bug, Tractor, Sprout, Leaf, Sun, Wheat } from 'lucide-react';

const crops = ['Tomato', 'Cotton', 'Wheat', 'Rice', 'Sugarcane', 'Maize'];

const CROP_GUIDE_DATA = {
  Tomato: [
    {
      stage: 'Land Preparation',
      duration: 'Pre-sowing',
      type: 'tractor',
      details: [
        'Plough the field 2-3 times to achieve a fine, weed-free tilth.',
        'Apply well-decomposed farmyard manure (FYM) at <strong>20-25 tonnes/ha</strong> during the last ploughing.',
        'Ensure soil pH is balanced between <strong>6.0 and 7.0</strong> for optimal nutrient absorption.',
        'Form raised beds of <strong>90-120 cm</strong> width to improve drainage and prevent root rot.'
      ]
    },
    {
      stage: 'Sowing & Germination',
      duration: 'Day 0 - 30',
      type: 'sprout',
      details: [
        'Sow seeds in pro-trays using coco-peat for a near 100% germination rate.',
        'Maintain a nursery temperature of <strong>25-30°C</strong>.',
        'Transplant healthy seedlings to the main field after <strong>25-30 days</strong> when they have 4-5 true leaves.',
        'Maintain a spacing of <strong>60 x 45 cm</strong> between plants.'
      ]
    },
    {
      stage: 'Vegetative Growth',
      duration: 'Day 31 - 60',
      type: 'leaf',
      details: [
        'Apply a basal dose of NPK <strong>19:19:19</strong> fertilizer to promote foliage growth.',
        'Install bamboo or wire staking to support the stems as they grow heavy.',
        'Use <strong>Drip Irrigation</strong> to deliver water directly to roots and avoid overhead watering, which causes fungal diseases.',
        'Manually weed the field 20 days and 45 days after transplanting.'
      ]
    },
    {
      stage: 'Flowering & Fruiting',
      duration: 'Day 61 - 90',
      type: 'sun',
      details: [
        'Spray <strong>Boron (0.2%)</strong> to prevent premature flower drop.',
        'Shift to a Potassium-rich fertilizer like NPK <strong>0:0:50</strong> to enhance fruit size and quality.',
        'Ensure consistent soil moisture; fluctuations can cause Tomato Blossom End Rot.',
        'Prune lower leaves to improve air circulation and sunlight penetration.'
      ]
    },
    {
      stage: 'Pest & Disease Management',
      duration: 'Preventive',
      type: 'pest',
      details: [
        'Watch out for the Tomato Fruit Borer. Spray <strong>Spinosad 45% SC</strong> or use <strong>Neem Oil (10000 ppm)</strong> at first sight.',
        'Install <strong>Yellow Sticky Traps</strong> (10-15 per acre) to control Whiteflies, which spread Leaf Curl Virus.',
        'For Early Blight (dark spots), spray <strong>Copper Oxychloride</strong> at 3g/liter of water.',
        'Remove and safely burn any virus-infected plants immediately.'
      ]
    },
    {
      stage: 'Harvesting',
      duration: 'Day 90+',
      type: 'wheat',
      details: [
        'Harvest fruits at the <strong>breaker stage</strong> (light pink) if transporting to distant markets.',
        'Harvest at the <strong>red ripe stage</strong> for local processing or immediate sale.',
        'Pick fruits carefully in the morning or late evening to prevent heat stress.',
        'Grade tomatoes by size and color before packing into well-ventilated corrugated boxes.'
      ]
    }
  ],
  Cotton: [
    {
      stage: 'Land Preparation',
      duration: 'Pre-sowing',
      type: 'tractor',
      details: [
        'Perform deep summer ploughing to expose hibernating pests like Pink Bollworm.',
        'Apply <strong>10 tonnes/ha</strong> of FYM and mix it thoroughly into the soil.',
        'Test soil to ensure a pH between <strong>5.8 and 8.0</strong>.',
        'Prepare ridges and furrows for efficient water management.'
      ]
    },
    {
      stage: 'Sowing & Germination',
      duration: 'May - June',
      type: 'sprout',
      details: [
        'Treat seeds with <strong>Imidacloprid</strong> to protect against early sucking pests.',
        'Maintain a plant spacing of <strong>90 x 90 cm</strong> or 120 x 60 cm depending on the hybrid.',
        'Sow 2-3 seeds per hill at a depth of <strong>4-5 cm</strong>.',
        'Irrigate immediately after sowing if soil moisture is low.'
      ]
    },
    {
      stage: 'Vegetative Growth',
      duration: 'Day 30 - 60',
      type: 'leaf',
      details: [
        'Thin out weaker plants, leaving only one healthy seedling per hill at 15 days.',
        'Apply the first top dressing of <strong>Urea (Nitrogen)</strong> at 30 days.',
        'Keep the field completely weed-free for the first 60 days to avoid competition.',
        'Apply light irrigation during dry spells, avoiding waterlogging at all costs.'
      ]
    },
    {
      stage: 'Flowering & Fruiting',
      duration: 'Day 61 - 100',
      type: 'sun',
      details: [
        'This is the most critical stage for water. Ensure adequate irrigation to prevent square (bud) dropping.',
        'Apply a foliar spray of <strong>2% DAP</strong> to boost boll formation.',
        'Spray <strong>NAA (Planofix)</strong> at 10 ppm to minimize flower shedding.',
        'Apply the final dose of Potassium fertilizer to improve fiber strength.'
      ]
    },
    {
      stage: 'Pest & Disease Management',
      duration: 'Critical',
      type: 'pest',
      details: [
        'The <strong>Pink Bollworm</strong> is a major threat. Install pheromone traps (5 per acre) to monitor moth activity.',
        'If infestation crosses the Economic Threshold Level (ETL), spray <strong>Emamectin Benzoate 5% SG</strong>.',
        'For sucking pests like Jassids and Aphids, spray <strong>Flonicamid</strong> or Neem-based bio-pesticides.',
        'Watch for Bacterial Blight; spray Streptocycline if angular leaf spots appear.'
      ]
    },
    {
      stage: 'Harvesting',
      duration: 'Day 120+',
      type: 'wheat',
      details: [
        'Pick cotton only when the bolls are fully open and fluffy.',
        'Harvest in the morning after the dew has dried to maintain fiber quality.',
        'Perform 3-4 pickings at intervals of 15-20 days.',
        'Store harvested raw cotton in a dry, clean place away from moisture and direct sunlight.'
      ]
    }
  ],
  Wheat: [
    {
      stage: 'Land Preparation',
      duration: 'Pre-sowing',
      type: 'tractor',
      details: [
        'Plough the field immediately after harvesting the previous Kharif crop.',
        'Perform 1 deep ploughing followed by 2-3 harrowings to get a fine tilth.',
        'Ensure the field is perfectly leveled for uniform irrigation.',
        'Apply a basal dose of <strong>50 kg DAP</strong> per acre.'
      ]
    },
    {
      stage: 'Sowing & Germination',
      duration: 'November',
      type: 'sprout',
      details: [
        'Treat seeds with <strong>Tebuconazole</strong> to prevent loose smut disease.',
        'Sow seeds in lines with a row spacing of <strong>20-22.5 cm</strong>.',
        'Sow at a depth of <strong>4-5 cm</strong> using a seed drill for uniformity.',
        'Maintain a seed rate of <strong>40 kg per acre</strong> for timely sowing.'
      ]
    },
    {
      stage: 'Vegetative Growth',
      duration: 'Day 21 - Crown Root Initiation',
      type: 'leaf',
      details: [
        'The Crown Root Initiation (CRI) stage at <strong>21 days</strong> is the most critical for irrigation.',
        'Apply the first dose of <strong>Urea (Nitrogen)</strong> immediately after the CRI irrigation.',
        'Control broad-leaved weeds by spraying <strong>2,4-D</strong> at 30-35 days.',
        'Ensure the field is not waterlogged, as wheat roots require high oxygen.'
      ]
    },
    {
      stage: 'Flowering & Fruiting',
      duration: 'Day 70 - 90',
      type: 'sun',
      details: [
        'Provide light irrigation during the heading and flowering stages.',
        'Avoid irrigation if high winds are predicted to prevent lodging (plants falling over).',
        'Maintain temperatures between <strong>15-20°C</strong> for optimal grain filling.',
        'Spray <strong>Potassium Nitrate (KNO3)</strong> if temperatures rise unexpectedly to mitigate heat stress.'
      ]
    },
    {
      stage: 'Pest & Disease Management',
      duration: 'Preventive',
      type: 'pest',
      details: [
        'Watch closely for <strong>Yellow Rust</strong>. Spray <strong>Propiconazole 25% EC</strong> at the very first sign of yellow stripes on leaves.',
        'To control Aphids, spray <strong>Imidacloprid</strong> if you count more than 15 aphids per earhead.',
        'Control rodents using Zinc Phosphide baits in the field.',
        'Ensure good crop rotation to naturally break the disease cycle.'
      ]
    },
    {
      stage: 'Harvesting',
      duration: 'Day 120-140',
      type: 'wheat',
      details: [
        'Harvest when the grains turn hard and the moisture content drops to <strong>12-14%</strong>.',
        'Use a combine harvester for efficiency, leaving the straw behind for mulching or baling.',
        'Dry the grains thoroughly in the sun before bagging.',
        'Store in airtight bins with Neem leaves or fumigants to prevent storage pests.'
      ]
    }
  ],
  Rice: [
    {
      stage: 'Land Preparation',
      duration: 'Pre-sowing',
      type: 'tractor',
      details: [
        'Puddle the field (ploughing in standing water) to create an impervious layer and reduce water percolation.',
        'Level the puddled field perfectly to ensure uniform water depth.',
        'Apply <strong>Green Manure (Dhaincha)</strong> and incorporate it into the soil 2 weeks before transplanting.',
        'Apply basal NPK fertilizers as per local soil test recommendations.'
      ]
    },
    {
      stage: 'Sowing & Germination',
      duration: 'Nursery Stage',
      type: 'sprout',
      details: [
        'Soak seeds in water for 24 hours, then incubate in gunny bags for 48 hours to induce sprouting.',
        'Sow sprouted seeds on raised nursery beds.',
        'Keep the nursery beds moist but not flooded for the first week.',
        'Transplant seedlings to the main field when they are <strong>20-25 days old</strong>.'
      ]
    },
    {
      stage: 'Vegetative Growth',
      duration: 'Day 30 - 60',
      type: 'leaf',
      details: [
        'Transplant seedlings at a spacing of <strong>20 x 15 cm</strong> with 2-3 seedlings per hill.',
        'Maintain a continuous shallow water depth of <strong>2-3 cm</strong> to suppress weeds.',
        'Apply the first top dressing of <strong>Urea</strong> at the active tillering stage (20 days after transplanting).',
        'Apply the second dose of Urea at the panicle initiation stage.'
      ]
    },
    {
      stage: 'Flowering & Fruiting',
      duration: 'Day 70 - 100',
      type: 'sun',
      details: [
        'Increase water depth to <strong>5 cm</strong> during flowering, as it is highly sensitive to water stress.',
        'Drain the water completely 10-15 days before harvesting to facilitate ripening.',
        'Avoid applying Nitrogen at this stage as it increases susceptibility to diseases.',
        'Ensure fields are protected from birds.'
      ]
    },
    {
      stage: 'Pest & Disease Management',
      duration: 'Critical',
      type: 'pest',
      details: [
        'For Stem Borer ("Dead Heart"), apply <strong>Cartap Hydrochloride 4G</strong> granules in standing water.',
        'For Brown Plant Hopper (BPH), spray <strong>Pymetrozine</strong> directed at the base of the plants.',
        'For Rice Blast (diamond-shaped leaf spots), spray <strong>Tricyclazole</strong> immediately.',
        'Maintain field sanitation by keeping bunds clean of weeds.'
      ]
    },
    {
      stage: 'Harvesting',
      duration: 'Day 120-150',
      type: 'wheat',
      details: [
        'Harvest when 80% of the panicles turn golden yellow and grains are hard.',
        'Harvesting moisture should be around <strong>20-22%</strong>.',
        'Thresh immediately after harvesting and dry the paddy to <strong>14% moisture</strong> for safe storage.',
        'Use combine harvesters for quick processing and to avoid weather risks.'
      ]
    }
  ],
  Sugarcane: [
    {
      stage: 'Land Preparation',
      duration: 'Pre-sowing',
      type: 'tractor',
      details: [
        'Perform deep ploughing up to <strong>40-50 cm</strong> using a chisel plough to break hardpans.',
        'Apply <strong>25 tonnes/ha</strong> of FYM or press mud.',
        'Prepare deep furrows spaced at <strong>90-120 cm</strong>.',
        'Ensure excellent drainage as sugarcane does not tolerate waterlogging in early stages.'
      ]
    },
    {
      stage: 'Sowing & Germination',
      duration: 'Day 0 - 45',
      type: 'sprout',
      details: [
        'Select healthy, 10-month-old seed canes (setts) with 2-3 buds each.',
        'Treat setts with <strong>Carbendazim</strong> for 15 minutes to prevent settling rot.',
        'Plant setts end-to-end in the furrows and cover with 2-3 cm of soil.',
        'Apply a light irrigation immediately after planting.'
      ]
    },
    {
      stage: 'Vegetative Growth',
      duration: 'Day 45 - 120',
      type: 'leaf',
      details: [
        'This is the grand growth phase. Ensure high soil moisture.',
        'Apply nitrogen fertilizers in 3-4 split doses to prevent leaching.',
        'Perform "earthing up" (mounding soil around the base) at 100 days to prevent lodging.',
        'Control weeds manually or use pre-emergence herbicides like <strong>Atrazine</strong>.'
      ]
    },
    {
      stage: 'Flowering & Fruiting',
      duration: 'Day 120 - 250',
      type: 'sun',
      details: [
        'Wrap and tie the tall canes together to protect them from high winds and lodging.',
        'Maintain steady irrigation; water stress reduces cane girth and sugar recovery.',
        'Remove dry lower leaves (trash mulching) to improve aeration and conserve moisture.',
        'Apply Potassium to enhance sugar accumulation.'
      ]
    },
    {
      stage: 'Pest & Disease Management',
      duration: 'Preventive',
      type: 'pest',
      details: [
        'For Early Shoot Borer, release <strong>Trichogramma chilonis</strong> egg parasitoids as biological control.',
        'For White Grubs, apply <strong>Phorate 10G</strong> granules to the soil.',
        'Watch for Red Rot (the "cancer of sugarcane"). Uproot and burn infected clumps immediately.',
        'Avoid ratooning (regrowing from roots) if the crop was heavily diseased.'
      ]
    },
    {
      stage: 'Harvesting',
      duration: '10 - 14 Months',
      type: 'wheat',
      details: [
        'Stop irrigation 15-20 days before harvest to improve sucrose concentration.',
        'Cut canes at the ground level to ensure the sugar-rich bottom internodes are harvested.',
        'Remove green tops and dry leaves immediately.',
        'Transport canes to the sugar mill within <strong>24 hours</strong> of harvesting to prevent weight and sugar loss.'
      ]
    }
  ],
  Maize: [
    {
      stage: 'Land Preparation',
      duration: 'Pre-sowing',
      type: 'tractor',
      details: [
        'Plough the land deeply to ensure good root penetration.',
        'Apply <strong>10-15 tonnes/ha</strong> of FYM and incorporate well.',
        'Prepare ridges and furrows; maize is highly sensitive to waterlogging.',
        'Apply a basal dose of NPK (typically 50% Nitrogen, 100% Phosphorus, 100% Potassium).'
      ]
    },
    {
      stage: 'Sowing & Germination',
      duration: 'Day 0 - 15',
      type: 'sprout',
      details: [
        'Treat seeds with <strong>Thiram</strong> to protect against soil-borne pathogens.',
        'Sow seeds on the side of ridges at a depth of <strong>3-5 cm</strong>.',
        'Maintain a spacing of <strong>60 x 20 cm</strong> for optimal plant population.',
        'Ensure adequate moisture for rapid and uniform germination.'
      ]
    },
    {
      stage: 'Vegetative Growth',
      duration: 'Day 16 - 45',
      type: 'leaf',
      details: [
        'Apply the first top dressing of Nitrogen at the knee-high stage (25-30 days).',
        'Weed the field 20 days after sowing. Apply <strong>Atrazine</strong> as a pre-emergence herbicide.',
        'Earthing up should be done simultaneously with the top dressing to support the stalks.',
        'Ensure no waterlogging occurs, as it can stunt growth permanently.'
      ]
    },
    {
      stage: 'Flowering & Fruiting',
      duration: 'Day 46 - 75',
      type: 'sun',
      details: [
        'Tasseling and Silking are the most critical stages for moisture. Do not allow water stress.',
        'Apply the final dose of Nitrogen just before tasseling.',
        'Ensure temperatures do not exceed 35°C excessively, which can dry the pollen.',
        'Monitor for proper cob development and grain filling.'
      ]
    },
    {
      stage: 'Pest & Disease Management',
      duration: 'Critical',
      type: 'pest',
      details: [
        'The Fall Armyworm (FAW) is highly destructive. Spray <strong>Spinetoram 11.7% SC</strong> or Emamectin Benzoate directly into the leaf whorls.',
        'For Stem Borer, apply <strong>Carbofuran 3G</strong> granules inside the leaf whorl at 20-25 days.',
        'For Turcicum Leaf Blight, spray <strong>Mancozeb</strong> at the first sign of cigar-shaped lesions.',
        'Use light traps to monitor moth populations.'
      ]
    },
    {
      stage: 'Harvesting',
      duration: 'Day 90 - 110',
      type: 'wheat',
      details: [
        'Harvest when the husks turn completely yellow and grains are hard.',
        'Check for the "black layer" formation at the base of the kernel, indicating physiological maturity.',
        'Sun-dry the cobs for a few days to reduce moisture to 15%.',
        'Shell the grains and store them in cool, dry conditions to prevent aflatoxin contamination.'
      ]
    }
  ]
};

const CultivationGuide = () => {
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [expandedStage, setExpandedStage] = useState(0);

  const getIcon = (type) => {
    switch(type) {
      case 'tractor': return <Tractor size={18} style={{ color: '#a3a8b4' }} />;
      case 'sprout': return <Sprout size={18} style={{ color: '#4ade80' }} />;
      case 'leaf': return <Leaf size={18} style={{ color: '#22c55e' }} />;
      case 'sun': return <Sun size={18} style={{ color: '#fbbf24' }} />;
      case 'pest': return <Bug size={18} style={{ color: '#ef4444' }} />;
      case 'wheat': return <Wheat size={18} style={{ color: '#f59e0b' }} />;
      default: return <CheckCircle size={18} style={{ color: 'var(--primary-light)' }} />;
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      
      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
        {crops.map(crop => (
          <button
            key={crop}
            onClick={() => { setSelectedCrop(crop); setExpandedStage(0); }}
            style={{
              background: selectedCrop === crop ? '#ffffff' : 'rgba(255,255,255,0.15)',
              color: selectedCrop === crop ? '#0f172a' : '#ffffff',
              border: '1px solid rgba(255,255,255,0.1)',
              whiteSpace: 'nowrap',
              padding: '10px 20px',
              borderRadius: '100px',
              fontSize: '0.95rem',
              fontWeight: selectedCrop === crop ? 600 : 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: selectedCrop === crop ? '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)' : 'none'
            }}
            onMouseOver={e => !selectedCrop === crop && (e.currentTarget.style.background = '#ffffff', e.currentTarget.style.color = '#0f172a')}
            onMouseOut={e => !selectedCrop === crop && (e.currentTarget.style.background = 'rgba(255,255,255,0.15)', e.currentTarget.style.color = '#ffffff')}
          >
            {crop}
          </button>
        ))}
      </div>

      <div>
        <h2 style={{ color: 'var(--accent)', marginBottom: '16px' }}>{selectedCrop} Lifecycle Guide</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {(CROP_GUIDE_DATA[selectedCrop] || CROP_GUIDE_DATA['Tomato']).map((item, index) => (
            <div key={index} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
              <div 
                onClick={() => setExpandedStage(expandedStage === index ? null : index)}
                style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: expandedStage === index ? 'rgba(255,255,255,0.05)' : 'transparent' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {getIcon(item.type)}
                  <div>
                    <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{item.stage}</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.duration}</span>
                  </div>
                </div>
                {expandedStage === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              
              {expandedStage === index && (
                <div style={{ padding: '20px', borderTop: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.3)', color: 'var(--text-muted)', lineHeight: '1.6' }} className="animate-fade-in">
                  <ul className="list-disc pl-5 space-y-2 m-0" style={{ marginLeft: '20px' }}>
                    {item.details.map((point, ptIndex) => (
                      <li key={ptIndex} dangerouslySetInnerHTML={{ __html: point }} style={{ marginBottom: '8px' }}></li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CultivationGuide;
