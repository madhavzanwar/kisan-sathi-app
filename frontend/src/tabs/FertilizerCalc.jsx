import React, { useState } from 'react';
import { Select, Slider, InputNumber, Button, Alert, Tag } from 'antd';
import { CalculatorOutlined } from '@ant-design/icons';
import { AiLoadingState } from '../design-system/components/AiLoadingState.jsx';
import { useLang } from '../i18n';

/**
 * FertilizerCalc — Precision NPK Fertilizer Calculator.
 * Payload JSON is 100% byte-compatible with backend /api/predict/fertilizer:
 * { n, p, k, ph, soil_type, crop_type, farm_size }
 */
const FertilizerCalc = () => {
  const { t } = useLang();
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

    const farmSizeNum = parseFloat(formData.farmSize);
    const nNum = parseFloat(formData.n);
    const pNum = parseFloat(formData.p);
    const kNum = parseFloat(formData.k);
    const phNum = parseFloat(formData.ph);

    if (isNaN(farmSizeNum) || farmSizeNum <= 0) {
      setErrorMessage(t('fertilizer.errors.invalidFarmSize', 'Please enter a valid farm size greater than 0 acres.'));
      return;
    }

    if (isNaN(phNum) || phNum < 3.0 || phNum > 10.0) {
      setErrorMessage(t('fertilizer.errors.invalidPh', 'Please enter a valid soil pH level between 3.0 and 10.0.'));
      return;
    }

    if (isNaN(nNum) || isNaN(pNum) || isNaN(kNum) || nNum < 0 || pNum < 0 || kNum < 0) {
      setErrorMessage(t('fertilizer.errors.invalidNpk', 'Please ensure Nitrogen, Phosphorus, and Potassium values are non-negative numbers.'));
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const payload = {
        n: nNum,
        p: pNum,
        k: kNum,
        ph: phNum,
        soil_type: formData.soilType,
        crop_type: formData.cropStage,
        farm_size: farmSizeNum,
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
        t('fertilizer.errors.apiError', 'Failed to connect to the fertilizer calculator service. If the server is sleeping on Render free tier, please wait 30 seconds and retry.')
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
          {t('fertilizer.eyebrow', 'Soil Chemistry & Nutrition')}
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
          {t('fertilizer.title', 'Smart Fertilizer')}{' '}
          <span className="heading-accent">{t('fertilizer.titleAccent', 'Calculator')}</span>
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
          {t('fertilizer.description', 'Calculate balanced N-P-K nutrient requirements and organic compost based on soil tests, crop growth stage, and plot acreage.')}
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
      <form onSubmit={handleCalculate} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
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
              {t('fertilizer.form.farmSize', 'Farm Size (Acres)')}
            </label>
            <InputNumber
              id="farm-size-input"
              aria-label={t('fertilizer.form.farmSizeAria', 'Farm Size in Acres')}
              min={0.1}
              step={0.1}
              value={formData.farmSize}
              onChange={(val) => setFormData({ ...formData, farmSize: val })}
              style={{ width: '100%', borderRadius: '12px', height: '44px' }}
            />
          </div>

          <div>
            <label
              htmlFor="soil-type-select"
              style={{
                display: 'block',
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--color-forest-ink, #0E2A12)',
                marginBottom: '6px',
              }}
            >
              {t('fertilizer.form.soilType', 'Soil Type')}
            </label>
            <Select
              id="soil-type-select"
              aria-label={t('fertilizer.form.soilTypeAria', 'Soil Type')}
              value={formData.soilType}
              onChange={(val) => setFormData({ ...formData, soilType: val })}
              style={{ width: '100%', height: '44px' }}
              options={[
                { value: 'Black', label: t('fertilizer.soil.black', 'Black Soil (Regur)') },
                { value: 'Red', label: t('fertilizer.soil.red', 'Red Soil') },
                { value: 'Alluvial', label: t('fertilizer.soil.alluvial', 'Alluvial Soil') },
                { value: 'Clayey', label: t('fertilizer.soil.clayey', 'Clayey Soil') },
                { value: 'Sandy', label: t('fertilizer.soil.sandy', 'Sandy Soil') },
              ]}
            />
          </div>

          <div>
            <label
              htmlFor="crop-stage-select"
              style={{
                display: 'block',
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--color-forest-ink, #0E2A12)',
                marginBottom: '6px',
              }}
            >
              {t('fertilizer.form.cropStage', 'Crop Growth Stage')}
            </label>
            <Select
              id="crop-stage-select"
              aria-label={t('fertilizer.form.cropStageAria', 'Crop Growth Stage')}
              value={formData.cropStage}
              onChange={(val) => setFormData({ ...formData, cropStage: val })}
              style={{ width: '100%', height: '44px' }}
              options={[
                { value: 'Vegetative', label: t('fertilizer.stage.vegetative', 'Vegetative Growth') },
                { value: 'Sowing', label: t('fertilizer.stage.sowing', 'Sowing / Basal') },
                { value: 'Flowering', label: t('fertilizer.stage.flowering', 'Flowering / Tillering') },
                { value: 'Maturity', label: t('fertilizer.stage.maturity', 'Ripening / Maturity') },
              ]}
            />
          </div>

          <div>
            <label
              htmlFor="soil-ph-input"
              style={{
                display: 'block',
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--color-forest-ink, #0E2A12)',
                marginBottom: '6px',
              }}
            >
              {t('fertilizer.form.phLevel', 'Soil pH Level')}
            </label>
            <InputNumber
              id="soil-ph-input"
              aria-label={t('fertilizer.form.phLevelAria', 'Soil pH Level')}
              min={4.0}
              max={9.0}
              step={0.1}
              value={formData.ph}
              onChange={(val) => setFormData({ ...formData, ph: val })}
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
                {t('fertilizer.form.nitrogen', 'Nitrogen (N) Content')}
              </span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#2E6B34' }}>
                {formData.n} {t('fertilizer.form.kgHaUnit', 'kg/ha')}
              </span>
            </div>
            <Slider
              aria-label={t('fertilizer.form.nitrogenAria', 'Nitrogen (N) Content in kg per hectare')}
              min={0}
              max={100}
              value={formData.n}
              onChange={(val) => setFormData({ ...formData, n: val })}
              handleRender={(originNode) =>
                React.cloneElement(originNode, {
                  'aria-label': t('fertilizer.form.nitrogenAria', 'Nitrogen (N) Content in kg per hectare'),
                  title: t('fertilizer.form.nitrogenAria', 'Nitrogen (N) Content in kg per hectare'),
                })
              }
              trackStyle={{ backgroundColor: '#2E6B34' }}
              handleStyle={{ borderColor: '#2E6B34' }}
            />
          </div>

          {/* Phosphorus */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#0E2A12' }}>
                {t('fertilizer.form.phosphorus', 'Phosphorus (P) Content')}
              </span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#2E6B34' }}>
                {formData.p} {t('fertilizer.form.kgHaUnit', 'kg/ha')}
              </span>
            </div>
            <Slider
              aria-label={t('fertilizer.form.phosphorusAria', 'Phosphorus (P) Content in kg per hectare')}
              min={0}
              max={100}
              value={formData.p}
              onChange={(val) => setFormData({ ...formData, p: val })}
              handleRender={(originNode) =>
                React.cloneElement(originNode, {
                  'aria-label': t('fertilizer.form.phosphorusAria', 'Phosphorus (P) Content in kg per hectare'),
                  title: t('fertilizer.form.phosphorusAria', 'Phosphorus (P) Content in kg per hectare'),
                })
              }
              trackStyle={{ backgroundColor: '#2E6B34' }}
              handleStyle={{ borderColor: '#2E6B34' }}
            />
          </div>

          {/* Potassium */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#0E2A12' }}>
                {t('fertilizer.form.potassium', 'Potassium (K) Content')}
              </span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#2E6B34' }}>
                {formData.k} {t('fertilizer.form.kgHaUnit', 'kg/ha')}
              </span>
            </div>
            <Slider
              aria-label={t('fertilizer.form.potassiumAria', 'Potassium (K) Content in kg per hectare')}
              min={0}
              max={100}
              value={formData.k}
              onChange={(val) => setFormData({ ...formData, k: val })}
              handleRender={(originNode) =>
                React.cloneElement(originNode, {
                  'aria-label': t('fertilizer.form.potassiumAria', 'Potassium (K) Content in kg per hectare'),
                  title: t('fertilizer.form.potassiumAria', 'Potassium (K) Content in kg per hectare'),
                })
              }
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
            onClick={handleCalculate}
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
            {loading ? t('fertilizer.form.calculatingBtn', 'Computing Chemistry Model...') : t('fertilizer.form.calculateBtn', 'Calculate Fertilizer Dosage')}
          </Button>
        </div>
      </form>

      {/* Loading State with Cold Start Detection */}
      {loading && (
        <AiLoadingState
          message={t('fertilizer.loading.message', 'Computing precision NPK formulation...')}
          subtext={t('fertilizer.loading.subtext', 'Mapping soil chemistry, crop requirements, and plot acreage')}
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
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#5C6E5F', textTransform: 'uppercase' }}>
                {t('fertilizer.results.formulationMatch', 'Formulation Match')}
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
                {t('fertilizer.results.recommended', 'Recommended:')} <span style={{ color: '#2E6B34' }}>{result.name}</span>
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Tag color="success" style={{ borderRadius: '999px', fontWeight: 600 }}>
                {t('fertilizer.results.balancedRatio', 'Balanced NPK Ratio')}
              </Tag>
              <span style={{ fontSize: '12.5px', color: '#5C6E5F' }}>
                {t('fertilizer.results.forAcreage', { count: formData.farmSize, defaultValue: `For ${formData.farmSize} Acres` })}
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
                {result.urea} <span style={{ fontSize: '14px', fontWeight: 500 }}>{t('fertilizer.results.kgUnit', 'kg')}</span>
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#5C6E5F', marginTop: '4px' }}>
                {t('fertilizer.results.ureaLabel', 'Urea (46-0-0)')}
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
                {result.dap} <span style={{ fontSize: '14px', fontWeight: 500 }}>{t('fertilizer.results.kgUnit', 'kg')}</span>
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#5C6E5F', marginTop: '4px' }}>
                {t('fertilizer.results.dapLabel', 'DAP (18-46-0)')}
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
                {result.mop} <span style={{ fontSize: '14px', fontWeight: 500 }}>{t('fertilizer.results.kgUnit', 'kg')}</span>
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#5C6E5F', marginTop: '4px' }}>
                {t('fertilizer.results.mopLabel', 'MOP / Potash')}
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
                {result.compost} <span style={{ fontSize: '14px', fontWeight: 500 }}>{t('fertilizer.results.tonsUnit', 'tons')}</span>
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#2E6B34', marginTop: '4px' }}>
                {t('fertilizer.results.compostLabel', 'Organic Manure')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FertilizerCalc;
