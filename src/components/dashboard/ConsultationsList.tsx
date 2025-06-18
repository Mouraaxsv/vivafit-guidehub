
import { motion } from "framer-motion";
import { Calendar, Clock, User, Check, X, MoreVertical } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useConsultations } from "@/hooks/useConsultations";

const ConsultationsList = () => {
  const { user } = useAuth();
  const {
    consultations,
    loading,
    confirmConsultation,
    cancelConsultation,
    completeConsultation
  } = useConsultations();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Minhas Consultas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Carregando consultas...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Agendada';
      case 'confirmed':
        return 'Confirmada';
      case 'cancelled':
        return 'Cancelada';
      case 'completed':
        return 'Concluída';
      default:
        return status;
    }
  };

  const isProfessional = user?.role === 'professional';

  const handleConfirm = async (consultationId: string) => {
    await confirmConsultation(consultationId);
  };

  const handleCancel = async (consultationId: string) => {
    await cancelConsultation(consultationId);
  };

  const handleComplete = async (consultationId: string) => {
    await completeConsultation(consultationId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {isProfessional ? 'Consultas dos Clientes' : 'Minhas Consultas'}
        </CardTitle>
        <CardDescription>
          {isProfessional 
            ? 'Gerencie as consultas agendadas com você'
            : 'Suas consultas agendadas'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {consultations.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {isProfessional 
                ? 'Nenhuma consulta agendada ainda'
                : 'Você ainda não tem consultas agendadas'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {consultations.map((consultation, index) => (
              <motion.div
                key={consultation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {isProfessional 
                          ? consultation.client?.name || 'Cliente'
                          : consultation.professional?.name || 'Profissional'
                        }
                      </span>
                      <Badge className={getStatusColor(consultation.status)}>
                        {getStatusText(consultation.status)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(consultation.scheduled_date).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {consultation.scheduled_time} ({consultation.duration_minutes}min)
                      </div>
                    </div>

                    {consultation.notes && (
                      <p className="text-sm text-muted-foreground">
                        <strong>Observações:</strong> {consultation.notes}
                      </p>
                    )}
                  </div>

                  {/* Ações para profissionais */}
                  {isProfessional && consultation.status !== 'completed' && consultation.status !== 'cancelled' && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {consultation.status === 'scheduled' && (
                          <DropdownMenuItem onClick={() => handleConfirm(consultation.id)}>
                            <Check className="h-4 w-4 mr-2" />
                            Confirmar
                          </DropdownMenuItem>
                        )}
                        {consultation.status === 'confirmed' && (
                          <DropdownMenuItem onClick={() => handleComplete(consultation.id)}>
                            <Check className="h-4 w-4 mr-2" />
                            Marcar como Concluída
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => handleCancel(consultation.id)}
                          className="text-red-600"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancelar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}

                  {/* Ações para clientes */}
                  {!isProfessional && consultation.status === 'scheduled' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleCancel(consultation.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancelar
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConsultationsList;
