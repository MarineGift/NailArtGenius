// Global variables
let clickCount = 0;
let isModalOpen = false;
let debugMode = true;

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Modal Test Page - JavaScript loaded successfully!');
    initializePage();
    updateDebugInfo();
    
    // Add fade-in animation to container
    document.querySelector('.container').classList.add('fade-in');
});

// Initialize page elements and event listeners
function initializePage() {
    try {
        // Update status
        updateStatus('✅ JavaScript loaded and ready!');
        updateDebugStatus('✅ WORKING PERFECTLY');
        
        // Set browser info
        const browserInfo = navigator.userAgent.split(' ').pop() || 'Unknown Browser';
        document.getElementById('browser-info').textContent = `Browser: ${browserInfo}`;
        
        // Add keyboard event listeners
        document.addEventListener('keydown', handleKeyPress);
        
        // Add window resize listener
        window.addEventListener('resize', updateDebugInfo);
        
        console.log('✅ Page initialization completed');
        
    } catch (error) {
        console.error('❌ Error during initialization:', error);
        updateDebugStatus('❌ ERROR during initialization');
    }
}

// Handle keyboard shortcuts
function handleKeyPress(event) {
    switch(event.key) {
        case 'Escape':
            if (isModalOpen) {
                closeModal();
            }
            break;
        case 'Enter':
            if (event.ctrlKey) {
                testModal();
            }
            break;
        case 'm':
            if (event.ctrlKey) {
                testModal();
                event.preventDefault();
            }
            break;
    }
}

// Test alert function
function testAlert() {
    try {
        clickCount++;
        updateCounter();
        
        const message = `🎉 JavaScript Alert Test Successful!\n\nClick Count: ${clickCount}\nTime: ${new Date().toLocaleTimeString()}\nStatus: All systems working!`;
        
        console.log('🎯 Alert test triggered:', {
            clickCount,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        });
        
        alert(message);
        updateStatus('✅ Alert test completed successfully');
        
        // Add pulse animation to test zone
        document.querySelector('.test-zone').classList.add('pulse');
        setTimeout(() => {
            document.querySelector('.test-zone').classList.remove('pulse');
        }, 2000);
        
    } catch (error) {
        console.error('❌ Error in testAlert:', error);
        updateStatus('❌ Alert test failed');
    }
}

// Test modal function
function testModal() {
    try {
        console.log('🎯 Modal test triggered');
        
        const modal = document.getElementById('testModal');
        const modalDetails = document.getElementById('modal-details');
        
        if (!modal || !modalDetails) {
            throw new Error('Modal elements not found');
        }
        
        // Update modal content
        modalDetails.innerHTML = `
            <h4 style="margin-bottom: 15px; color: #1f2937;">🔍 Detailed Test Results</h4>
            <div style="text-align: left;">
                <p><strong>Test Type:</strong> Modal Functionality Test</p>
                <p><strong>Trigger Time:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Click Count:</strong> ${clickCount}</p>
                <p><strong>Browser:</strong> ${navigator.userAgent.split(' ').pop()}</p>
                <p><strong>Screen Size:</strong> ${window.innerWidth} x ${window.innerHeight}px</p>
                <p><strong>Modal Status:</strong> Successfully Opened</p>
                <p><strong>JavaScript Status:</strong> ✅ Fully Functional</p>
            </div>
            <div style="margin-top: 20px; padding: 15px; background: #f0f9ff; border-radius: 8px;">
                <p style="margin: 0; font-style: italic; color: #3b82f6;">
                    🎊 Congratulations! All modal functionality is working perfectly.
                </p>
            </div>
        `;
        
        // Show modal
        modal.style.display = 'block';
        isModalOpen = true;
        
        updateStatus('✅ Modal opened successfully');
        console.log('✅ Modal displayed successfully');
        
    } catch (error) {
        console.error('❌ Error in testModal:', error);
        updateStatus('❌ Modal test failed: ' + error.message);
        alert('Modal test failed: ' + error.message);
    }
}

// Test console function
function testConsole() {
    try {
        console.clear();
        console.log('🎯 === CONSOLE TEST START ===');
        console.log('📊 Current Statistics:', {
            clickCount,
            timestamp: new Date().toISOString(),
            pageLoadTime: performance.now(),
            memoryUsage: performance.memory ? {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + 'MB',
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) + 'MB'
            } : 'Not available'
        });
        console.log('🌐 Browser Information:', {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine
        });
        console.log('📱 Screen Information:', {
            screenSize: `${screen.width} x ${screen.height}`,
            windowSize: `${window.innerWidth} x ${window.innerHeight}`,
            colorDepth: screen.colorDepth,
            pixelRatio: window.devicePixelRatio
        });
        console.log('✅ === CONSOLE TEST COMPLETE ===');
        
        updateStatus('✅ Console test completed - Check F12 Developer Tools');
        alert('Console test completed! 🎉\n\nOpen Browser Developer Tools (F12) to see detailed logs.\n\nAll console functionality is working perfectly!');
        
    } catch (error) {
        console.error('❌ Error in testConsole:', error);
        updateStatus('❌ Console test failed');
    }
}

// Handle card clicks
function clickCard(title, count) {
    try {
        console.log('🎯 Card clicked:', { title, count, timestamp: new Date().toISOString() });
        
        // Show immediate alert
        const alertMessage = `📊 ${title}\n\nCount: ${count}\nClick Time: ${new Date().toLocaleTimeString()}\n\nOpening detailed modal...`;
        alert(alertMessage);
        
        // Open modal with card details
        const modal = document.getElementById('testModal');
        const modalDetails = document.getElementById('modal-details');
        
        modalDetails.innerHTML = `
            <h4 style="margin-bottom: 20px; color: #1f2937;">📊 ${title} - Detailed Analytics</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; text-align: left;">
                <div style="padding: 15px; background: #f8fafc; border-radius: 8px;">
                    <h5 style="margin: 0 0 10px 0; color: #374151;">Basic Information</h5>
                    <p style="margin: 5px 0;"><strong>Metric:</strong> ${title}</p>
                    <p style="margin: 5px 0;"><strong>Current Count:</strong> ${count}</p>
                    <p style="margin: 5px 0;"><strong>Last Updated:</strong> ${new Date().toLocaleString()}</p>
                </div>
                <div style="padding: 15px; background: #f0f9ff; border-radius: 8px;">
                    <h5 style="margin: 0 0 10px 0; color: #374151;">Performance</h5>
                    <p style="margin: 5px 0;"><strong>Load Time:</strong> ${Math.round(performance.now())}ms</p>
                    <p style="margin: 5px 0;"><strong>Click Response:</strong> Instant</p>
                    <p style="margin: 5px 0;"><strong>Status:</strong> ✅ Operational</p>
                </div>
            </div>
            <div style="margin-top: 20px; padding: 20px; background: linear-gradient(135deg, #f0fdf4, #dcfce7); border-radius: 12px; border: 2px solid #10b981;">
                <h5 style="margin: 0 0 10px 0; color: #065f46;">📈 Quick Analysis</h5>
                <p style="margin: 5px 0; color: #065f46;">This metric shows your ${title.toLowerCase()} data.</p>
                <p style="margin: 5px 0; color: #065f46;">Current value of ${count} indicates ${getAnalysis(title, count)}.</p>
                <p style="margin: 5px 0; color: #065f46;">All systems are functioning normally.</p>
            </div>
        `;
        
        modal.style.display = 'block';
        isModalOpen = true;
        
        updateStatus(`✅ ${title} modal opened successfully`);
        
    } catch (error) {
        console.error('❌ Error in clickCard:', error);
        updateStatus(`❌ Error opening ${title} modal`);
        alert('Error: ' + error.message);
    }
}

// Get analysis text based on metric
function getAnalysis(title, count) {
    const analyses = {
        'Total Customers': count > 20 ? 'strong customer base' : 'growing customer base',
        'Total Appointments': count > 40 ? 'high booking activity' : 'steady booking activity',
        'Today Visitors': count > 10 ? 'good daily traffic' : 'moderate daily traffic',
        'Total Orders': count > 5 ? 'healthy order volume' : 'building order volume'
    };
    return analyses[title] || 'positive trend';
}

// Close modal function
function closeModal() {
    try {
        const modal = document.getElementById('testModal');
        if (modal) {
            modal.style.display = 'none';
            isModalOpen = false;
            console.log('✅ Modal closed successfully');
            updateStatus('✅ Modal closed');
        }
    } catch (error) {
        console.error('❌ Error closing modal:', error);
        updateStatus('❌ Error closing modal');
    }
}

// Update counter display
function updateCounter() {
    try {
        const counterElement = document.getElementById('counter');
        if (counterElement) {
            counterElement.textContent = `Click count: ${clickCount}`;
            counterElement.style.fontWeight = 'bold';
            counterElement.style.color = '#059669';
        }
    } catch (error) {
        console.error('❌ Error updating counter:', error);
    }
}

// Update status display  
function updateStatus(message) {
    try {
        const statusElement = document.getElementById('status');
        if (statusElement) {
            statusElement.textContent = `Status: ${message}`;
            statusElement.style.fontWeight = 'bold';
            
            // Add color based on message type
            if (message.includes('✅')) {
                statusElement.style.color = '#059669';
            } else if (message.includes('❌')) {
                statusElement.style.color = '#dc2626';
            } else {
                statusElement.style.color = '#f59e0b';
            }
        }
        updateTimestamp();
    } catch (error) {
        console.error('❌ Error updating status:', error);
    }
}

// Update debug status
function updateDebugStatus(status) {
    try {
        const debugElement = document.getElementById('debug-status');
        if (debugElement) {
            debugElement.textContent = `JavaScript Status: ${status}`;
            debugElement.style.fontWeight = 'bold';
            
            if (status.includes('✅')) {
                debugElement.style.color = '#059669';
            } else if (status.includes('❌')) {
                debugElement.style.color = '#dc2626';
            }
        }
    } catch (error) {
        console.error('❌ Error updating debug status:', error);
    }
}

// Update timestamp
function updateTimestamp() {
    try {
        const timestampElement = document.getElementById('timestamp');
        if (timestampElement) {
            timestampElement.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
        }
    } catch (error) {
        console.error('❌ Error updating timestamp:', error);
    }
}

// Update debug information
function updateDebugInfo() {
    try {
        updateTimestamp();
        
        if (debugMode) {
            console.log('🔍 Debug Info Update:', {
                clickCount,
                isModalOpen,
                timestamp: new Date().toISOString(),
                windowSize: `${window.innerWidth}x${window.innerHeight}`
            });
        }
    } catch (error) {
        console.error('❌ Error updating debug info:', error);
    }
}

// Global error handler
window.onerror = function(msg, url, lineNo, columnNo, error) {
    const errorMsg = `JavaScript Error: ${msg} at line ${lineNo}`;
    console.error('💥 Global Error:', errorMsg, error);
    
    updateDebugStatus('❌ ERROR DETECTED');
    updateStatus('❌ JavaScript error occurred');
    
    // Still return false to allow default error handling
    return false;
};

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(event) {
    console.error('💥 Unhandled Promise Rejection:', event.reason);
    updateDebugStatus('❌ Promise Error');
    updateStatus('❌ Promise rejection occurred');
});

// Page visibility change handler
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        console.log('👁️ Page became visible');
        updateDebugInfo();
    }
});

// Export functions for global access (for debugging in browser console)
window.debugFunctions = {
    testAlert,
    testModal,
    testConsole,
    clickCard,
    closeModal,
    updateDebugInfo,
    getStats: () => ({ clickCount, isModalOpen })
};

console.log('🎯 All functions loaded and ready!');
console.log('💡 Available debug functions:', Object.keys(window.debugFunctions));