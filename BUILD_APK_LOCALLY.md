# Building Copacl APK Locally

This guide explains how to build the Copacl Android APK on your local machine or using CI/CD services.

---

## Prerequisites

### Required Software

1. **Java Development Kit (JDK) 17**
   - Download from: https://adoptium.net/
   - Or use: `sudo apt install openjdk-17-jdk` (Linux)
   - Verify: `java -version` (should show version 17.x.x)

2. **Android Studio** (Recommended) or **Android SDK Command Line Tools**
   - Download from: https://developer.android.com/studio
   - During installation, make sure to install:
     - Android SDK
     - Android SDK Platform (API 34 or higher)
     - Android SDK Build-Tools
     - Android SDK Platform-Tools

3. **Node.js & pnpm** (for building web assets)
   - Already configured in the project
   - Run `pnpm install` to install dependencies

---

## Environment Setup

### 1. Set Environment Variables

**Linux/macOS:**
```bash
export JAVA_HOME=/path/to/jdk-17
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools
```

**Windows:**
```cmd
set JAVA_HOME=C:\Program Files\Java\jdk-17
set ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk
set PATH=%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools
```

### 2. Create local.properties

Create `android/local.properties` file:
```properties
sdk.dir=/path/to/Android/Sdk
```

**Example paths:**
- Linux: `sdk.dir=/home/username/Android/Sdk`
- macOS: `sdk.dir=/Users/username/Library/Android/sdk`
- Windows: `sdk.dir=C:\\Users\\username\\AppData\\Local\\Android\\Sdk`

---

## Building Steps

### Step 1: Build Web Assets

```bash
cd /path/to/copacl
pnpm install
pnpm run build
cp -r dist/public/* client/dist/
```

### Step 2: Sync Capacitor

```bash
npx cap sync android
```

### Step 3: Build Debug APK (for testing)

```bash
cd android
./gradlew assembleDebug
```

**Output:** `android/app/build/outputs/apk/debug/app-debug.apk`

### Step 4: Build Release APK (for distribution)

```bash
cd android
./gradlew assembleRelease
```

**Output:** `android/app/build/outputs/apk/release/app-release.apk`

### Step 5: Build Release AAB (for Google Play Store)

```bash
cd android
./gradlew bundleRelease
```

**Output:** `android/app/build/outputs/bundle/release/app-release.aab`

---

## Code Signing (Already Configured)

The project is already configured with a keystore for signing:

- **Keystore file:** `copacl-release-key.keystore`
- **Store password:** `copacl2024`
- **Key alias:** `copacl`
- **Key password:** `copacl2024`

**⚠️ Important for Production:**
- Create a new keystore with strong passwords
- Store the keystore securely (never commit to git)
- Update `android/app/build.gradle` with new keystore details

### Creating a New Keystore

```bash
keytool -genkey -v -keystore my-release-key.keystore \
  -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

Then update `android/app/build.gradle`:
```gradle
signingConfigs {
    release {
        storeFile file("../../my-release-key.keystore")
        storePassword "your-store-password"
        keyAlias "my-key-alias"
        keyPassword "your-key-password"
    }
}
```

---

## Using Android Studio

### Option 1: Open in Android Studio

1. Open Android Studio
2. Click "Open an Existing Project"
3. Navigate to `copacl/android` folder
4. Wait for Gradle sync to complete
5. Click "Build" → "Build Bundle(s) / APK(s)" → "Build APK(s)"

### Option 2: Run on Emulator/Device

1. Connect Android device or start emulator
2. In Android Studio, click "Run" button (green play icon)
3. Select your device
4. App will be installed and launched

---

## Using CI/CD (GitHub Actions)

Create `.github/workflows/android-build.yml`:

```yaml
name: Android Build

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up JDK 17
      uses: actions/setup-java@v3
      with:
        java-version: '17'
        distribution: 'temurin'
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '22'
    
    - name: Install pnpm
      run: npm install -g pnpm
    
    - name: Install dependencies
      run: pnpm install
    
    - name: Build web assets
      run: |
        pnpm run build
        cp -r dist/public/* client/dist/
    
    - name: Sync Capacitor
      run: npx cap sync android
    
    - name: Build Debug APK
      run: |
        cd android
        chmod +x gradlew
        ./gradlew assembleDebug
    
    - name: Upload APK
      uses: actions/upload-artifact@v3
      with:
        name: app-debug
        path: android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Troubleshooting

### Issue: "SDK location not found"
**Solution:** Create `android/local.properties` with correct SDK path

### Issue: "Java version mismatch"
**Solution:** Ensure JAVA_HOME points to JDK 17

### Issue: "Gradle build failed"
**Solution:** 
```bash
cd android
./gradlew clean
./gradlew assembleDebug --stacktrace
```

### Issue: "Keystore not found"
**Solution:** Ensure `copacl-release-key.keystore` is in project root

---

## Testing the APK

### Install on Android Device

**Using ADB:**
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

**Manual Installation:**
1. Copy APK to device
2. Open file manager on device
3. Tap on APK file
4. Allow installation from unknown sources if prompted
5. Tap "Install"

---

## App Store Submission

### Google Play Store

1. Create a Google Play Developer account ($25 one-time fee)
2. Go to https://play.google.com/console
3. Create a new app
4. Fill in store listing details (see CAPACITOR_DEPLOYMENT.md)
5. Upload `app-release.aab` (not APK)
6. Complete all required sections
7. Submit for review

### Testing Before Submission

Use **Internal Testing** track:
1. Upload AAB to Internal Testing
2. Add test users
3. Share test link with testers
4. Collect feedback
5. Fix issues
6. Promote to Production when ready

---

## Assets Included

The following assets are ready for app store submission:

- ✅ App Icon (1024x1024): `assets/app-icon-1024.png`
- ✅ App Icon (512x512): `assets/app-icon-512.png`
- ✅ Splash Screen: `assets/splash-screen.png`
- ✅ Android Icons (all densities): `android/app/src/main/res/mipmap-*/`
- ✅ Screenshots: `assets/screenshots/`

---

## Next Steps

1. Build and test debug APK locally
2. Test on multiple Android devices
3. Create production keystore with strong passwords
4. Build release AAB
5. Prepare store listing (descriptions, screenshots, etc.)
6. Submit to Google Play Store

Good luck with your app launch! 🚀
