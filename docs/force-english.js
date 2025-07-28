// Emergency English force override
(function() {
    'use strict';
    
    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Force English
    localStorage.setItem('preferred-language', 'en');
    
    // Override any existing language functions
    window.addEventListener('load', function() {
        setTimeout(function() {
            if (window.updateLanguage) {
                window.updateLanguage('en');
            }
            
            // Force all select options to English
            const selects = document.querySelectorAll('select option[data-key]');
            selects.forEach(option => {
                const key = option.getAttribute('data-key');
                if (key && window.t) {
                    option.textContent = window.t(key);
                }
            });
            
            // Force language selector to English
            const langSelect = document.getElementById('language-select');
            if (langSelect) {
                langSelect.value = 'en';
            }
        }, 100);
    });
})();