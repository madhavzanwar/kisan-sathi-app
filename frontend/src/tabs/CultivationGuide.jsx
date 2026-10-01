import React, { useState } from 'react';
import { Tag, Timeline, Button } from 'antd';
import { ClockCircleOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { CheckCircle, Bug, Tractor, Sprout, Leaf, Sun, Wheat } from 'lucide-react';

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
  const [expandedStages, setExpandedStages] = useState({ 0: true, 1: true });

  const cropEmojis = {
    Tomato: '🍅',
    Cotton: '☁️',
    Wheat: '🌾',
    Rice: '🍚',
    Sugarcane: '🎋',
    Maize: '🌽',
  };

  const getIcon = (type) => {
    switch (type) {
      case 'tractor':
        return <Tractor size={18} style={{ color: '#2E6B34' }} />;
      case 'sprout':
        return <Sprout size={18} style={{ color: '#2E6B34' }} />;
      case 'leaf':
        return <Leaf size={18} style={{ color: '#15803d' }} />;
      case 'sun':
        return <Sun size={18} style={{ color: '#d97706' }} />;
      case 'pest':
        return <Bug size={18} style={{ color: '#dc2626' }} />;
      case 'wheat':
        return <Wheat size={18} style={{ color: '#d97706' }} />;
      default:
        return <CheckCircle size={18} style={{ color: '#2E6B34' }} />;
    }
  };

  const toggleStage = (idx) => {
    setExpandedStages((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const stages = CROP_GUIDE_DATA[selectedCrop] || CROP_GUIDE_DATA['Tomato'];

  const toggleAll = () => {
    const allExpanded = stages.every((_, i) => expandedStages[i]);
    const newState = {};
    stages.forEach((_, i) => {
      newState[i] = !allExpanded;
    });
    setExpandedStages(newState);
  };

  const allAreExpanded = stages.every((_, i) => expandedStages[i]);

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        padding: 'clamp(20px, 4vw, 36px)',
        boxShadow: '0 10px 30px rgba(14, 42, 18, 0.04)',
        border: '1px solid rgba(14, 42, 18, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '100%',
        maxWidth: '1000px',
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div>
        <span className="eyebrow-tag" style={{ marginBottom: '12px' }}>
          Agronomic Protocols
        </span>
        <h2
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(24px, 3vw, 32px)',
            fontWeight: 700,
            color: 'var(--color-forest-ink, #0E2A12)',
            margin: '0 0 8px 0',
            letterSpacing: '-0.02em',
          }}
        >
          Cultivation <span className="heading-accent">Guides</span>
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '14.5px',
            color: 'var(--color-text-muted, #5C6E5F)',
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          Standardized crop lifecycle manuals, field operations, irrigation schedules, and integrated pest management recommendations.
        </p>
      </div>

      {/* Crop Selector Chips */}
      <div>
        <label
          style={{
            display: 'block',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: 700,
            color: '#5C6E5F',
            marginBottom: '10px',
          }}
        >
          Select Crop
        </label>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            alignItems: 'center',
          }}
        >
          {crops.map((crop) => {
            const isSelected = selectedCrop === crop;
            return (
              <button
                key={crop}
                type="button"
                onClick={() => {
                  setSelectedCrop(crop);
                  setExpandedStages({ 0: true, 1: true });
                }}
                style={{
                  minHeight: '44px',
                  padding: '8px 20px',
                  borderRadius: '999px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '14px',
                  fontWeight: isSelected ? 600 : 500,
                  cursor: 'pointer',
                  border: isSelected ? '1px solid #2E6B34' : '1px solid rgba(14, 42, 18, 0.12)',
                  backgroundColor: isSelected ? '#2E6B34' : '#F9FAF8',
                  color: isSelected ? '#FFFFFF' : '#0E2A12',
                  transition: 'all 0.2s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: isSelected ? '0 4px 12px rgba(46, 107, 52, 0.18)' : 'none',
                }}
              >
                <span>{cropEmojis[crop] || '🌱'}</span>
                <span>{crop}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Crop Summary Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          padding: '16px 20px',
          backgroundColor: '#F9FAF8',
          borderRadius: '16px',
          border: '1px solid rgba(14, 42, 18, 0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>{cropEmojis[selectedCrop] || '🌱'}</span>
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '16px',
                fontWeight: 700,
                color: '#0E2A12',
                margin: 0,
              }}
            >
              {selectedCrop} Complete Lifecycle
            </h3>
            <span style={{ fontSize: '13px', color: '#5C6E5F' }}>
              {stages.length} comprehensive agronomic stages from land preparation to harvest
            </span>
          </div>
        </div>

        <Button
          type="default"
          size="small"
          onClick={toggleAll}
          style={{
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: 600,
            color: '#2E6B34',
            borderColor: 'rgba(46, 107, 52, 0.3)',
          }}
        >
          {allAreExpanded ? 'Collapse All' : 'Expand All'}
        </Button>
      </div>

      {/* Ant Design Timeline of Stages */}
      <div style={{ marginTop: '8px', paddingLeft: '8px' }}>
        <Timeline
          items={stages.map((item, index) => {
            const isExpanded = !!expandedStages[index];
            return {
              dot: (
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    border: '2px solid #2E6B34',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(46, 107, 52, 0.15)',
                    marginTop: '-2px',
                  }}
                >
                  {getIcon(item.type)}
                </div>
              ),
              children: (
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid rgba(14, 42, 18, 0.08)',
                    boxShadow: '0 2px 10px rgba(14, 42, 18, 0.03)',
                    overflow: 'hidden',
                    marginBottom: '22px',
                    marginLeft: '8px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {/* Stage Card Header */}
                  <div
                    onClick={() => toggleStage(index)}
                    style={{
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      backgroundColor: isExpanded ? 'rgba(46, 107, 52, 0.03)' : '#FFFFFF',
                      userSelect: 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <Tag
                        style={{
                          borderRadius: '999px',
                          padding: '2px 10px',
                          fontSize: '11px',
                          fontWeight: 700,
                          backgroundColor: 'rgba(46, 107, 52, 0.08)',
                          color: '#2E6B34',
                          border: 'none',
                        }}
                      >
                        STAGE {String(index + 1).padStart(2, '0')}
                      </Tag>
                      <h4
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: '16px',
                          fontWeight: 700,
                          color: '#0E2A12',
                          margin: 0,
                        }}
                      >
                        {item.stage}
                      </h4>
                      <Tag
                        icon={<ClockCircleOutlined />}
                        style={{
                          borderRadius: '999px',
                          fontSize: '12px',
                          color: '#5C6E5F',
                          backgroundColor: '#F4F5F3',
                          border: 'none',
                        }}
                      >
                        {item.duration}
                      </Tag>
                    </div>

                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#F4F5F3',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#2E6B34',
                        transition: 'transform 0.2s ease',
                      }}
                    >
                      {isExpanded ? <UpOutlined style={{ fontSize: '12px' }} /> : <DownOutlined style={{ fontSize: '12px' }} />}
                    </div>
                  </div>

                  {/* Stage Card Details */}
                  {isExpanded && (
                    <div
                      style={{
                        padding: '18px 20px',
                        borderTop: '1px solid rgba(14, 42, 18, 0.06)',
                        backgroundColor: '#FFFFFF',
                      }}
                    >
                      <ul
                        style={{
                          listStyle: 'none',
                          padding: 0,
                          margin: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                        }}
                      >
                        {item.details.map((point, ptIndex) => (
                          <li
                            key={ptIndex}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '10px',
                              fontSize: '14px',
                              lineHeight: '1.6',
                              color: '#334155',
                            }}
                          >
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                backgroundColor: 'rgba(46, 107, 52, 0.1)',
                                color: '#2E6B34',
                                flexShrink: 0,
                                marginTop: '2px',
                                fontSize: '11px',
                                fontWeight: 700,
                              }}
                            >
                              ✓
                            </span>
                            <span
                              dangerouslySetInnerHTML={{ __html: point }}
                              style={{ flex: 1 }}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ),
            };
          })}
        />
      </div>
    </div>
  );
};

export default CultivationGuide;

