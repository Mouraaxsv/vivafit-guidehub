import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Activity, 
  Calendar, 
  ChevronRight, 
  Dumbbell, 
  ChartLine, 
  Users, 
  Utensils,
  Clock,
  Target
} from "lucide-react";
import { PageTransition } from "@/components/layout/PageTransition";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { ExerciseTracker } from "@/components/dashboard/ExerciseTracker";
import { supabase } from "@/integrations/supabase/client";

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

  // Mock upcoming activities for now
  const upcomingActivities = [
    {
      id: 1,
      title: "Treino de musculação",
      time: "11:00 - 12:00",
      icon: <Dumbbell className="h-5 w-5 text-vivafit-500" />
    },
    {
      id: 2,
      title: "Almoço proteico",
      time: "13:00 - 13:30",
      icon: <Utensils className="h-5 w-5 text-leaf-500" />
    },
    {
      id: 3,
      title: "Meditação guiada",
      time: "19:00 - 19:15",
      icon: <Activity className="h-5 w-5 text-purple-500" />
    }
  ];

  // Mock users for professionals
  const clientUsers = [
    {
      id: 1,
      name: "Ana Maria Silva",
      progress: 78,
      lastActive: "Hoje, 09:45",
      avatar: "https://i.pravatar.cc/150?img=5"
    },
    {
      id: 2,
      name: "Ricardo Mendes",
      progress: 45,
      lastActive: "Ontem, 18:30",
      avatar: "https://i.pravatar.cc/150?img=12"
    },
    {
      id: 3,
      name: "Camila Oliveira",
      progress: 92,
      lastActive: "Hoje, 11:15",
      avatar: "https://i.pravatar.cc/150?img=9"
    },
    {
      id: 4,
      name: "Fernando Alves",
      progress: 33,
      lastActive: "Há 3 dias",
      avatar: "https://i.pravatar.cc/150?img=67"
    }
  ];
  
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
              
              {/* Progress Overview */}
              {!isProfessional && (
                <Card>
                  <CardHeader>
                    <CardTitle>Seu Progresso Hoje</CardTitle>
                    <CardDescription>Acompanhe seus objetivos diários</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Dumbbell className="h-4 w-4 text-vivafit-600" />
                          <span>Exercícios</span>
                        </div>
                        <span className="text-sm font-medium">{progress.workout}%</span>
                      </div>
                      <Progress value={progress.workout} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Utensils className="h-4 w-4 text-leaf-600" />
                          <span>Nutrição</span>
                        </div>
                        <span className="text-sm font-medium">{progress.nutrition}%</span>
                      </div>
                      <Progress value={progress.nutrition} className="h-2 bg-muted [&>div]:bg-leaf-500" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="text-blue-500">💧</div>
                          <span>Hidratação</span>
                        </div>
                        <span className="text-sm font-medium">{progress.hydration}%</span>
                      </div>
                      <Progress value={progress.hydration} className="h-2 bg-muted [&>div]:bg-blue-500" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-purple-600" />
                          <span>Sono</span>
                        </div>
                        <span className="text-sm font-medium">{progress.sleep}%</span>
                      </div>
                      <Progress value={progress.sleep} className="h-2 bg-muted [&>div]:bg-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Pro: Recent Client Activity / User: Today's Plan */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {isProfessional ? "Clientes Recentes" : "Seu Plano de Hoje"}
                  </CardTitle>
                  <CardDescription>
                    {isProfessional 
                      ? "Atividade recente dos seus clientes" 
                      : "Atividades programadas para hoje"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* ... keep existing code (Pro/User content section) */}
                  {isProfessional ? (
                    <div className="space-y-4">
                      {clientUsers.slice(0, 3).map((client) => (
                        <div key={client.id} className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-3">
                            <img 
                              src={client.avatar} 
                              alt={client.name} 
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <h4 className="font-medium">{client.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                Último acesso: {client.lastActive}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <span className="text-sm font-medium">{client.progress}%</span>
                              <div className="w-16 h-1.5 bg-muted rounded-full mt-1">
                                <div 
                                  className="h-full bg-vivafit-500 rounded-full"
                                  style={{ width: `${client.progress}%` }}
                                ></div>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" asChild>
                              <Link to={`/clients/${client.id}`}>
                                <ChevronRight className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full" asChild>
                        <Link to="/clients">
                          Ver todos os clientes
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {upcomingActivities.map((activity) => (
                        <div key={activity.id} className="flex items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="mr-4 p-2 rounded-full bg-muted/50">
                            {activity.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{activity.title}</h4>
                            <p className="text-sm text-muted-foreground">{activity.time}</p>
                          </div>
                          <Button variant="ghost" size="icon">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full" asChild>
                        <Link to="/plan">
                          Ver plano completo
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Right Column */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="inline-flex p-3 rounded-full bg-vivafit-100 text-vivafit-600 mb-3">
                        {isProfessional ? <Users className="h-6 w-6" /> : <Target className="h-6 w-6" />}
                      </div>
                      <div className="text-2xl font-bold">
                        {isProfessional ? "28" : "6"}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {isProfessional ? "Total de Clientes" : "Dias de Streak"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="inline-flex p-3 rounded-full bg-leaf-100 text-leaf-600 mb-3">
                        {isProfessional ? <ChartLine className="h-6 w-6" /> : <Calendar className="h-6 w-6" />}
                      </div>
                      <div className="text-2xl font-bold">
                        {isProfessional ? "84%" : "3/5"}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {isProfessional ? "Taxa de Progresso" : "Treinos na Semana"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Calendar or Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {isProfessional ? "Agenda da Semana" : "Próximos Eventos"}
                  </CardTitle>
                  <CardDescription>
                    {isProfessional ? "Consultas agendadas" : "Seu calendário de atividades"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        day: "Hoje",
                        events: ["Consulta com Ana Maria", "Revisão de planos"],
                        isPast: false,
                      },
                      {
                        day: "Amanhã",
                        events: ["Consulta com Ricardo", "Webinar de Nutrição"],
                        isPast: false,
                      },
                      {
                        day: "Quinta-feira",
                        events: ["Consulta com Camila", "Avaliação mensal"],
                        isPast: false,
                      },
                    ].map((day, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-2 h-2 rounded-full ${day.isPast ? 'bg-muted' : 'bg-vivafit-500'}`}></div>
                          <div className="w-0.5 h-full bg-muted"></div>
                        </div>
                        <div className="flex-1 pb-4">
                          <h4 className="font-medium">{day.day}</h4>
                          <div className="mt-2 space-y-2">
                            {day.events.map((event, j) => (
                              <div 
                                key={j} 
                                className={`text-sm p-2 rounded-md ${
                                  day.isPast ? 'text-muted-foreground bg-muted/30' : 'bg-muted/50'
                                }`}
                              >
                                {event}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default DashboardPage;
