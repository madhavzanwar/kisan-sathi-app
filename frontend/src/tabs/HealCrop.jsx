import React, { useState } from 'react';
import { Camera, Upload, AlertTriangle, CheckCircle, Leaf } from 'lucide-react';

const HealCrop = () => {
  const [step, setStep] = useState(1); // 1: Upload, 2: Scanning, 3: Result
  const [selectedImage, setSelectedImage] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setStep(2);
      
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(`${API_URL}/api/predict/disease`, {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        
        if (data.error) throw new Error(data.error);
        
        setDiagnosis(data);
        setStep(3);
      } catch (error) {
        console.error("API Error", error);
        alert("Failed to connect to the backend. Ensure uvicorn is running on port 8000.");
        setStep(1);
      }
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px', width: '100%', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 24px 48px -12px rgba(0,0,0,0.5)', borderRadius: '24px' }}>
      
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 600, color: '#fff', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>Identify Crop Issues</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '0.95rem' }}>Upload a clear, well-lit photo of the affected leaf.</p>
      </div>
      
      {/* 3-Step Indicator */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ textAlign: 'center', opacity: step >= 1 ? 1 : 0.5 }}>
          <div style={{ background: step >= 1 ? '#059669' : 'transparent', border: step >= 1 ? 'none' : '1px solid rgba(255,255,255,0.2)', color: step >= 1 ? '#fff' : 'rgba(255,255,255,0.5)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px auto', fontWeight: 600 }}>1</div>
          <span style={{ fontSize: '0.8rem', color: step >= 1 ? '#fff' : 'rgba(255,255,255,0.5)' }}>Take Photo</span>
        </div>
        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.2)', margin: '0 16px' }}></div>
        <div style={{ textAlign: 'center', opacity: step >= 2 ? 1 : 0.5 }}>
          <div style={{ background: step >= 2 ? '#059669' : 'transparent', border: step >= 2 ? 'none' : '1px solid rgba(255,255,255,0.2)', color: step >= 2 ? '#fff' : 'rgba(255,255,255,0.5)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px auto', fontWeight: 600 }}>2</div>
          <span style={{ fontSize: '0.8rem', color: step >= 2 ? '#fff' : 'rgba(255,255,255,0.5)' }}>Diagnosis</span>
        </div>
        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.2)', margin: '0 16px' }}></div>
        <div style={{ textAlign: 'center', opacity: step >= 3 ? 1 : 0.5 }}>
          <div style={{ background: step >= 3 ? '#059669' : 'transparent', border: step >= 3 ? 'none' : '1px solid rgba(255,255,255,0.2)', color: step >= 3 ? '#fff' : 'rgba(255,255,255,0.5)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px auto', fontWeight: 600 }}>3</div>
          <span style={{ fontSize: '0.8rem', color: step >= 3 ? '#fff' : 'rgba(255,255,255,0.5)' }}>Treatment</span>
        </div>
      </div>

      {step === 1 && (
        <div className="animate-fade-in" style={{ border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '20px', padding: '64px 24px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.05)'} onMouseOut={e => e.currentTarget.style.background='rgba(255,255,255,0.02)'}>
          <Camera size={48} strokeWidth={1.5} style={{ color: 'rgba(255,255,255,0.8)', margin: '0 auto 16px auto' }} />
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 500 }}>Click or drag photo here</h3>
          <p style={{ color: 'rgba(255,255,255,0.4)', margin: '0 0 32px 0', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Supports JPG, PNG</p>
          
          <label style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff', color: '#0f172a', padding: '14px 28px', borderRadius: '12px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform='translateY(-1px)'} onMouseOut={e => e.currentTarget.style.transform='translateY(0)'}>
            Select Image
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
          </label>
        </div>
      )}

      {step === 2 && (
        <div className="animate-fade-in" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto 24px auto', borderRadius: '16px', overflow: 'hidden' }}>
            <img src={selectedImage} alt="Scanning" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            {/* Scanning Line Animation */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'var(--accent)', boxShadow: '0 0 10px var(--accent)', animation: 'scan 2s infinite linear' }}></div>
          </div>
          <h3>AI is analyzing your crop...</h3>
          <p style={{ color: 'var(--text-muted)' }}>Identifying diseases and nutrient deficiencies.</p>
          <style>{`
            @keyframes scan {
              0% { top: 0; }
              50% { top: 100%; }
              100% { top: 0; }
            }
          `}</style>
        </div>
      )}

      {step === 3 && diagnosis && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <img src={selectedImage} alt="Crop" style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }} />
            <div>
              <h2 style={{ color: '#ff6b6b' }}>{diagnosis.disease_name}</h2>
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>{diagnosis.confidence}% Match</span>
                <span style={{ background: 'rgba(255,107,107,0.2)', color: '#ff6b6b', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>Severity: {diagnosis.severity}</span>
              </div>
            </div>
          </div>

          <hr style={{ borderColor: 'var(--glass-border)' }} />

          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff9f43', marginBottom: '8px' }}><AlertTriangle size={18} /> Chemical Treatment</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>{diagnosis.chemical_treatment}</p>
          </div>

          <div style={{ background: 'rgba(45,106,79,0.2)', padding: '16px', borderRadius: '12px' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', marginBottom: '8px' }}><Leaf size={18} /> Organic/Bio Alternative</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>{diagnosis.organic_treatment}</p>
          </div>
          
          <button className="glass-button" onClick={() => setStep(1)} style={{ marginTop: '16px' }}>Scan Another Plant</button>
        </div>
      )}
    </div>
  );
};

export default HealCrop;
