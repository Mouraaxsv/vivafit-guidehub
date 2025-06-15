
import { motion } from "framer-motion";
import { CheckCircle, Clock, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Exercise {
  id: string;
  title: string;
  description?: string;
  type: string;
  completed: boolean;
  created_at: string;
  scheduled_time?: string;
}

interface ExerciseListProps {
  exercises: Exercise[];
  onExerciseUpdated: () => void;
}

export const ExerciseList = ({ exercises, onExerciseUpdated }: ExerciseListProps) => {
  const toggleComplete = async (exerciseId: string, currentStatus: boolean) => {
    try {
      console.log("Atualizando exercício:", exerciseId, !currentStatus);
      
      const { error } = await supabase
        .from('user_activities')
        .update({ completed: !currentStatus })
        .eq('id', exerciseId);

      if (error) {
        console.error("Erro ao atualizar exercício:", error);
        toast.error(`Erro ao atualizar exercício: ${error.message}`);
        return;
      }

      toast.success(currentStatus ? "Exercício desmarcado" : "Exercício concluído!");
      onExerciseUpdated();
    } catch (error) {
      console.error("Erro inesperado:", error);
      toast.error("Erro inesperado ao atualizar exercício");
    }
  };

  if (exercises.length === 0) {
    return (
      <div className="text-center py-12">
        <Dumbbell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          Nenhum exercício hoje
        </h3>
        <p className="text-sm text-muted-foreground">
          Adicione seu primeiro exercício para começar!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {exercises.map((exercise, index) => (
        <motion.div
          key={exercise.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={`p-4 rounded-lg border transition-all duration-200 ${
            exercise.completed 
              ? 'bg-green-50 border-green-200 shadow-sm' 
              : 'bg-white border-gray-200 hover:shadow-md'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className={`font-semibold ${
                  exercise.completed ? 'text-green-800 line-through' : 'text-gray-900'
                }`}>
                  {exercise.title}
                </h4>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>30min</span>
                </div>
              </div>
              
              {exercise.description && (
                <p className={`text-sm ${
                  exercise.completed ? 'text-green-600' : 'text-muted-foreground'
                }`}>
                  {exercise.description}
                </p>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleComplete(exercise.id, exercise.completed)}
              className={`ml-4 ${
                exercise.completed 
                  ? 'text-green-600 hover:text-green-700' 
                  : 'text-gray-400 hover:text-vivafit-600'
              }`}
            >
              <CheckCircle className={`h-5 w-5 ${
                exercise.completed ? 'fill-current' : ''
              }`} />
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
