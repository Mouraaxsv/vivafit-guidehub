
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Award, 
  Briefcase, 
  Calendar, 
  GraduationCap, 
  MessageCircle, 
  Scale, 
  Star, 
  Users, 
  Weight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useEffect, useState } from "react";

// Professional interface
interface Professional {
  id: string;
  name: string;
  title: string;
  avatar: string;
  specialties: string[];
  experience: number;
  rating: number;
  reviews: number;
  clients: number;
  education: string[];
  certifications: string[];
  about: string;
  availability: {
    days: string[];
    hours: string;
  };
}

// Mock professional data
const PROFESSIONALS: Record<string, Professional> = {
  "2": {
    id: "2",
    name: "Dr. Jane Smith",
    title: "Nutricionista",
    avatar: "https://i.pravatar.cc/300?img=25",
    specialties: ["Nutrição Esportiva", "Perda de Peso", "Nutrição Clínica"],
    experience: 8,
    rating: 4.9,
    reviews: 124,
    clients: 87,
    education: [
      "Mestrado em Nutrição Clínica - Universidade Federal",
      "Especialização em Nutrição Esportiva - Instituto de Esportes",
      "Graduação em Nutrição - Universidade Estadual"
    ],
    certifications: [
      "Certificação em Nutrição Funcional",
      "Especialista em Metabolismo e Emagrecimento",
      "Nutricionista Esportiva Certificada"
    ],
    about: "Especialista em nutrição com foco em transformação corporal e saúde metabólica. Trabalho com atletas e pessoas comuns que desejam melhorar sua composição corporal e qualidade de vida através da alimentação adequada. Desenvolvo planos nutricionais personalizados baseados em evidências científicas e adaptados à rotina e preferências de cada cliente.",
    availability: {
      days: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"],
      hours: "08:00 - 18:00"
    }
  },
  "3": {
    id: "3",
    name: "Carlos Mendes",
    title: "Personal Trainer",
    avatar: "https://i.pravatar.cc/300?img=12",
    specialties: ["Hipertrofia", "Perda de Peso", "Treinamento Funcional"],
    experience: 10,
    rating: 4.8,
    reviews: 98,
    clients: 65,
    education: [
      "Bacharelado em Educação Física - Universidade Federal",
      "Especialização em Treinamento de Força - Academia de Esportes"
    ],
    certifications: [
      "CREF-SP: 123456-G/SP",
      "Especialista em Treinamento Funcional",
      "Certificado em Avaliação Física"
    ],
    about: "Profissional com mais de 10 anos de experiência em treinamento personalizado. Trabalho com foco em resultados, adaptando os treinos conforme as necessidades e objetivos individuais de cada cliente. Especializado em transformação corporal e correção postural, ajudando pessoas a alcançarem seu potencial físico máximo de forma segura e eficiente.",
    availability: {
      days: ["Segunda", "Terça", "Quinta", "Sexta", "Sábado"],
      hours: "06:00 - 21:00"
    }
  }
};

const ClientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [professional, setProfessional] = useState<Professional | null>(null);

  useEffect(() => {
    if (id && PROFESSIONALS[id]) {
      setProfessional(PROFESSIONALS[id]);
    } else {
      // If no professional found with this ID, redirect to the first available professional
      const firstId = Object.keys(PROFESSIONALS)[0];
      if (firstId) {
        navigate(`/clients/${firstId}`);
      } else {
        navigate("/clients");
      }
    }
  }, [id, navigate]);

  if (!professional) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleScheduleConsultation = () => {
    toast.success("Consulta agendada com sucesso", {
      description: `Sua consulta com ${professional.name} foi agendada.`,
      action: {
        label: "Ver detalhes",
        onClick: () => navigate("/consultation")
      }
    });
  };
  
  const handleStartChat = () => {
    toast.success("Chat iniciado", {
      description: `Você pode agora conversar com ${professional.name}.`,
      action: {
        label: "Ir para chat",
        onClick: () => navigate("/consultation")
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container max-w-4xl py-8"
    >
      {/* Professional header */}
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="relative">
          <img
            src={professional.avatar}
            alt={professional.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
          />
          <div className="absolute bottom-1 right-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow">
            Online
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold">{professional.name}</h1>
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="fill-yellow-500 text-yellow-500 h-5 w-5" />
              <span className="font-medium">{professional.rating}</span>
              <span className="text-muted-foreground text-sm">({professional.reviews} avaliações)</span>
            </div>
          </div>
          <p className="text-xl text-muted-foreground mb-4">{professional.title}</p>
          
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span>{professional.experience} anos de experiência</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{professional.clients} clientes atendidos</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-3 w-full md:w-auto">
          <Button onClick={handleScheduleConsultation} className="w-full md:w-auto">
            <Calendar className="mr-2 h-4 w-4" />
            Agendar Consulta
          </Button>
          <Button variant="outline" onClick={handleStartChat} className="w-full md:w-auto">
            <MessageCircle className="mr-2 h-4 w-4" />
            Iniciar Conversa
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="md:col-span-2 space-y-6">
          {/* About section */}
          <Card>
            <CardHeader>
              <CardTitle>Sobre</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {professional.about}
              </p>
            </CardContent>
          </Card>
          
          {/* Education & Certifications */}
          <Card>
            <CardHeader>
              <CardTitle>Formação & Certificações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium text-lg flex items-center mb-3">
                  <GraduationCap className="mr-2 h-5 w-5 text-primary" />
                  Formação Acadêmica
                </h3>
                <ul className="space-y-3 pl-7 list-disc text-muted-foreground">
                  {professional.education.map((edu, index) => (
                    <li key={index}>{edu}</li>
                  ))}
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium text-lg flex items-center mb-3">
                  <Award className="mr-2 h-5 w-5 text-primary" />
                  Certificações
                </h3>
                <ul className="space-y-3 pl-7 list-disc text-muted-foreground">
                  {professional.certifications.map((cert, index) => (
                    <li key={index}>{cert}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
          
          {/* Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>Avaliações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {
                  name: "Roberto Silva",
                  date: "2 semanas atrás",
                  rating: 5,
                  comment: "Excelente profissional! Ajustou o plano nutricional às minhas necessidades e já estou vendo resultados.",
                  avatar: "https://i.pravatar.cc/50?img=68"
                },
                {
                  name: "Maria Oliveira",
                  date: "1 mês atrás",
                  rating: 5,
                  comment: "Profissional atenciosa e muito conhecedora. As orientações são claras e o acompanhamento é constante.",
                  avatar: "https://i.pravatar.cc/50?img=47"
                },
                {
                  name: "Carlos Gomes",
                  date: "2 meses atrás",
                  rating: 4,
                  comment: "Muito bom atendimento, recomendações precisas e plano alimentar bem adaptado à minha rotina.",
                  avatar: "https://i.pravatar.cc/50?img=13"
                }
              ].map((review, index) => (
                <div key={index} className="pb-4">
                  <div className="flex items-center gap-4 mb-3">
                    <img 
                      src={review.avatar} 
                      alt={review.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium">{review.name}</div>
                      <div className="text-xs text-muted-foreground">{review.date}</div>
                    </div>
                    <div className="ml-auto flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-muted"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">{review.comment}</p>
                  {index < 2 && <Separator className="mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Specialties */}
          <Card>
            <CardHeader>
              <CardTitle>Especialidades</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {professional.specialties.map((specialty, index) => (
                <div 
                  key={index}
                  className="flex items-center px-3 py-2 rounded-lg bg-muted/50"
                >
                  {professional.title === "Nutricionista" ? (
                    <Scale className="h-4 w-4 mr-2 text-primary" />
                  ) : (
                    <Weight className="h-4 w-4 mr-2 text-primary" />
                  )}
                  <span>{specialty}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          
          {/* Availability */}
          <Card>
            <CardHeader>
              <CardTitle>Disponibilidade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="font-medium min-w-24">Dias:</div>
                <div className="text-muted-foreground">{professional.availability.days.join(", ")}</div>
              </div>
              <Separator />
              <div className="flex items-center gap-3 text-sm">
                <div className="font-medium min-w-24">Horários:</div>
                <div className="text-muted-foreground">{professional.availability.hours}</div>
              </div>
            </CardContent>
          </Card>
          
          {/* Contact */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <p className="text-center mb-4">
                Precisa de mais informações?
              </p>
              <Button variant="outline" className="w-full" onClick={handleStartChat}>
                <MessageCircle className="mr-2 h-4 w-4" />
                Entre em contato
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default ClientDetailPage;
