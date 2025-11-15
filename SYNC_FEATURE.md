# Cloud Sync Feature - Technical Documentation

## Overview

Copacl now includes **End-to-End Encrypted Cloud Sync**, allowing users to securely synchronize their clipboard history across multiple devices (iOS, Android, and Web).

## Architecture

### Security Model

The sync feature implements a **zero-knowledge architecture** where:
- All clipboard data is encrypted on the client device before transmission
- The server never has access to unencrypted content
- Each device has its own encryption key pair
- Master encryption key is derived from user credentials

### Encryption Stack

- **Algorithm**: AES-256-GCM for data encryption
- **Key Derivation**: PBKDF2 with 100,000 iterations
- **Device Authentication**: RSA-2048 key pairs
- **Random IV**: 12-byte initialization vector per encryption

### Database Schema

#### `devices` Table
Stores registered devices for each user:
- `deviceId`: Unique device identifier
- `deviceName`: Human-readable device name
- `deviceType`: ios, android, or web
- `publicKey`: RSA public key for device authentication
- `lastSyncAt`: Timestamp of last successful sync
- `isActive`: Boolean flag for device status

#### `syncQueue` Table
Manages pending sync operations:
- `itemId`: Reference to clipboard item
- `action`: create, update, or delete
- `encryptedData`: AES-encrypted clipboard content
- `iv`: Initialization vector for decryption
- `syncStatus`: pending, synced, or failed

#### `userKeys` Table
Stores user encryption keys:
- `encryptedMasterKey`: Master key encrypted with user password
- `salt`: Salt for key derivation

## API Endpoints

All sync endpoints are under `trpc.sync.*`:

### Device Management
- `registerDevice`: Register a new device
- `getDevices`: Get all user devices
- `deactivateDevice`: Remove a device
- `updateLastSync`: Update device sync timestamp

### Sync Operations
- `addToQueue`: Add item to sync queue
- `getPendingItems`: Get pending sync items
- `markSynced`: Mark item as synced

### Key Management
- `storeKey`: Store user encryption key
- `getKey`: Retrieve user encryption key

## Client-Side Implementation

### Encryption Service (`client/src/lib/encryption.ts`)

Key functions:
- `generateEncryptionKey()`: Generate AES-256 key
- `generateKeyPair()`: Generate RSA key pair
- `encryptData()`: Encrypt data with AES-GCM
- `decryptData()`: Decrypt data with AES-GCM
- `deriveKeyFromPassword()`: Derive key using PBKDF2
- `getDeviceId()`: Get or create unique device ID

### Sync Hook (`client/src/hooks/useSync.ts`)

Provides sync functionality:
- `initializeSync()`: Enable sync for current device
- `syncItem()`: Sync a clipboard item
- `processPendingItems()`: Process pending sync queue
- `syncStatus`: Current sync status and statistics

### Auto-Sync

- Automatically syncs every 30 seconds when enabled
- Triggered on clipboard item create/update/delete
- Optimistic updates for instant UI feedback

## User Interface

### Sync Settings Page (`/sync`)

Features:
- Enable/disable sync toggle
- Sync status dashboard (last sync, device count, pending items)
- Manual sync trigger
- Connected devices list
- Device management (remove devices)
- Security information display

### Home Page Integration

- Sync button in header
- Automatic sync on item operations
- Sync status indicator

## Security Considerations

### What's Encrypted
✅ Clipboard item content
✅ Metadata (type, timestamps)
✅ User-generated tags

### What's NOT Encrypted
❌ User ID (needed for routing)
❌ Device ID (needed for device management)
❌ Sync timestamps (needed for conflict resolution)

### Key Storage
- Encryption keys stored in browser `localStorage`
- Keys never transmitted to server in plain text
- Master key encrypted with user-derived password

### Device Trust
- Each device generates its own key pair
- Public keys stored on server for authentication
- Private keys never leave the device

## Conflict Resolution

Current implementation uses **last-write-wins** strategy:
- Items are timestamped on creation/update
- Newer items override older ones
- Future enhancement: version vectors for better conflict detection

## Performance Optimization

- **Batch Sync**: Multiple items synced in single request
- **Incremental Sync**: Only pending items are synced
- **Lazy Loading**: Encryption keys loaded on demand
- **Background Sync**: Non-blocking sync operations

## Testing

### Manual Testing Checklist

1. **Enable Sync**
   - [ ] Navigate to /sync
   - [ ] Click "Enable Sync"
   - [ ] Verify device registered

2. **Create Item**
   - [ ] Add clipboard item
   - [ ] Verify item encrypted and added to sync queue
   - [ ] Check sync status updates

3. **Multi-Device**
   - [ ] Open app on second device
   - [ ] Enable sync with same account
   - [ ] Verify items appear on both devices

4. **Device Management**
   - [ ] View connected devices
   - [ ] Remove a device
   - [ ] Verify device no longer syncs

5. **Encryption**
   - [ ] Check database for encrypted data
   - [ ] Verify data is unreadable without key
   - [ ] Test decryption on client

## Future Enhancements

### Planned Features
- [ ] Selective sync (choose which items to sync)
- [ ] Sync conflict UI (manual resolution)
- [ ] Sync history and audit log
- [ ] Export/import encryption keys
- [ ] Backup and recovery options
- [ ] Real-time sync with WebSockets
- [ ] Sync bandwidth optimization
- [ ] Offline queue management

### Security Enhancements
- [ ] Key rotation mechanism
- [ ] Device verification (2FA)
- [ ] Encrypted device names
- [ ] Session management
- [ ] Audit logging

## Troubleshooting

### Common Issues

**Sync not working**
- Check if sync is enabled in settings
- Verify device is registered
- Check browser console for errors
- Ensure localStorage is not blocked

**Items not appearing**
- Trigger manual sync
- Check pending items count
- Verify encryption key exists
- Check network connectivity

**Encryption errors**
- Clear localStorage and re-enable sync
- Regenerate encryption keys
- Check browser crypto API support

### Debug Mode

Enable debug logging:
```javascript
localStorage.setItem('copacl_debug', 'true');
```

## API Reference

### Encryption Functions

```typescript
// Generate new encryption key
const key = await generateEncryptionKey();

// Encrypt data
const { encryptedData, iv } = await encryptData("content", key);

// Decrypt data
const content = await decryptData(encryptedData, iv, key);
```

### Sync Functions

```typescript
// Initialize sync
const success = await initializeSync();

// Sync an item
await syncItem(itemId, "create", content);

// Process pending items
await processPendingItems();
```

## Compliance

### GDPR Compliance
- Users have full control over their data
- Data can be deleted at any time
- Encryption ensures data privacy
- No third-party access to unencrypted data

### Data Retention
- Sync queue items retained for 30 days
- Inactive devices marked after 90 days
- Users can manually delete devices anytime

---

**Last Updated**: November 2025
**Version**: 2.0.0
**Author**: Copacl Development Team
