
-- Habilitar RLS nas tabelas users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Políticas para a tabela users
CREATE POLICY "Users can view their own profile" 
  ON public.users 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.users 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Criar tabela para clientes dos profissionais
CREATE TABLE public.client_professionals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  professional_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(client_id, professional_id)
);

-- Habilitar RLS na tabela client_professionals
ALTER TABLE public.client_professionals ENABLE ROW LEVEL SECURITY;

-- Políticas para client_professionals
CREATE POLICY "Professionals can view their clients" 
  ON public.client_professionals 
  FOR SELECT 
  USING (auth.uid() = professional_id);

CREATE POLICY "Clients can view their professionals" 
  ON public.client_professionals 
  FOR SELECT 
  USING (auth.uid() = client_id);

CREATE POLICY "Professionals can add clients" 
  ON public.client_professionals 
  FOR INSERT 
  WITH CHECK (auth.uid() = professional_id);

-- Criar tabela para atividades dos usuários
CREATE TABLE public.user_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- 'workout', 'nutrition', 'meditation', etc.
  scheduled_time TIMESTAMP WITH TIME ZONE,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela user_activities
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- Políticas para user_activities
CREATE POLICY "Users can view their own activities" 
  ON public.user_activities 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own activities" 
  ON public.user_activities 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Professionals can view their clients' activities
CREATE POLICY "Professionals can view client activities" 
  ON public.user_activities 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.client_professionals 
      WHERE professional_id = auth.uid() 
      AND client_id = user_activities.user_id
    )
  );

-- Criar tabela para progresso do usuário
CREATE TABLE public.user_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  workout_progress INTEGER DEFAULT 0,
  nutrition_progress INTEGER DEFAULT 0,
  hydration_progress INTEGER DEFAULT 0,
  sleep_progress INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Habilitar RLS na tabela user_progress
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Políticas para user_progress
CREATE POLICY "Users can view their own progress" 
  ON public.user_progress 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own progress" 
  ON public.user_progress 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Professionals can view their clients' progress
CREATE POLICY "Professionals can view client progress" 
  ON public.user_progress 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.client_professionals 
      WHERE professional_id = auth.uid() 
      AND client_id = user_progress.user_id
    )
  );
