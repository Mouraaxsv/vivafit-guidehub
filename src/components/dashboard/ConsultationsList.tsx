
import { motion } from "framer-motion";
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useConsultations, Consultation } from "@/hooks/useConsultations";
import { useAuth } from "@/contexts/AuthContext";

const ConsultationsList = () => {
  const { user } = useAuth();
  const { 
    consultations, 
    isLoading, 
    cancelConsultation, 
    confirmConsultation, 
    completeConsultation 
  } = useConsultations();

  const getStatusIcon = (status: Consultation['status']) => {
    switch (status) {
      case 'scheduled':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: Consultation['status']) => {
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

  const getStatusVariant = (status: Consultation['status']) => {
    switch (status) {
      case 'scheduled':
        return 'secondary';
      case 'confirmed':
        return 'default';
      case 'cancelled':
        return 'destructive';
      case 'completed':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Próximas Consultas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="text-muted-foreground">Carregando consultas...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const upcomingConsultations = consultations
    .filter(consultation => {
      const consultationDate = new Date(`${consultation.scheduled_date}T${consultation.scheduled_time}`);
      return consultationDate >= new Date() && consultation.status !== 'cancelled';
    })
    .slice(0, 3); // Mostrar apenas as próximas 3

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Próximas Consultas
        </CardTitle>
        <CardDescription>
          {user?.role === 'professional' 
            ? 'Consultas agendadas com seus clientes' 
            : 'Suas consultas agendadas'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {upcomingConsultations.length === 0 ? (
          <div className="text-center py-6">
            <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Nenhuma consulta agendada</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingConsultations.map((consultation, index) => (
              <motion.div
                key={consultation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {user?.role === 'professional' 
                          ? consultation.client?.name 
                          : consultation.professional?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(consultation.scheduled_date).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {consultation.scheduled_time} ({consultation.duration_minutes}min)
                      </div>
                    </div>
                  </div>
                  <Badge variant={getStatusVariant(consultation.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(consultation.status)}
                      {getStatusText(consultation.status)}
                    </div>
                  </Badge>
                </div>

                {consultation.notes && (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    {consultation.notes}
                  </p>
                )}

                {/* Ações baseadas no tipo de usuário e status */}
                {consultation.status === 'scheduled' && (
                  <div className="flex gap-2">
                    {user?.role === 'professional' && (
                      <Button
                        size="sm"
                        onClick={() => confirmConsultation(consultation.id)}
                        className="flex-1"
                      >
                        Confirmar
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => cancelConsultation(consultation.id)}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                  </div>
                )}

                {consultation.status === 'confirmed' && user?.role === 'professional' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => completeConsultation(consultation.id)}
                    className="w-full"
                  >
                    Marcar como Concluída
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConsultationsList;
