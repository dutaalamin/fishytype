import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [wordList, setWordList] = useState([]);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const [testDuration, setTestDuration] = useState(60);
  const [currentTheme, setCurrentTheme] = useState('classic');
  const [searchTerm, setSearchTerm] = useState('');
  
  
  // Statistik detail
  const [wpm, setWpm] = useState(0);
  const [rawWpm, setRawWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [missedChars, setMissedChars] = useState(0);
  const [extraChars, setExtraChars] = useState(0);
  const [currentWordErrors, setCurrentWordErrors] = useState([]);
  const [currentCharErrors, setCurrentCharErrors] = useState([]);
  const [typedChars, setTypedChars] = useState([]);

  // Tambahkan state baru untuk riwayat hasil
  const [testHistory, setTestHistory] = useState([]);
  const [bestWpm, setBestWpm] = useState(0);

  // Tambahkan state untuk menampilkan modal hasil
  const [showResults, setShowResults] = useState(false);

  const inputRef = useRef(null);
  const caretRef = useRef(null);

  // Di bagian atas komponen, tambahkan state timer
  const [timer, setTimer] = useState(null);

  // Tambahkan state untuk mengontrol visibility theme picker
  const [showThemePicker, setShowThemePicker] = useState(false);

  const wordDatabase = [
    // Common verbs
    'go', 'come', 'see', 'make', 'take', 'eat', 'drink', 'sleep', 'wake', 'walk',
    'run', 'sit', 'stand', 'talk', 'hear', 'think', 'feel', 'want', 'can', 'must',
    'learn', 'work', 'write', 'read', 'play', 'laugh', 'cry', 'smile', 'jump', 'sing',
    
    // Common nouns
    'house', 'car', 'book', 'table', 'chair', 'door', 'window', 'place', 'time', 'day',
    'month', 'year', 'morning', 'noon', 'night', 'food', 'drink', 'clothes', 'money', 'work',
    'shoes', 'bag', 'hat', 'glass', 'lamp', 'phone', 'radio', 'paper', 'news', 'magazine',
    
    // Common adjectives
    'good', 'bad', 'big', 'small', 'high', 'low', 'hot', 'cold', 'fast', 'slow',
    'hard', 'soft', 'new', 'old', 'easy', 'hard', 'happy', 'sad', 'angry', 'afraid',
    'beautiful', 'pretty', 'handsome', 'ugly', 'rough', 'smooth', 'bright', 'dark', 'strong', 'weak',
    
    // Common prepositions
    'in', 'on', 'at', 'to', 'for', 'with', 'from', 'by', 'into', 'onto',
    'about', 'like', 'through', 'after', 'before', 'between', 'under', 'over', 'behind', 'beside',
    
    // Common pronouns
    'I', 'you', 'he', 'she', 'it', 'we', 'they', 'this', 'that', 'who',
    'what', 'which', 'when', 'why', 'how', 'where', 'whose', 'whom', 'these', 'those',
    
    // Time words
    'now', 'later', 'soon', 'today', 'tomorrow', 'yesterday', 'always', 'never', 'often', 'sometimes',
    'rarely', 'weekly', 'daily', 'monthly', 'yearly', 'early', 'late', 'again', 'once', 'twice',
    
    // Numbers and quantities
    'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
    'many', 'few', 'all', 'some', 'most', 'half', 'first', 'second', 'third', 'last',
    
    // Common phrases
    'please', 'sorry', 'thank', 'you', 'hello', 'bye', 'welcome', 'excuse', 'pardon', 'okay',
    'yes', 'no', 'maybe', 'sure', 'right', 'wrong', 'true', 'false', 'good', 'bad',
    
    // Places
    'office', 'school', 'market', 'store', 'bank', 'home', 'hospital', 'station', 'airport', 'hotel',
    'mall', 'park', 'beach', 'mountain', 'city', 'town', 'street', 'room', 'kitchen', 'space',
    
    // Technology
    'computer', 'phone', 'tablet', 'screen', 'mouse', 'keyboard', 'internet', 'email', 'website', 'app',
    'data', 'file', 'folder', 'program', 'system', 'network', 'cloud', 'code', 'game', 'video',
    
    // Business
    'meeting', 'project', 'client', 'report', 'budget', 'market', 'sales', 'team', 'goal', 'plan',
    'strategy', 'success', 'growth', 'value', 'cost', 'price', 'deal', 'task', 'time', 'work'
  ];

  const themes = {
    classic: {
      name: 'classic',
      background: '#323437',
      text: '#d1d0c5',
      primary: '#e2b714',
      error: '#ca4754',
      caret: '#e2b714',
      sub: '#646669',
      subAlt: '#2c2e31',
      errorExtra: '#7e2a33',
      colorfulError: '#e2b714',
      colorfulErrorExtra: '#8f7425',
      highlight: '#ffcc00',
      shadow: '#1a1a1a'
    },
    ocean: {
      name: 'ocean',
      background: '#1b2b34',
      text: '#d8dee9',
      primary: '#6699cc',
      error: '#ec5f67',
      caret: '#6699cc',
      sub: '#4f5b66',
      subAlt: '#161e23',
      errorExtra: '#bc4c52',
      colorfulError: '#6699cc',
      colorfulErrorExtra: '#527aa3'
    },
    forest: {
      name: 'forest',
      background: '#2d3436',
      text: '#f0f7ee',
      primary: '#6ab04c',
      error: '#eb4d4b',
      caret: '#6ab04c',
      sub: '#95a5a6',
      subAlt: '#232829',
      errorExtra: '#8b1e27',
      colorfulError: '#6ab04c',
      colorfulErrorExtra: '#3d662c'
    },
    sunset: {
      name: 'sunset',
      background: '#2d3436',
      text: '#f5f6fa',
      primary: '#ff7f50',
      error: '#ff4757',
      caret: '#ff7f50',
      sub: '#a4b0be',
      subAlt: '#232829',
      errorExtra: '#8b1e27',
      colorfulError: '#ff7f50',
      colorfulErrorExtra: '#b35838'
    },
    lavender: {
      name: 'lavender',
      background: '#2f3640',
      text: '#f5f6fa',
      primary: '#9b59b6',
      error: '#e84393',
      caret: '#9b59b6',
      sub: '#a4b0be',
      subAlt: '#262b33',
      errorExtra: '#8b1e27',
      colorfulError: '#9b59b6',
      colorfulErrorExtra: '#6c3d80'
    },
    mint: {
      name: 'mint',
      background: '#222f3e',
      text: '#f5f6fa',
      primary: '#00b894',
      error: '#ff7675',
      caret: '#00b894',
      sub: '#8395a7',
      subAlt: '#1b2631',
      errorExtra: '#8b1e27',
      colorfulError: '#00b894',
      colorfulErrorExtra: '#007a62'
    },
    coffee: {
      name: 'coffee',
      background: '#2f3640',
      text: '#dcdde1',
      primary: '#cd6133',
      error: '#e84118',
      caret: '#cd6133',
      sub: '#718093',
      subAlt: '#262b33',
      errorExtra: '#8b1e27',
      colorfulError: '#cd6133',
      colorfulErrorExtra: '#8f4323'
    },
    retro: {
      name: 'retro',
      background: '#2c3e50',
      text: '#ecf0f1',
      primary: '#f1c40f',
      error: '#e74c3c',
      caret: '#f1c40f',
      sub: '#95a5a6',
      subAlt: '#233140',
      errorExtra: '#8b1e27',
      colorfulError: '#f1c40f',
      colorfulErrorExtra: '#a8890a'
    },
    // Tema baru
    pastel: {
      name: 'pastel',
      background: '#f8f4e1',
      text: '#6d6875',
      primary: '#f4a261',
      error: '#e76f51',
      caret: '#f4a261',
      sub: '#b5838d',
      subAlt: '#ffe8d6',
      errorExtra: '#e63946',
      colorfulError: '#f4a261',
      colorfulErrorExtra: '#e07a5f'
    },
    witch_girl: {
      name: 'witch girl',
      background: '#2b2d42',
      text: '#edf2f4',
      primary: '#8d99ae',
      error: '#ef233c',
      caret: '#d90429',
      sub: '#8d99ae',
      subAlt: '#3a3b58',
      errorExtra: '#ef233c',
      colorfulError: '#d90429',
      colorfulErrorExtra: '#ef233c'
    },
    candy: {
      name: 'candy',
      background: '#ffecf1',
      text: '#4a4459',
      primary: '#ff6b9f',
      error: '#ff4757',
      caret: '#ff6b9f',
      sub: '#8b7997',
      subAlt: '#f7dfe7',
      errorExtra: '#cf3a48',
      colorfulError: '#ff6b9f',
      colorfulErrorExtra: '#cc567f'
    },
    sunset: {
      name: 'sunset',
      background: '#1a1a2e',
      text: '#ffd460',
      primary: '#ff6b6b',
      error: '#ee5253',
      caret: '#ff6b6b',
      sub: '#706fd3',
      subAlt: '#16162a',
      errorExtra: '#c41e3a',
      colorfulError: '#ff6b6b',
      colorfulErrorExtra: '#cc5555'
    },
    rainbow: {
      name: 'rainbow',
      background: '#2d132c',
      text: '#ff9de6',
      primary: '#4deeea',
      error: '#ff1493',
      caret: '#4deeea',
      sub: '#9b4f96',
      subAlt: '#251026',
      errorExtra: '#cc1076',
      colorfulError: '#4deeea',
      colorfulErrorExtra: '#3ebebb'
    },
    neon: {
      name: 'neon',
      background: '#000000',
      text: '#00ff00',
      primary: '#ff00ff',
      error: '#ff0000',
      caret: '#00ffff',
      sub: '#008800',
      subAlt: '#0a0a0a',
      errorExtra: '#cc0000',
      colorfulError: '#00ffff',
      colorfulErrorExtra: '#00cccc'
    },
    retro_wave: {
      name: 'retro wave',
      background: '#1a1a2e',
      text: '#ff00ff',
      primary: '#00ffff',
      error: '#ff0055',
      caret: '#00ffff',
      sub: '#7b2cbf',
      subAlt: '#16162a',
      errorExtra: '#cc0044',
      colorfulError: '#00ffff',
      colorfulErrorExtra: '#00cccc'
    },
    cotton_candy: {
      name: 'cotton candy',
      background: '#fae3ff',
      text: '#6c567b',
      primary: '#ff70a6',
      error: '#ff4081',
      caret: '#ff70a6',
      sub: '#b39ddb',
      subAlt: '#f5d5ff',
      errorExtra: '#cc3366',
      colorfulError: '#ff70a6',
      colorfulErrorExtra: '#cc5985'
    },
    unicorn: {
      name: 'unicorn',
      background: '#6c5ce7',
      text: '#ffeaa7',
      primary: '#ff79c6',
      error: '#ff0066',
      caret: '#ff79c6',
      sub: '#a29bfe',
      subAlt: '#5f52cc',
      errorExtra: '#cc0052',
      colorfulError: '#ff79c6',
      colorfulErrorExtra: '#cc619e'
    },
    galaxy: {
      name: 'galaxy',
      background: '#0c0c1d',
      text: '#e2e2ff',
      primary: '#7f5af0',
      error: '#ff0055',
      caret: '#7f5af0',
      sub: '#4d4d8f',
      subAlt: '#0a0a18',
      errorExtra: '#cc0044',
      colorfulError: '#7f5af0',
      colorfulErrorExtra: '#6548c0'
    },
    bubblegum: {
      name: 'bubblegum',
      background: '#ff9ff3',
      text: '#4a266a',
      primary: '#ff36ab',
      error: '#ff0055',
      caret: '#ff36ab',
      sub: '#b088c9',
      subAlt: '#ff8aed',
      errorExtra: '#cc0044',
      colorfulError: '#ff36ab',
      colorfulErrorExtra: '#cc2b89'
    },
    coral_reef: {
      name: 'coral reef',
      background: '#2b3d4f',
      text: '#48dbfb',
      primary: '#ff9ff3',
      error: '#ff4757',
      caret: '#ff9ff3',
      sub: '#45aaf2',
      subAlt: '#263545',
      errorExtra: '#cc3a46',
      colorfulError: '#ff9ff3',
      colorfulErrorExtra: '#cc7fc2'
    },
    coral: {
      name: 'coral',
      background: '#1d2021',
      text: '#f8f8f2',
      primary: '#ff7f50',
      error: '#ff5555',
      caret: '#ff7f50',
      sub: '#6272a4',
      subAlt: '#161819',
      errorExtra: '#cc4444',
      colorfulError: '#ff7f50',
      colorfulErrorExtra: '#cc6640'
    },
    matrix: {
      name: 'matrix',
      background: '#000000',
      text: '#00ff00',
      primary: '#008f11',
      error: '#ff0000',
      caret: '#00ff00',
      sub: '#003b00',
      subAlt: '#001a00',
      errorExtra: '#800000',
      colorfulError: '#008f11',
      colorfulErrorExtra: '#006b0d'
    },
    dracula: {
      name: 'dracula',
      background: '#282a36',
      text: '#f8f8f2',
      primary: '#bd93f9',
      error: '#ff5555',
      caret: '#bd93f9',
      sub: '#6272a4',
      subAlt: '#21222c',
      errorExtra: '#cc4444',
      colorfulError: '#bd93f9',
      colorfulErrorExtra: '#9674c7'
    },
    gruvbox: {
      name: 'gruvbox',
      background: '#282828',
      text: '#ebdbb2',
      primary: '#b8bb26',
      error: '#fb4934',
      caret: '#b8bb26',
      sub: '#928374',
      subAlt: '#1d2021',
      errorExtra: '#cc241d',
      colorfulError: '#b8bb26',
      colorfulErrorExtra: '#98971a'
    }
  };

  const generateWordList = useCallback(() => {
    const isMobile = window.innerWidth <= 768;
    const wordCount = isMobile ? 10 : 30; // Mengurangi jumlah kata untuk mobile
    const wordsPerRow = isMobile ? 3 : 10; // Mengurangi kata per baris untuk mobile
    
    const shuffled = [...wordDatabase]
      .sort(() => Math.random() - 0.5)
      .slice(0, wordCount);
    
    const rows = [];
    for (let i = 0; i < shuffled.length; i += wordsPerRow) {
      rows.push(shuffled.slice(i, i + wordsPerRow));
    }
    setWordList(rows.flat());
  }, []);

  useEffect(() => {
    generateWordList();
  }, [generateWordList]);

  useEffect(() => {
    if (isRunning && timeLeft > 0 && hasStartedTyping) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        calculateWPM();
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      endTest();
    }
  }, [isRunning, timeLeft, hasStartedTyping]);

  const calculateWPM = () => {
    const minutes = (testDuration - timeLeft) / 60;
    if (minutes === 0) return;
    
    const totalChars = correctChars + incorrectChars;
    const rawWPM = Math.round((totalChars / 5) / minutes);
    const netWPM = Math.round(((correctChars / 5) / minutes) * (accuracy / 100));
    
    setRawWpm(rawWPM);
    setWpm(netWPM);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Alt' || e.altKey) {
      return;
    }

    if (!isRunning && e.key !== 'Tab') {
      setIsRunning(true);
      setHasStartedTyping(true);
      startTimer();
    }

    // Handle backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (currentCharIndex > 0) {
        setCurrentCharIndex(prev => prev - 1);
        setTypedChars(prev => prev.slice(0, -1));
        setCurrentCharErrors(prev => prev.filter(err => err !== currentCharIndex - 1));
      }
      return;
    }

    // Handle space untuk pindah ke kata berikutnya
    if (e.key === ' ') {
      e.preventDefault();
      const currentWord = wordList[currentWordIndex];
      const typedWord = typedChars.join('');
      
      if (typedWord.length === 0) return; // Mencegah spasi di awal kata
      
      if (currentCharIndex === currentWord.length) {
        moveToNextWord();
      }
      return;
    }

    // Handle input karakter normal
    if (e.key.length === 1) {
      const currentWord = wordList[currentWordIndex];
      if (currentCharIndex < currentWord.length) {
        const isCorrect = e.key === currentWord[currentCharIndex];
        
        // Update statistik
        if (isCorrect) {
          setCorrectChars(prev => prev + 1);
        } else {
          setIncorrectChars(prev => prev + 1);
        }
        
        if (!isCorrect) {
          setCurrentCharErrors(prev => [...prev, currentCharIndex]);
        }
        setTypedChars(prev => [...prev, e.key]);
        setCurrentCharIndex(prev => prev + 1);
        
        // Update akurasi
        const totalChars = correctChars + incorrectChars + 1;
        const newAccuracy = Math.round((correctChars + (isCorrect ? 1 : 0)) / totalChars * 100);
        setAccuracy(newAccuracy);

        if (!hasStartedTyping) {
          setHasStartedTyping(true);
          startTimer();
        }
      }
    }
  };

  const moveToNextWord = () => {
    if (currentWordIndex >= wordList.length - 1) {
      generateWordList();
      setCurrentWordIndex(0);
    } else {
      setCurrentWordIndex(prev => prev + 1);
    }
    
    setCurrentCharIndex(0);
    setCurrentCharErrors([]);
    setTypedChars([]);
  };

  // Tambahkan fungsi untuk menyimpan riwayat test
  const saveTestResult = () => {
    const result = {
      date: new Date(),
      wpm,
      rawWpm,
      accuracy,
      correctChars,
      incorrectChars,
      duration: testDuration
    };
    setTestHistory(prev => [...prev, result]);
    if (wpm > bestWpm) {
      setBestWpm(wpm);
    }
  };

  // Modifikasi fungsi endTest
  const endTest = () => {
    setIsRunning(false);
    calculateWPM();
    
    // Update best WPM
    if (wpm > bestWpm) {
      setBestWpm(wpm);
      // Opsional: simpan ke localStorage
      localStorage.setItem('bestWpm', wpm.toString());
    }
    
    saveTestResult();
    setShowResults(true);
  };

  // Tambahkan fungsi untuk menutup modal hasil
  const closeResults = () => {
    setShowResults(false);
    restartTest();
  };

  const restartTest = () => {
    setText('');
    setTimeLeft(testDuration);
    setIsRunning(false);
    setHasStartedTyping(false);
    setCurrentWordIndex(0);
    setCurrentCharIndex(0);
    setWpm(0);
    setRawWpm(0);
    setAccuracy(100);
    setCorrectChars(0);
    setIncorrectChars(0);
    setCurrentWordErrors([]);
    generateWordList();
    inputRef.current?.focus();
  };

  const changeTheme = (themeName) => {
    setCurrentTheme(themeName);
    const theme = themes[themeName];
    document.documentElement.style.setProperty('--bg-color', theme.background);
    document.documentElement.style.setProperty('--text-color', theme.text);
    document.documentElement.style.setProperty('--main-color', theme.primary);
    document.documentElement.style.setProperty('--error-color', theme.error);
    document.documentElement.style.setProperty('--caret-color', theme.caret);
    document.documentElement.style.setProperty('--sub-color', theme.sub);
    document.documentElement.style.setProperty('--sub-alt-color', theme.subAlt);
    document.documentElement.style.setProperty('--error-extra-color', theme.errorExtra);
    document.documentElement.style.setProperty('--colorful-error-color', theme.colorfulError);
    document.documentElement.style.setProperty('--colorful-error-extra-color', theme.colorfulErrorExtra);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Tambahkan fungsi untuk menangani focus loss
  const handleFocusLoss = useCallback(() => {
    if (isRunning || hasStartedTyping) {
      inputRef.current?.focus();
    }
  }, [isRunning, hasStartedTyping]);

  useEffect(() => {
    window.addEventListener('click', handleFocusLoss);
    return () => window.removeEventListener('click', handleFocusLoss);
  }, [isRunning, hasStartedTyping]);

  // Tambahkan fungsi startTimer
  const startTimer = () => {
    if (timer) return;
    
    const newTimer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(newTimer);
          endTest();
          return 0;
        }
        calculateWPM();
        return prevTime - 1;
      });
    }, 1000);
    
    setTimer(newTimer);
    setIsRunning(true);
  };

  // Cleanup timer saat component unmount
  useEffect(() => {
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [timer]);

  // Tambahkan useEffect untuk memperbarui WPM secara real-time
  useEffect(() => {
    if (isRunning && hasStartedTyping) {
      calculateWPM();
    }
  }, [correctChars, incorrectChars, timeLeft]); // Tambahkan dependencies

  // Tambahkan useEffect untuk memperbarui best WPM dari localStorage
  useEffect(() => {
    // Load best WPM dari localStorage jika ada
    const savedBestWpm = localStorage.getItem('bestWpm');
    if (savedBestWpm) {
      setBestWpm(parseInt(savedBestWpm));
    }
  }, []);

  // Tambahkan useEffect untuk me-regenerate word list saat ukuran layar berubah
  useEffect(() => {
    const handleResize = () => {
      generateWordList();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [generateWordList]);

  return (
    <div className={`typing-test theme-${currentTheme}`}>
      <div className="header">
        <div className="logo">fishytype</div>
        <div className="settings">
          <div className="theme-picker-wrapper">
            <button 
              className="theme-picker-trigger"
              onClick={() => setShowThemePicker(!showThemePicker)}
            >
              {currentTheme}
            </button>
            
            {showThemePicker && (
              <div className="theme-picker">
                <div className="theme-search">
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                  />
                </div>
                <div className="theme-list">
                  {Object.keys(themes)
                    .filter(theme => theme.toLowerCase().includes(searchTerm || ''))
                    .map(theme => (
                      <div 
                        key={theme} 
                        className={`theme-item ${currentTheme === theme ? 'active' : ''}`}
                        onClick={() => {
                          changeTheme(theme);
                          setShowThemePicker(false);
                        }}
                      >
                        <span className="theme-name">{themes[theme].name}</span>
                        <div className="theme-colors">
                          <div style={{ backgroundColor: themes[theme].background }}></div>
                          <div style={{ backgroundColor: themes[theme].text }}></div>
                          <div style={{ backgroundColor: themes[theme].primary }}></div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          <select 
            className="setting-item"
            value={testDuration} 
            onChange={(e) => setTestDuration(Number(e.target.value))}
          >
            <option value={15}>15s</option>
            <option value={30}>30s</option>
            <option value={60}>60s</option>
            <option value={120}>120s</option>
          </select>
        </div>
      </div>

      <div className="test-container">
        <div className="stats-top">
          <div className="time">{timeLeft}s</div>
        </div>

        <div className="word-display" onClick={() => inputRef.current?.focus()}>
          <div className="word-rows">
            {[0, 1, 2].map(rowIndex => (
              <div key={rowIndex} className="word-row">
                {wordList.slice(rowIndex * 10, (rowIndex + 1) * 10).map((word, wordIdx) => (
                  <div 
                    key={`${word}-${wordIdx}`}
                    className={`word 
                      ${wordIdx + rowIndex * 10 === currentWordIndex ? 'current' : ''} 
                      ${wordIdx + rowIndex * 10 < currentWordIndex ? 'completed' : ''}`
                    }
                  >
                    {word.split('').map((char, charIdx) => (
                      <span
                        key={`${char}-${charIdx}`}
                        className={`char 
                          ${wordIdx + rowIndex * 10 === currentWordIndex && charIdx === currentCharIndex ? 'caret' : ''}
                          ${wordIdx + rowIndex * 10 === currentWordIndex && currentWordErrors.includes(charIdx) ? 'error' : ''}
                          ${wordIdx + rowIndex * 10 < currentWordIndex ? 'typed' : ''}`
                        }
                      >
                        {char}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <input
          ref={inputRef}
          type="text"
          onKeyDown={handleKeyDown}
          onChange={(e) => setText(e.target.value)}
          value={text}
          autoFocus
          style={{
            position: 'fixed',
            opacity: 0,
            pointerEvents: 'none',
            width: '0px',
            height: '0px',
            top: '0px',
            left: '0px'
          }}
        />
      </div>

      <div className="restart-container">
        <button className="restart-icon" onClick={restartTest}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
            <path d="M21 3v5h-5"/>
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
            <path d="M3 21v-5h5"/>
          </svg>
        </button>
      </div>

      <div className="footer">
        <div className="stats-detail">
          <div>raw: {rawWpm}</div>
          <div>chars: {correctChars}/{incorrectChars}</div>
          <div>best: {bestWpm} wpm</div>
        </div>
      </div>

      {/* Tambahkan modal hasil */}
      {showResults && (
        <div className="results-modal">
          <div className="results-content">
            <h2>Hasil Test Mengetik</h2>
            
            <div className="results-stats">
              <div className="stat-item">
                <div className="stat-value">{wpm}</div>
                <div className="stat-label">WPM</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-value">{rawWpm}</div>
                <div className="stat-label">Raw WPM</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-value">{accuracy}%</div>
                <div className="stat-label">Akurasi</div>
              </div>
            </div>

            <div className="detailed-stats">
              <div className="stat-row">
                <span>Karakter Benar:</span>
                <span>{correctChars}</span>
              </div>
              <div className="stat-row">
                <span>Karakter Salah:</span>
                <span>{incorrectChars}</span>
              </div>
              <div className="stat-row">
                <span>Total Karakter:</span>
                <span>{correctChars + incorrectChars}</span>
              </div>
              <div className="stat-row">
                <span>Durasi Test:</span>
                <span>{testDuration} detik</span>
              </div>
            </div>

            <div className="results-actions">
              <button onClick={closeResults} className="restart-btn">
                Test Lagi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
