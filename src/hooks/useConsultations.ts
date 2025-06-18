
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
  const [loading, setLoading] = useState(true);

  const fetchConsultations = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('consultations')
        .select(`
          *,
          client:client_id (
            name,
            email
          ),
          professional:professional_id (
            name,
            email
          )
        `)
        .or(`client_id.eq.${user.id},professional_id.eq.${user.id}`)
        .order('scheduled_date', { ascending: true });

      if (error) throw error;

      // Mapear os dados corretamente
      const typedData: Consultation[] = data?.map(consultation => ({
        id: consultation.id,
        client_id: consultation.client_id,
        professional_id: consultation.professional_id,
        scheduled_date: consultation.scheduled_date,
        scheduled_time: consultation.scheduled_time,
        duration_minutes: consultation.duration_minutes,
        status: consultation.status as 'scheduled' | 'confirmed' | 'cancelled' | 'completed',
        notes: consultation.notes,
        created_at: consultation.created_at,
        updated_at: consultation.updated_at,
        client: consultation.client ? {
          name: consultation.client.name || '',
          email: consultation.client.email || ''
        } : undefined,
        professional: consultation.professional ? {
          name: consultation.professional.name || '',
          email: consultation.professional.email || ''
        } : undefined
      })) || [];

      setConsultations(typedData);
    } catch (error) {
      console.error('Error fetching consultations:', error);
      toast.error('Erro ao carregar consultas');
    } finally {
      setLoading(false);
    }
  };

  const createConsultation = async (consultationData: {
    professional_id: string;
    scheduled_date: string;
    scheduled_time: string;
    duration_minutes?: number;
    notes?: string;
  }) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('consultations')
        .insert({
          client_id: user.id,
          ...consultationData,
          duration_minutes: consultationData.duration_minutes || 60
        });

      if (error) throw error;

      toast.success('Consulta agendada com sucesso!');
      fetchConsultations();
      return true;
    } catch (error) {
      console.error('Error creating consultation:', error);
      toast.error('Erro ao agendar consulta');
      return false;
    }
  };

  const updateConsultationStatus = async (consultationId: string, status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed') => {
    try {
      const { error } = await supabase
        .from('consultations')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', consultationId);

      if (error) throw error;

      toast.success('Status da consulta atualizado!');
      fetchConsultations();
      return true;
    } catch (error) {
      console.error('Error updating consultation:', error);
      toast.error('Erro ao atualizar consulta');
      return false;
    }
  };

  // Funções auxiliares para simplificar o uso
  const confirmConsultation = async (consultationId: string) => {
    return updateConsultationStatus(consultationId, 'confirmed');
  };

  const cancelConsultation = async (consultationId: string) => {
    return updateConsultationStatus(consultationId, 'cancelled');
  };

  const completeConsultation = async (consultationId: string) => {
    return updateConsultationStatus(consultationId, 'completed');
  };

  useEffect(() => {
    fetchConsultations();
  }, [user]);

  return {
    consultations,
    loading,
    isLoading: loading, // Alias para compatibilidade
    fetchConsultations,
    createConsultation,
    updateConsultationStatus,
    confirmConsultation,
    cancelConsultation,
    completeConsultation
  };
};
