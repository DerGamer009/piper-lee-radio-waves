
import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash, ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { createPartner, updatePartner, deletePartner, fetchPartners } from "@/services/radioService";

interface Partner {
  id: string;
  name: string;
  description?: string;
  website_url?: string;
  logo_url?: string;
  is_active?: boolean;
}

const PartnerManagement = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [formData, setFormData] = useState<Omit<Partner, "id">>({
    name: "",
    description: "",
    website_url: "",
    logo_url: "",
    is_active: true,
  });
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>("");
  const { toast } = useToast();

  const fetchPartnerData = async () => {
    setLoading(true);
    try {
      const data = await fetchPartners();
      setPartners(data);
    } catch (error) {
      console.error("Error fetching partners:", error);
      toast({
        title: "Fehler",
        description: "Partner konnten nicht geladen werden.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartnerData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPartnerData().finally(() => {
      setRefreshing(false);
      toast({
        title: "Aktualisiert",
        description: "Die Partner wurden aktualisiert.",
      });
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_active: checked }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      website_url: "",
      logo_url: "",
      is_active: true,
    });
    setEditingPartner(null);
  };

  const handleOpenDialog = (partner?: Partner) => {
    if (partner) {
      setEditingPartner(partner);
      setFormData({
        name: partner.name,
        description: partner.description || "",
        website_url: partner.website_url || "",
        logo_url: partner.logo_url || "",
        is_active: partner.is_active !== false,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleOpenDeleteDialog = (id: string) => {
    setSelectedPartnerId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast({
        title: "Fehler",
        description: "Name ist ein Pflichtfeld.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingPartner) {
        // Update existing partner
        await updatePartner(editingPartner.id, formData);
        toast({
          title: "Erfolg",
          description: "Partner wurde aktualisiert.",
        });
      } else {
        // Create new partner
        await createPartner(formData);
        toast({
          title: "Erfolg",
          description: "Neuer Partner wurde erstellt.",
        });
      }
      handleCloseDialog();
      fetchPartnerData();
    } catch (error) {
      console.error("Error saving partner:", error);
      toast({
        title: "Fehler",
        description: editingPartner
          ? "Partner konnte nicht aktualisiert werden."
          : "Partner konnte nicht erstellt werden.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedPartnerId) return;
    
    try {
      await deletePartner(selectedPartnerId);
      toast({
        title: "Erfolg",
        description: "Partner wurde gelöscht.",
      });
      fetchPartnerData();
    } catch (error) {
      console.error("Error deleting partner:", error);
      toast({
        title: "Fehler",
        description: "Partner konnte nicht gelöscht werden.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedPartnerId("");
    }
  };

  return (
    <Card className="bg-[#1c1f2f] border-0 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-white text-lg md:text-xl">Partner verwalten</CardTitle>
          <CardDescription className="text-gray-400">
            Erstellen und verwalten Sie Partnerschaften für die Radio-Website.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="border-gray-700 text-gray-300 hover:text-white"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Aktualisieren
          </Button>
          <Button 
            onClick={() => handleOpenDialog()} 
            size="sm" 
            className="bg-[#7c4dff] hover:bg-[#9e77ff] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Neuer Partner
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin h-12 w-12 border-4 border-[#7c4dff] border-t-transparent rounded-full"></div>
          </div>
        ) : partners.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-700/50">
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white">Name</TableHead>
                  <TableHead className="text-white">Beschreibung</TableHead>
                  <TableHead className="text-white">Website</TableHead>
                  <TableHead className="text-white">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partners.map((partner) => (
                  <TableRow key={partner.id} className="border-b border-gray-700/50 hover:bg-gray-800/20">
                    <TableCell>
                      {partner.is_active !== false ? (
                        <div className="flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-green-500"></span>
                          <span className="text-sm text-green-500">Aktiv</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-gray-500"></span>
                          <span className="text-sm text-gray-400">Inaktiv</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium text-white">{partner.name}</TableCell>
                    <TableCell className="text-gray-300 max-w-[280px] truncate">
                      {partner.description || "-"}
                    </TableCell>
                    <TableCell>
                      {partner.website_url ? (
                        <a
                          href={partner.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-[#7c4dff] hover:text-[#9e77ff]"
                        >
                          <span className="mr-1 underline">Website</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(partner)}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDeleteDialog(partner.id)}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🤝</div>
            <p className="text-lg font-semibold text-white mb-2">Keine Partner gefunden</p>
            <p className="text-gray-400 mb-6">
              Sie haben noch keine Partner hinzugefügt. Erstellen Sie Ihren ersten Partner.
            </p>
            <Button 
              onClick={() => handleOpenDialog()} 
              className="bg-[#7c4dff] hover:bg-[#9e77ff] text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Neuen Partner hinzufügen
            </Button>
          </div>
        )}
      </CardContent>

      {/* Create/Edit Partner Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#252a40] text-white border-gray-700 max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingPartner ? "Partner bearbeiten" : "Neuen Partner erstellen"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingPartner
                ? "Bearbeiten Sie die Details des Partners."
                : "Fügen Sie einen neuen Partner hinzu."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-300">
                Name*
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Name des Partners"
                required
                className="bg-[#1c1f2f] border-gray-700 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-gray-300">
                Beschreibung
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Beschreibung des Partners"
                className="bg-[#1c1f2f] border-gray-700 text-white h-20"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="website_url" className="text-sm font-medium text-gray-300">
                Website URL
              </label>
              <Input
                id="website_url"
                name="website_url"
                value={formData.website_url}
                onChange={handleInputChange}
                placeholder="https://example.com"
                className="bg-[#1c1f2f] border-gray-700 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="logo_url" className="text-sm font-medium text-gray-300">
                Logo URL
              </label>
              <Input
                id="logo_url"
                name="logo_url"
                value={formData.logo_url}
                onChange={handleInputChange}
                placeholder="https://example.com/logo.png"
                className="bg-[#1c1f2f] border-gray-700 text-white"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-300">Status</span>
                <span className="text-xs text-gray-400">
                  Ist dieser Partner aktiv?
                </span>
              </div>
              <Switch
                checked={formData.is_active}
                onCheckedChange={handleSwitchChange}
                className="data-[state=checked]:bg-[#7c4dff]"
              />
            </div>
            
            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
                className="border-gray-700 text-gray-300 hover:text-white"
              >
                Abbrechen
              </Button>
              <Button
                type="submit"
                className="bg-[#7c4dff] hover:bg-[#9e77ff] text-white"
              >
                {editingPartner ? "Aktualisieren" : "Erstellen"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-[#252a40] text-white border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle>Partner löschen</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Sind Sie sicher, dass Sie diesen Partner löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-700 text-gray-300 hover:text-white">
              Abbrechen
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default PartnerManagement;
