import React, { useState, useEffect } from 'react';
import { Upload, Steps, Progress, Tag, Alert, Button } from 'antd';
import { CameraOutlined, CheckCircleOutlined, SyncOutlined, ExperimentOutlined } from '@ant-design/icons';
import { Leaf, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';
import { AiLoadingState } from '../design-system/components/AiLoadingState.jsx';

const { Dragger } = Upload;

/**
 * HealCrop — Leaf disease diagnosis tool.
 * Powered by PyTorch ResNet18 across 38 PlantVillage disease classes.
 * Payload: Multipart FormData with key 'file'.
 */
const HealCrop = () => {
  const [step, setStep] = useState(1); // 1: Upload, 2: Scanning, 3: Result
  const [selectedImage, setSelectedImage] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    return () => {
      if (selectedImage && selectedImage.startsWith('blob:')) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [selectedImage]);

  const executeUpload = async (file) => {
    if (!file) return;

    if (selectedImage && selectedImage.startsWith('blob:')) {
      URL.revokeObjectURL(selectedImage);
    }

    setSelectedImage(URL.createObjectURL(file));
    setStep(2);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_URL}/api/predict/disease`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();

      if (data.error) throw new Error(data.error);

      setDiagnosis(data);
      setStep(3);
    } catch (error) {
      console.error('API Error:', error);
      setErrorMessage(
        'Failed to connect to backend diagnosis service. If the server is sleeping on Render free tier, please wait 30 seconds and retry.'
      );
      setStep(1);
    }
  };

  const handleNativeChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) executeUpload(file);
  };

  const handleReset = () => {
    setStep(1);
    setDiagnosis(null);
    setErrorMessage(null);
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
          AI Leaf Pathology
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
          Heal Your <span className="heading-accent">Crop</span>
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
          Upload a clear, well-lit photo of the affected crop leaf to detect disease pathogens and generate scientific treatment plans.
        </p>
      </div>

      {/* 3-Step Indicator */}
      <Steps
        current={step - 1}
        items={[
          { title: 'Upload Leaf Photo' },
          { title: 'Neural Analysis' },
          { title: 'Treatment Plan' },
        ]}
        style={{ marginBottom: '8px' }}
      />

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

      {/* Step 1: Upload Dragger */}
      {step === 1 && (
        <div>
          <Dragger
            accept="image/*"
            showUploadList={false}
            beforeUpload={(file) => {
              executeUpload(file);
              return false; // Prevent automatic antd HTTP post
            }}
            style={{
              padding: '36px 20px',
              backgroundColor: '#F9FAF8',
              borderRadius: '20px',
              border: '2px dashed rgba(46, 107, 52, 0.25)',
              transition: 'all 0.2s ease',
            }}
          >
            <p className="ant-upload-drag-icon" style={{ marginBottom: '16px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(46, 107, 52, 0.08)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                }}
              >
                <CameraOutlined style={{ fontSize: '28px', color: '#2E6B34' }} />
              </div>
            </p>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '17px',
                fontWeight: 600,
                color: '#0E2A12',
                marginBottom: '6px',
              }}
            >
              Click or drag a leaf photograph here
            </p>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                color: '#7C8B7E',
                marginBottom: '20px',
              }}
            >
              Supports JPG, PNG, WEBP • Max file size 10MB
            </p>

            <Button
              type="primary"
              size="large"
              style={{
                borderRadius: '999px',
                backgroundColor: 'var(--color-cta-green, #2E6B34)',
                fontWeight: 600,
                padding: '0 28px',
                height: '44px',
              }}
            >
              Browse Files
            </Button>
          </Dragger>

          {/* Hidden native input for testing flexibility */}
          <input
            type="file"
            id="native-leaf-file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleNativeChange}
          />
        </div>
      )}

      {/* Step 2: Scanning & Cold Start Feedback */}
      {step === 2 && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          {selectedImage && (
            <div
              style={{
                position: 'relative',
                width: '180px',
                height: '180px',
                margin: '0 auto 24px auto',
                borderRadius: '18px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
              }}
            >
              <img
                src={selectedImage}
                alt="Uploaded crop leaf"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '4px',
                  backgroundColor: 'var(--color-lime-accent, #D5F145)',
                  boxShadow: '0 0 12px #D5F145',
                  animation: 'scan 2s infinite linear',
                }}
              />
            </div>
          )}

          <AiLoadingState
            message="PyTorch ResNet18 is analyzing leaf pathology..."
            subtext="Evaluating 38 disease categories and nutritional deficiencies"
          />

          <style>{`
            @keyframes scan {
              0% { top: 0; }
              50% { top: 100%; }
              100% { top: 0; }
            }
          `}</style>
        </div>
      )}

      {/* Step 3: Diagnosis & Treatment Results */}
      {step === 3 && diagnosis && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Main Diagnosis Banner */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              padding: '20px',
              backgroundColor: '#F9FAF8',
              borderRadius: '18px',
              border: '1px solid rgba(14, 42, 18, 0.08)',
              flexWrap: 'wrap',
            }}
          >
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Diagnosed leaf"
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '14px',
                  objectFit: 'cover',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              />
            )}

            <div style={{ flex: 1, minWidth: '220px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <h3
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '22px',
                    fontWeight: 700,
                    color: '#0E2A12',
                    margin: 0,
                  }}
                >
                  {diagnosis.disease_name}
                </h3>
                <Tag
                  color={
                    diagnosis.severity === 'High'
                      ? 'error'
                      : diagnosis.severity === 'Moderate'
                      ? 'warning'
                      : 'success'
                  }
                  style={{ borderRadius: '999px', fontWeight: 600 }}
                >
                  Severity: {diagnosis.severity}
                </Tag>
              </div>

              <div style={{ maxWidth: '320px', marginTop: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#5C6E5F', marginBottom: '2px' }}>
                  <span>Diagnostic Match</span>
                  <span style={{ fontWeight: 600, color: '#0E2A12' }}>{diagnosis.confidence}%</span>
                </div>
                <Progress
                  percent={diagnosis.confidence}
                  showInfo={false}
                  strokeColor="#2E6B34"
                  size="small"
                />
              </div>
            </div>
          </div>

          {/* Treatment Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
            }}
          >
            {/* Chemical Treatment Card */}
            <div
              style={{
                backgroundColor: '#FFFBEB',
                border: '1px solid #FDE68A',
                borderRadius: '16px',
                padding: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#D97706', marginBottom: '10px' }}>
                <AlertTriangle size={18} />
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#B45309' }}>
                  Chemical Treatment
                </h4>
              </div>
              <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.6, color: '#78350F' }}>
                {diagnosis.chemical_treatment}
              </p>
            </div>

            {/* Organic Alternative Card */}
            <div
              style={{
                backgroundColor: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: '16px',
                padding: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16A34A', marginBottom: '10px' }}>
                <Leaf size={18} />
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#15803D' }}>
                  Organic / Bio Alternative
                </h4>
              </div>
              <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.6, color: '#14532D' }}>
                {diagnosis.organic_treatment}
              </p>
            </div>
          </div>

          {/* Re-Scan Action Button */}
          <div style={{ marginTop: '8px', textAlign: 'center' }}>
            <Button
              type="default"
              size="large"
              icon={<RefreshCw size={15} />}
              onClick={handleReset}
              style={{
                borderRadius: '999px',
                fontWeight: 600,
                color: '#0E2A12',
                borderColor: 'rgba(14, 42, 18, 0.2)',
                padding: '0 28px',
                height: '44px',
              }}
            >
              Scan Another Leaf
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealCrop;
