
        // Matrix background effect
        let matrixInterval;
        
        function createMatrixEffect() {
            const matrixBg = document.getElementById('matrixBg');
            
            // Clear any existing canvas
            matrixBg.innerHTML = '';
            
            // Clear any existing interval
            if (matrixInterval) {
                clearInterval(matrixInterval);
            }
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            matrixBg.appendChild(canvas);
            
            const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ01010101';
            const charArray = chars.split('');
            const fontSize = 14;
            const columns = canvas.width / fontSize;
            const drops = [];
            
            for (let i = 0; i < columns; i++) {
                drops[i] = 1;
            }
            
            function draw() {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                ctx.font = fontSize + 'px monospace';
                
                for (let i = 0; i < drops.length; i++) {
                    const text = charArray[Math.floor(Math.random() * charArray.length)];
                    
                    // Gradient colors for matrix effect
                    const colors = ['#00d4ff', '#ff0080', '#39ff14', '#b300ff', '#ccff00'];
                    const randomColor = colors[Math.floor(Math.random() * colors.length)];
                    
                    // Create gradient effect
                    const gradient = ctx.createLinearGradient(0, drops[i] * fontSize - 20, 0, drops[i] * fontSize + 20);
                    gradient.addColorStop(0, 'transparent');
                    gradient.addColorStop(0.5, randomColor);
                    gradient.addColorStop(1, 'transparent');
                    
                    ctx.fillStyle = gradient;
                    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                    
                    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                        drops[i] = 0;
                    }
                    drops[i]++;
                }
            }
            
            matrixInterval = setInterval(draw, 35);
        }
        
        // Currency converter
        let currentRate = 0;
        
        async function fetchExchangeRate() {
            try {
                const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
                const data = await response.json();
                currentRate = data.rates.MXN;
                document.getElementById('exchangeRate').textContent = `1 USD = ${currentRate.toFixed(4)} MXN`;
            } catch (error) {
                // Fallback rate if API fails
                currentRate = 18.50;
                document.getElementById('exchangeRate').textContent = `1 USD = ${currentRate.toFixed(4)} MXN (Estimado)`;
            }
        }
        
        function convertMXNtoUSD(mxn) {
            return (mxn / currentRate).toFixed(2);
        }
        
        function convertUSDtoMXN(usd) {
            return (usd * currentRate).toFixed(2);
        }
        
        function swapCurrencies() {
            const mxnInput = document.getElementById('mxnInput');
            const usdInput = document.getElementById('usdInput');
            
            const tempValue = mxnInput.value;
            mxnInput.value = usdInput.value;
            usdInput.value = tempValue;
            
            // Trigger conversion
            if (mxnInput.value) {
                usdInput.value = convertMXNtoUSD(parseFloat(mxnInput.value));
            }
        }
        
        // Event listeners for currency inputs
        document.getElementById('mxnInput').addEventListener('input', function(e) {
            const mxnValue = parseFloat(e.target.value);
            if (!isNaN(mxnValue) && mxnValue >= 0 && currentRate > 0) {
                document.getElementById('usdInput').value = convertMXNtoUSD(mxnValue);
            } else if (e.target.value === '' || e.target.value === '0') {
                document.getElementById('usdInput').value = '';
            }
        });
        
        document.getElementById('usdInput').addEventListener('input', function(e) {
            const usdValue = parseFloat(e.target.value);
            if (!isNaN(usdValue) && usdValue >= 0 && currentRate > 0) {
                document.getElementById('mxnInput').value = convertUSDtoMXN(usdValue);
            } else if (e.target.value === '' || e.target.value === '0') {
                document.getElementById('mxnInput').value = '';
            }
        });
        
        // Add keyup listeners for better responsiveness
        document.getElementById('mxnInput').addEventListener('keyup', function(e) {
            const mxnValue = parseFloat(e.target.value);
            if (!isNaN(mxnValue) && mxnValue >= 0 && currentRate > 0) {
                document.getElementById('usdInput').value = convertMXNtoUSD(mxnValue);
            }
        });
        
        document.getElementById('usdInput').addEventListener('keyup', function(e) {
            const usdValue = parseFloat(e.target.value);
            if (!isNaN(usdValue) && usdValue >= 0 && currentRate > 0) {
                document.getElementById('mxnInput').value = convertUSDtoMXN(usdValue);
            }
        });
        

        
        // Check if device is mobile
        function isMobile() {
            return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        }
        
        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            // Create matrix effect on both desktop and mobile
            createMatrixEffect();
            fetchExchangeRate();
            
            // Update exchange rate every 5 minutes
            setInterval(fetchExchangeRate, 300000);
        });
        
        // Responsive matrix effect
        window.addEventListener('resize', function() {
            createMatrixEffect();
        });
        
        // Language toggle functionality
        let currentLanguage = 'es';
        
        function toggleLanguage() {
            currentLanguage = currentLanguage === 'es' ? 'en' : 'es';
            
            // Update all elements with language data attributes
            document.querySelectorAll('[data-es][data-en]').forEach(element => {
                const text = element.getAttribute(`data-${currentLanguage}`);
                if (text) {
                    element.innerHTML = text;
                }
            });
            
            // Update language toggle button
            const langToggle = document.getElementById('langToggle');
            langToggle.innerHTML = currentLanguage === 'es' ? '🌐 EN' : '🌐 ES';
            
            // Update document language
            document.documentElement.lang = currentLanguage;
        }
        
        // Smooth scrolling for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
