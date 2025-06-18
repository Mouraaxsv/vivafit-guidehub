
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, User, Mail, Calendar, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageTransition } from "@/components/layout/PageTransition";
import { HealthInfoDisplay } from "@/components/HealthInfoDisplay";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ClientData {
  id: string;
  name: string;
  email: string;
  role: string;
  physicalInfo?: any;
}

const ClientDetailPage = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [client, setClient] = useState<ClientData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!user || user.role !== 'professional') {
      navigate('/dashboard');
      return;
    }
    
    if (clientId) {
      fetchClientData();
    }
  }, [clientId, user, navigate]);
  
  const fetchClientData = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', clientId)
        .single();
      
      if (error) {
        console.error('Error fetching client:', error);
        toast.error('Erro ao carregar dados do cliente');
        navigate('/clients');
        return;
      }
      
      setClient(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao carregar dados do cliente');
      navigate('/clients');
    } finally {
      setIsLoading(false);
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
  
  if (!client) {
    return (
      <PageTransition>
        <div className="container py-10 max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Cliente não encontrado</h1>
            <Button onClick={() => navigate('/clients')}>
              Voltar para Clientes
            </Button>
          </div>
        </div>
      </PageTransition>
    );
  }
  
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
              onClick={() => navigate('/clients')}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Clientes
            </Button>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Detalhes do Cliente
            </h1>
            <p className="text-muted-foreground">
              Informações completas sobre {client.name}
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {/* Informações básicas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Nome:</span>
                  </div>
                  <p className="text-sm bg-muted p-3 rounded-lg">{client.name}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Email:</span>
                  </div>
                  <p className="text-sm bg-muted p-3 rounded-lg">{client.email}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {client.role === 'user' ? 'Cliente' : 'Profissional'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Atividade recente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Atividade Recente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm">Último login</span>
                    <span className="text-sm text-muted-foreground">Hoje</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm">Planos ativos</span>
                    <Badge variant="outline">2</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm">Progresso semanal</span>
                    <span className="text-sm text-vivafit-600 font-medium">75%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Informações de saúde */}
          {client.physicalInfo && (
            <div className="mt-6">
              <HealthInfoDisplay 
                healthInfo={client.physicalInfo}
                title="Informações de Saúde do Cliente"
                showAllFields={true}
              />
            </div>
          )}
          
          {/* Ações */}
          <div className="mt-6 flex gap-3">
            <Button className="flex-1">
              <Calendar className="mr-2 h-4 w-4" />
              Agendar Consulta
            </Button>
            <Button variant="outline" className="flex-1">
              <Activity className="mr-2 h-4 w-4" />
              Ver Progresso
            </Button>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default ClientDetailPage;
