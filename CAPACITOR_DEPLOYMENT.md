# Copacl - Capacitor Native App Deployment Guide

## 📱 Overview

Copacl has been successfully converted to a Native App using Capacitor, making it ready for deployment on both Google Play Store and Apple App Store.

---

## 🎯 What's Included

### Platforms
- ✅ **Android** - Ready for Google Play Store
- ✅ **iOS** - Ready for Apple App Store

### Capacitor Plugins
- **@capacitor/app** (7.1.0) - App lifecycle management
- **@capacitor/clipboard** (7.0.2) - System clipboard access
- **@capacitor/haptics** (7.0.2) - Haptic feedback
- **@capacitor/share** (7.0.2) - Native share functionality
- **@capacitor/splash-screen** (7.0.3) - Splash screen management

### Configuration
- **App ID**: `com.copacl.app`
- **App Name**: Copacl
- **Web Dir**: `client/dist`
- **Scheme**: HTTPS (both platforms)

---

## 🔧 Development Commands

### Build Web Assets
```bash
pnpm run build
cp -r dist/public/* client/dist/
```

### Sync with Native Platforms
```bash
npx cap sync
```

### Open in Native IDEs
```bash
# Android Studio
npx cap open android

# Xcode (macOS only)
npx cap open ios
```

### Run on Device/Emulator
```bash
# Android
npx cap run android

# iOS (macOS only)
npx cap run ios
```

---

## 📦 Building for Production

### Android (APK/AAB)

#### Debug APK (for testing)
```bash
cd android
./gradlew assembleDebug
# Output: android/app/build/outputs/apk/debug/app-debug.apk
```

#### Release APK
```bash
cd android
./gradlew assembleRelease
# Output: android/app/build/outputs/apk/release/app-release.apk
```

#### Release AAB (for Play Store)
```bash
cd android
./gradlew bundleRelease
# Output: android/app/build/outputs/bundle/release/app-release.aab
```

### iOS (IPA)

**Requirements:**
- macOS with Xcode installed
- Apple Developer Account ($99/year)
- Provisioning profiles and certificates

```bash
# Open in Xcode
npx cap open ios

# Then in Xcode:
# 1. Select your development team
# 2. Configure signing & capabilities
# 3. Product → Archive
# 4. Distribute App → App Store Connect
```

---

## 🔐 Code Signing

### Android

1. **Generate Keystore** (first time only):
```bash
keytool -genkey -v -keystore copacl-release-key.keystore \
  -alias copacl -keyalg RSA -keysize 2048 -validity 10000
```

2. **Configure in `android/app/build.gradle`**:
```gradle
android {
    signingConfigs {
        release {
            storeFile file("path/to/copacl-release-key.keystore")
            storePassword "your-password"
            keyAlias "copacl"
            keyPassword "your-password"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

### iOS

- Managed through Xcode
- Requires Apple Developer Account
- Configure in Xcode → Signing & Capabilities

---

## 🚀 Publishing

### Google Play Store

1. **Create Developer Account** ($25 one-time fee)
   - Visit: https://play.google.com/console

2. **Prepare Store Listing**:
   - App name: Copacl
   - Short description: Smart clipboard manager for your mobile device
   - Full description: (see below)
   - Screenshots: 2-8 screenshots (1080x1920px recommended)
   - Feature graphic: 1024x500px
   - App icon: 512x512px

3. **Upload AAB**:
   - Go to Production → Create new release
   - Upload `app-release.aab`
   - Add release notes
   - Submit for review

4. **Review Process**: Usually 1-3 days

### Apple App Store

1. **Create Developer Account** ($99/year)
   - Visit: https://developer.apple.com

2. **App Store Connect**:
   - Create new app
   - Fill in app information
   - Upload screenshots (various sizes for different devices)
   - Set pricing and availability

3. **Upload IPA**:
   - Use Xcode or Transporter app
   - Submit for review

4. **Review Process**: Usually 1-3 days (can be longer)

---

## 📝 App Store Descriptions

### Short Description (80 characters)
Smart clipboard manager - Never lose what you copy again!

### Full Description

**Copacl - Your Smart Clipboard Manager**

Never lose important information you copy! Copacl automatically saves everything you copy on your device, making it easy to find and reuse later.

**✨ Key Features:**

📋 **Automatic Clipboard Monitoring**
- Captures everything you copy instantly
- Works in the background
- No manual saving required

🔍 **Powerful Search**
- Find any copied item quickly
- Search by content or type
- Filter by date

🗂️ **Smart Organization**
- Create custom folders
- Add tags to items
- Pin important clips
- Mark favorites

🔗 **Smart Content Recognition**
- Automatically detects URLs, emails, and phone numbers
- Quick actions for each content type
- One-tap to open links, send emails, or make calls

☁️ **Encrypted Cloud Sync**
- Sync across all your devices
- End-to-end encryption
- Your data stays private

🎨 **Beautiful & Fast**
- Modern, intuitive interface
- Dark mode support
- Lightning-fast performance

**Perfect for:**
- Students taking notes
- Developers copying code
- Writers collecting research
- Anyone who copies and pastes frequently

Download Copacl today and never lose important information again!

---

## 🔒 Privacy & Permissions

### Required Permissions

**Android (AndroidManifest.xml)**:
- `INTERNET` - For cloud sync
- `ACCESS_NETWORK_STATE` - Check connectivity
- `VIBRATE` - Haptic feedback

**iOS (Info.plist)**:
- `NSPhotoLibraryUsageDescription` - For saving images
- `NSCameraUsageDescription` - For capturing images (if needed)

### Privacy Policy

**Important**: Both app stores require a privacy policy URL. Make sure to:
1. Create a privacy policy document
2. Host it on a public URL
3. Include it in your store listing

Key points to cover:
- What data is collected (clipboard content)
- How it's stored (encrypted, local + cloud)
- How it's used (only by the user)
- Third-party services (if any)
- User rights (delete data, export data)

---

## 🎨 Assets Needed

### App Icons
- **Android**: 512x512px (PNG)
- **iOS**: 1024x1024px (PNG, no alpha channel)

### Splash Screen
- **Both platforms**: 2732x2732px (PNG)
- Background color: `#0a0a0a` (configured in capacitor.config.ts)

### Screenshots
- **Android**: 
  - Phone: 1080x1920px (min 2, max 8)
  - Tablet: 2048x2732px (optional)
- **iOS**:
  - 6.5" Display: 1284x2778px
  - 5.5" Display: 1242x2208px
  - iPad Pro: 2048x2732px

---

## 🐛 Troubleshooting

### Build Errors

**Android Gradle Issues**:
```bash
cd android
./gradlew clean
./gradlew build
```

**iOS CocoaPods Issues** (macOS only):
```bash
cd ios/App
pod install
pod update
```

### Sync Issues
```bash
# Clean and rebuild
rm -rf client/dist
pnpm run build
cp -r dist/public/* client/dist/
npx cap sync
```

---

## 📚 Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Developer Guide](https://developer.android.com)
- [iOS Developer Guide](https://developer.apple.com)
- [Google Play Console](https://play.google.com/console)
- [App Store Connect](https://appstoreconnect.apple.com)

---

## 🎉 Next Steps

1. **Test the app** on physical devices
2. **Create app store assets** (icons, screenshots, descriptions)
3. **Set up code signing** for both platforms
4. **Build release versions**
5. **Submit to app stores**

Good luck with your app launch! 🚀
