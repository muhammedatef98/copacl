# Automatic Clipboard Monitoring Feature

## Overview

Copacl includes an **automatic clipboard monitoring** feature that captures everything you copy on your device in real-time. This feature works across all apps and automatically saves clipboard content to your history.

## How It Works

### Architecture

The monitoring system uses the **Clipboard API** with a polling mechanism:

1. **Permission Request**: On first use, users are prompted to grant clipboard access
2. **Polling Mechanism**: Once enabled, the app checks the clipboard every 1.5 seconds
3. **Duplicate Detection**: Only new content is saved (prevents duplicate entries)
4. **Automatic Saving**: Detected content is automatically saved to the database
5. **Smart Recognition**: URLs, emails, and phone numbers are automatically detected

### Technical Implementation

**Hook: `useClipboardMonitor`**
- Located in: `client/src/hooks/useClipboardMonitor.ts`
- Uses `navigator.clipboard.readText()` API
- Implements interval-based polling with `setInterval`
- Stores last content in ref to detect changes
- Auto-starts on page load if previously enabled

**Setup Page**
- Located in: `client/src/pages/Setup.tsx`
- Shows on first visit for authenticated users
- Explains the feature with visual cards
- Handles permission requests gracefully
- Can be skipped and enabled later

## Browser Compatibility

### Supported Browsers
✅ Chrome 66+ (Desktop & Android)
✅ Edge 79+
✅ Safari 13.1+ (Desktop & iOS)
✅ Firefox 63+
✅ Opera 53+

### Limitations

**iOS Safari:**
- Requires user interaction before clipboard access works
- User must tap the page at least once after opening
- This is a browser security feature, not an app limitation

**Firefox:**
- May show permission prompt on every clipboard read
- Users can set "Always allow" in browser settings

**Incognito/Private Mode:**
- Clipboard API may be restricted in some browsers
- Feature will gracefully disable if not supported

## User Experience

### First Time Setup

1. User logs in and lands on home page
2. Automatically redirected to `/setup` page
3. Sees explanation of the feature
4. Clicks "Grant Clipboard Access"
5. Browser shows permission prompt
6. Once granted, redirected to home page
7. Monitoring starts automatically

### Daily Usage

1. **Active Monitoring**: Green "Monitoring" button shows in header
2. **Item Counter**: Badge shows number of items captured in current session
3. **Toast Notifications**: Subtle notification when new item is saved
4. **Pause/Resume**: Click button to toggle monitoring on/off
5. **Persistent State**: Monitoring state is saved and restored on page reload

### Visual Indicators

- **Monitoring Active**: Button has primary color and pulse animation
- **Monitoring Paused**: Button is outlined (not filled)
- **Items Captured**: Small badge with count next to button text
- **Toast Messages**: Brief notifications for new items

## Privacy & Security

### Data Protection

- **Local Processing**: Clipboard content is processed locally in the browser
- **Encrypted Storage**: All saved items are stored with E2E encryption (if sync enabled)
- **No External Sharing**: Clipboard data never leaves your devices
- **User Control**: Can be paused or disabled anytime

### Permission Model

- **Explicit Consent**: Users must explicitly grant permission
- **Revocable**: Permission can be revoked in browser settings
- **Transparent**: Clear explanation of what data is accessed

## Configuration

### Local Storage Keys

```javascript
// Permission state
localStorage.getItem("clipboard_permission_granted") // "true" | null

// Monitoring state
localStorage.getItem("clipboard_monitoring_enabled") // "true" | "false"

// Setup flow
localStorage.getItem("has_seen_setup") // "true" | null
```

### Polling Interval

Default: **1.5 seconds** (1500ms)

This interval balances:
- ✅ Fast enough to catch most clipboard operations
- ✅ Low enough CPU/battery impact
- ✅ Doesn't overwhelm the database with requests

Can be adjusted in `useClipboardMonitor.ts`:
```typescript
setInterval(() => {
  checkClipboard();
}, 1500); // Change this value
```

## Troubleshooting

### "Permission Denied" Error

**Cause**: User denied clipboard access or browser blocked it

**Solution**:
1. Check browser settings for clipboard permissions
2. Try in a different browser
3. Ensure not in incognito/private mode
4. On mobile, tap the page before granting permission

### Monitoring Not Working on Mobile

**Cause**: iOS Safari requires user interaction first

**Solution**:
1. Tap anywhere on the page after opening
2. Then click "Start Monitor" button
3. Grant permission when prompted

### Duplicate Items Being Saved

**Cause**: Polling interval too fast or duplicate detection failing

**Solution**:
- Check that `lastContentRef` is properly comparing content
- Ensure content is trimmed before comparison
- Verify polling interval isn't too aggressive

### High Battery Usage

**Cause**: Polling mechanism runs continuously

**Solution**:
- Pause monitoring when not needed
- Increase polling interval (trade-off: slower detection)
- Consider implementing visibility API to pause when tab is hidden

## Future Enhancements

### Potential Improvements

1. **Adaptive Polling**: Slow down when no activity detected
2. **Visibility API**: Pause when tab is hidden
3. **Image Support**: Capture copied images (requires different API)
4. **Configurable Interval**: Let users choose polling speed
5. **Clipboard Events**: Use Clipboard Events API when available (limited support)
6. **Background Service Worker**: Continue monitoring when tab is closed (PWA)

### Known Limitations

- **Cannot capture images**: Clipboard API for images has limited browser support
- **Cannot capture formatted text**: Only plain text is captured
- **Cannot run in background**: Monitoring stops when browser/tab is closed
- **Requires active tab**: Some browsers pause intervals in background tabs

## API Reference

### `useClipboardMonitor()` Hook

```typescript
const {
  isMonitoring,      // boolean - Is monitoring currently active?
  hasPermission,     // boolean - Has user granted clipboard permission?
  isSupported,       // boolean - Is Clipboard API supported in this browser?
  itemsCaptured,     // number - Count of items captured in current session
  lastContent,       // string | null - Last captured clipboard content
  requestPermission, // () => Promise<boolean> - Request clipboard permission
  startMonitoring,   // () => Promise<boolean> - Start monitoring
  stopMonitoring,    // () => void - Stop monitoring
  toggleMonitoring,  // () => Promise<void> - Toggle monitoring on/off
} = useClipboardMonitor();
```

## Testing Checklist

- [ ] Test on Chrome Desktop
- [ ] Test on Chrome Android
- [ ] Test on Safari Desktop
- [ ] Test on iOS Safari
- [ ] Test on Firefox
- [ ] Test permission grant flow
- [ ] Test permission deny flow
- [ ] Test pause/resume functionality
- [ ] Test duplicate detection
- [ ] Test auto-start on page reload
- [ ] Test with different content types (text, URLs)
- [ ] Test battery impact over extended period
- [ ] Test in incognito/private mode

## Support

For issues or questions about clipboard monitoring:

1. Check browser compatibility above
2. Review troubleshooting section
3. Verify browser permissions are granted
4. Test in a different browser to isolate issue
5. Check browser console for error messages

---

**Note**: This feature relies on modern browser APIs and may not work in older browsers or restricted environments. Always provide a manual "Add to Clipboard" option as a fallback.
