
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Activity, Dumbbell, Utensils, Brain, HeartPulse, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { toast } from "sonner";

const HomePage = () => {
  const { user } = useAuth();

  useEffect(() => {
    // Show professional availability notification only to logged-in users
    if (user && user.role === 'user') {
      const timer = setTimeout(() => {
        toast.success("Um profissional está disponível para atendê-lo!", {
          description: "Dr. Jane Smith está pronta para sua consulta",
          action: {
            label: "Ver perfil",
            onClick: () => window.location.href = "/clients/2"
          },
        });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [user]);

  // Função para formatar objetivos em texto legível
  const formatGoals = (goals?: string[]) => {
    if (!goals || goals.length === 0) return "Nenhum objetivo definido";
    
    const goalMap: Record<string, string> = {
      'lose_weight': 'Perder peso',
      'gain_muscle': 'Ganhar massa muscular',
      'improve_health': 'Melhorar saúde geral',
      'increase_flexibility': 'Aumentar flexibilidade'
    };
    
    return goals.map(goal => goalMap[goal] || goal).join(', ');
  };

  // Renderizar informação sobre condições médicas se existirem
  const renderMedicalInfo = () => {
    if (!user || !user.physicalInfo) return null;
    
    const hasMedicalConditions = user.physicalInfo.hasMedicalConditions;
    const takesMedication = user.physicalInfo.takesMedication;
    
    if (!hasMedicalConditions && !takesMedication) return null;
    
    return (
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md text-sm">
        <p className="font-medium text-blue-700 dark:text-blue-300">Informações de saúde:</p>
        {hasMedicalConditions && (
          <p className="text-blue-600 dark:text-blue-400">
            • Condições médicas: {user.physicalInfo.medicalConditionsDetails || 'Não especificado'}
          </p>
        )}
        {takesMedication && (
          <p className="text-blue-600 dark:text-blue-400">
            • Medicamentos: {user.physicalInfo.medicationDetails || 'Não especificado'}
          </p>
        )}
      </div>
    );
  };

  const featureItems = [
    {
      icon: <Dumbbell className="h-10 w-10 text-vivafit-600" />,
      title: "Exercícios Personalizados",
      description: "Planos de exercícios adaptados às suas necessidades, objetivos e condições físicas."
    },
    {
      icon: <Utensils className="h-10 w-10 text-vivafit-600" />,
      title: "Nutrição Inteligente",
      description: "Recomendações nutricionais baseadas no seu perfil metabólico e objetivos de saúde."
    },
    {
      icon: <Brain className="h-10 w-10 text-vivafit-600" />,
      title: "IA Avançada",
      description: "Nossa inteligência artificial aprende com seus dados para oferecer recomendações cada vez mais precisas."
    },
    {
      icon: <HeartPulse className="h-10 w-10 text-vivafit-600" />,
      title: "Acompanhamento Profissional",
      description: "Profissionais qualificados supervisionam seu progresso e ajustam seu plano quando necessário."
    }
  ];

  // Renderização condicional com dados do usuário
  const renderUserCard = () => {
    if (!user || user.role !== 'user' || !user.physicalInfo) return null;
    
    const { weight, height, age, goals } = user.physicalInfo;
    const bmi = weight && height ? (weight / Math.pow(height/100, 2)).toFixed(1) : null;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative mx-auto"
      >
        <div className="glass-card p-6 relative z-10 max-w-md mx-auto">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-vivafit-600" />
              <h3 className="font-medium">Seu Perfil</h3>
            </div>
            <Link 
              to="/profile" 
              className="flex items-center text-sm text-vivafit-600 hover:underline"
            >
              <User className="h-4 w-4 mr-1" />
              Gerenciar perfil
            </Link>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Peso</p>
                <p className="font-medium">{weight ? `${weight} kg` : 'Não informado'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Altura</p>
                <p className="font-medium">{height ? `${height} cm` : 'Não informada'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Idade</p>
                <p className="font-medium">{age ? `${age} anos` : 'Não informada'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">IMC</p>
                <p className="font-medium">{bmi ? `${bmi} kg/m²` : 'Não calculado'}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Objetivos</p>
              <p className="font-medium">{formatGoals(goals)}</p>
            </div>
            
            {renderMedicalInfo()}
            
            <div className="pt-2">
              <Button asChild variant="outline" className="w-full">
                <Link to="/dashboard">
                  Ver meu dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-vivafit-400/10 rounded-full filter blur-3xl -z-10"></div>
        <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-leaf-400/10 rounded-full filter blur-3xl -z-10"></div>
      </motion.div>
    );
  };

  // Call to action for guest users
  const renderCallToAction = () => {
    if (user) return null;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative mx-auto"
      >
        <div className="glass-card p-6 relative z-10 max-w-md mx-auto">
          <div className="mb-4 text-center">
            <h3 className="text-xl font-medium mb-2">Sua jornada começa aqui</h3>
            <p className="text-muted-foreground">Crie sua conta para acessar recomendações personalizadas</p>
          </div>
          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link to="/register">
                Criar conta gratuita
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Já tem uma conta?{' '}
                <Link to="/login" className="text-vivafit-600 hover:underline">
                  Faça login
                </Link>
              </p>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-vivafit-400/10 rounded-full filter blur-3xl -z-10"></div>
        <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-leaf-400/10 rounded-full filter blur-3xl -z-10"></div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:min-h-[90vh] flex items-center relative overflow-hidden">
        <div className="container mx-auto z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                {user ? `Olá, ${user.name}!` : 'Transforme sua saúde com'} <span className="text-gradient">VivaFit</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-lg text-balance">
                {user && user.role === 'user' ? 
                  'Acompanhe seu progresso e conecte-se com profissionais qualificados para alcançar seus objetivos.' : 
                  'A plataforma que combina inteligência artificial com expertise profissional para oferecer recomendações personalizadas de exercícios e nutrição.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <>
                    <Button asChild size="lg" className="rounded-full">
                      <Link to="/dashboard">
                        Acessar Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="rounded-full">
                      <Link to="/profile">
                        Meu Perfil
                        <User className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild size="lg" className="rounded-full">
                      <Link to="/register">
                        Começar Agora
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="rounded-full">
                      <Link to="/login">
                        Login
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </motion.div>

            {renderUserCard() || renderCallToAction()}
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute -z-10 top-0 left-0 right-0 bottom-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-vivafit-400/20 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-leaf-400/15 rounded-full filter blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-vivafit-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Recursos <span className="text-gradient">Poderosos</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Nossa plataforma integra tecnologia avançada e conhecimento profissional para oferecer a melhor experiência de saúde personalizada.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featureItems.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-6 hover-scale"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-vivafit-500 to-leaf-500 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {user ? 'Vamos começar sua jornada de saúde?' : 'Pronto para transformar sua saúde?'}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {user 
              ? 'Acesse seu dashboard para ver recomendações personalizadas e conectar-se com profissionais.' 
              : 'Junte-se a milhares de pessoas que estão melhorando sua qualidade de vida com o VivaFit.'}
          </p>
          <Button asChild size="lg" variant="secondary" className="rounded-full">
            <Link to={user ? "/dashboard" : "/register"}>
              {user ? "Ver meu dashboard" : "Comece gratuitamente"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
