
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, User, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PageTransition } from "@/components/layout/PageTransition";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Professional {
  id: string;
  name: string;
  email: string;
}

const ScheduleConsultationPage = () => {
  const { professionalId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState("");
  const [duration, setDuration] = useState("60");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Horários disponíveis
  const availableTimes = [
    "08:00", "09:00", "10:00", "11:00", 
    "14:00", "15:00", "16:00", "17:00"
  ];

  useEffect(() => {
    if (!user || user.role !== 'user') {
      navigate('/dashboard');
      return;
    }
    
    if (professionalId) {
      fetchProfessional();
    }
  }, [professionalId, user, navigate]);

  const fetchProfessional = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email')
        .eq('id', professionalId)
        .eq('role', 'professional')
        .single();
      
      if (error) {
        console.error('Error fetching professional:', error);
        toast.error('Profissional não encontrado');
        navigate('/clients');
        return;
      }
      
      setProfessional(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao carregar dados do profissional');
      navigate('/clients');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime || !professional || !user) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('consultations')
        .insert({
          client_id: user.id,
          professional_id: professional.id,
          scheduled_date: selectedDate.toISOString().split('T')[0],
          scheduled_time: selectedTime,
          duration_minutes: parseInt(duration),
          notes: notes.trim() || null,
          status: 'scheduled'
        });

      if (error) {
        console.error('Error creating consultation:', error);
        toast.error('Erro ao agendar consulta');
        return;
      }

      toast.success('Consulta agendada com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao agendar consulta');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <PageTransition>
        <div className="container py-10 max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Carregando...</div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!professional) {
    return (
      <PageTransition>
        <div className="container py-10 max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Profissional não encontrado</h1>
            <Button onClick={() => navigate('/dashboard')}>
              Voltar ao Dashboard
            </Button>
          </div>
        </div>
      </PageTransition>
    );
  }

  const today = new Date();
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 2); // Permitir agendamento até 2 meses à frente

  return (
    <PageTransition>
      <div className="container py-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Agendar Consulta
            </h1>
            <p className="text-muted-foreground">
              Agende uma consulta com {professional.name}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Informações do profissional */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profissional
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{professional.name}</p>
                  <p className="text-sm text-muted-foreground">{professional.email}</p>
                </div>
              </CardContent>
            </Card>

            {/* Resumo do agendamento */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Resumo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Data:</span>
                    <span className="text-sm font-medium">
                      {selectedDate ? selectedDate.toLocaleDateString('pt-BR') : 'Não selecionada'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Horário:</span>
                    <span className="text-sm font-medium">
                      {selectedTime || 'Não selecionado'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Duração:</span>
                    <span className="text-sm font-medium">{duration} minutos</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formulário de agendamento */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Detalhes do Agendamento
              </CardTitle>
              <CardDescription>
                Selecione a data, horário e adicione observações se necessário
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Seleção de data */}
              <div className="space-y-2">
                <Label>Data da Consulta</Label>
                <div className="flex justify-center">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < today || date > maxDate}
                    className="rounded-md border"
                  />
                </div>
              </div>

              {/* Seleção de horário */}
              {selectedDate && (
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Horário Disponível
                  </Label>
                  <RadioGroup value={selectedTime} onValueChange={setSelectedTime}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {availableTimes.map((time) => (
                        <div key={time} className="flex items-center space-x-2">
                          <RadioGroupItem value={time} id={time} />
                          <Label htmlFor={time} className="cursor-pointer">
                            {time}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              )}

              {/* Duração */}
              <div className="space-y-3">
                <Label>Duração da Consulta</Label>
                <RadioGroup value={duration} onValueChange={setDuration}>
                  <div className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="30" id="30min" />
                      <Label htmlFor="30min" className="cursor-pointer">30 minutos</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="60" id="60min" />
                      <Label htmlFor="60min" className="cursor-pointer">1 hora</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="90" id="90min" />
                      <Label htmlFor="90min" className="cursor-pointer">1h30min</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Observações */}
              <div className="space-y-2">
                <Label htmlFor="notes">Observações (opcional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Adicione informações importantes para a consulta..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              {/* Botões de ação */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSchedule}
                  disabled={!selectedDate || !selectedTime || isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? 'Agendando...' : 'Confirmar Agendamento'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default ScheduleConsultationPage;
