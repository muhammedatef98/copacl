import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSync } from "@/hooks/useSync";
import { trpc } from "@/lib/trpc";
import {
  Check,
  Cloud,
  CloudOff,
  Loader2,
  RefreshCw,
  Shield,
  Smartphone,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function SyncSettings() {
  const { syncStatus, isSyncing, initializeSync, processPendingItems, devices } = useSync();
  const [showEnableDialog, setShowEnableDialog] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState<string | null>(null);

  const deactivateDeviceMutation = trpc.sync.deactivateDevice.useMutation();
  const utils = trpc.useUtils();

  const handleEnableSync = async () => {
    const success = await initializeSync();
    if (success) {
      setShowEnableDialog(false);
    }
  };

  const handleDeactivateDevice = async (deviceId: string) => {
    try {
      await deactivateDeviceMutation.mutateAsync({ deviceId });
      utils.sync.getDevices.invalidate();
      toast.success("Device removed successfully");
      setDeviceToDelete(null);
    } catch (error) {
      toast.error("Failed to remove device");
    }
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "Never";
    return new Date(date).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container py-4">
          <h1 className="text-2xl font-bold">Sync Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage cloud sync and connected devices
          </p>
        </div>
      </header>

      <main className="container py-8 space-y-6 max-w-4xl">
        {/* Sync Status Card */}
        <Card className="p-6 border-border/50 bg-card/50 backdrop-blur">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {syncStatus.enabled ? (
                  <Cloud className="w-5 h-5 text-green-500" />
                ) : (
                  <CloudOff className="w-5 h-5 text-muted-foreground" />
                )}
                <h2 className="text-lg font-semibold">
                  {syncStatus.enabled ? "Sync Enabled" : "Sync Disabled"}
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                {syncStatus.enabled
                  ? "Your clipboard is syncing across devices"
                  : "Enable sync to access your clipboard from any device"}
              </p>
            </div>
            {!syncStatus.enabled && (
              <Button onClick={() => setShowEnableDialog(true)}>
                <Cloud className="w-4 h-4 mr-2" />
                Enable Sync
              </Button>
            )}
          </div>

          {syncStatus.enabled && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Last Sync</p>
                <p className="text-sm font-medium">{formatDate(syncStatus.lastSync)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Connected Devices</p>
                <p className="text-sm font-medium">{syncStatus.deviceCount}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Pending Items</p>
                <p className="text-sm font-medium">{syncStatus.pendingItems}</p>
              </div>
            </div>
          )}

          {syncStatus.enabled && (
            <div className="mt-6 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => processPendingItems()}
                disabled={isSyncing}
              >
                {isSyncing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Sync Now
              </Button>
            </div>
          )}
        </Card>

        {/* Security Info */}
        <Card className="p-6 border-border/50 bg-card/50 backdrop-blur">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">End-to-End Encryption</h3>
              <p className="text-sm text-muted-foreground">
                Your clipboard data is encrypted on your device before being synced. Only you can
                decrypt and access your data. We never have access to your unencrypted content.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <div className="flex items-center gap-1 text-xs text-green-500">
                  <Check className="w-3 h-3" />
                  AES-256 Encryption
                </div>
                <div className="flex items-center gap-1 text-xs text-green-500">
                  <Check className="w-3 h-3" />
                  Zero-Knowledge Architecture
                </div>
                <div className="flex items-center gap-1 text-xs text-green-500">
                  <Check className="w-3 h-3" />
                  Device Authentication
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Connected Devices */}
        {syncStatus.enabled && devices.length > 0 && (
          <Card className="p-6 border-border/50 bg-card/50 backdrop-blur">
            <h3 className="font-semibold mb-4">Connected Devices</h3>
            <div className="space-y-3">
              {devices.map((device) => (
                <div
                  key={device.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-background/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{device.deviceName}</p>
                      <p className="text-xs text-muted-foreground">
                        {device.deviceType?.toUpperCase()} • Last sync:{" "}
                        {formatDate(device.lastSyncAt)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => setDeviceToDelete(device.deviceId)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}
      </main>

      {/* Enable Sync Dialog */}
      <Dialog open={showEnableDialog} onOpenChange={setShowEnableDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enable Cloud Sync</DialogTitle>
            <DialogDescription>
              Enable end-to-end encrypted sync to access your clipboard from any device.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">Fully Encrypted</p>
                <p className="text-xs text-muted-foreground">
                  Your data is encrypted on your device before syncing
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Cloud className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">Automatic Sync</p>
                <p className="text-xs text-muted-foreground">
                  Changes sync automatically across all your devices
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Smartphone className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">Multi-Device</p>
                <p className="text-xs text-muted-foreground">
                  Connect unlimited devices to your account
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEnableDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEnableSync}>Enable Sync</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Device Dialog */}
      <Dialog open={!!deviceToDelete} onOpenChange={() => setDeviceToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Device</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this device? It will no longer sync with your
              account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeviceToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deviceToDelete && handleDeactivateDevice(deviceToDelete)}
              disabled={deactivateDeviceMutation.isPending}
            >
              {deactivateDeviceMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
