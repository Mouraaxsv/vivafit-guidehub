
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/layout/PageTransition";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ExerciseTracker } from "@/components/dashboard/ExerciseTracker";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { ProgressOverview } from "@/components/dashboard/ProgressOverview";
import { ClientActivity } from "@/components/dashboard/ClientActivity";
import { UserPlan } from "@/components/dashboard/UserPlan";
import { DashboardCalendar } from "@/components/dashboard/DashboardCalendar";
import ConsultationsList from "@/components/dashboard/ConsultationsList";

const DashboardPage = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState({
    workout: 0,
    nutrition: 0,
    hydration: 0,
    sleep: 0
  });

  useEffect(() => {
    const fetchTodayProgress = async () => {
      if (!user) return;

      try {
        const today = new Date().toISOString().split('T')[0];
        
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('date', today)
          .single();

        if (progressData) {
          setProgress({
            workout: progressData.workout_progress || 0,
            nutrition: progressData.nutrition_progress || 0,
            hydration: progressData.hydration_progress || 0,
            sleep: progressData.sleep_progress || 0
          });
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    };

    fetchTodayProgress();
  }, [user]);

  const isProfessional = user?.role === 'professional';
  
  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <div className="mb-8">
            <motion.h1 
              className="text-3xl font-bold mb-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Olá, {user?.name.split(' ')[0]}!
            </motion.h1>
            <motion.p 
              className="text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {isProfessional 
                ? "Bem-vindo ao seu dashboard profissional. Acompanhe seus clientes."
                : "Bem-vindo ao seu dashboard. Veja seu progresso e atividades."}
            </motion.p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <motion.div 
              className="lg:col-span-2 space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Exercise Tracker for Users */}
              {!isProfessional && <ExerciseTracker />}
              
              {/* Progress Overview for Users */}
              {!isProfessional && <ProgressOverview progress={progress} />}
              
              {/* Consultations List */}
              <ConsultationsList />
              
              {/* Activity Section */}
              {isProfessional ? <ClientActivity /> : <UserPlan />}
            </motion.div>

            {/* Right Column */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {/* Quick Stats */}
              <DashboardStats isProfessional={isProfessional} />

              {/* Calendar */}
              <DashboardCalendar isProfessional={isProfessional} />
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default DashboardPage;
