import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

const FertilizerCalc = () => {
  const [formData, setFormData] = useState({
    farmSize: 1,
    soilType: 'Black',
    cropStage: 'Vegetative',
    n: 30,
    p: 30,
    k: 30,
    ph: 6.5
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/api/predict/fertilizer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          n: parseFloat(formData.n),
          p: parseFloat(formData.p),
          k: parseFloat(formData.k),
          ph: parseFloat(formData.ph),
          soil_type: formData.soilType,
          crop_type: formData.cropStage,
          farm_size: parseFloat(formData.farmSize)
        })
      });
      
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      
      setResult({
        name: data.recommended_fertilizer,
        urea: data.urea_kg,
        dap: data.dap_kg,
        mop: data.mop_kg,
        compost: data.compost_tonnes
      });
    } catch (error) {
      console.error("API Error", error);
      alert("Failed to connect to the backend. Ensure uvicorn is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <h2 style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Calculator size={24} /> Nutrient Calculator
      </h2>

      <form onSubmit={handleCalculate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Farm Size (Acres)</label>
            <input 
              type="number" 
              className="glass-input" 
              value={formData.farmSize} 
              onChange={e => setFormData({...formData, farmSize: e.target.value})} 
              min="0.1" step="0.1" 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Soil Type</label>
            <select className="glass-input" value={formData.soilType} onChange={e => setFormData({...formData, soilType: e.target.value})} style={{ appearance: 'none' }}>
              <option value="Black">Black Soil</option>
              <option value="Red">Red Soil</option>
              <option value="Alluvial">Alluvial Soil</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Nitrogen (N) - {formData.n}</label>
          <input type="range" min="0" max="100" value={formData.n} onChange={e => setFormData({...formData, n: e.target.value})} style={{ width: '100%', accentColor: 'var(--primary)' }} />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Phosphorus (P) - {formData.p}</label>
          <input type="range" min="0" max="100" value={formData.p} onChange={e => setFormData({...formData, p: e.target.value})} style={{ width: '100%', accentColor: 'var(--primary)' }} />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Potassium (K) - {formData.k}</label>
          <input type="range" min="0" max="100" value={formData.k} onChange={e => setFormData({...formData, k: e.target.value})} style={{ width: '100%', accentColor: 'var(--primary)' }} />
        </div>

        <button type="submit" className="glass-button" style={{ marginTop: '8px' }} disabled={loading}>
          {loading ? 'Calculating...' : 'Calculate Dosage'}
        </button>
      </form>

      {result && (
        <div className="animate-fade-in" style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: '1px solid var(--primary-light)' }}>
          <h3 style={{ marginBottom: '8px' }}>Recommended Fertilizer: <span style={{color: 'var(--accent)'}}>{result.name}</span></h3>
          <p style={{ marginBottom: '16px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Required Dosage for {formData.farmSize} Acres:</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{result.urea} kg</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Urea</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{result.dap} kg</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>DAP</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{result.mop} kg</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>MOP / Potash</div>
            </div>
            <div style={{ background: 'var(--primary-dark)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent)' }}>{result.compost} tons</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>Organic Manure</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FertilizerCalc;
