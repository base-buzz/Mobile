import { SAFE_MODE } from "@env";

export const isSafeModeEnabled = (): boolean => {
  return SAFE_MODE === "true";
};

export const getSafeModeInjectionScript = (): string => {
  if (!isSafeModeEnabled()) {
    return "";
  }

  return `
    (function() {
      console.log('BaseBuzz Safe Mode: Enabled');
      
      // Function to hide elements with safe-sensitive attribute
      function hideSafeSensitiveElements() {
        const elements = document.querySelectorAll('[data-safe-sensitive="true"]');
        elements.forEach(el => {
          el.style.display = 'none';
        });
      }
      
      // Function to hide wallet connection buttons
      function hideWalletButtons() {
        const selectors = [
          '[data-testid*="wallet"]',
          '[class*="wallet"]',
          '[id*="wallet"]',
          'button[class*="connect"]',
          'button[class*="Connect"]',
          '[data-testid*="connect"]',
          'button:contains("Connect Wallet")',
          'button:contains("Connect")',
          '[aria-label*="wallet"]',
          '[aria-label*="connect"]'
        ];
        
        selectors.forEach(selector => {
          try {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
              if (el.textContent && (
                el.textContent.toLowerCase().includes('wallet') ||
                el.textContent.toLowerCase().includes('connect') ||
                el.textContent.toLowerCase().includes('metamask') ||
                el.textContent.toLowerCase().includes('coinbase')
              )) {
                el.style.display = 'none';
              }
            });
          } catch (e) {
            // Ignore selector errors
          }
        });
      }
      
      // Function to hide mint/buy/claim buttons
      function hidePurchaseButtons() {
        const selectors = [
          'button[class*="mint"]',
          'button[class*="Mint"]',
          'button[class*="buy"]',
          'button[class*="Buy"]',
          'button[class*="claim"]',
          'button[class*="Claim"]',
          'button[class*="purchase"]',
          'button[class*="Purchase"]',
          '[data-testid*="mint"]',
          '[data-testid*="buy"]',
          '[data-testid*="claim"]',
          '[data-testid*="purchase"]'
        ];
        
        selectors.forEach(selector => {
          try {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
              if (el.textContent && (
                el.textContent.toLowerCase().includes('mint') ||
                el.textContent.toLowerCase().includes('buy') ||
                el.textContent.toLowerCase().includes('claim') ||
                el.textContent.toLowerCase().includes('purchase') ||
                el.textContent.toLowerCase().includes('$')
              )) {
                el.style.display = 'none';
              }
            });
          } catch (e) {
            // Ignore selector errors
          }
        });
      }
      
      // Apply safe mode immediately
      function applySafeMode() {
        hideSafeSensitiveElements();
        hideWalletButtons();
        hidePurchaseButtons();
      }
      
      // Apply safe mode on load
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applySafeMode);
      } else {
        applySafeMode();
      }
      
      // Monitor for dynamic content changes
      const observer = new MutationObserver(function(mutations) {
        let shouldApply = false;
        mutations.forEach(function(mutation) {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            shouldApply = true;
          }
        });
        if (shouldApply) {
          setTimeout(applySafeMode, 100);
        }
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      // Apply safe mode periodically as fallback
      setInterval(applySafeMode, 2000);
      
    })();
  `;
};

export const getWalletFallbackScript = (): string => {
  return `
    (function() {
      // Prevent crashes from missing wallet providers
      if (typeof window !== 'undefined') {
        // Mock ethereum provider to prevent crashes
        if (!window.ethereum) {
          window.ethereum = {
            isMetaMask: false,
            isCoinbaseWallet: false,
            request: () => Promise.reject(new Error('No wallet provider available')),
            on: () => {},
            removeListener: () => {}
          };
        }
        
        // Redirect wallet connections to WalletConnect
        const originalRequest = window.ethereum.request;
        window.ethereum.request = function(args) {
          if (args.method === 'eth_requestAccounts') {
            console.log('BaseBuzz: Wallet connection attempted, redirecting to WalletConnect');
            // You could show a modal here directing users to use WalletConnect
            return Promise.reject(new Error('Please use WalletConnect for wallet connections'));
          }
          return originalRequest.call(this, args);
        };
      }
    })();
  `;
};
