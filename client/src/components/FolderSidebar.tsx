import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import {
  Folder,
  FolderPlus,
  Inbox,
  Loader2,
  MoreVertical,
  Pencil,
  Star,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FolderSidebarProps {
  selectedFolderId: number | null | "all" | "favorites";
  onSelectFolder: (folderId: number | null | "all" | "favorites") => void;
}

export default function FolderSidebar({ selectedFolderId, onSelectFolder }: FolderSidebarProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolder, setEditingFolder] = useState<{ id: number; name: string } | null>(null);
  const [deletingFolder, setDeletingFolder] = useState<number | null>(null);

  const utils = trpc.useUtils();
  const { data: folders, isLoading } = trpc.folders.list.useQuery();
  const createFolder = trpc.folders.create.useMutation({
    onSuccess: () => {
      utils.folders.list.invalidate();
      setIsCreating(false);
      setNewFolderName("");
      toast.success("Folder created!");
    },
  });

  const updateFolder = trpc.folders.update.useMutation({
    onSuccess: () => {
      utils.folders.list.invalidate();
      setEditingFolder(null);
      toast.success("Folder renamed!");
    },
  });

  const deleteFolder = trpc.folders.delete.useMutation({
    onSuccess: () => {
      utils.folders.list.invalidate();
      utils.clipboard.list.invalidate();
      setDeletingFolder(null);
      toast.success("Folder deleted!");
    },
  });

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    createFolder.mutate({ name: newFolderName.trim() });
  };

  const handleRenameFolder = () => {
    if (!editingFolder || !editingFolder.name.trim()) return;
    updateFolder.mutate({
      folderId: editingFolder.id,
      name: editingFolder.name.trim(),
    });
  };

  const handleDeleteFolder = () => {
    if (!deletingFolder) return;
    deleteFolder.mutate({ folderId: deletingFolder });
  };

  return (
    <>
      <Card className="p-4 space-y-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm text-foreground">Folders</h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsCreating(true)}
          >
            <FolderPlus className="w-4 h-4" />
          </Button>
        </div>

        {/* Default Views */}
        <Button
          variant={selectedFolderId === "all" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => onSelectFolder("all")}
        >
          <Inbox className="w-4 h-4 mr-2" />
          All Items
        </Button>

        <Button
          variant={selectedFolderId === "favorites" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => onSelectFolder("favorites")}
        >
          <Star className="w-4 h-4 mr-2 fill-yellow-500 text-yellow-500" />
          Favorites
        </Button>

        <Button
          variant={selectedFolderId === null ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => onSelectFolder(null)}
        >
          <Folder className="w-4 h-4 mr-2" />
          Uncategorized
        </Button>

        <div className="border-t border-border my-2" />

        {/* User Folders */}
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : folders && folders.length > 0 ? (
          <div className="space-y-1">
            {folders.map((folder) => (
              <div
                key={folder.id}
                className="group flex items-center justify-between"
              >
                <Button
                  variant={selectedFolderId === folder.id ? "secondary" : "ghost"}
                  className="flex-1 justify-start"
                  onClick={() => onSelectFolder(folder.id)}
                >
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: folder.color || "#8b5cf6" }}
                  />
                  <span className="truncate">{folder.name}</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setEditingFolder({ id: folder.id, name: folder.name })}
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDeletingFolder(folder.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground text-center py-4">
            No folders yet. Create one!
          </p>
        )}
      </Card>

      {/* Create Folder Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Give your folder a name to organize your clipboard items.
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Folder name..."
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder} disabled={createFolder.isPending}>
              {createFolder.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Folder Dialog */}
      <Dialog open={!!editingFolder} onOpenChange={() => setEditingFolder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Folder</DialogTitle>
            <DialogDescription>
              Enter a new name for this folder.
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Folder name..."
            value={editingFolder?.name || ""}
            onChange={(e) =>
              setEditingFolder(editingFolder ? { ...editingFolder, name: e.target.value } : null)
            }
            onKeyDown={(e) => e.key === "Enter" && handleRenameFolder()}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingFolder(null)}>
              Cancel
            </Button>
            <Button onClick={handleRenameFolder} disabled={updateFolder.isPending}>
              {updateFolder.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Folder Dialog */}
      <Dialog open={!!deletingFolder} onOpenChange={() => setDeletingFolder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Folder</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this folder? Items inside will be moved to
              "Uncategorized".
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingFolder(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteFolder}
              disabled={deleteFolder.isPending}
            >
              {deleteFolder.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
