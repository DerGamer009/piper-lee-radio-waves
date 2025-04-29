
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Edit, PieChart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

interface Poll {
  id: string;
  question: string;
  is_active: boolean;
  created_at: string;
  start_date: string;
  end_date: string | null;
}

interface PollOption {
  id: string;
  poll_id: string;
  option_text: string;
}

interface PollWithOptions extends Poll {
  options: PollOption[];
  votes: number;
}

const PollManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddingPoll, setIsAddingPoll] = useState(false);
  const [isEditingPoll, setIsEditingPoll] = useState(false);
  const [currentPoll, setCurrentPoll] = useState<PollWithOptions | null>(null);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pollToDelete, setPollToDelete] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);

  const { data: polls, isLoading } = useQuery({
    queryKey: ['polls'],
    queryFn: async () => {
      // Fetch polls
      const { data: pollsData, error: pollsError } = await supabase
        .from('polls')
        .select('*')
        .order('created_at', { ascending: false });

      if (pollsError) {
        throw pollsError;
      }

      // Fetch options for each poll
      const pollsWithOptions = await Promise.all(
        pollsData.map(async (poll: Poll) => {
          const { data: optionsData } = await supabase
            .from('poll_options')
            .select('*')
            .eq('poll_id', poll.id);

          // Count votes for each poll
          const { data: votesData } = await supabase
            .from('poll_votes')
            .select('id')
            .eq('poll_id', poll.id);

          return {
            ...poll,
            options: optionsData || [],
            votes: votesData?.length || 0
          };
        })
      );

      return pollsWithOptions;
    }
  });

  const createPollMutation = useMutation({
    mutationFn: async () => {
      // Insert poll
      const { data: poll, error: pollError } = await supabase
        .from('polls')
        .insert([{ 
          question,
          is_active: isActive
        }])
        .select()
        .single();

      if (pollError) {
        throw pollError;
      }

      // Insert options
      const validOptions = options.filter(opt => opt.trim() !== '');
      if (validOptions.length < 2) {
        throw new Error('Es müssen mindestens zwei Optionen angegeben werden.');
      }

      const optionsToInsert = validOptions.map(option => ({
        poll_id: poll.id,
        option_text: option
      }));

      const { error: optionsError } = await supabase
        .from('poll_options')
        .insert(optionsToInsert);

      if (optionsError) {
        throw optionsError;
      }

      return poll;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['polls'] });
      resetForm();
      toast({
        title: 'Umfrage erstellt',
        description: 'Die Umfrage wurde erfolgreich erstellt.'
      });
    },
    onError: (error) => {
      toast({
        title: 'Fehler',
        description: `Fehler beim Erstellen der Umfrage: ${error.message}`,
        variant: 'destructive'
      });
    }
  });

  const updatePollMutation = useMutation({
    mutationFn: async () => {
      if (!currentPoll) return null;

      // Update poll
      const { error: pollError } = await supabase
        .from('polls')
        .update({ 
          question,
          is_active: isActive
        })
        .eq('id', currentPoll.id);

      if (pollError) {
        throw pollError;
      }

      // Delete existing options
      const { error: deleteError } = await supabase
        .from('poll_options')
        .delete()
        .eq('poll_id', currentPoll.id);

      if (deleteError) {
        throw deleteError;
      }

      // Insert new options
      const validOptions = options.filter(opt => opt.trim() !== '');
      if (validOptions.length < 2) {
        throw new Error('Es müssen mindestens zwei Optionen angegeben werden.');
      }

      const optionsToInsert = validOptions.map(option => ({
        poll_id: currentPoll.id,
        option_text: option
      }));

      const { error: optionsError } = await supabase
        .from('poll_options')
        .insert(optionsToInsert);

      if (optionsError) {
        throw optionsError;
      }

      return currentPoll;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['polls'] });
      resetForm();
      toast({
        title: 'Umfrage aktualisiert',
        description: 'Die Umfrage wurde erfolgreich aktualisiert.'
      });
    },
    onError: (error) => {
      toast({
        title: 'Fehler',
        description: `Fehler beim Aktualisieren der Umfrage: ${error.message}`,
        variant: 'destructive'
      });
    }
  });

  const deletePollMutation = useMutation({
    mutationFn: async (pollId: string) => {
      const { error } = await supabase
        .from('polls')
        .delete()
        .eq('id', pollId);

      if (error) {
        throw error;
      }
      return pollId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['polls'] });
      setIsDeleteDialogOpen(false);
      toast({
        title: 'Umfrage gelöscht',
        description: 'Die Umfrage wurde erfolgreich gelöscht.'
      });
    },
    onError: (error) => {
      toast({
        title: 'Fehler',
        description: `Fehler beim Löschen der Umfrage: ${error.message}`,
        variant: 'destructive'
      });
    }
  });

  const togglePollStatus = useMutation({
    mutationFn: async ({ id, is_active }: { id: string, is_active: boolean }) => {
      const { error } = await supabase
        .from('polls')
        .update({ is_active })
        .eq('id', id);

      if (error) {
        throw error;
      }
      return { id, is_active };
    },
    onSuccess: ({ id, is_active }) => {
      queryClient.invalidateQueries({ queryKey: ['polls'] });
      toast({
        title: `Umfrage ${is_active ? 'aktiviert' : 'deaktiviert'}`,
        description: `Die Umfrage wurde erfolgreich ${is_active ? 'aktiviert' : 'deaktiviert'}.`
      });
    },
    onError: (error) => {
      toast({
        title: 'Fehler',
        description: `Status konnte nicht geändert werden: ${error.message}`,
        variant: 'destructive'
      });
    }
  });

  const handleDeletePoll = (pollId: string) => {
    setPollToDelete(pollId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (pollToDelete) {
      deletePollMutation.mutate(pollToDelete);
    }
  };

  const handleEditPoll = (poll: PollWithOptions) => {
    setCurrentPoll(poll);
    setQuestion(poll.question);
    setIsActive(poll.is_active);
    setOptions(poll.options.map(opt => opt.option_text));
    // Add empty options if there are fewer than 2
    if (poll.options.length < 2) {
      setOptions([...poll.options.map(opt => opt.option_text), '', ''].slice(0, 2));
    }
    setIsEditingPoll(true);
  };

  const handleToggleStatus = (pollId: string, currentStatus: boolean) => {
    togglePollStatus.mutate({ id: pollId, is_active: !currentStatus });
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    } else {
      toast({
        title: 'Mindestens zwei Optionen',
        description: 'Eine Umfrage muss mindestens zwei Optionen haben.',
        variant: 'destructive'
      });
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const resetForm = () => {
    setQuestion('');
    setOptions(['', '']);
    setIsActive(true);
    setCurrentPoll(null);
    setIsAddingPoll(false);
    setIsEditingPoll(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditingPoll) {
      updatePollMutation.mutate();
    } else {
      createPollMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Umfragen werden geladen...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-4">
            <div className="animate-spin h-10 w-10 border-4 border-radio-purple border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Umfragen verwalten</CardTitle>
          {!isAddingPoll && !isEditingPoll && (
            <Button onClick={() => setIsAddingPoll(true)}>
              <Plus className="h-4 w-4 mr-2" /> Neue Umfrage
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {(isAddingPoll || isEditingPoll) ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="question">Frage</Label>
                <Textarea 
                  id="question" 
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Geben Sie Ihre Frage ein..."
                  required
                  className="mt-1"
                />
              </div>
              
              <div className="space-y-3">
                <Label>Optionen</Label>
                {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      required
                    />
                    <Button 
                      type="button"
                      variant="outline" 
                      size="sm"
                      onClick={() => removeOption(index)}
                      disabled={options.length <= 2}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={addOption}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Option hinzufügen
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="is-active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
                <Label htmlFor="is-active">Umfrage aktiv</Label>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={resetForm}
                >
                  Abbrechen
                </Button>
                <Button type="submit">
                  {isEditingPoll ? 'Aktualisieren' : 'Erstellen'}
                </Button>
              </div>
            </form>
          ) : (
            <>
              {polls && polls.length > 0 ? (
                <div className="space-y-4">
                  {polls.map((poll: PollWithOptions) => (
                    <Card key={poll.id} className="overflow-hidden">
                      <div className="p-4 border-b flex items-center justify-between">
                        <div className="flex items-center">
                          <PieChart className="h-5 w-5 text-radio-purple mr-2" />
                          <div>
                            <h3 className="font-medium">{poll.question}</h3>
                            <p className="text-xs text-gray-500">
                              {new Date(poll.created_at).toLocaleDateString()} • {poll.votes} Stimmen
                            </p>
                          </div>
                        </div>
                        <Badge variant={poll.is_active ? "success" : "secondary"}>
                          {poll.is_active ? 'Aktiv' : 'Inaktiv'}
                        </Badge>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {poll.options.map((option, i) => (
                            <div 
                              key={option.id} 
                              className="px-3 py-1 text-sm bg-gray-100 rounded"
                            >
                              {i+1}. {option.option_text}
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleToggleStatus(poll.id, poll.is_active)}
                          >
                            {poll.is_active ? 'Deaktivieren' : 'Aktivieren'}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditPoll(poll)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeletePoll(poll.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p>Keine Umfragen vorhanden</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setIsAddingPoll(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Umfrage erstellen
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Umfrage löschen</AlertDialogTitle>
            <AlertDialogDescription>
              Sind Sie sicher, dass Sie diese Umfrage löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PollManagement;
