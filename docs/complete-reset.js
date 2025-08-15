// Complete English Reset System
(function() {
    'use strict';
    
    // Nuclear option - clear everything and force English
    function forceEnglishReset() {
        // Clear all storage
        try {
            localStorage.clear();
            sessionStorage.clear();
            
            // Clear any cookies
            document.cookie.split(";").forEach(function(c) { 
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
            });
        } catch(e) {
            console.log('Storage clearing error:', e);
        }
        
        // Force English
        localStorage.setItem('preferred-language', 'en');
        window.currentLanguage = 'en';
        
        // Force all text elements to English immediately
        if (window.updateLanguage) {
            window.updateLanguage('en');
        }
        
        // Force language selector
        const langSelect = document.getElementById('language-select');
        if (langSelect) {
            langSelect.value = 'en';
        }
        
        console.log('COMPLETE ENGLISH RESET APPLIED');
    }
    
    // Execute immediately
    forceEnglishReset();
    
    // Execute on load
    window.addEventListener('load', forceEnglishReset);
    
    // Execute on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', forceEnglishReset);
    } else {
        forceEnglishReset();
    }
    
    // Periodic enforcement every 2 seconds
    setInterval(function() {
        if (window.currentLanguage !== 'en') {
            forceEnglishReset();
        }
    }, 2000);
    
})();