import React, { useState, useEffect } from 'react';

function Accessibility() {
  // State for accessibility preferences
  const [showAccessibilityMenu, setShowAccessibilityMenu] = useState(false);
  const [preferences, setPreferences] = useState({
    textToSpeech: false,
    highContrast: false,
    largeText: false,
    grayscale: false,
    darkMode: false,
    cursorEnlarge: false,
    dyslexiaFont: false,
    lineSpacing: false
  });

  // Check for saved preferences on component mount
  useEffect(() => {
    const savedPrefs = localStorage.getItem('accessibilityPreferences');
    
    if (savedPrefs) {
      setPreferences(JSON.parse(savedPrefs));
      applyPreferences(JSON.parse(savedPrefs));
    } else {
      // Show accessibility menu on first visit
      setTimeout(() => {
        setShowAccessibilityMenu(true);
      }, 1500);
    }
  }, []);

  // Save preferences to localStorage
  const savePreferences = () => {
    localStorage.setItem('accessibilityPreferences', JSON.stringify(preferences));
    applyPreferences(preferences); // Apply preferences instantly
    setShowAccessibilityMenu(false); // Close the menu
  
    // Refresh the page after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 300); 
  };

  // Apply selected preferences to the document
  const applyPreferences = (prefs) => {
    console.log("Applying Preferences:", prefs); // Debugging log

    document.body.classList.toggle('large-text', prefs.largeText);
    document.body.classList.toggle('high-contrast', prefs.highContrast);
    document.body.classList.toggle('dark-mode', prefs.darkMode);
    document.body.classList.toggle('large-cursor', prefs.cursorEnlarge);
    document.body.classList.toggle('dyslexia-font', prefs.dyslexiaFont);
    document.body.classList.toggle('increased-spacing', prefs.lineSpacing);

    // Setup text-to-speech if enabled
    if (prefs.textToSpeech) {
      setupTextToSpeech();
    } else {
      removeTextToSpeech();
    }
  };

  // Handle text-to-speech setup
  const setupTextToSpeech = () => {
    // Add event listeners to elements for text-to-speech
    const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, a, button, li');
    
    elements.forEach(element => {
      element.addEventListener('mouseenter', handleTextToSpeech);
      element.addEventListener('mouseleave', stopSpeaking);
    });
  };

  // Remove text-to-speech event listeners
  const removeTextToSpeech = () => {
    const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, a, button, li');
    
    elements.forEach(element => {
      element.removeEventListener('mouseenter', handleTextToSpeech);
      element.removeEventListener('mouseleave', stopSpeaking);
    });
  };

  // Handle speaking text
  const handleTextToSpeech = (e) => {
    if ('speechSynthesis' in window) {
      const text = e.target.textContent;
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Stop speaking
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Handle preference changes
  const handlePreferenceChange = (preferenceName) => {
    setPreferences({
      ...preferences,
      [preferenceName]: !preferences[preferenceName]
    });
  };

  // Toggle accessibility menu
  const toggleAccessibilityMenu = () => {
    setShowAccessibilityMenu(!showAccessibilityMenu);
  };

  return (
    <div className="accessibility-container">
      {/* Accessibility button */}
      <button 
        className="accessibility-button"
        onClick={toggleAccessibilityMenu}
        aria-label="Accessibility Options"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
        Accessibility
      </button>

      {/* Accessibility menu */}
      {showAccessibilityMenu && (
        <div className="accessibility-menu">
          <div className="accessibility-header">
            <h2>Accessibility Preferences</h2>
            <p>Please select the accessibility features you'd like to enable:</p>
          </div>

          <div className="accessibility-options">
            <div className="option">
              <input
                type="checkbox"
                id="textToSpeech"
                checked={preferences.textToSpeech}
                onChange={() => handlePreferenceChange('textToSpeech')}
              />
              <label htmlFor="textToSpeech">Text to Speech (Hover to hear)</label>
            </div>

            <div className="option">
              <input
                type="checkbox"
                id="highContrast"
                checked={preferences.highContrast}
                onChange={() => handlePreferenceChange('highContrast')}
              />
              <label htmlFor="highContrast">High Contrast</label>
            </div>

            <div className="option">
              <input
                type="checkbox"
                id="largeText"
                checked={preferences.largeText}
                onChange={() => handlePreferenceChange('largeText')}
              />
              <label htmlFor="largeText">Large Text</label>
            </div>

            <div className="option">
              <input
                type="checkbox"
                id="grayscale"
                checked={preferences.grayscale}
                onChange={() => handlePreferenceChange('grayscale')}
              />
              <label htmlFor="grayscale">Grayscale</label>
            </div>

            <div className="option">
              <input
                type="checkbox"
                id="darkMode"
                checked={preferences.darkMode}
                onChange={() => handlePreferenceChange('darkMode')}
              />
              <label htmlFor="darkMode">Dark Mode</label>
            </div>

            <div className="option">
              <input
                type="checkbox"
                id="cursorEnlarge"
                checked={preferences.cursorEnlarge}
                onChange={() => handlePreferenceChange('cursorEnlarge')}
              />
              <label htmlFor="cursorEnlarge">Larger Cursor</label>
            </div>

            <div className="option">
              <input
                type="checkbox"
                id="dyslexiaFont"
                checked={preferences.dyslexiaFont}
                onChange={() => handlePreferenceChange('dyslexiaFont')}
              />
              <label htmlFor="dyslexiaFont">Dyslexia-Friendly Font</label>
            </div>

            <div className="option">
              <input
                type="checkbox"
                id="lineSpacing"
                checked={preferences.lineSpacing}
                onChange={() => handlePreferenceChange('lineSpacing')}
              />
              <label htmlFor="lineSpacing">Increased Line Spacing</label>
            </div>
          </div>

          <div className="accessibility-actions">
            <button onClick={savePreferences} className="save-button">
              Save Preferences
            </button>
            <button onClick={() => setShowAccessibilityMenu(false)} className="cancel-button">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* CSS for accessibility features */}
      <style jsx>{`
        /* Base styles for accessibility components */
        .accessibility-container {
          position: relative;
        }

        .accessibility-button {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 50px;
          padding: 10px 15px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          z-index: 9999;
          position: fixed !important;
          bottom: 20px !important;
          right: 20px !important;
          z-index: 99999 !important;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        }

        .accessibility-menu {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          border-radius: 10px;
          padding: 20px;
          width: 90%;
          max-width: 500px;
          z-index: 10000;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }

        .accessibility-header h2 {
          margin-top: 0;
          color: #2563eb;
        }

        .accessibility-options {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 15px;
          margin: 20px 0;
        }

        .option {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .accessibility-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }

        .save-button {
          background: #2563eb;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
        }

        .cancel-button {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
        }

        /* Global styles applied based on preferences */
        :global(.large-text) {
          font-size: 120% !important;
        }

        :global(.high-contrast) {
          filter: contrast(150%) !important;
        }

        :global(.grayscale) {
          filter: grayscale(100%) !important;
          position: fixed !important;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        :global(.dark-mode) {
          filter: invert(100%) !important;
          background: #000 !important;
        }

        :global(.large-cursor) {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 16 16"><path fill="black" d="M1 1 L15 8 L8 8 L8 15 L1 1"></path></svg>') 16 16, auto !important;
        }

        :global(.dyslexia-font) {
          font-family: 'OpenDyslexic', Comic Sans MS, sans-serif !important;
        }

        :global(.increased-spacing) {
          line-height: 2 !important;
          letter-spacing: 0.5px !important;
          word-spacing: 2px !important;
        }
      `}</style>
    </div>
  );
}

export default Accessibility;