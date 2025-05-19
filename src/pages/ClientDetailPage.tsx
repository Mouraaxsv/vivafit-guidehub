
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/layout/PageTransition";
import { 
  ArrowLeft,
  Calendar, 
  Clipboard,
  Target,
  Dumbbell,
  Heart,
  User,
  Activity,
  Scale,
  LineChart as ChartLineIcon,
  Pencil,
  MessageSquare,
  History
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  ChartContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "@/components/ui/chart";

const ClientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data from API
    setTimeout(() => {
      // Mock client data - in a real application this would come from an API
      const clientData = {
        id: parseInt(id || "1"),
        name: "Ana Maria Silva",
        age: 32,
        email: "ana.silva@email.com",
        phone: "(11) 99876-5432",
        goal: "Perda de peso",
        startWeight: 78.5,
        currentWeight: 72.1,
        targetWeight: 65.0,
        height: 168,
        progress: 78,
        lastActive: "Hoje, 09:45",
        plan: "Personalizado",
        avatar: "https://i.pravatar.cc/150?img=5",
        status: "active",
        startDate: "12/01/2023",
        sessions: 46,
        nextSession: "23/05/2025",
        bodyFat: {
          initial: 29.8,
          current: 24.5,
          target: 22.0
        },
        measurements: {
          initial: {
            chest: 95,
            waist: 84,
            hips: 108,
            thighs: 64
          },
          current: {
            chest: 92,
            waist: 78,
            hips: 103,
            thighs: 60
          }
        },
        notes: "Ana está focada em perder peso com foco na redução de gordura abdominal. Tem problemas nas articulações dos joelhos, então exercícios de baixo impacto são preferíveis. Faz dieta com nutricionista e tem conseguido boa adesão ao plano.",
        lastWorkouts: [
          { date: "19/05/2025", type: "Treino A - Membros Superiores", completed: true, performance: "Bom" },
          { date: "17/05/2025", type: "Treino B - Membros Inferiores", completed: true, performance: "Regular" },
          { date: "15/05/2025", type: "Cardio - HIIT", completed: true, performance: "Excelente" },
          { date: "14/05/2025", type: "Treino A - Membros Superiores", completed: false, performance: "-" },
          { date: "12/05/2025", type: "Cardio - Moderado", completed: true, performance: "Bom" }
        ],
        progressData: [
          { month: "Jan", peso: 78.5, gordura: 29.8 },
          { month: "Fev", peso: 77.2, gordura: 28.9 },
          { month: "Mar", peso: 75.8, gordura: 27.5 },
          { month: "Abr", peso: 74.0, gordura: 26.2 },
          { month: "Mai", peso: 72.1, gordura: 24.5 }
        ],
        attendance: 86, // percentage of attendance
        nutrition: {
          plan: "Deficit calórico moderado",
          calories: 1800,
          macros: {
            protein: 30,
            carbs: 40,
            fat: 30
          },
          compliance: 75 // percentage of compliance
        }
      };
      
      setClient(clientData);
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen pt-24 pb-16 px-4">
          <div className="container mx-auto">
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse text-muted-foreground">
                Carregando informações do cliente...
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!client) {
    return (
      <PageTransition>
        <div className="min-h-screen pt-24 pb-16 px-4">
          <div className="container mx-auto">
            <div className="text-center p-8">
              <h2 className="text-2xl font-bold mb-4">Cliente não encontrado</h2>
              <Button asChild>
                <Link to="/clients">Voltar para lista de clientes</Link>
              </Button>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  // Calculate BMI
  const bmi = (client.currentWeight / Math.pow(client.height / 100, 2)).toFixed(1);
  
  // Determine BMI status
  let bmiStatus = "Normal";
  let bmiColor = "text-green-500";
  
  // Corrected: Parse bmi as a number before comparison
  const bmiValue = parseFloat(bmi);
  if (bmiValue < 18.5) {
    bmiStatus = "Abaixo do peso";
    bmiColor = "text-yellow-500";
  } else if (bmiValue >= 25 && bmiValue < 30) {
    bmiStatus = "Sobrepeso";
    bmiColor = "text-orange-500";
  } else if (bmiValue >= 30) {
    bmiStatus = "Obesidade";
    bmiColor = "text-red-500";
  }

  // Calculate weight loss
  const weightLoss = client.startWeight - client.currentWeight;
  const weightLossPercentage = (weightLoss / client.startWeight * 100).toFixed(1);
  
  // Calculate body fat loss
  const fatLoss = client.bodyFat.initial - client.bodyFat.current;

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="container mx-auto">
          {/* Back button and title */}
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4 -ml-4 gap-1">
              <Link to="/clients">
                <ArrowLeft className="h-4 w-4" />
                Voltar para clientes
              </Link>
            </Button>

            <div className="flex flex-wrap items-start justify-between gap-4">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl font-bold mb-1">{client.name}</h1>
                <p className="text-muted-foreground flex items-center gap-3">
                  <Badge variant={client.status === "active" ? "outline" : "secondary"}>
                    {client.status === "active" ? "Ativo" : "Inativo"}
                  </Badge>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Cliente desde {client.startDate}
                  </span>
                </p>
              </motion.div>

              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Pencil className="h-4 w-4" />
                  Editar Perfil
                </Button>
                <Button className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Mensagem
                </Button>
              </div>
            </div>
          </div>

          {/* Overview cards row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="h-4 w-4 text-vivafit-600" />
                    Meta Principal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold">{client.goal}</p>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Progresso Geral</span>
                      <span className="font-medium">{client.progress}%</span>
                    </div>
                    <Progress value={client.progress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Scale className="h-4 w-4 text-leaf-600" />
                    Peso
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline">
                    <p className="text-lg font-semibold">{client.currentWeight} kg</p>
                    <Badge variant="outline" className="ml-2 text-green-600">
                      -{weightLoss.toFixed(1)} kg
                    </Badge>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <div className="text-xs">
                      <p className="text-muted-foreground">Inicial</p>
                      <p>{client.startWeight} kg</p>
                    </div>
                    <Separator orientation="vertical" className="h-8" />
                    <div className="text-xs">
                      <p className="text-muted-foreground">Meta</p>
                      <p>{client.targetWeight} kg</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Activity className="h-4 w-4 text-purple-600" />
                    % Gordura Corporal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline">
                    <p className="text-lg font-semibold">{client.bodyFat.current}%</p>
                    <Badge variant="outline" className="ml-2 text-green-600">
                      -{fatLoss.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <div className="text-xs">
                      <p className="text-muted-foreground">Inicial</p>
                      <p>{client.bodyFat.initial}%</p>
                    </div>
                    <Separator orientation="vertical" className="h-8" />
                    <div className="text-xs">
                      <p className="text-muted-foreground">Meta</p>
                      <p>{client.bodyFat.target}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Dumbbell className="h-4 w-4 text-amber-600" />
                    Treinos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold">{client.sessions} sessões</p>
                  <div className="flex gap-2 mt-2">
                    <div className="text-xs">
                      <p className="text-muted-foreground">Assiduidade</p>
                      <p>{client.attendance}%</p>
                    </div>
                    <Separator orientation="vertical" className="h-8" />
                    <div className="text-xs">
                      <p className="text-muted-foreground">Próximo</p>
                      <p>{client.nextSession}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Main content with tabs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Profile information */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-vivafit-100">
                    <AvatarImage src={client.avatar} alt={client.name} />
                    <AvatarFallback>
                      <User className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{client.name}</CardTitle>
                    <CardDescription>{client.age} anos</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Informações Pessoais</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Email:</span>
                      <span>{client.email}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Telefone:</span>
                      <span>{client.phone}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Altura:</span>
                      <span>{client.height} cm</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">IMC:</span>
                      <span className={bmiColor}>{bmi} ({bmiStatus})</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-2">Plano Atual</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tipo:</span>
                      <span>{client.plan}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Nutrição:</span>
                      <span>{client.nutrition.plan}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Calorias:</span>
                      <span>{client.nutrition.calories} kcal/dia</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Último Acesso:</span>
                      <span>{client.lastActive}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-2">Observações</h3>
                  <p className="text-sm">{client.notes}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">Ver Plano Detalhado</Button>
                <Button size="sm">
                  <Pencil className="h-3.5 w-3.5 mr-1" />
                  Editar
                </Button>
              </CardFooter>
            </Card>

            {/* Right column - Tabs with different data views */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Detalhes de Progresso</CardTitle>
                <CardDescription>
                  Acompanhamento detalhado de métricas e atividades do cliente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="metrics" className="space-y-4">
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="metrics">Métricas</TabsTrigger>
                    <TabsTrigger value="activities">Atividades</TabsTrigger>
                    <TabsTrigger value="measurements">Medidas</TabsTrigger>
                  </TabsList>

                  {/* Metrics Tab */}
                  <TabsContent value="metrics" className="space-y-4">
                    <div className="h-[300px] w-full">
                      <ChartContainer
                        config={{
                          weight: {
                            label: "Peso (kg)",
                            color: "#9b87f5",
                          },
                          fat: {
                            label: "Gordura (%)",
                            color: "#6E59A5",
                          },
                        }}
                      >
                        <LineChart data={client.progressData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="peso"
                            stroke="var(--color-weight, #9b87f5)"
                            name="weight"
                            activeDot={{ r: 8 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="gordura"
                            stroke="var(--color-fat, #6E59A5)"
                            name="fat"
                          />
                        </LineChart>
                      </ChartContainer>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Peso</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <p className="text-muted-foreground">Inicial</p>
                                <p className="font-medium">{client.startWeight} kg</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Atual</p>
                                <p className="font-medium">{client.currentWeight} kg</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Meta</p>
                                <p className="font-medium">{client.targetWeight} kg</p>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Redução Total</p>
                              <div className="flex items-baseline">
                                <span className="text-xl font-semibold">{weightLoss.toFixed(1)} kg</span>
                                <span className="ml-2 text-xs text-green-600">({weightLossPercentage}%)</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Gordura Corporal</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <p className="text-muted-foreground">Inicial</p>
                                <p className="font-medium">{client.bodyFat.initial}%</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Atual</p>
                                <p className="font-medium">{client.bodyFat.current}%</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Meta</p>
                                <p className="font-medium">{client.bodyFat.target}%</p>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Redução Total</p>
                              <div className="flex items-baseline">
                                <span className="text-xl font-semibold">{fatLoss.toFixed(1)}%</span>
                                <span className="ml-2 text-xs text-green-600">
                                  ({((fatLoss / client.bodyFat.initial) * 100).toFixed(1)}%)
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Activities Tab */}
                  <TabsContent value="activities">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Data</TableHead>
                            <TableHead>Atividade</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Desempenho</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {client.lastWorkouts.map((workout, i) => (
                            <TableRow key={i}>
                              <TableCell>{workout.date}</TableCell>
                              <TableCell>{workout.type}</TableCell>
                              <TableCell>
                                {workout.completed ? (
                                  <Badge variant="outline" className="bg-green-50 text-green-600">
                                    Realizado
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-red-50 text-red-600">
                                    Faltou
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>{workout.performance}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    
                    <div className="mt-4 flex justify-between">
                      <Button variant="outline" className="gap-2">
                        <History className="h-4 w-4" />
                        Ver Histórico Completo
                      </Button>
                      <Button className="gap-2">
                        <Clipboard className="h-4 w-4" />
                        Registrar Atividade
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Measurements Tab */}
                  <TabsContent value="measurements">
                    <Card>
                      <CardHeader className="pb-0">
                        <CardTitle className="text-base">Medidas Corporais (cm)</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium text-sm mb-3">Medidas Iniciais</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Tórax:</span>
                                  <span>{client.measurements.initial.chest} cm</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Cintura:</span>
                                  <span>{client.measurements.initial.waist} cm</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Quadril:</span>
                                  <span>{client.measurements.initial.hips} cm</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Coxas:</span>
                                  <span>{client.measurements.initial.thighs} cm</span>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-sm mb-3">Medidas Atuais</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Tórax:</span>
                                  <span>{client.measurements.current.chest} cm</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Cintura:</span>
                                  <span>{client.measurements.current.waist} cm</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Quadril:</span>
                                  <span>{client.measurements.current.hips} cm</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Coxas:</span>
                                  <span>{client.measurements.current.thighs} cm</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="pt-4">
                            <h4 className="font-medium text-sm mb-3">Redução</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                              <Card className="p-3">
                                <div className="text-center">
                                  <p className="text-muted-foreground text-xs">Tórax</p>
                                  <p className="text-xl font-semibold text-green-600">
                                    -{client.measurements.initial.chest - client.measurements.current.chest} cm
                                  </p>
                                </div>
                              </Card>
                              <Card className="p-3">
                                <div className="text-center">
                                  <p className="text-muted-foreground text-xs">Cintura</p>
                                  <p className="text-xl font-semibold text-green-600">
                                    -{client.measurements.initial.waist - client.measurements.current.waist} cm
                                  </p>
                                </div>
                              </Card>
                              <Card className="p-3">
                                <div className="text-center">
                                  <p className="text-muted-foreground text-xs">Quadril</p>
                                  <p className="text-xl font-semibold text-green-600">
                                    -{client.measurements.initial.hips - client.measurements.current.hips} cm
                                  </p>
                                </div>
                              </Card>
                              <Card className="p-3">
                                <div className="text-center">
                                  <p className="text-muted-foreground text-xs">Coxas</p>
                                  <p className="text-xl font-semibold text-green-600">
                                    -{client.measurements.initial.thighs - client.measurements.current.thighs} cm
                                  </p>
                                </div>
                              </Card>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ClientDetailPage;

