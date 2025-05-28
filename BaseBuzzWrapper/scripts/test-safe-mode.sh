#!/bin/bash

# BaseBuzz Wrapper - Safe Mode Toggle Script

echo "🔧 BaseBuzz Safe Mode Toggle"
echo "=============================="

if [ "$1" = "on" ]; then
    echo "✅ Enabling Safe Mode..."
    sed -i '' 's/SAFE_MODE=false/SAFE_MODE=true/' .env
    sed -i '' 's/SAFE_MODE=.*/SAFE_MODE=true/' .env
    echo "Safe Mode: ENABLED"
    echo "- Wallet buttons will be hidden"
    echo "- Purchase buttons will be hidden"
    echo "- App Store compliant mode"
elif [ "$1" = "off" ]; then
    echo "❌ Disabling Safe Mode..."
    sed -i '' 's/SAFE_MODE=true/SAFE_MODE=false/' .env
    sed -i '' 's/SAFE_MODE=.*/SAFE_MODE=false/' .env
    echo "Safe Mode: DISABLED"
    echo "- All functionality visible"
    echo "- Full web3 experience"
else
    echo "Usage: $0 [on|off]"
    echo ""
    echo "Current configuration:"
    cat .env | grep SAFE_MODE
    echo ""
    echo "Examples:"
    echo "  $0 on   # Enable Safe Mode (App Store compliant)"
    echo "  $0 off  # Disable Safe Mode (Full functionality)"
fi

echo ""
echo "💡 Remember to restart the Expo server after changing Safe Mode!"
echo "   Press 'r' in the Expo CLI to reload the app" 