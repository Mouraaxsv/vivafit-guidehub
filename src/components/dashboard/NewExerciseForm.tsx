
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface ExerciseFormData {
  title: string;
  description: string;
}

interface NewExerciseFormProps {
  onExerciseAdded: () => void;
}

export const NewExerciseForm = ({ onExerciseAdded }: NewExerciseFormProps) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ExerciseFormData>({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (data: ExerciseFormData) => {
    if (!user?.id) {
      toast.error("Você precisa estar logado para adicionar exercícios");
      return;
    }

    setIsSubmitting(true);
    console.log("Adicionando exercício:", { ...data, user_id: user.id });

    try {
      const { data: newExercise, error } = await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          title: data.title,
          description: data.description || null,
          type: 'exercise',
          completed: false,
        })
        .select()
        .single();

      if (error) {
        console.error("Erro ao adicionar exercício:", error);
        toast.error(`Erro ao adicionar exercício: ${error.message}`);
        return;
      }

      console.log("Exercício adicionado com sucesso:", newExercise);
      toast.success("Exercício adicionado com sucesso!");
      
      form.reset();
      setIsOpen(false);
      onExerciseAdded();
    } catch (error) {
      console.error("Erro inesperado:", error);
      toast.error("Erro inesperado ao adicionar exercício");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-vivafit-600 hover:bg-vivafit-700">
          <Plus className="h-4 w-4 mr-2" />
          Novo Exercício
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Exercício</DialogTitle>
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
                    <Input 
                      placeholder="Ex: Corrida, Musculação, Yoga..." 
                      {...field} 
                    />
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
                      placeholder="Descreva o exercício, séries, etc..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex gap-2 pt-4">
              <Button 
                type="submit" 
                className="flex-1" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adicionando..." : "Adicionar"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
