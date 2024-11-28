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
  const [currentTheme, setCurrentTheme] = useState('default');
  
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

  const wordDatabase = [
    // Kata kerja sehari-hari
    'pergi', 'datang', 'lihat', 'buat', 'ambil', 'makan', 'minum', 'tidur', 'bangun', 'berjalan',
    'berlari', 'duduk', 'berdiri', 'bicara', 'dengar', 'pikir', 'rasa', 'ingin', 'dapat', 'harus',
    'belajar', 'bekerja', 'menulis', 'membaca', 'bermain', 'tertawa', 'menangis', 'tersenyum', 'melompat', 'bernyanyi',
    
    // Kata benda sehari-hari
    'rumah', 'mobil', 'buku', 'meja', 'kursi', 'pintu', 'jendela', 'tempat', 'waktu', 'hari',
    'bulan', 'tahun', 'pagi', 'siang', 'malam', 'makanan', 'minuman', 'pakaian', 'uang', 'kerja',
    'sepatu', 'tas', 'topi', 'kaca', 'lampu', 'televisi', 'radio', 'telepon', 'koran', 'majalah',
    
    // Kata sifat umum
    'baik', 'buruk', 'besar', 'kecil', 'tinggi', 'rendah', 'panas', 'dingin', 'cepat', 'lambat',
    'keras', 'lembut', 'baru', 'lama', 'mudah', 'sulit', 'senang', 'sedih', 'marah', 'takut',
    'indah', 'cantik', 'tampan', 'jelek', 'kasar', 'halus', 'terang', 'gelap', 'kuat', 'lemah',
    
    // Kata penghubung
    'dan', 'atau', 'tetapi', 'karena', 'untuk', 'dengan', 'dari', 'ke', 'di', 'pada',
    'dalam', 'tentang', 'seperti', 'jika', 'bila', 'ketika', 'setelah', 'sebelum', 'saat', 'sambil',
    
    // Kata ganti
    'saya', 'anda', 'kamu', 'dia', 'mereka', 'kita', 'kami', 'ini', 'itu', 'siapa',
    'apa', 'mana', 'kapan', 'mengapa', 'bagaimana', 'dimana', 'kemana', 'berapa', 'yang', 'tersebut',
    
    // Kata keterangan waktu
    'sekarang', 'nanti', 'tadi', 'kemarin', 'besok', 'lusa', 'dulu', 'segera', 'selalu', 'sering',
    'jarang', 'kadang', 'pernah', 'belum', 'sudah', 'akan', 'sedang', 'masih', 'sempat', 'lagi',
    
    // Kata bilangan
    'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh',
    'banyak', 'sedikit', 'semua', 'beberapa', 'sebagian', 'setengah', 'pertama', 'kedua', 'ketiga', 'terakhir',
    
    // Kata sapaan dan kesopanan
    'tolong', 'maaf', 'terima', 'kasih', 'silakan', 'permisi', 'selamat', 'sampai', 'jumpa', 'halo',
    'hai', 'pagi', 'siang', 'sore', 'malam', 'ya', 'tidak', 'mungkin', 'boleh', 'bisa',
    
    // Tempat umum
    'kantor', 'sekolah', 'pasar', 'toko', 'bank', 'rumah', 'sakit', 'stasiun', 'bandara', 'terminal',
    'mall', 'taman', 'pantai', 'gunung', 'desa', 'kota', 'jalan', 'kamar', 'dapur', 'ruang',
    
    // Anggota keluarga
    'ayah', 'ibu', 'kakak', 'adik', 'nenek', 'kakek', 'paman', 'bibi', 'sepupu', 'keluarga',
    
    // Cuaca dan alam
    'hujan', 'panas', 'angin', 'awan', 'langit', 'bintang', 'bulan', 'matahari', 'laut', 'sungai',
    
    // Makanan dan minuman
    'nasi', 'roti', 'sayur', 'buah', 'daging', 'ikan', 'susu', 'air', 'kopi', 'teh',
    
    // Warna
    'merah', 'biru', 'hijau', 'kuning', 'putih', 'hitam', 'coklat', 'ungu', 'abu', 'jingga'
  ];

  const themes = {
    default: {
      name: 'default',
      background: '#323437',
      text: '#d1d0c5',
      primary: '#e2b714',
      error: '#ca4754',
      caret: '#e2b714',
      sub: '#646669',
      subAlt: '#2c2e31',
      errorExtra: '#7e2a33',
      colorfulError: '#e2b714',
      colorfulErrorExtra: '#8f7425'
    },
    ocean: {
      name: 'ocean',
      background: '#1a1a2e',
      text: '#e9f1f7',
      primary: '#4fb0c6',
      error: '#ff4757',
      caret: '#4fb0c6',
      sub: '#8d93ab',
      subAlt: '#16213e',
      errorExtra: '#8b1e27',
      colorfulError: '#4fb0c6',
      colorfulErrorExtra: '#2d6975'
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
    witchGirl: {
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
          <select 
            value={testDuration} 
            onChange={(e) => setTestDuration(Number(e.target.value))}
            className="setting-item"
          >
            <option value={15}>15s</option>
            <option value={30}>30s</option>
            <option value={60}>60s</option>
            <option value={120}>120s</option>
          </select>
          <select 
            value={currentTheme} 
            onChange={(e) => changeTheme(e.target.value)}
            className="setting-item"
          >
            {Object.keys(themes).map(theme => (
              <option key={theme} value={theme}>
                {themes[theme].name}
              </option>
            ))}
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

      <div className="footer">
        <div className="hint">
          <button className="restart-button" onClick={restartTest}>
            Restart
          </button>
        </div>
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
