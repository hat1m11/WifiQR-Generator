document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const ssidInput = document.getElementById('ssid');
    const passwordInput = document.getElementById('password');
    const securitySelect = document.getElementById('security');
    const generateBtn = document.getElementById('generateBtn');
    const loader = document.getElementById('loader');
    const result = document.getElementById('result');
    const qrcodeContainer = document.getElementById('qrcode');
    const downloadBtn = document.getElementById('downloadBtn');
    const newBtn = document.getElementById('newBtn');
    const togglePassword = document.getElementById('togglePassword');
    
    // Initialize form state
    resetForm();
    
    // Event listeners
    generateBtn.addEventListener('click', handleGenerateQRCode);
    downloadBtn.addEventListener('click', downloadQRCode);
    newBtn.addEventListener('click', resetForm);
    togglePassword.addEventListener('click', togglePasswordVisibility);
    
    // Listen for 'enter' key press
    ssidInput.addEventListener('keypress', submitOnEnter);
    passwordInput.addEventListener('keypress', submitOnEnter);
    
    // Handle security type change
    securitySelect.addEventListener('change', function() {
        const noPasswordSelected = this.value === 'nopass';
        passwordInput.disabled = noPasswordSelected;
        passwordInput.placeholder = noPasswordSelected ? 'Not required' : 'Enter password';
        
        if (noPasswordSelected) {
            passwordInput.value = '';
            passwordInput.parentElement.classList.add('disabled');
        } else {
            passwordInput.parentElement.classList.remove('disabled');
        }
    });
    
    // Functions
    function handleGenerateQRCode() {
        const ssid = ssidInput.value.trim();
        const password = passwordInput.value;
        const security = securitySelect.value;
        
        // Validate input
        if (!ssid) {
            showError('Please enter a Wi-Fi network name.');
            ssidInput.focus();
            return;
        }
        
        if (security !== 'nopass' && !password) {
            showError('Please enter a Wi-Fi password.');
            passwordInput.focus();
            return;
        }
        
        // Show loader
        generateBtn.disabled = true;
        loader.classList.remove('hidden');
        result.classList.add('hidden');
        
        // Simulate loading time for better UX
        setTimeout(() => {
            generateQRCode(ssid, password, security);
        }, 800);
    }
    
    function generateQRCode(ssid, password, security) {
        // Clear previous QR code
        qrcodeContainer.innerHTML = '';
        
        // Format the Wi-Fi string according to specifications
        // Escaping special characters in SSID and password
        const escapedSSID = escapeString(ssid);
        const escapedPassword = escapeString(password);
        
        let wifiString = `WIFI:S:${escapedSSID};T:${security};`;
        
        if (security !== 'nopass') {
            wifiString += `P:${escapedPassword};`;
        }
        
        wifiString += ';;';
        
        // Generate QR code with better options
        new QRCode(qrcodeContainer, {
            text: wifiString,
            width: 200,
            height: 200,
            colorDark: '#4361ee',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H // Higher error correction
        });
        
        // Hide loader and show result
        loader.classList.add('hidden');
        result.classList.remove('hidden');
        generateBtn.disabled = false;
    }
    
    function escapeString(str) {
        // Escape characters according to the Wi-Fi QR code format specification
        return str.replace(/([\\;,:"'])/g, '\\$1');
    }
    
    function downloadQRCode() {
        const qrImage = qrcodeContainer.querySelector('img');
        if (!qrImage) return;
        
        // Create a temporary link element
        const downloadLink = document.createElement('a');
        downloadLink.href = qrImage.src;
        
        // Set filename with current date
        const date = new Date();
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        const ssid = ssidInput.value.trim();
        
        downloadLink.download = `wifi-qr-${ssid}-${formattedDate}.png`;
        
        // Append to body, click and remove
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }
    
    function togglePasswordVisibility() {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        
        // Toggle icon
        togglePassword.classList.toggle('fa-eye');
        togglePassword.classList.toggle('fa-eye-slash');
    }
    
    function submitOnEnter(e) {
        if (e.key === 'Enter') {
            handleGenerateQRCode();
        }
    }
    
    function showError(message) {
        // Simple error handling - can be enhanced with custom toast notifications
        alert(message);
    }
    
    function resetForm() {
        // Reset form and hide results
        ssidInput.value = '';
        passwordInput.value = '';
        securitySelect.value = 'WPA';
        
        // Ensure password field is enabled
        passwordInput.disabled = false;
        passwordInput.placeholder = 'Enter password';
        passwordInput.parentElement.classList.remove('disabled');
        
        // Reset password visibility
        passwordInput.type = 'password';
        togglePassword.classList.remove('fa-eye');
        togglePassword.classList.add('fa-eye-slash');
        
        // Hide results
        result.classList.add('hidden');
        loader.classList.add('hidden');
        
        // Focus on first field for better UX
        ssidInput.focus();
    }
});
