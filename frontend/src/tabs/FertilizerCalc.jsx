import React, { useState } from 'react';
import { Form, Select, Slider, InputNumber, Button, Alert, Tag } from 'antd';
import { CalculatorOutlined, CheckCircleOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Sprout, Scale, Sparkles, RefreshCw } from 'lucide-react';
import { AiLoadingState } from '../design-system/components/AiLoadingState.jsx';

/**
 * FertilizerCalc — Precision NPK Fertilizer Calculator.
 * Payload JSON is 100% byte-compatible with backend /api/predict/fertilizer:
 * { n, p, k, ph, soil_type, crop_type, farm_size }
 */
const FertilizerCalc = () => {
  const [formData, setFormData] = useState({
    farmSize: 1,
    soilType: 'Black',
    cropStage: 'Vegetative',
    n: 30,
    p: 30,
    k: 30,
    ph: 6.5,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const handleCalculate = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const payload = {
        n: parseFloat(formData.n),
        p: parseFloat(formData.p),
        k: parseFloat(formData.k),
        ph: parseFloat(formData.ph),
        soil_type: formData.soilType,
        crop_type: formData.cropStage,
        farm_size: parseFloat(formData.farmSize),
      };

      const response = await fetch(`${API_URL}/api/predict/fertilizer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Network error connecting to fertilizer API');
      const data = await response.json();

      setResult({
        name: data.recommended_fertilizer,
        urea: data.urea_kg,
        dap: data.dap_kg,
        mop: data.mop_kg,
        compost: data.compost_tonnes,
      });
    } catch (error) {
      console.error('API Error:', error);
      setErrorMessage(
        'Failed to connect to the fertilizer calculator service. If the server is sleeping on Render free tier, please wait 30 seconds and retry.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        padding: 'clamp(24px, 4vw, 40px)',
        boxShadow: '0 12px 36px rgba(14, 42, 18, 0.08)',
        border: '1px solid rgba(14, 42, 18, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '28px',
        width: '100%',
        maxWidth: '880px',
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div>
        <span className="eyebrow-tag" style={{ marginBottom: '12px' }}>
          Soil Chemistry & Nutrition
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
          Smart Fertilizer <span className="heading-accent">Calculator</span>
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '14.5px',
            color: 'var(--color-text-muted, #7C8B7E)',
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          Calculate balanced N-P-K nutrient requirements and organic compost based on soil tests, crop growth stage, and plot acreage.
        </p>
      </div>

      {errorMessage && (
        <Alert
          type="error"
          message={errorMessage}
          showIcon
          closable
          onClose={() => setErrorMessage(null)}
          style={{ borderRadius: '12px' }}
        />
      )}

      {/* Input Form */}
      <form onSubmit={handleCalculate} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        {/* Plot Details Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}
        >
          <div>
            <label
              style={{
                display: 'block',
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--color-forest-ink, #0E2A12)',
                marginBottom: '6px',
              }}
            >
              Farm Size (Acres)
            </label>
            <InputNumber
              min={0.1}
              step={0.1}
              value={formData.farmSize}
              onChange={(val) => setFormData({ ...formData, farmSize: val ?? 1 })}
              style={{ width: '100%', borderRadius: '12px', height: '44px' }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--color-forest-ink, #0E2A12)',
                marginBottom: '6px',
              }}
            >
              Soil Type
            </label>
            <Select
              value={formData.soilType}
              onChange={(val) => setFormData({ ...formData, soilType: val })}
              style={{ width: '100%', height: '44px' }}
              options={[
                { value: 'Black', label: 'Black Soil (Regur)' },
                { value: 'Red', label: 'Red Soil' },
                { value: 'Alluvial', label: 'Alluvial Soil' },
                { value: 'Clayey', label: 'Clayey Soil' },
                { value: 'Sandy', label: 'Sandy Soil' },
              ]}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--color-forest-ink, #0E2A12)',
                marginBottom: '6px',
              }}
            >
              Crop Growth Stage
            </label>
            <Select
              value={formData.cropStage}
              onChange={(val) => setFormData({ ...formData, cropStage: val })}
              style={{ width: '100%', height: '44px' }}
              options={[
                { value: 'Vegetative', label: 'Vegetative Growth' },
                { value: 'Sowing', label: 'Sowing / Basal' },
                { value: 'Flowering', label: 'Flowering / Tillering' },
                { value: 'Maturity', label: 'Ripening / Maturity' },
              ]}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--color-forest-ink, #0E2A12)',
                marginBottom: '6px',
              }}
            >
              Soil pH Level
            </label>
            <InputNumber
              min={4.0}
              max={9.0}
              step={0.1}
              value={formData.ph}
              onChange={(val) => setFormData({ ...formData, ph: val ?? 6.5 })}
              style={{ width: '100%', borderRadius: '12px', height: '44px' }}
            />
          </div>
        </div>

        {/* N-P-K Sliders */}
        <div
          style={{
            backgroundColor: '#F9FAF8',
            borderRadius: '18px',
            padding: '20px',
            border: '1px solid rgba(14, 42, 18, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {/* Nitrogen */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#0E2A12' }}>
                Nitrogen (N) Content
              </span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#2E6B34' }}>
                {formData.n} kg/ha
              </span>
            </div>
            <Slider
              min={0}
              max={100}
              value={formData.n}
              onChange={(val) => setFormData({ ...formData, n: val })}
              trackStyle={{ backgroundColor: '#2E6B34' }}
              handleStyle={{ borderColor: '#2E6B34' }}
            />
          </div>

          {/* Phosphorus */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#0E2A12' }}>
                Phosphorus (P) Content
              </span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#2E6B34' }}>
                {formData.p} kg/ha
              </span>
            </div>
            <Slider
              min={0}
              max={100}
              value={formData.p}
              onChange={(val) => setFormData({ ...formData, p: val })}
              trackStyle={{ backgroundColor: '#2E6B34' }}
              handleStyle={{ borderColor: '#2E6B34' }}
            />
          </div>

          {/* Potassium */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#0E2A12' }}>
                Potassium (K) Content
              </span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#2E6B34' }}>
                {formData.k} kg/ha
              </span>
            </div>
            <Slider
              min={0}
              max={100}
              value={formData.k}
              onChange={(val) => setFormData({ ...formData, k: val })}
              trackStyle={{ backgroundColor: '#2E6B34' }}
              handleStyle={{ borderColor: '#2E6B34' }}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            disabled={loading}
            icon={<CalculatorOutlined />}
            style={{
              borderRadius: '999px',
              backgroundColor: 'var(--color-cta-green, #2E6B34)',
              fontWeight: 600,
              padding: '0 32px',
              height: '46px',
              boxShadow: '0 4px 14px rgba(46, 107, 52, 0.3)',
            }}
          >
            {loading ? 'Computing Chemistry Model...' : 'Calculate Fertilizer Dosage'}
          </Button>
        </div>
      </form>

      {/* Loading State with Cold Start Detection */}
      {loading && (
        <AiLoadingState
          message="Computing precision NPK formulation..."
          subtext="Mapping soil chemistry, crop requirements, and plot acreage"
        />
      )}

      {/* Results Section: 4 Stat Cards + Confidence */}
      {result && !loading && (
        <div
          style={{
            backgroundColor: '#F9FAF8',
            padding: '24px',
            borderRadius: '20px',
            border: '1px solid rgba(46, 107, 52, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#7C8B7E', textTransform: 'uppercase' }}>
                Formulation Match
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#0E2A12',
                  margin: '2px 0 0 0',
                }}
              >
                Recommended: <span style={{ color: '#2E6B34' }}>{result.name}</span>
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Tag color="success" style={{ borderRadius: '999px', fontWeight: 600 }}>
                Balanced NPK Ratio
              </Tag>
              <span style={{ fontSize: '12.5px', color: '#5C6E5F' }}>
                For {formData.farmSize} Acres
              </span>
            </div>
          </div>

          {/* 4 Glass Stat Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '12px',
            }}
          >
            {/* Urea */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '16px',
                textAlign: 'center',
                boxShadow: '0 4px 16px rgba(14, 42, 18, 0.05)',
                border: '1px solid rgba(14, 42, 18, 0.06)',
              }}
            >
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#0E2A12' }}>
                {result.urea} <span style={{ fontSize: '14px', fontWeight: 500 }}>kg</span>
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#7C8B7E', marginTop: '4px' }}>
                Urea (46-0-0)
              </div>
            </div>

            {/* DAP */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '16px',
                textAlign: 'center',
                boxShadow: '0 4px 16px rgba(14, 42, 18, 0.05)',
                border: '1px solid rgba(14, 42, 18, 0.06)',
              }}
            >
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#0E2A12' }}>
                {result.dap} <span style={{ fontSize: '14px', fontWeight: 500 }}>kg</span>
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#7C8B7E', marginTop: '4px' }}>
                DAP (18-46-0)
              </div>
            </div>

            {/* MOP */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '16px',
                textAlign: 'center',
                boxShadow: '0 4px 16px rgba(14, 42, 18, 0.05)',
                border: '1px solid rgba(14, 42, 18, 0.06)',
              }}
            >
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#0E2A12' }}>
                {result.mop} <span style={{ fontSize: '14px', fontWeight: 500 }}>kg</span>
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#7C8B7E', marginTop: '4px' }}>
                MOP / Potash
              </div>
            </div>

            {/* Organic Compost */}
            <div
              style={{
                backgroundColor: 'rgba(46, 107, 52, 0.08)',
                borderRadius: '16px',
                padding: '16px',
                textAlign: 'center',
                border: '1px solid rgba(46, 107, 52, 0.2)',
              }}
            >
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#2E6B34' }}>
                {result.compost} <span style={{ fontSize: '14px', fontWeight: 500 }}>tons</span>
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#2E6B34', marginTop: '4px' }}>
                Organic Manure
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FertilizerCalc;
