import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import {
  ClipboardList,
  Copy,
  Heart,
  Link2,
  Loader2,
  Pin,
  Plus,
  Search,
  Trash2,
  Image as ImageIcon,
  FileText,
  Star,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [newItemContent, setNewItemContent] = useState("");
  const [newItemType, setNewItemType] = useState<"text" | "image" | "link">("text");

  const utils = trpc.useUtils();

  // Fetch clipboard items
  const { data: items = [], isLoading: itemsLoading } = trpc.clipboard.list.useQuery(
    { limit: 100 },
    { enabled: isAuthenticated }
  );

  // Search items
  const { data: searchResults } = trpc.clipboard.search.useQuery(
    { searchTerm },
    { enabled: isAuthenticated && searchTerm.length > 0 }
  );

  // Mutations
  const createItem = trpc.clipboard.create.useMutation({
    onSuccess: () => {
      utils.clipboard.list.invalidate();
      setNewItemContent("");
      toast.success("Item added to clipboard!");
    },
  });

  const togglePin = trpc.clipboard.togglePin.useMutation({
    onMutate: async ({ itemId }) => {
      await utils.clipboard.list.cancel();
      const previousItems = utils.clipboard.list.getData();
      utils.clipboard.list.setData({ limit: 100 }, (old) =>
        old?.map((item) =>
          item.id === itemId ? { ...item, isPinned: item.isPinned ? 0 : 1 } : item
        )
      );
      return { previousItems };
    },
    onError: (err, variables, context) => {
      utils.clipboard.list.setData({ limit: 100 }, context?.previousItems);
      toast.error("Failed to pin item");
    },
    onSettled: () => {
      utils.clipboard.list.invalidate();
    },
  });

  const toggleFavorite = trpc.clipboard.toggleFavorite.useMutation({
    onMutate: async ({ itemId }) => {
      await utils.clipboard.list.cancel();
      const previousItems = utils.clipboard.list.getData();
      utils.clipboard.list.setData({ limit: 100 }, (old) =>
        old?.map((item) =>
          item.id === itemId ? { ...item, isFavorite: item.isFavorite ? 0 : 1 } : item
        )
      );
      return { previousItems };
    },
    onError: (err, variables, context) => {
      utils.clipboard.list.setData({ limit: 100 }, context?.previousItems);
      toast.error("Failed to favorite item");
    },
    onSettled: () => {
      utils.clipboard.list.invalidate();
    },
  });

  const deleteItem = trpc.clipboard.delete.useMutation({
    onMutate: async ({ itemId }) => {
      await utils.clipboard.list.cancel();
      const previousItems = utils.clipboard.list.getData();
      utils.clipboard.list.setData({ limit: 100 }, (old) =>
        old?.filter((item) => item.id !== itemId)
      );
      return { previousItems };
    },
    onError: (err, variables, context) => {
      utils.clipboard.list.setData({ limit: 100 }, context?.previousItems);
      toast.error("Failed to delete item");
    },
    onSettled: () => {
      utils.clipboard.list.invalidate();
    },
  });

  const clearAll = trpc.clipboard.clearAll.useMutation({
    onSuccess: () => {
      utils.clipboard.list.invalidate();
      toast.success("All items cleared!");
    },
  });

  const handleAddItem = () => {
    if (!newItemContent.trim()) {
      toast.error("Please enter some content");
      return;
    }

    createItem.mutate({
      type: newItemType,
      content: newItemContent,
    });
  };

  const handleCopyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const displayItems = searchTerm ? searchResults : items;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl">
                <ClipboardList className="w-10 h-10 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight">
              Welcome to <span className="gradient-text">{APP_TITLE}</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Your smart clipboard manager for iOS and Android. Never lose what you copy again.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-8">
            <Card className="p-4 space-y-2 border-border/50 bg-card/50 backdrop-blur">
              <Copy className="w-6 h-6 text-primary mx-auto" />
              <p className="text-sm font-medium">Auto Save</p>
              <p className="text-xs text-muted-foreground">Everything you copy is saved</p>
            </Card>
            <Card className="p-4 space-y-2 border-border/50 bg-card/50 backdrop-blur">
              <Search className="w-6 h-6 text-primary mx-auto" />
              <p className="text-sm font-medium">Quick Search</p>
              <p className="text-xs text-muted-foreground">Find anything instantly</p>
            </Card>
            <Card className="p-4 space-y-2 border-border/50 bg-card/50 backdrop-blur">
              <Sparkles className="w-6 h-6 text-primary mx-auto" />
              <p className="text-sm font-medium">Smart Sync</p>
              <p className="text-xs text-muted-foreground">Encrypted cloud sync</p>
            </Card>
          </div>

          <Button size="lg" className="w-full" asChild>
            <a href={getLoginUrl()}>
              Get Started
              <Sparkles className="ml-2 w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{APP_TITLE}</h1>
                <p className="text-xs text-muted-foreground">Welcome, {user?.name}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => clearAll.mutate()}
              disabled={clearAll.isPending || !items?.length}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-6">
        {/* Add New Item */}
        <Card className="p-6 space-y-4 border-border/50 bg-card/50 backdrop-blur">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Add to Clipboard</h2>
          </div>
          <div className="flex gap-2">
            <Button
              variant={newItemType === "text" ? "default" : "outline"}
              size="sm"
              onClick={() => setNewItemType("text")}
            >
              <FileText className="w-4 h-4 mr-2" />
              Text
            </Button>
            <Button
              variant={newItemType === "image" ? "default" : "outline"}
              size="sm"
              onClick={() => setNewItemType("image")}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Image
            </Button>
            <Button
              variant={newItemType === "link" ? "default" : "outline"}
              size="sm"
              onClick={() => setNewItemType("link")}
            >
              <Link2 className="w-4 h-4 mr-2" />
              Link
            </Button>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder={`Enter ${newItemType}...`}
              value={newItemContent}
              onChange={(e) => setNewItemContent(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
              className="flex-1"
            />
            <Button onClick={handleAddItem} disabled={createItem.isPending}>
              {createItem.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </Button>
          </div>
        </Card>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search your clipboard history..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Clipboard Items */}
        <div className="space-y-3">
          {itemsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : displayItems && displayItems.length > 0 ? (
            displayItems.map((item) => (
              <Card
                key={item.id}
                className="p-4 hover:border-primary/50 transition-all border-border/50 bg-card/50 backdrop-blur group"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    {item.type === "text" && <FileText className="w-5 h-5 text-primary" />}
                    {item.type === "image" && <ImageIcon className="w-5 h-5 text-primary" />}
                    {item.type === "link" && <Link2 className="w-5 h-5 text-primary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground break-words">
                      {item.content}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => togglePin.mutate({ itemId: item.id })}
                    >
                      <Pin
                        className={`w-4 h-4 ${item.isPinned ? "fill-primary text-primary" : ""}`}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleFavorite.mutate({ itemId: item.id })}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          item.isFavorite ? "fill-red-500 text-red-500" : ""
                        }`}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleCopyToClipboard(item.content)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => deleteItem.mutate({ itemId: item.id })}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-12 text-center border-border/50 bg-card/50 backdrop-blur">
              <ClipboardList className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No items yet</h3>
              <p className="text-sm text-muted-foreground">
                Start adding items to your clipboard history
              </p>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
