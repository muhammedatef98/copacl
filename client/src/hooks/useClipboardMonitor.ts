import { trpc } from "@/lib/trpc";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface ClipboardMonitorState {
  isMonitoring: boolean;
  hasPermission: boolean;
  lastContent: string | null;
  itemsCaptured: number;
}

export function useClipboardMonitor() {
  const [state, setState] = useState<ClipboardMonitorState>({
    isMonitoring: false,
    hasPermission: false,
    lastContent: null,
    itemsCaptured: 0,
  });

  const monitorIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastContentRef = useRef<string | null>(null);
  const createItemMutation = trpc.clipboard.create.useMutation();

  // Check if browser supports Clipboard API
  const isClipboardSupported = useCallback(() => {
    return (
      typeof navigator !== "undefined" &&
      "clipboard" in navigator &&
      "readText" in navigator.clipboard
    );
  }, []);

  // Request clipboard permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isClipboardSupported()) {
      toast.error("Clipboard API is not supported in this browser");
      return false;
    }

    try {
      // Try to read clipboard to trigger permission request
      await navigator.clipboard.readText();
      
      setState((prev) => ({ ...prev, hasPermission: true }));
      localStorage.setItem("clipboard_permission_granted", "true");
      toast.success("Clipboard access granted!");
      return true;
    } catch (error) {
      console.error("Permission denied:", error);
      toast.error("Clipboard permission denied. Please allow clipboard access in your browser settings.");
      setState((prev) => ({ ...prev, hasPermission: false }));
      return false;
    }
  }, [isClipboardSupported]);

  // Read clipboard content
  const readClipboard = useCallback(async (): Promise<string | null> => {
    if (!isClipboardSupported()) {
      return null;
    }

    try {
      const text = await navigator.clipboard.readText();
      return text;
    } catch (error) {
      // Permission might have been revoked
      console.warn("Failed to read clipboard:", error);
      setState((prev) => ({ ...prev, hasPermission: false }));
      return null;
    }
  }, [isClipboardSupported]);

  // Save clipboard item to database
  const saveClipboardItem = useCallback(
    async (content: string) => {
      try {
        // Detect content type
        let type: "text" | "link" = "text";
        
        // Check if it's a URL
        try {
          const url = new URL(content);
          if (url.protocol === "http:" || url.protocol === "https:") {
            type = "link";
          }
        } catch {
          // Not a URL, keep as text
        }

        await createItemMutation.mutateAsync({
          content,
          type,
        });

        setState((prev) => ({
          ...prev,
          itemsCaptured: prev.itemsCaptured + 1,
        }));

        // Show subtle notification
        toast.success("📋 New clipboard item saved", {
          duration: 2000,
        });
      } catch (error) {
        console.error("Failed to save clipboard item:", error);
      }
    },
    [createItemMutation]
  );

  // Monitor clipboard for changes
  const checkClipboard = useCallback(async () => {
    const content = await readClipboard();

    if (!content) {
      return;
    }

    // Check if content is different from last captured
    if (content !== lastContentRef.current && content.trim().length > 0) {
      lastContentRef.current = content;
      setState((prev) => ({ ...prev, lastContent: content }));
      
      // Save to database
      await saveClipboardItem(content);
    }
  }, [readClipboard, saveClipboardItem]);

  // Start monitoring
  const startMonitoring = useCallback(async () => {
    // Check permission first
    const hasPermission = await requestPermission();
    if (!hasPermission) {
      return false;
    }

    // Clear any existing interval
    if (monitorIntervalRef.current) {
      clearInterval(monitorIntervalRef.current);
    }

    // Start polling every 1.5 seconds
    monitorIntervalRef.current = setInterval(() => {
      checkClipboard();
    }, 1500);

    setState((prev) => ({ ...prev, isMonitoring: true }));
    localStorage.setItem("clipboard_monitoring_enabled", "true");
    toast.success("🔍 Clipboard monitoring started");
    
    return true;
  }, [requestPermission, checkClipboard]);

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    if (monitorIntervalRef.current) {
      clearInterval(monitorIntervalRef.current);
      monitorIntervalRef.current = null;
    }

    setState((prev) => ({ ...prev, isMonitoring: false }));
    localStorage.setItem("clipboard_monitoring_enabled", "false");
    toast.info("⏸️ Clipboard monitoring paused");
  }, []);

  // Toggle monitoring
  const toggleMonitoring = useCallback(async () => {
    if (state.isMonitoring) {
      stopMonitoring();
    } else {
      await startMonitoring();
    }
  }, [state.isMonitoring, startMonitoring, stopMonitoring]);

  // Auto-start monitoring if previously enabled
  useEffect(() => {
    const wasEnabled = localStorage.getItem("clipboard_monitoring_enabled") === "true";
    const hadPermission = localStorage.getItem("clipboard_permission_granted") === "true";

    if (wasEnabled && hadPermission) {
      // Delay auto-start by 1 second to avoid issues on page load
      const timer = setTimeout(() => {
        startMonitoring();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [startMonitoring]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (monitorIntervalRef.current) {
        clearInterval(monitorIntervalRef.current);
      }
    };
  }, []);

  return {
    ...state,
    isSupported: isClipboardSupported(),
    requestPermission,
    startMonitoring,
    stopMonitoring,
    toggleMonitoring,
  };
}
