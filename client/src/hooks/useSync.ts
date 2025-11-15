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
import { useCallback, useEffect, useRef, useState } from "react";
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
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const utils = trpc.useUtils();
  
  // Disable automatic refetching to prevent infinite loops
  const { data: devices = [], refetch: refetchDevices } = trpc.sync.getDevices.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
  
  const { data: pendingItems = [], refetch: refetchPending } = trpc.sync.getPendingItems.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
  
  const registerDeviceMutation = trpc.sync.registerDevice.useMutation();
  const addToQueueMutation = trpc.sync.addToQueue.useMutation();
  const markSyncedMutation = trpc.sync.markSynced.useMutation();
  const updateLastSyncMutation = trpc.sync.updateLastSync.useMutation();

  // Update sync status when devices or pending items change
  useEffect(() => {
    const currentDevice = devices.find((d) => d.deviceId === getDeviceId());
    setSyncStatus((prev) => {
      const newStatus = {
        enabled: devices.length > 0,
        lastSync: currentDevice?.lastSyncAt || null,
        deviceCount: devices.length,
        pendingItems: pendingItems.length,
      };
      
      // Only update if values actually changed
      if (
        prev.enabled !== newStatus.enabled ||
        prev.deviceCount !== newStatus.deviceCount ||
        prev.pendingItems !== newStatus.pendingItems ||
        prev.lastSync?.getTime() !== newStatus.lastSync?.getTime()
      ) {
        return newStatus;
      }
      return prev;
    });
  }, [devices, pendingItems]);

  // Initialize sync (register device)
  const initializeSync = useCallback(async () => {
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

      await refetchDevices();
      toast.success("Sync enabled successfully!");
      return true;
    } catch (error) {
      console.error("Failed to initialize sync:", error);
      toast.error("Failed to enable sync");
      return false;
    }
  }, [registerDeviceMutation, refetchDevices]);

  // Sync clipboard item
  const syncItem = useCallback(async (
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

      await refetchPending();
    } catch (error) {
      console.error("Failed to sync item:", error);
    }
  }, [addToQueueMutation, refetchPending]);

  // Process pending sync items
  const processPendingItems = useCallback(async () => {
    if (isSyncing) {
      console.log("Sync already in progress, skipping...");
      return;
    }
    
    // Refetch to get latest pending items
    const { data: latestPending } = await refetchPending();
    
    if (!latestPending || latestPending.length === 0) {
      console.log("No pending items to sync");
      return;
    }

    setIsSyncing(true);
    try {
      const encryptionKeyString = getStoredEncryptionKey();
      if (!encryptionKeyString) {
        console.warn("No encryption key found");
        return;
      }

      const encryptionKey = await importKey(encryptionKeyString);

      for (const item of latestPending) {
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

      await refetchPending();
      await refetchDevices();
    } catch (error) {
      console.error("Failed to process pending items:", error);
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, markSyncedMutation, updateLastSyncMutation, refetchPending, refetchDevices]);

  // Setup auto-sync interval
  useEffect(() => {
    // Clear any existing interval
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
      syncIntervalRef.current = null;
    }

    // Only setup interval if sync is enabled
    if (syncStatus.enabled) {
      console.log("Setting up auto-sync interval (every 30 seconds)");
      syncIntervalRef.current = setInterval(() => {
        console.log("Auto-sync triggered");
        processPendingItems();
      }, 30000);
    }

    // Cleanup on unmount or when sync is disabled
    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }
    };
  }, [syncStatus.enabled, processPendingItems]);

  return {
    syncStatus,
    isSyncing,
    initializeSync,
    syncItem,
    processPendingItems,
    devices,
    refetchDevices,
    refetchPending,
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
