
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Activity, Dumbbell, Utensils, Brain, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";

const HomePage = () => {
  const { user } = useAuth();

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

  const testimonials = [
    {
      name: "Maria Silva",
      role: "Cliente há 6 meses",
      content: "O VivaFit transformou minha abordagem ao fitness. As recomendações personalizadas realmente fazem a diferença!",
      avatar: "https://i.pravatar.cc/150?img=5"
    },
    {
      name: "Carlos Oliveira",
      role: "Nutricionista parceiro",
      content: "Como profissional, a plataforma me ajuda a acompanhar meus clientes de forma mais eficiente e com dados precisos.",
      avatar: "https://i.pravatar.cc/150?img=12"
    },
    {
      name: "Juliana Costa",
      role: "Cliente há 1 ano",
      content: "Perdi 15kg seguindo as recomendações de exercícios e dieta. A combinação de IA com o suporte humano é perfeita.",
      avatar: "https://i.pravatar.cc/150?img=9"
    }
  ];

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
                Transforme sua saúde com <span className="text-gradient">VivaFit</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-lg text-balance">
                A plataforma que combina inteligência artificial com expertise profissional para oferecer recomendações personalizadas de exercícios e nutrição.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="rounded-full">
                  <Link to={user ? "/dashboard" : "/register"}>
                    {user ? "Acessar Dashboard" : "Começar Agora"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                {!user && (
                  <Button asChild variant="outline" size="lg" className="rounded-full">
                    <Link to="/login">
                      Login
                    </Link>
                  </Button>
                )}
              </div>
            </motion.div>

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
                    <h3 className="font-medium">Seu Progresso</h3>
                  </div>
                  <div className="text-sm text-muted-foreground">Hoje</div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Exercícios</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-vivafit-500 rounded-full w-[78%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Nutrição</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-leaf-500 rounded-full w-[92%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Hidratação</span>
                      <span className="font-medium">65%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full w-[65%]"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-vivafit-400/10 rounded-full filter blur-3xl -z-10"></div>
              <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-leaf-400/10 rounded-full filter blur-3xl -z-10"></div>
            </motion.div>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute -z-10 top-0 left-0 right-0 bottom-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-vivafit-400/20 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-leaf-400/15 rounded-full filter blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-vivafit-50">
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

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              O que nossos <span className="text-gradient">usuários</span> dizem
            </h2>
            <p className="text-lg text-muted-foreground">
              Histórias reais de pessoas que transformaram sua saúde com o VivaFit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-6 hover-scale"
              >
                <div className="mb-6">
                  {Array(5).fill(0).map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-muted-foreground mb-6">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-vivafit-500 to-leaf-500 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para transformar sua saúde?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de pessoas que estão melhorando sua qualidade de vida com o VivaFit.
          </p>
          <Button asChild size="lg" variant="secondary" className="rounded-full">
            <Link to={user ? "/dashboard" : "/register"}>
              {user ? "Acesse sua conta" : "Comece gratuitamente"}
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
