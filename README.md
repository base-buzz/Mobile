# BaseBuzz Mobile Platform

This project contains the official **mobile wrappers** for the BaseBuzz social app, structured by platform.

BaseBuzz is a Web3-enabled social platform that lets users post, react, and unlock digital badges. The mobile versions are designed to wrap the `https://base.buzz` web experience into native apps for iOS, Android, and other platforms using safe, App Store–compliant rendering techniques.

---

## 📱 Supported Platforms

| Platform  | Path                | Status     | Description                                                  |
| --------- | ------------------- | ---------- | ------------------------------------------------------------ |
| iOS       | `/Mobile/iOS`       | ✅ Active  | Expo WebView wrapper with Safe Mode and App Store compliance |
| Android   | `/Mobile/Android`   | 🚧 Planned | Mirror of iOS, built for Google Play compatibility           |
| macOS     | `/Mobile/macOS`     | 🚧 Planned | Future Catalyst/macOS app                                    |
| Windows   | `/Mobile/Windows`   | 🚧 Planned | Future Electron/UWP builds                                   |
| HarmonyOS | `/Mobile/HarmonyOS` | 🚧 Planned | Potential Chinese market deployment                          |

---

## 🚀 Quick Start (iOS)

```bash
cd Mobile/iOS
pnpm install
pnpm start
```

Then use the Expo Go app or simulator to preview the wrapper.

---

## 🔐 App Store Compliance

The iOS and Android wrappers are designed to:
• Load BaseBuzz as a WebView
• Enable "Safe Mode" by default during review
• Hide all crypto-related functionality (wallets, minting, balances)
• Provide a clean social feed experience suitable for submission

---

## 📦 Folder Structure

```
/Mobile
  ├── iOS/            # ✅ Expo project for App Store submission
  ├── Android/        # 🚧 Future Android wrapper (mirrors iOS)
  ├── macOS/          # 🚧 Future native macOS wrapper
  ├── Windows/        # 🚧 Future Windows native/electron build
  ├── HarmonyOS/      # 🚧 Future Huawei/HarmonyOS fork
  ├── LICENSE         # Project license
  └── README.md       # This file
```

---

## 🛠️ Developer Notes

• **Main Web app**: https://base.buzz
• **Safe Mode**: All crypto logic is isolated from mobile via Safe Mode
• **Compliance**: Vault unlocks, mint buttons, and wallet popups are disabled in wrapper apps
• **Native features**: Push notifications, splash screen, app icons live in each platform folder
• **Current focus**: iOS implementation is complete and ready for App Store submission

---

## 🧩 Contributors

Feel free to fork or PR any platform folder if you're working on a wrapper or store build.

---

## 📋 Platform-Specific Documentation

For platform-specific setup or App Store reviewer instructions, see:
• `Mobile/iOS/README.md` - iOS development and App Store submission guide

---

```

```
