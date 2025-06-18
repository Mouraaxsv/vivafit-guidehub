
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Consultation {
  id: string;
  client_id: string;
  professional_id: string;
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes: number;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  created_at: string;
  updated_at: string;
  client?: {
    name: string;
    email: string;
  };
  professional?: {
    name: string;
    email: string;
  };
}

export const useConsultations = () => {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchConsultations = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      let query = supabase
        .from('consultations')
        .select(`
          *,
          client:users!consultations_client_id_fkey(name, email),
          professional:users!consultations_professional_id_fkey(name, email)
        `)
        .order('scheduled_date', { ascending: true });

      // Filtrar baseado no tipo de usuário
      if (user.role === 'professional') {
        query = query.eq('professional_id', user.id);
      } else {
        query = query.eq('client_id', user.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching consultations:', error);
        toast.error('Erro ao carregar consultas');
        return;
      }

      setConsultations(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao carregar consultas');
    } finally {
      setIsLoading(false);
    }
  };

  const updateConsultationStatus = async (
    consultationId: string, 
    status: Consultation['status']
  ) => {
    try {
      const { error } = await supabase
        .from('consultations')
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', consultationId);

      if (error) {
        console.error('Error updating consultation:', error);
        toast.error('Erro ao atualizar consulta');
        return false;
      }

      toast.success('Consulta atualizada com sucesso!');
      fetchConsultations(); // Recarregar lista
      return true;
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao atualizar consulta');
      return false;
    }
  };

  const cancelConsultation = async (consultationId: string) => {
    return updateConsultationStatus(consultationId, 'cancelled');
  };

  const confirmConsultation = async (consultationId: string) => {
    return updateConsultationStatus(consultationId, 'confirmed');
  };

  const completeConsultation = async (consultationId: string) => {
    return updateConsultationStatus(consultationId, 'completed');
  };

  useEffect(() => {
    fetchConsultations();
  }, [user]);

  return {
    consultations,
    isLoading,
    fetchConsultations,
    updateConsultationStatus,
    cancelConsultation,
    confirmConsultation,
    completeConsultation
  };
};
