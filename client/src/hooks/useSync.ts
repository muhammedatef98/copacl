import { trpc } from "@/lib/trpc";
import {
  decryptData,
  encryptData,
  exportKey,
  generateEncryptionKey,
  generateKeyPair,
  getDeviceId,
  getStoredEncryptionKey,
  importKey,
  storeEncryptionKey,
} from "@/lib/encryption";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export interface SyncStatus {
  enabled: boolean;
  lastSync: Date | null;
  deviceCount: number;
  pendingItems: number;
}

export function useSync() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    enabled: false,
    lastSync: null,
    deviceCount: 0,
    pendingItems: 0,
  });
  const [isSyncing, setIsSyncing] = useState(false);

  const utils = trpc.useUtils();
  const { data: devices = [] } = trpc.sync.getDevices.useQuery();
  const { data: pendingItems = [] } = trpc.sync.getPendingItems.useQuery();
  const registerDeviceMutation = trpc.sync.registerDevice.useMutation();
  const addToQueueMutation = trpc.sync.addToQueue.useMutation();
  const markSyncedMutation = trpc.sync.markSynced.useMutation();
  const updateLastSyncMutation = trpc.sync.updateLastSync.useMutation();

  // Update sync status
  useEffect(() => {
    const currentDevice = devices.find((d) => d.deviceId === getDeviceId());
    setSyncStatus({
      enabled: devices.length > 0,
      lastSync: currentDevice?.lastSyncAt || null,
      deviceCount: devices.length,
      pendingItems: pendingItems.length,
    });
  }, [devices, pendingItems]);

  // Initialize sync (register device)
  const initializeSync = async () => {
    try {
      const deviceId = getDeviceId();
      const deviceName = getDeviceName();
      const deviceType = getDeviceType();

      // Generate key pair for this device
      const keyPair = await generateKeyPair();

      // Register device
      await registerDeviceMutation.mutateAsync({
        deviceId,
        deviceName,
        deviceType,
        publicKey: keyPair.publicKey,
      });

      // Generate or retrieve encryption key
      let encryptionKey = getStoredEncryptionKey();
      if (!encryptionKey) {
        const key = await generateEncryptionKey();
        encryptionKey = await exportKey(key);
        storeEncryptionKey(encryptionKey);
      }

      utils.sync.getDevices.invalidate();
      toast.success("Sync enabled successfully!");
      return true;
    } catch (error) {
      console.error("Failed to initialize sync:", error);
      toast.error("Failed to enable sync");
      return false;
    }
  };

  // Sync clipboard item
  const syncItem = async (
    itemId: number,
    action: "create" | "update" | "delete",
    content?: string
  ) => {
    try {
      const deviceId = getDeviceId();
      const encryptionKeyString = getStoredEncryptionKey();

      if (!encryptionKeyString) {
        console.warn("No encryption key found, skipping sync");
        return;
      }

      const encryptionKey = await importKey(encryptionKeyString);

      let encryptedData: string | undefined;
      let iv: string | undefined;

      if (content && action !== "delete") {
        const encrypted = await encryptData(content, encryptionKey);
        encryptedData = encrypted.encryptedData;
        iv = encrypted.iv;
      }

      await addToQueueMutation.mutateAsync({
        deviceId,
        itemId,
        action,
        encryptedData,
        iv,
      });

      utils.sync.getPendingItems.invalidate();
    } catch (error) {
      console.error("Failed to sync item:", error);
    }
  };

  // Process pending sync items
  const processPendingItems = async () => {
    if (isSyncing || pendingItems.length === 0) return;

    setIsSyncing(true);
    try {
      const encryptionKeyString = getStoredEncryptionKey();
      if (!encryptionKeyString) {
        console.warn("No encryption key found");
        return;
      }

      const encryptionKey = await importKey(encryptionKeyString);

      for (const item of pendingItems) {
        try {
          // Decrypt and apply changes
          if (item.encryptedData && item.iv) {
            const decryptedContent = await decryptData(
              item.encryptedData,
              item.iv,
              encryptionKey
            );

            // Apply the sync action based on item.action
            // This would trigger the appropriate clipboard mutation
            console.log("Synced item:", item.id, decryptedContent);
          }

          // Mark as synced
          await markSyncedMutation.mutateAsync({ syncId: item.id });
        } catch (error) {
          console.error("Failed to process sync item:", item.id, error);
        }
      }

      // Update last sync time
      const deviceId = getDeviceId();
      await updateLastSyncMutation.mutateAsync({ deviceId });

      utils.sync.getPendingItems.invalidate();
      utils.sync.getDevices.invalidate();
    } catch (error) {
      console.error("Failed to process pending items:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Auto-sync every 30 seconds
  useEffect(() => {
    if (!syncStatus.enabled) return;

    const interval = setInterval(() => {
      processPendingItems();
    }, 30000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncStatus.enabled]);

  return {
    syncStatus,
    isSyncing,
    initializeSync,
    syncItem,
    processPendingItems,
    devices,
  };
}

// Helper functions
function getDeviceName(): string {
  const userAgent = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(userAgent)) {
    return "iPhone";
  } else if (/Android/.test(userAgent)) {
    return "Android Device";
  } else if (/Mac/.test(userAgent)) {
    return "Mac";
  } else if (/Windows/.test(userAgent)) {
    return "Windows PC";
  } else {
    return "Web Browser";
  }
}

function getDeviceType(): string {
  const userAgent = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(userAgent)) {
    return "ios";
  } else if (/Android/.test(userAgent)) {
    return "android";
  } else {
    return "web";
  }
}
