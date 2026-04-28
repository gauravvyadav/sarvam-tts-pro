import React, { useState } from 'react';
import './Sidebar.css';
import logo from '@/assets/sarvamtts.png';

const CustomSelect = ({ 
  value, 
  options, 
  onChange, 
  isOpen, 
  setIsOpen, 
  label 
}: any) => {
  const selectedOption = options.find((o: any) => o.value === value);
  
  return (
    <div className={`custom-select-container ${isOpen ? 'open' : ''}`}>
      <div 
        className="custom-select-trigger" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="trigger-content">
          <span className="trigger-label">
            {selectedOption?.icon && <span className="opt-icon">{selectedOption.icon}</span>}
            {selectedOption?.label}
          </span>
          {selectedOption?.gender && <span className="gender-pill">{selectedOption.gender}</span>}
        </div>
        <div className="chevron"></div>
      </div>
      {isOpen && (
        <div className="custom-select-dropdown">
          {options.map((option: any) => (
            <div 
              key={option.value}
              className={`custom-option ${value === option.value ? 'selected' : ''}`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              <div className="option-main">
                <div className="option-header">
                  <span className="option-name">
                    {option.icon && <span className="opt-icon">{option.icon}</span>}
                    {option.label}
                  </span>
                  {option.gender && <span className="gender-pill">{option.gender}</span>}
                </div>
                {option.tags && (
                  <div className="option-tags">
                    {option.tags.join(' • ')}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar: React.FC = () => {
  const [text, setText] = useState('Sarvam AI मुफ़्त वॉइस टेस्टिंग की सुविधा देता है, लेकिन ऑडियो डाउनलोड करने का विकल्प नहीं मिलता। इसीलिए हमने यह एक्सटेंशन बनाया है जो API रिस्पॉन्स को MP3 में बदलकर आपको डाउनलोड करने की सुविधा देता है। अगर आपको उनकी सेवाएं और TTS मॉडल पसंद हैं, तो आप उनके API की प्राइसिंग चेक कर सकते हैं, आपको टॉप राइट कॉर्नर में API का बटन मिल जाएगा।');
  const [speaker, setSpeaker] = useState('shubh');
  const [model, setModel] = useState('bulbul:v3-beta');
  const [language, setLanguage] = useState('hi-IN');
  const [pace, setPace] = useState(1.1);
  const [temperature, setTemperature] = useState(0.6);
  const [loading, setLoading] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(true);
  const [speakerOpen, setSpeakerOpen] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);

  const contentRef = React.useRef<HTMLDivElement>(null);

  // Reset audio preview when any parameter changes
  const handleParamChange = (setter: any, value: any) => {
    setter(value);
    if (audioUrl) {
      window.URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
  };

  const speakers = [
    { value: 'shubh', label: 'Shubh', gender: 'Male', tags: ['Conversational', 'Friendly'], icon: '👨' },
    { value: 'shreya', label: 'Shreya', gender: 'Female', tags: ['News', 'Authoritative'], icon: '👩' },
    { value: 'manan', label: 'Manan', gender: 'Male', tags: ['Conversational', 'Consistent'], icon: '👨' },
    { value: 'ishita', label: 'Ishita', gender: 'Female', tags: ['Entertainment', 'Dynamic'], icon: '👩' },
  ];

  const models = [
    { value: 'bulbul:v3-beta', label: 'Bulbul v3 Beta' },
  ];

  const languages = [
    { value: 'hi-IN', label: 'Hindi' },
    { value: 'en-IN', label: 'English' },
    { value: 'bn-IN', label: 'Bengali' },
    { value: 'ta-IN', label: 'Tamil' },
    { value: 'te-IN', label: 'Telugu' },
    { value: 'kn-IN', label: 'Kannada' },
    { value: 'ml-IN', label: 'Malayalam' },
    { value: 'mr-IN', label: 'Marathi' },
    { value: 'gu-IN', label: 'Gujarati' },
    { value: 'pa-IN', label: 'Punjabi' },
    { value: 'or-IN', label: 'Odia' },
  ];

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('sarvam_tts_pro') === 'open') {
      setCollapsed(false);
      const newUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, '', newUrl);
    }

    const handleClickOutside = (event: MouseEvent) => {
      const path = event.composedPath();
      const isInside = path.some((el: any) => el.classList && el.classList.contains('custom-select-container'));
      
      if (!isInside) {
        setSpeakerOpen(false);
        setModelOpen(false);
        setLanguageOpen(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  React.useEffect(() => {
    const listener = (message: any) => {
      if (message.type === 'toggle-sidebar') {
        setCollapsed((prev) => !prev);
      }
    };
    browser.runtime.onMessage.addListener(listener);
    return () => browser.runtime.onMessage.removeListener(listener);
  }, []);

  const handlePreview = async () => {
    setPreviewing(true);
    setAudioUrl(null);
    try {
      const response = await fetch("https://www.sarvam.ai/api/playground/tts", {
        "headers": {
          "accept": "*/*",
          "content-type": "application/json",
        },
        "referrer": "https://www.sarvam.ai/apis/text-to-speech",
        "body": JSON.stringify({
          "text": text,
          "target_language_code": language,
          "speaker": speaker,
          "model": model,
          "pace": pace,
          "speech_sample_rate": 22050,
          "temperature": temperature,
          "enable_preprocessing": true,
          "output_audio_codec": "mp3"
        }),
        "method": "POST",
        "credentials": "include"
      });

      if (!response.ok) throw new Error("Network response was not ok");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setAudioUrl(url);

      // Smooth scroll to the audio player
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.scrollTo({
            top: contentRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      }, 100);
    } catch (err) {
      console.error("Error generating preview:", err);
      alert("Failed to generate preview. Check console for details.");
    } finally {
      setPreviewing(false);
    }
  };

  const handleDownload = async () => {
    // If we already have a preview for these exact settings, just download it
    if (audioUrl) {
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = audioUrl;
      a.download = `sarvam-${speaker}-${Date.now()}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://www.sarvam.ai/api/playground/tts", {
        "headers": {
          "accept": "*/*",
          "content-type": "application/json",
        },
        "referrer": "https://www.sarvam.ai/apis/text-to-speech",
        "body": JSON.stringify({
          "text": text,
          "target_language_code": language,
          "speaker": speaker,
          "model": model,
          "pace": pace,
          "speech_sample_rate": 22050,
          "temperature": temperature,
          "enable_preprocessing": true,
          "output_audio_codec": "mp3"
        }),
        "method": "POST",
        "credentials": "include"
      });

      if (!response.ok) throw new Error("Network response was not ok");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `sarvam-${speaker}-${Date.now()}.mp3`;
      document.body.appendChild(a);
      a.click();
      
      // Since this wasn't a preview, we can revoke it immediately
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Error downloading audio:", err);
      alert("Failed to download audio. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`sidebar-container ${collapsed ? 'collapsed' : ''}`}>
      <button 
        className="collapse-toggle" 
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? "Open Sidebar" : "Close Sidebar"}
      >
        {collapsed ? '←' : '→'}
      </button>

      <div className="header">
        <div className="header-main">
          <img src={logo} alt="Sarvam TTS" style={{ width: '32px', height: '32px', borderRadius: '6px' }} />
          <h1>Sarvam TTS Pro</h1>
        </div>
        <a href="https://www.sarvam.ai/api-pricing" target="_blank" rel="noopener noreferrer" className="api-badge">
          API
        </a>
      </div>

      <div className="content" ref={contentRef}>
        <div className="input-group">
          <label>Speech Text</label>
          <textarea 
            value={text} 
            onChange={(e) => handleParamChange(setText, e.target.value.slice(0, 2000))}
            placeholder="Type something (max 2000 characters)..."
            maxLength={2000}
          />
          <div className="char-counter">
            {text.length} / 2000
          </div>
        </div>

        <div className="input-group">
          <label>Language</label>
          <CustomSelect 
            value={language}
            options={languages}
            onChange={(val: string) => handleParamChange(setLanguage, val)}
            isOpen={languageOpen}
            setIsOpen={(val: boolean) => {
              setLanguageOpen(val);
              if (val) {
                setSpeakerOpen(false);
                setModelOpen(false);
              }
            }}
          />
        </div>

        <div className="input-group">
          <label>Speaker</label>
          <CustomSelect 
            value={speaker}
            options={speakers}
            onChange={(val: string) => handleParamChange(setSpeaker, val)}
            isOpen={speakerOpen}
            setIsOpen={(val: boolean) => {
              setSpeakerOpen(val);
              if (val) {
                setModelOpen(false);
                setLanguageOpen(false);
              }
            }}
          />
        </div>

        <div className="input-group">
          <label>Model</label>
          <CustomSelect 
            value={model}
            options={models}
            onChange={(val: string) => handleParamChange(setModel, val)}
            isOpen={modelOpen}
            setIsOpen={(val: boolean) => {
              setModelOpen(val);
              if (val) setSpeakerOpen(false);
            }}
          />
        </div>

        <div className="slider-container">
          <div className="slider-header">
            <label>Pace</label>
            <span className="slider-value">{pace}x</span>
          </div>
          <input 
            type="range" 
            min="0.5" 
            max="2.0" 
            step="0.1" 
            value={pace} 
            onChange={(e) => handleParamChange(setPace, parseFloat(e.target.value))}
          />
        </div>

        <div className="slider-container">
          <div className="slider-header">
            <label>Temperature</label>
            <span className="slider-value">{temperature}</span>
          </div>
          <input 
            type="range" 
            min="0.0" 
            max="1.0" 
            step="0.1" 
            value={temperature} 
            onChange={(e) => handleParamChange(setTemperature, parseFloat(e.target.value))}
          />
        </div>

        {audioUrl && (
          <div className="audio-player-container">
            <audio controls src={audioUrl} className="custom-audio-player">
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

      </div>

      <div className="footer-actions">
        <button 
          className="preview-btn" 
          onClick={handlePreview} 
          disabled={loading || previewing || !text.trim()}
        >
          {previewing ? (
            <>
              <div className="spinner indigo"></div>
              Loading...
            </>
          ) : (
            <>
              Preview
            </>
          )}
        </button>

        <button 
          className="download-btn" 
          onClick={handleDownload} 
          disabled={loading || previewing || !text.trim()}
        >
          {loading ? (
            <>
              <div className="spinner"></div>
              Downloading...
            </>
          ) : (
            <>
              Download
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
