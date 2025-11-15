import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_TITLE } from "@/const";
import { useClipboardMonitor } from "@/hooks/useClipboardMonitor";
import { CheckCircle2, Clipboard, Lock, Smartphone, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function Setup() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { requestPermission, hasPermission, isSupported } = useClipboardMonitor();
  const [isRequesting, setIsRequesting] = useState(false);

  // Redirect if already has permission
  useEffect(() => {
    if (hasPermission) {
      setLocation("/");
    }
  }, [hasPermission, setLocation]);

  const handleRequestPermission = async () => {
    setIsRequesting(true);
    const granted = await requestPermission();
    setIsRequesting(false);

    if (granted) {
      // Wait a moment then redirect
      setTimeout(() => {
        setLocation("/");
      }, 1500);
    }
  };

  const handleSkip = () => {
    setLocation("/");
  };

  if (!isSupported) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-lg w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <Clipboard className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Browser Not Supported</CardTitle>
            <CardDescription>
              Your browser doesn't support the Clipboard API required for automatic monitoring.
              Please use a modern browser like Chrome, Edge, or Safari.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleSkip} className="w-full">
              Continue Anyway
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to {APP_TITLE}
          </h1>
          <p className="text-xl text-muted-foreground">
            {user?.name ? `Hi ${user.name}! ` : ""}Let's set up automatic clipboard monitoring
          </p>
        </div>

        {/* Main Setup Card */}
        <Card className="border-2">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Clipboard className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-2xl">Enable Automatic Clipboard Capture</CardTitle>
            <CardDescription className="text-base">
              Grant clipboard access to automatically save everything you copy
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Features */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex gap-3 p-4 rounded-lg bg-muted/50">
                <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Automatic Capture</h3>
                  <p className="text-sm text-muted-foreground">
                    Every copy operation is automatically saved to your history
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-4 rounded-lg bg-muted/50">
                <Smartphone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Works Everywhere</h3>
                  <p className="text-sm text-muted-foreground">
                    Captures clipboard from any app on your device
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-4 rounded-lg bg-muted/50">
                <Lock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Private & Secure</h3>
                  <p className="text-sm text-muted-foreground">
                    Your clipboard data is encrypted and stored securely
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-4 rounded-lg bg-muted/50">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Smart Detection</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatically recognizes URLs, emails, and phone numbers
                  </p>
                </div>
              </div>
            </div>

            {/* How it works */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">
                  i
                </span>
                How it works
              </h3>
              <p className="text-sm text-muted-foreground pl-8">
                When you grant permission, {APP_TITLE} will check your clipboard every 1.5 seconds
                for new content. Any new text or link you copy will be automatically saved to your
                history. You can pause monitoring anytime from the main screen.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={handleRequestPermission}
                disabled={isRequesting}
                size="lg"
                className="flex-1 text-base h-12"
              >
                {isRequesting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Requesting Permission...
                  </>
                ) : (
                  <>
                    <Clipboard className="w-5 h-5 mr-2" />
                    Grant Clipboard Access
                  </>
                )}
              </Button>

              <Button
                onClick={handleSkip}
                variant="outline"
                size="lg"
                className="sm:w-auto text-base h-12"
              >
                Skip for Now
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              You can enable this feature later from the settings
            </p>
          </CardContent>
        </Card>

        {/* Browser Note */}
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Note:</strong> On mobile devices, you may need to interact with the page
              (tap anywhere) before clipboard access works. This is a browser security feature.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
