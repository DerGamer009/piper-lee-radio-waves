import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Plus,
  Edit,
  Trash,
  ArrowDownToLine,
  RotateCw,
  Users,
  Key,
  Settings,
  Download,
  Upload,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  getUsers,
  createNewUser,
  updateUser,
  deleteUser,
  createBackup,
  getBackups,
  downloadBackup,
  restoreBackup,
  User,
  BackupInfo,
} from "@/services/apiService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import RadioCard from "@/components/dashboard/RadioCard";
import StatusManagement from "@/components/dashboard/StatusManagement";

const AdminPanel = () => {
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBackupDialogOpen, setIsBackupDialogOpen] = useState(false);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [backupList, setBackupList] = useState<BackupInfo[]>([]);
  const [backupLoading, setBackupLoading] = useState(false);
  const [restoringBackup, setRestoringBackup] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<BackupInfo | null>(null);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    email: "",
    fullName: "",
    roles: ["user"],
    isActive: true,
  });
  const [editedUser, setEditedUser] = useState<Partial<User>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: users,
    isLoading,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const { refetch: refetchBackups } = useQuery({
    queryKey: ["backups"],
    queryFn: getBackups,
  });

  // Set up effect to update backupList whenever data changes
  useEffect(() => {
    const fetchBackups = async () => {
      const data = await getBackups();
      setBackupList(data);
    };
    
    fetchBackups();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleRoleChange = (value: string) => {
    setNewUser((prevUser) => ({
      ...prevUser,
      roles: [value],
    }));
  };

  const handleEditRoleChange = (value: string) => {
    setEditedUser((prevUser) => ({
      ...prevUser,
      roles: [value],
    }));
  };

  const handleActiveChange = (checked: boolean) => {
    setNewUser((prevUser) => ({
      ...prevUser,
      isActive: checked,
    }));
  };

  const handleEditActiveChange = (checked: boolean) => {
    setEditedUser((prevUser) => ({
      ...prevUser,
      isActive: checked,
    }));
  };

  const handleCreateUser = async () => {
    try {
      await createNewUser(newUser);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Benutzer erstellt",
        description: "Der Benutzer wurde erfolgreich erstellt.",
      });
      setIsAddingUser(false);
      setNewUser({
        username: "",
        password: "",
        email: "",
        fullName: "",
        roles: ["user"],
        isActive: true,
      });
    } catch (error) {
      console.error("Error creating user:", error);
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Der Benutzer konnte nicht erstellt werden.",
      });
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditedUser({ ...user });
    setIsEditingUser(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      await updateUser(selectedUser.id, editedUser);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Benutzer aktualisiert",
        description: "Der Benutzer wurde erfolgreich aktualisiert.",
      });
      setIsEditingUser(false);
      setSelectedUser(null);
      setEditedUser({});
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Der Benutzer konnte nicht aktualisiert werden.",
      });
    }
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    try {
      await deleteUser(selectedUser.id);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Benutzer gelöscht",
        description: "Der Benutzer wurde erfolgreich gelöscht.",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Der Benutzer konnte nicht gelöscht werden.",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const handleBackupCreation = async () => {
    try {
      setBackupLoading(true);
      const result = await createBackup();
      console.log("Backup created:", result);

      // Manually update backup list after creation
      const data = await getBackups();
      setBackupList(data);

      toast({
        title: "Backup erstellt",
        description: "Das Backup wurde erfolgreich erstellt.",
      });
    } catch (error) {
      console.error("Error creating backup:", error);
      toast({
        variant: "destructive",
        title: "Fehler beim Erstellen des Backups",
        description: "Bitte versuchen Sie es später erneut.",
      });
    } finally {
      setBackupLoading(false);
    }
  };

  const handleBackupDownload = async (backupId: string) => {
    try {
      const result = await downloadBackup();
      if (result) {
        console.log("Download initiated");
      } else {
        toast({
          variant: "destructive",
          title: "Fehler beim Download",
          description: "Das Backup konnte nicht heruntergeladen werden.",
        });
      }
    } catch (error) {
      console.error("Error downloading backup:", error);
      toast({
        variant: "destructive",
        title: "Fehler beim Download",
        description: "Bitte versuchen Sie es später erneut.",
      });
    }
  };

  const handleBackupRestore = async (backupId: string) => {
    try {
      setRestoringBackup(true);
      const result = await restoreBackup();

      if (result && result.success) {
        toast({
          title: "Backup wiederhergestellt",
          description: "Das Backup wurde erfolgreich wiederhergestellt.",
        });

        refetchUsers();
      } else {
        toast({
          variant: "destructive",
          title: "Fehler bei der Wiederherstellung",
          description: result?.message || "Das Backup konnte nicht wiederhergestellt werden.",
        });
      }
    } catch (error) {
      console.error("Error restoring backup:", error);
      toast({
        variant: "destructive",
        title: "Fehler bei der Wiederherstellung",
        description: "Bitte versuchen Sie es später erneut.",
      });
    } finally {
      setRestoringBackup(false);
      setIsRestoreDialogOpen(false);
    }
  };

  // Add handler for the refetch button
  const handleRefetchBackups = () => {
    const fetchBackups = async () => {
      try {
        setBackupLoading(true);
        const data = await getBackups();
        setBackupList(data);
      } catch (error) {
        console.error("Error fetching backups:", error);
      } finally {
        setBackupLoading(false);
      }
    };
    
    fetchBackups();
  };

  if (isLoading) return <div className="p-4">Daten werden geladen...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
        <Settings className="h-6 w-6" />
        Admin-Bereich
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <RadioCard />
        <StatusManagement />
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Benutzerverwaltung
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Button onClick={() => setIsAddingUser(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Benutzer hinzufügen
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Benutzername</TableHead>
                <TableHead>E-Mail</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Rolle</TableHead>
                <TableHead>Aktiv</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.roles}</TableCell>
                  <TableCell>
                    {user.isActive ? (
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        Ja
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                        Nein
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditUser(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(user)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Backup-Verwaltung
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={() => handleBackupCreation()}
              disabled={backupLoading}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Backup erstellen
            </Button>
            <Button
              variant="outline"
              onClick={handleRefetchBackups}
              disabled={backupLoading}
              className="flex items-center gap-2"
            >
              <RotateCw className={`h-4 w-4 ${backupLoading ? "animate-spin" : ""}`} />
              Aktualisieren
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Erstellt am</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {backupList.map((backup) => (
                <TableRow key={backup.id}>
                  <TableCell>{backup.id}</TableCell>
                  <TableCell>{new Date(backup.created_at).toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleBackupDownload(backup.id)}
                    >
                      <ArrowDownToLine className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedBackup(backup);
                        setIsRestoreDialogOpen(true);
                      }}
                      disabled={restoringBackup}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modals and Dialogs */}
      {/* Add user dialog */}
      <Dialog open={isAddingUser} onOpenChange={setIsAddingUser}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Benutzer hinzufügen</DialogTitle>
            <DialogDescription>
              Erstellen Sie einen neuen Benutzer im System.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Benutzername
              </Label>
              <Input
                type="text"
                id="username"
                name="username"
                value={newUser.username}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Passwort
              </Label>
              <Input
                type="password"
                id="password"
                name="password"
                value={newUser.password}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                E-Mail
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={newUser.email}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fullName" className="text-right">
                Voller Name
              </Label>
              <Input
                type="text"
                id="fullName"
                name="fullName"
                value={newUser.fullName}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Rolle
              </Label>
              <Select onValueChange={handleRoleChange}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Rolle auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Benutzer</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="active" className="text-right">
                Aktiv
              </Label>
              <Switch
                id="active"
                checked={newUser.isActive}
                onCheckedChange={handleActiveChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsAddingUser(false)}>
              Abbrechen
            </Button>
            <Button type="submit" onClick={handleCreateUser}>
              Benutzer erstellen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit user dialog */}
      <Dialog open={isEditingUser} onOpenChange={setIsEditingUser}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Benutzer bearbeiten</DialogTitle>
            <DialogDescription>
              Bearbeiten Sie die Details des ausgewählten Benutzers.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_username" className="text-right">
                Benutzername
              </Label>
              <Input
                type="text"
                id="edit_username"
                name="username"
                value={editedUser.username || ""}
                onChange={handleEditInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_email" className="text-right">
                E-Mail
              </Label>
              <Input
                type="email"
                id="edit_email"
                name="email"
                value={editedUser.email || ""}
                onChange={handleEditInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_fullName" className="text-right">
                Voller Name
              </Label>
              <Input
                type="text"
                id="edit_fullName"
                name="fullName"
                value={editedUser.fullName || ""}
                onChange={handleEditInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_role" className="text-right">
                Rolle
              </Label>
              <Select onValueChange={handleEditRoleChange} defaultValue={editedUser.roles as string}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Rolle auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Benutzer</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_active" className="text-right">
                Aktiv
              </Label>
              <Switch
                id="edit_active"
                checked={editedUser.isActive === undefined ? false : editedUser.isActive}
                onCheckedChange={handleEditActiveChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsEditingUser(false)}>
              Abbrechen
            </Button>
            <Button type="submit" onClick={handleUpdateUser}>
              Benutzer aktualisieren
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete user confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Benutzer löschen</AlertDialogTitle>
            <AlertDialogDescription>
              Möchten Sie diesen Benutzer wirklich löschen? Diese Aktion kann
              nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Restore backup confirmation */}
      <AlertDialog open={isRestoreDialogOpen} onOpenChange={setIsRestoreDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Backup wiederherstellen</AlertDialogTitle>
            <AlertDialogDescription>
              Möchten Sie dieses Backup wirklich wiederherstellen? Alle aktuellen
              Daten werden überschrieben.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleBackupRestore(selectedBackup?.id || "")} disabled={restoringBackup}>
              Wiederherstellen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPanel;
