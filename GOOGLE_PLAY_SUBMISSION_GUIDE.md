# Google Play Console Submission Guide for Copacl

**Complete step-by-step guide to publish Copacl on Google Play Store**

---

## Prerequisites

Before starting the submission process, ensure you have:

- ✅ **Google Play Developer Account** ($25 one-time registration fee)
- ✅ **Signed APK/AAB file** (release build)
- ✅ **App assets** (icons, screenshots, feature graphic)
- ✅ **Store listing content** (descriptions, keywords)
- ✅ **Privacy policy URL** (required for apps that handle user data)

---

## Step 1: Register for Google Play Developer Account

### 1.1 Create Developer Account

1. Visit [Google Play Console](https://play.google.com/console)
2. Sign in with your Google account
3. Accept the Developer Distribution Agreement
4. Pay the **$25 one-time registration fee**
5. Complete your account details:
   - Developer name (will be public)
   - Email address
   - Phone number
   - Website (optional)

### 1.2 Set Up Payment Profile

1. Navigate to **Settings** → **Developer account** → **Payment profile**
2. Enter your payment information for receiving app revenue
3. Verify your identity (may require ID verification)

**Estimated time:** 30-60 minutes  
**Cost:** $25 USD (one-time)

---

## Step 2: Create Your App in Play Console

### 2.1 Create New App

1. Click **Create app** in Play Console dashboard
2. Fill in app details:
   - **App name:** Copacl
   - **Default language:** English (United States)
   - **App or game:** App
   - **Free or paid:** Free
3. Accept declarations:
   - ✅ Developer Program Policies
   - ✅ US export laws

### 2.2 Set Up App Access

Navigate to **App content** → **App access**:

- Select: **All functionality is available without special access**
- If you have restricted features, provide test credentials

---

## Step 3: Complete Store Listing

### 3.1 Main Store Listing

Navigate to **Store presence** → **Main store listing**

#### App Details

```
App name: Copacl - Smart Clipboard Manager
Short description: Never lose what you copy! Auto-capture, organize & sync clipboard history.
Full description: [Use content from STORE_LISTING.md]
```

#### Graphics

Upload the following assets (all files are in `/assets/` folder):

| Asset Type | Size | File | Required |
|------------|------|------|----------|
| App icon | 512 x 512 | `app-icon-512.png` | ✅ Yes |
| Feature graphic | 1024 x 500 | `feature-graphic.png` | ✅ Yes |
| Phone screenshots | 16:9 or 9:16 | `screenshots/screenshot-*.png` | ✅ Yes (2-8) |
| 7-inch tablet | 16:9 or 9:16 | (optional) | ❌ No |
| 10-inch tablet | 16:9 or 9:16 | (optional) | ❌ No |
| Promo video | YouTube URL | (optional) | ❌ No |

**Screenshot Requirements:**
- Minimum 2 screenshots, maximum 8
- JPEG or 24-bit PNG (no alpha)
- Minimum dimension: 320px
- Maximum dimension: 3840px
- Aspect ratio between 16:9 and 9:16

#### Categorization

```
App category: Productivity
Tags: clipboard, productivity, tools, utility
```

#### Contact Details

```
Email: support@copacl.app
Website: https://copacl.app
Phone: (optional)
```

---

## Step 4: Set Up App Content

### 4.1 Privacy Policy

1. Navigate to **App content** → **Privacy policy**
2. Enter your privacy policy URL: `https://copacl.app/privacy-policy.html`
3. The privacy policy must be publicly accessible

### 4.2 App Access

- Select how users can access your app
- For Copacl: **All functionality is available without restrictions**

### 4.3 Ads

- Does your app contain ads? **No**
- (Copacl is ad-free)

### 4.4 Content Rating

1. Click **Start questionnaire**
2. Enter your email address
3. Select app category: **Utility, Productivity, Communication, or Other**
4. Answer content questions:
   - Violence: No
   - Sexual content: No
   - Profanity: No
   - Controlled substances: No
   - User-generated content: No
   - User interaction: No
   - Data sharing: Yes (encrypted clipboard data)
5. Submit for rating

**Expected rating:** Everyone / PEGI 3 / ESRB Everyone

### 4.5 Target Audience

1. Select target age groups:
   - ✅ 18 and over (primary)
   - ✅ 13-17 (secondary, if applicable)
2. Appeal to children: **No**

### 4.6 News App

- Is this a news app? **No**

### 4.7 COVID-19 Contact Tracing

- Is this a contact tracing app? **No**

### 4.8 Data Safety

This is **critical** for Copacl as it handles clipboard data.

#### Data Collection

**Data types collected:**

| Data Type | Collected | Purpose | Shared |
|-----------|-----------|---------|--------|
| Personal info (email) | Yes | Account creation | No |
| App activity (clipboard content) | Yes | Core functionality | No |
| Device ID | Yes | Multi-device sync | No |

**Data security:**

- ✅ Data is encrypted in transit (TLS)
- ✅ Data is encrypted at rest (AES-256-GCM)
- ✅ Users can request data deletion
- ✅ Data follows Families Policy (if targeting children)

**Key points to emphasize:**

> Copacl uses end-to-end encryption (E2E). Your clipboard data is encrypted on your device before being sent to our servers. We cannot read your data—only you have the decryption keys.

---

## Step 5: Prepare Release

### 5.1 Select Countries

Navigate to **Production** → **Countries / regions**:

- **Recommended:** Select all available countries
- Or select specific regions based on your target audience

### 5.2 Create Release

1. Navigate to **Production** → **Releases**
2. Click **Create new release**

### 5.3 Upload App Bundle (AAB)

**Option A: Upload AAB (Recommended)**

```bash
# Build release AAB
cd /home/ubuntu/copacl/android
./gradlew bundleRelease

# AAB location:
# android/app/build/outputs/bundle/release/app-release.aab
```

**Option B: Upload APK**

```bash
# Build release APK
cd /home/ubuntu/copacl/android
./gradlew assembleRelease

# APK location:
# android/app/build/outputs/apk/release/app-release.apk
```

**Important:** Google Play requires AAB format for new apps (since August 2021).

### 5.4 Release Name

```
Version: 1.0.0
Release name: Initial Release - Smart Clipboard Manager
```

### 5.5 Release Notes

Use content from `STORE_LISTING.md` → Release Notes section:

```
🎉 Welcome to Copacl v1.0!

✨ Features:
• Automatic clipboard monitoring
• End-to-end encrypted cloud sync
• Smart content recognition (URLs, emails, phones)
• Powerful organization with folders and tags
• Beautiful dark theme interface
• Cross-device synchronization

📱 Works seamlessly on Android devices
🔒 Your data is always encrypted and private

Thank you for trying Copacl!
```

---

## Step 6: App Signing

### 6.1 Google Play App Signing (Recommended)

1. Navigate to **Release** → **Setup** → **App integrity**
2. Opt in to **Google Play App Signing**
3. Upload your upload key certificate

**Benefits:**
- Google manages your app signing key securely
- You can reset your upload key if compromised
- Automatic APK optimization

### 6.2 Manual Signing (Alternative)

If you prefer to manage your own keys:

```bash
# Sign APK manually
jarsigner -verbose \
  -sigalg SHA256withRSA \
  -digestalg SHA-256 \
  -keystore /home/ubuntu/copacl/copacl-release-key.jks \
  -storepass copacl2024 \
  android/app/build/outputs/apk/release/app-release-unsigned.apk \
  copacl-key

# Verify signature
jarsigner -verify -verbose -certs app-release.apk

# Align APK
zipalign -v 4 app-release-unsigned.apk app-release.apk
```

---

## Step 7: Review and Publish

### 7.1 Pre-Launch Report

Google Play will automatically test your app on real devices:

- Tests on ~20 different devices
- Checks for crashes and performance issues
- Provides screenshots and logs
- **Review time:** 1-2 hours after upload

### 7.2 Final Review Checklist

Before submitting, verify:

- ✅ All store listing content is complete
- ✅ Screenshots are high quality and representative
- ✅ Privacy policy is accessible
- ✅ Content rating is complete
- ✅ Data safety section is filled
- ✅ App is signed correctly
- ✅ Release notes are clear
- ✅ Target countries are selected

### 7.3 Submit for Review

1. Click **Review release**
2. Review all information
3. Click **Start rollout to Production**

---

## Step 8: Review Process

### 8.1 Timeline

| Stage | Duration | Status |
|-------|----------|--------|
| Upload complete | Immediate | ✅ |
| Pre-launch report | 1-2 hours | ⏳ |
| Google review | 1-7 days | ⏳ |
| Published | Immediate | ✅ |

**Average review time:** 1-3 days  
**Maximum review time:** 7 days

### 8.2 Common Rejection Reasons

**Be prepared for these common issues:**

1. **Privacy Policy Issues**
   - Policy not accessible
   - Policy doesn't mention data collection
   - Policy URL is broken

2. **Permissions Not Justified**
   - Clipboard permission must be clearly explained
   - Add explanation in app description

3. **Misleading Content**
   - Screenshots must show actual app functionality
   - Don't use mock-ups or concept designs

4. **Data Safety Incomplete**
   - Must disclose all data collection
   - Must explain encryption clearly

### 8.3 If Rejected

1. Read rejection email carefully
2. Fix the specific issues mentioned
3. Update your app or listing
4. Resubmit for review
5. Respond to reviewer comments if needed

---

## Step 9: Post-Publication

### 9.1 Monitor Performance

After publication, monitor:

- **Install metrics:** Track downloads and uninstalls
- **Ratings & reviews:** Respond to user feedback
- **Crash reports:** Fix bugs quickly
- **Pre-launch reports:** Check for device-specific issues

### 9.2 Update Your App

For future updates:

1. Increment version code and version name
2. Build new AAB/APK
3. Create new release in Production track
4. Add release notes
5. Submit for review

**Version naming convention:**
```
Version 1.0.0 → Initial release
Version 1.0.1 → Bug fixes
Version 1.1.0 → Minor features
Version 2.0.0 → Major update
```

### 9.3 Promote Your App

After publication:

- ✅ Share Play Store link on social media
- ✅ Update website with download badge
- ✅ Submit to app review sites
- ✅ Create promotional content
- ✅ Engage with user reviews

---

## Troubleshooting

### Issue: "Upload failed - Signature mismatch"

**Solution:**
```bash
# Delete existing keys and regenerate
rm copacl-release-key.jks
keytool -genkey -v -keystore copacl-release-key.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias copacl-key
```

### Issue: "App not compatible with any devices"

**Solution:**
Check `android/app/build.gradle`:
```gradle
android {
    defaultConfig {
        minSdkVersion 24  // Android 7.0+
        targetSdkVersion 34  // Latest
    }
}
```

### Issue: "Privacy policy URL not accessible"

**Solution:**
- Ensure privacy policy is hosted on a public URL
- Test URL in incognito browser
- Use HTTPS (not HTTP)

### Issue: "Pre-launch report shows crashes"

**Solution:**
1. Download crash logs from Play Console
2. Fix crashes in your code
3. Test on similar devices
4. Upload new build

---

## Important Notes

### Permissions Declaration

Copacl requires these permissions (already in `AndroidManifest.xml`):

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.READ_CLIPBOARD" />
<uses-permission android:name="android.permission.WRITE_CLIPBOARD" />
```

**Justification for review:**

> Copacl is a clipboard manager that requires clipboard access to automatically capture and save copied content. This is the core functionality of the app. All clipboard data is encrypted end-to-end before syncing to the cloud.

### Data Deletion

Users can request data deletion:

1. In-app: Settings → Account → Delete All Data
2. Email: support@copacl.app
3. Automatic: Account deletion removes all data within 30 days

### GDPR Compliance

For European users:

- ✅ Clear consent before data collection
- ✅ Easy data export (JSON format)
- ✅ Easy data deletion
- ✅ Privacy policy in user's language
- ✅ Data processing agreement

---

## Useful Resources

- [Google Play Console](https://play.google.com/console)
- [Developer Policy Center](https://support.google.com/googleplay/android-developer/topic/9858052)
- [App Content Guidelines](https://support.google.com/googleplay/android-developer/topic/9877467)
- [Data Safety Form](https://support.google.com/googleplay/android-developer/answer/10787469)
- [Release Management](https://support.google.com/googleplay/android-developer/topic/7071935)

---

## Quick Reference: Build Commands

```bash
# Navigate to Android project
cd /home/ubuntu/copacl/android

# Clean build
./gradlew clean

# Build debug APK (for testing)
./gradlew assembleDebug

# Build release AAB (for Play Store)
./gradlew bundleRelease

# Build release APK (alternative)
./gradlew assembleRelease

# Install on connected device
./gradlew installDebug
```

---

## Checklist Before Submission

Print this checklist and check off each item:

- [ ] Google Play Developer account created ($25 paid)
- [ ] App created in Play Console
- [ ] Store listing completed (name, descriptions, screenshots)
- [ ] App icon uploaded (512x512)
- [ ] Feature graphic uploaded (1024x500)
- [ ] At least 2 screenshots uploaded
- [ ] Privacy policy URL added
- [ ] Content rating completed
- [ ] Data safety form completed
- [ ] Target audience selected
- [ ] Countries/regions selected
- [ ] Release AAB/APK built and signed
- [ ] Release notes written
- [ ] Pre-launch report reviewed
- [ ] All declarations accepted
- [ ] Ready to submit!

---

**Good luck with your submission! 🚀**

If you encounter any issues, refer to the troubleshooting section or contact Google Play Developer Support.

---

*Document prepared for Copacl v1.0.0*  
*Last updated: November 2024*
