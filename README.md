# BaseBuzz Mobile Platform

This project contains the official **mobile wrappers** for the BaseBuzz social app, structured by platform.

BaseBuzz is a Web3-enabled social platform that lets users post, react, and unlock digital badges. The mobile versions are designed to wrap the `https://base.buzz` web experience into native apps for iOS, Android, and other platforms using safe, App Store–compliant rendering techniques.

---

## 📱 Supported Platforms

| Platform  | Path                | Description                                                  |
| --------- | ------------------- | ------------------------------------------------------------ |
| iOS       | `/Mobile/iOS`       | Expo WebView wrapper with Safe Mode and App Store compliance |
| Android   | `/Mobile/Android`   | Mirror of iOS, built for Google Play compatibility           |
| macOS     | `/Mobile/macOS`     | Placeholder for future Catalyst/macOS app                    |
| Windows   | `/Mobile/Windows`   | Placeholder for Electron/UWP builds (optional)               |
| HarmonyOS | `/Mobile/HarmonyOS` | Placeholder – potential Chinese market deployment            |
| KaiOS     | `/Mobile/KaiOS`     | Placeholder – not actively maintained                        |

---

## 🚀 Quick Start (iOS)

```bash
cd Mobile/iOS
pnpm install
pnpm start

Then use the Expo Go app or simulator to preview the wrapper.

⸻

🔐 App Store Compliance

The iOS and Android wrappers are designed to:
	•	Load BaseBuzz as a WebView
	•	Enable “Safe Mode” by default during review
	•	Hide all crypto-related functionality (wallets, minting, balances)
	•	Provide a clean social feed experience suitable for submission

⸻

📦 Folder Structure

/Mobile
  ├── iOS/            # Expo project for App Store submission
  ├── Android/        # Mirror of iOS project
  ├── macOS/          # Future native macOS wrapper
  ├── Windows/        # Placeholder for Windows native/electron build
  ├── HarmonyOS/      # Optional Huawei fork
  └── KaiOS/          # Optional feature phone port


⸻

🛠️ Developer Notes
	•	Main Web app: https://base.buzz
	•	All crypto logic is isolated from mobile via Safe Mode
	•	Vault unlocks, mint buttons, and wallet popups are disabled in wrapper apps
	•	Native features (push notifications, splash screen, app icons) live in each platform folder

⸻

🧩 Contributors

Feel free to fork or PR any platform folder if you’re working on a wrapper or store build.

⸻

For platform-specific setup or App Store reviewer instructions, see:
	•	Mobile/iOS/REVIEWER.md

---
```
