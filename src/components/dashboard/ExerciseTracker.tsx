
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Dumbbell, Calendar, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Exercise {
  id: string;
  title: string;
  description?: string;
  type: string;
  scheduled_time?: string;
  completed: boolean;
  created_at: string;
}

interface ExerciseFormData {
  title: string;
  description: string;
  scheduled_time: string;
}

export const ExerciseTracker = () => {
  const { user, session, isLoading: authLoading } = useAuth();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<ExerciseFormData>({
    defaultValues: {
      title: "",
      description: "",
      scheduled_time: "",
    },
  });

  // Debug function to log auth state
  useEffect(() => {
    console.log('ExerciseTracker - Auth state:', {
      user: user?.id,
      session: session?.user?.id,
      authLoading,
      isLoading
    });
  }, [user, session, authLoading, isLoading]);

  // Fetch user's exercises
  const fetchExercises = async () => {
    console.log('fetchExercises called - Auth state:', {
      user: user?.id,
      session: session?.user?.id,
      authLoading
    });

    if (authLoading) {
      console.log('Auth still loading, skipping fetch');
      return;
    }

    if (!user && !session?.user) {
      console.log('No user or session found');
      setIsLoading(false);
      return;
    }

    const userId = user?.id || session?.user?.id;
    if (!userId) {
      console.log('No user ID available');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Fetching exercises for user:', userId);
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', userId)
        .eq('type', 'workout')
        .gte('created_at', today)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching exercises:', error);
        toast.error('Erro ao carregar exercícios: ' + error.message);
        return;
      }

      console.log('Fetched exercises:', data);
      setExercises(data || []);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      toast.error('Erro ao carregar exercícios');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, [user, session, authLoading]);

  // Add new exercise
  const onSubmit = async (data: ExerciseFormData) => {
    console.log('onSubmit called with data:', data);
    console.log('Current auth state:', {
      user: user?.id,
      session: session?.user?.id
    });

    const userId = user?.id || session?.user?.id;
    
    if (!userId) {
      console.error('No user ID found in user or session');
      toast.error('Usuário não encontrado. Tente fazer login novamente.');
      return;
    }

    try {
      const scheduledTime = data.scheduled_time 
        ? new Date(data.scheduled_time).toISOString()
        : null;

      const exerciseData = {
        user_id: userId,
        title: data.title,
        description: data.description || null,
        type: 'workout',
        scheduled_time: scheduledTime,
        completed: false,
      };

      console.log('Exercise data to insert:', exerciseData);

      const { data: insertedData, error } = await supabase
        .from('user_activities')
        .insert(exerciseData)
        .select()
        .single();

      if (error) {
        console.error('Error adding exercise:', error);
        toast.error('Erro ao adicionar exercício: ' + error.message);
        return;
      }

      console.log('Exercise added successfully:', insertedData);
      toast.success('Exercício adicionado com sucesso!');
      form.reset();
      setIsDialogOpen(false);
      fetchExercises();
    } catch (error) {
      console.error('Error adding exercise:', error);
      toast.error('Erro ao adicionar exercício');
    }
  };

  // Toggle exercise completion
  const toggleExerciseCompletion = async (exerciseId: string, completed: boolean) => {
    try {
      console.log('Toggling exercise completion:', exerciseId, !completed);
      
      const { error } = await supabase
        .from('user_activities')
        .update({ completed: !completed })
        .eq('id', exerciseId);

      if (error) {
        console.error('Error updating exercise:', error);
        toast.error('Erro ao atualizar exercício: ' + error.message);
        return;
      }

      toast.success(completed ? 'Exercício desmarcado' : 'Exercício concluído!');
      fetchExercises();
    } catch (error) {
      console.error('Error updating exercise:', error);
      toast.error('Erro ao atualizar exercício');
    }
  };

  const completedCount = exercises.filter(ex => ex.completed).length;
  const totalCount = exercises.length;

  // Show loading state if auth is still loading
  if (authLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vivafit-600 mx-auto"></div>
            <p className="text-muted-foreground mt-2">Carregando...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show message if no user
  if (!user && !session?.user) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <p className="text-muted-foreground">
              Faça login para ver seus exercícios.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-vivafit-600" />
              Exercícios de Hoje
            </CardTitle>
            <CardDescription>
              {completedCount} de {totalCount} exercícios concluídos
            </CardDescription>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-vivafit-600 hover:bg-vivafit-700">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Exercício</DialogTitle>
                <DialogDescription>
                  Registre um exercício para hoje
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    rules={{ required: "Nome do exercício é obrigatório" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Exercício</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Musculação, Corrida, Yoga..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição (opcional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descreva o exercício, séries, repetições..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="scheduled_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Horário (opcional)</FormLabel>
                        <FormControl>
                          <Input 
                            type="datetime-local"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      Adicionar Exercício
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vivafit-600 mx-auto"></div>
            <p className="text-muted-foreground mt-2">Carregando exercícios...</p>
          </div>
        ) : exercises.length === 0 ? (
          <div className="text-center py-8">
            <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Nenhum exercício registrado hoje.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Clique em "Adicionar" para registrar seu primeiro exercício!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {exercises.map((exercise) => (
              <motion.div
                key={exercise.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border transition-colors ${
                  exercise.completed 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-muted/30 border-muted'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className={`font-medium ${
                      exercise.completed ? 'text-green-800 line-through' : ''
                    }`}>
                      {exercise.title}
                    </h4>
                    
                    {exercise.description && (
                      <p className={`text-sm mt-1 ${
                        exercise.completed ? 'text-green-600' : 'text-muted-foreground'
                      }`}>
                        {exercise.description}
                      </p>
                    )}
                    
                    {exercise.scheduled_time && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(exercise.scheduled_time).toLocaleString()}
                      </div>
                    )}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExerciseCompletion(exercise.id, exercise.completed)}
                    className={exercise.completed ? 'text-green-600' : 'text-muted-foreground'}
                  >
                    {exercise.completed ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <XCircle className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
