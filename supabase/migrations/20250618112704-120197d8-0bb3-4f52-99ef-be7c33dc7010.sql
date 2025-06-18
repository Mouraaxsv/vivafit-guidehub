
-- Criar tabela para consultas agendadas
CREATE TABLE public.consultations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  professional_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'cancelled', 'completed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar RLS para segurança
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

-- Política para clientes verem suas próprias consultas
CREATE POLICY "Clients can view their own consultations" 
  ON public.consultations 
  FOR SELECT 
  USING (auth.uid() = client_id);

-- Política para profissionais verem consultas marcadas com eles
CREATE POLICY "Professionals can view their consultations" 
  ON public.consultations 
  FOR SELECT 
  USING (auth.uid() = professional_id);

-- Política para clientes criarem consultas
CREATE POLICY "Clients can create consultations" 
  ON public.consultations 
  FOR INSERT 
  WITH CHECK (auth.uid() = client_id);

-- Política para profissionais atualizarem status das consultas
CREATE POLICY "Professionals can update their consultations" 
  ON public.consultations 
  FOR UPDATE 
  USING (auth.uid() = professional_id);

-- Política para clientes cancelarem suas consultas
CREATE POLICY "Clients can cancel their consultations" 
  ON public.consultations 
  FOR UPDATE 
  USING (auth.uid() = client_id AND status IN ('scheduled', 'confirmed'));

-- Índices para performance
CREATE INDEX idx_consultations_client_id ON public.consultations(client_id);
CREATE INDEX idx_consultations_professional_id ON public.consultations(professional_id);
CREATE INDEX idx_consultations_date ON public.consultations(scheduled_date);
