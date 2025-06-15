
import { useState, useEffect } from "react";
import { Dumbbell } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { NewExerciseForm } from "./NewExerciseForm";
import { ExerciseList } from "./ExerciseList";

interface Exercise {
  id: string;
  name: string;
  description?: string;
  duration: number;
  completed: boolean;
  created_at: string;
}

export const ExerciseTracker = () => {
  const { user } = useAuth();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchExercises = async () => {
    if (!user?.id) {
      console.log("Usuário não encontrado, não carregando exercícios");
      setIsLoading(false);
      return;
    }

    console.log("Carregando exercícios para o usuário:", user.id);

    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Erro ao carregar exercícios:", error);
        toast.error(`Erro ao carregar exercícios: ${error.message}`);
        return;
      }

      console.log("Exercícios carregados:", data);
      setExercises(data || []);
    } catch (error) {
      console.error("Erro inesperado ao carregar exercícios:", error);
      toast.error("Erro inesperado ao carregar exercícios");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, [user]);

  const completedCount = exercises.filter(ex => ex.completed).length;
  const totalCount = exercises.length;

  if (!user) {
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
              Meus Exercícios
            </CardTitle>
            <CardDescription>
              {totalCount > 0 ? (
                `${completedCount} de ${totalCount} exercícios concluídos hoje`
              ) : (
                "Adicione exercícios para hoje"
              )}
            </CardDescription>
          </div>
          
          <NewExerciseForm onExerciseAdded={fetchExercises} />
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vivafit-600 mx-auto"></div>
            <p className="text-muted-foreground mt-2">Carregando exercícios...</p>
          </div>
        ) : (
          <ExerciseList exercises={exercises} onExerciseUpdated={fetchExercises} />
        )}
      </CardContent>
    </Card>
  );
};
