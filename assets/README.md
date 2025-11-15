# Copacl - App Store Assets

This folder contains all the assets needed for publishing Copacl on Google Play Store and Apple App Store.

---

## 📁 Files Included

### App Icons

| File | Size | Purpose |
|------|------|---------|
| `app-icon-1024.png` | 1024×1024 | iOS App Store, High-res master |
| `app-icon-512.png` | 512×512 | Google Play Store listing |

### Splash Screens

| File | Size | Purpose |
|------|------|---------|
| `splash-screen.png` | 2732×2732 | Launch screen for both platforms |

### Screenshots

| File | Size | Purpose |
|------|------|---------|
| `screenshots/screenshot-1.png` | 1265×728 | Main interface screenshot |

**Note:** You may need additional screenshots showing:
- Clipboard monitoring in action
- Folder organization
- Search functionality
- Sync settings
- Quick actions for links

---

## 📱 Android Assets (Already Configured)

Android icons have been automatically generated and placed in:
```
../android/app/src/main/res/
├── mipmap-mdpi/ic_launcher.png (48×48)
├── mipmap-hdpi/ic_launcher.png (72×72)
├── mipmap-xhdpi/ic_launcher.png (96×96)
├── mipmap-xxhdpi/ic_launcher.png (144×144)
└── mipmap-xxxhdpi/ic_launcher.png (192×192)
```

---

## 🍎 iOS Assets (Requires macOS)

For iOS, you'll need to:
1. Open the project in Xcode (on macOS)
2. Navigate to `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
3. Drag and drop `app-icon-1024.png` into the appropriate slot
4. Xcode will automatically generate all required sizes

---

## 📸 Screenshot Requirements

### Google Play Store

**Phone Screenshots** (Required - minimum 2, maximum 8):
- Recommended size: 1080×1920 (portrait) or 1920×1080 (landscape)
- Format: PNG or JPEG
- Max file size: 8MB each

**Tablet Screenshots** (Optional):
- Recommended size: 2048×2732 (portrait) or 2732×2048 (landscape)

### Apple App Store

**iPhone Screenshots** (Required for each device size):
- 6.7" Display: 1290×2796 or 1284×2778
- 6.5" Display: 1284×2778 or 1242×2688
- 5.5" Display: 1242×2208

**iPad Screenshots** (Required if supporting iPad):
- 12.9" Display: 2048×2732
- 11" Display: 1668×2388

---

## 🎨 Design Specifications

### App Icon
- **Style:** Modern, minimalist clipboard with gradient
- **Colors:** Purple to Blue gradient (#8b5cf6 → #3b82f6)
- **Background:** Dark (#0a0a0a)
- **Format:** PNG with transparency (except iOS which requires no alpha)

### Splash Screen
- **Background:** Dark (#0a0a0a)
- **Icon:** Centered with subtle glow
- **Text:** "Copacl" in white below icon
- **Duration:** 2 seconds (configured in capacitor.config.ts)

---

## ✅ Checklist Before Submission

### Assets
- [x] App icon (1024×1024)
- [x] App icon (512×512)
- [x] Splash screen
- [x] At least 1 screenshot
- [ ] 2-8 phone screenshots (recommended)
- [ ] Tablet screenshots (optional)
- [ ] Feature graphic for Google Play (1024×500)

### Descriptions
- [ ] Short description (80 characters)
- [ ] Full description (4000 characters max)
- [ ] What's new / Release notes
- [ ] Privacy policy URL

### Technical
- [x] Keystore created and configured
- [ ] APK/AAB built and tested
- [ ] App tested on physical devices
- [ ] All features working correctly

---

## 📝 Store Listing Text

### App Name
**Copacl - Smart Clipboard Manager**

### Short Description (80 characters)
Smart clipboard manager - Never lose what you copy again!

### Keywords (for App Store)
clipboard, manager, copy, paste, history, sync, productivity, tools, organize

### Category
- **Google Play:** Tools / Productivity
- **App Store:** Utilities / Productivity

---

## 🔗 Additional Resources

- [Google Play Console](https://play.google.com/console)
- [App Store Connect](https://appstoreconnect.apple.com)
- [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/) - Generate additional icon variants
- [App Icon Generator](https://appicon.co/) - Generate iOS icons

---

## 💡 Tips for Better Screenshots

1. **Show the app in action** - Don't just show empty states
2. **Add text overlays** - Highlight key features
3. **Use device frames** - Makes screenshots look more professional
4. **Show different features** - Each screenshot should demonstrate a unique capability
5. **Use consistent branding** - Match your app's color scheme

### Recommended Tools
- [Screely](https://screely.com/) - Add browser mockups
- [Mockuphone](https://mockuphone.com/) - Device frame mockups
- [Figma](https://figma.com/) - Design custom screenshots with annotations

---

## 🚀 Ready to Publish?

Once you have all assets ready:
1. Follow instructions in `../CAPACITOR_DEPLOYMENT.md`
2. Build your APK/AAB using `../BUILD_APK_LOCALLY.md`
3. Submit to app stores
4. Wait for review (usually 1-3 days)

Good luck! 🎉
