import { useState } from "react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/layout/PageTransition";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dumbbell, 
  Utensils, 
  Droplets, 
  Heart,
  Clock,
  CircleCheck,
  CircleX,
  ChevronRight,
  ChartLine
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const PlanPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const exerciseData = [
    {
      day: "Segunda-feira",
      focus: "Parte superior",
      completed: true,
      exercises: [
        { name: "Supino reto", sets: 3, reps: "12, 10, 8", completed: true },
        { name: "Puxada frontal", sets: 3, reps: "12, 10, 8", completed: true },
        { name: "Desenvolvimento de ombros", sets: 3, reps: "12, 10, 8", completed: true },
        { name: "Rosca direta", sets: 3, reps: "12, 10, 10", completed: true },
        { name: "Tríceps corda", sets: 3, reps: "12, 10, 10", completed: true },
      ]
    },
    {
      day: "Terça-feira",
      focus: "Parte inferior",
      completed: true,
      exercises: [
        { name: "Agachamento", sets: 4, reps: "15, 12, 10, 8", completed: true },
        { name: "Leg press", sets: 3, reps: "12, 10, 8", completed: true },
        { name: "Cadeira extensora", sets: 3, reps: "15, 12, 12", completed: true },
        { name: "Cadeira flexora", sets: 3, reps: "15, 12, 12", completed: true },
        { name: "Panturrilha em pé", sets: 4, reps: "20, 15, 15, 15", completed: true },
      ]
    },
    {
      day: "Quarta-feira",
      focus: "Descanso ativo",
      completed: true,
      exercises: [
        { name: "Caminhada leve", sets: 1, reps: "30 min", completed: true },
        { name: "Alongamento completo", sets: 1, reps: "15 min", completed: true },
      ]
    },
    {
      day: "Quinta-feira",
      focus: "Parte superior",
      completed: false,
      exercises: [
        { name: "Remada curvada", sets: 3, reps: "12, 10, 8", completed: false },
        { name: "Crucifixo", sets: 3, reps: "12, 12, 10", completed: false },
        { name: "Elevação lateral", sets: 3, reps: "15, 12, 12", completed: false },
        { name: "Rosca martelo", sets: 3, reps: "12, 10, 10", completed: false },
        { name: "Tríceps francês", sets: 3, reps: "12, 10, 10", completed: false },
      ]
    },
    {
      day: "Sexta-feira",
      focus: "Parte inferior",
      completed: false,
      exercises: [
        { name: "Agachamento sumô", sets: 3, reps: "15, 12, 10", completed: false },
        { name: "Stiff", sets: 3, reps: "12, 10, 8", completed: false },
        { name: "Avanço", sets: 3, reps: "10 (cada perna)", completed: false },
        { name: "Abdução de quadril", sets: 3, reps: "15, 15, 15", completed: false },
        { name: "Panturrilha sentado", sets: 4, reps: "20, 15, 15, 15", completed: false },
      ]
    },
    {
      day: "Sábado",
      focus: "Cardio e core",
      completed: false,
      exercises: [
        { name: "HIIT", sets: 1, reps: "20 min", completed: false },
        { name: "Prancha", sets: 3, reps: "45 seg", completed: false },
        { name: "Crunch", sets: 3, reps: "20, 15, 15", completed: false },
        { name: "Mountain climber", sets: 3, reps: "30 seg", completed: false },
      ]
    },
    {
      day: "Domingo",
      focus: "Descanso completo",
      completed: false,
      exercises: []
    }
  ];

  const nutritionData = [
    {
      meal: "Café da manhã",
      time: "7:00",
      completed: true,
      items: [
        { name: "Ovos mexidos (2 unidades)", macros: "16g proteína, 12g gorduras", completed: true },
        { name: "Torrada integral (2 fatias)", macros: "30g carboidratos, 4g fibras", completed: true },
        { name: "Abacate (1/4)", macros: "6g gorduras saudáveis", completed: true },
        { name: "Café preto ou chá verde", macros: "", completed: true }
      ]
    },
    {
      meal: "Lanche da manhã",
      time: "10:00",
      completed: true,
      items: [
        { name: "Iogurte natural (200g)", macros: "12g proteína, 8g carboidratos", completed: true },
        { name: "Mix de frutas vermelhas (100g)", macros: "12g carboidratos, 3g fibras", completed: true },
        { name: "Castanhas (15g)", macros: "5g gorduras saudáveis", completed: true }
      ]
    },
    {
      meal: "Almoço",
      time: "13:00",
      completed: true,
      items: [
        { name: "Peito de frango grelhado (150g)", macros: "35g proteína", completed: true },
        { name: "Arroz integral (3 colheres)", macros: "30g carboidratos, 3g fibras", completed: true },
        { name: "Feijão (3 colheres)", macros: "12g proteína, 20g carboidratos", completed: true },
        { name: "Salada verde à vontade", macros: "fibras e micronutrientes", completed: true },
        { name: "Azeite extra virgem (1 colher)", macros: "14g gorduras saudáveis", completed: true }
      ]
    },
    {
      meal: "Lanche da tarde",
      time: "16:00",
      completed: false,
      items: [
        { name: "Whey protein (1 scoop)", macros: "25g proteína", completed: false },
        { name: "Banana (1 unidade)", macros: "27g carboidratos", completed: false },
        { name: "Pasta de amendoim (1 colher)", macros: "8g gorduras, 4g proteína", completed: false }
      ]
    },
    {
      meal: "Jantar",
      time: "19:30",
      completed: false,
      items: [
        { name: "Salmão (150g)", macros: "30g proteína, 15g gorduras saudáveis", completed: false },
        { name: "Batata doce (100g)", macros: "25g carboidratos, 3g fibras", completed: false },
        { name: "Legumes salteados", macros: "fibras e micronutrientes", completed: false }
      ]
    },
    {
      meal: "Ceia",
      time: "21:30",
      completed: false,
      items: [
        { name: "Caseína ou iogurte grego (200g)", macros: "15g proteína", completed: false },
        { name: "Castanhas (10g)", macros: "7g gorduras saudáveis", completed: false }
      ]
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
              Seu Plano Personalizado
            </motion.h1>
            <motion.p 
              className="text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Acompanhe sua rotina de exercícios, nutrição e metas semanais
            </motion.p>
          </div>

          <Tabs 
            defaultValue="overview" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="overview" className="data-[state=active]:bg-vivafit-50 data-[state=active]:text-vivafit-600">
                Visão Geral
              </TabsTrigger>
              <TabsTrigger value="exercise" className="data-[state=active]:bg-vivafit-50 data-[state=active]:text-vivafit-600">
                Exercícios
              </TabsTrigger>
              <TabsTrigger value="nutrition" className="data-[state=active]:bg-vivafit-50 data-[state=active]:text-vivafit-600">
                Nutrição
              </TabsTrigger>
              <TabsTrigger value="metrics" className="data-[state=active]:bg-vivafit-50 data-[state=active]:text-vivafit-600">
                Métricas
              </TabsTrigger>
            </TabsList>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Resumo da Semana</CardTitle>
                        <CardDescription>Seu progresso acumulado</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                          <div className="space-y-6">
                            <div>
                              <div className="flex justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Dumbbell className="h-5 w-5 text-vivafit-600" />
                                  <span>Exercícios</span>
                                </div>
                                <span className="font-medium">71%</span>
                              </div>
                              <Progress value={71} className="h-2" />
                              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                                <span>10 de 14 treinos</span>
                                <span>Completos</span>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Utensils className="h-5 w-5 text-leaf-600" />
                                  <span>Nutrição</span>
                                </div>
                                <span className="font-medium">83%</span>
                              </div>
                              <Progress value={83} className="h-2 bg-muted [&>div]:bg-leaf-500" />
                              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                                <span>29 de 35 refeições</span>
                                <span>Completas</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-6">
                            <div>
                              <div className="flex justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Droplets className="h-5 w-5 text-blue-600" />
                                  <span>Hidratação</span>
                                </div>
                                <span className="font-medium">68%</span>
                              </div>
                              <Progress value={68} className="h-2 bg-muted [&>div]:bg-blue-500" />
                              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                                <span>17 de 25 copos</span>
                                <span>Esta semana</span>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-5 w-5 text-purple-600" />
                                  <span>Sono</span>
                                </div>
                                <span className="font-medium">90%</span>
                              </div>
                              <Progress value={90} className="h-2 bg-muted [&>div]:bg-purple-500" />
                              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                                <span>7h15 por noite</span>
                                <span>Média semanal</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Próximas Atividades</CardTitle>
                        <CardDescription>Sua programação para hoje</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {[
                            {
                              time: "16:00",
                              title: "Lanche da tarde",
                              type: "nutrition",
                              icon: <Utensils className="h-4 w-4 text-leaf-600" />,
                              content: "Whey protein, banana, pasta de amendoim"
                            },
                            {
                              time: "17:30",
                              title: "Treino de parte superior",
                              type: "exercise",
                              icon: <Dumbbell className="h-4 w-4 text-vivafit-600" />,
                              content: "Foco em costas e bíceps"
                            },
                            {
                              time: "19:30",
                              title: "Jantar",
                              type: "nutrition",
                              icon: <Utensils className="h-4 w-4 text-leaf-600" />,
                              content: "Salmão, batata doce, legumes"
                            },
                            {
                              time: "21:30",
                              title: "Ceia",
                              type: "nutrition",
                              icon: <Utensils className="h-4 w-4 text-leaf-600" />,
                              content: "Caseína ou iogurte grego, castanhas"
                            }
                          ].map((activity, index) => (
                            <div key={index} className="flex items-start p-3 rounded-lg hover:bg-muted/50 transition-colors">
                              <div className="text-muted-foreground font-medium text-sm min-w-[60px]">
                                {activity.time}
                              </div>
                              <div className="p-2 mx-3 rounded-full bg-muted/50 flex-shrink-0">
                                {activity.icon}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium">
                                  {activity.title}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {activity.content}
                                </p>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => setActiveTab(activity.type === "exercise" ? "exercise" : "nutrition")}
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Estatísticas</CardTitle>
                        <CardDescription>Seu desempenho recente</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Dias consecutivos</span>
                          <Badge variant="outline" className="font-medium">6 dias</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Total de treinos</span>
                          <Badge variant="outline" className="font-medium">24 este mês</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Calorias (média)</span>
                          <Badge variant="outline" className="font-medium">2,450 kcal</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Proteína (média)</span>
                          <Badge variant="outline" className="font-medium">180g/dia</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Água (média)</span>
                          <Badge variant="outline" className="font-medium">2.7L/dia</Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Mensagem do Profissional</CardTitle>
                        <CardDescription>Dr. Jane Smith</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="rounded-lg p-4 border">
                          <p className="text-sm text-muted-foreground mb-4">
                            Seu progresso na última semana foi notável! Continue focando no aumento de proteínas e garanta sua hidratação durante os treinos.
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Adicionei novos exercícios para fortalecer seus ombros. Qualquer dúvida, estou à disposição.
                          </p>
                          <div className="mt-4 text-sm font-medium">
                            <span className="text-vivafit-600">Atualizado: 2 dias atrás</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Dicas da IA</CardTitle>
                        <CardDescription>Sugestões personalizadas</CardDescription>
                      </CardHeader>
                      <CardContent className="text-sm space-y-4">
                        <div className="flex">
                          <Heart className="h-4 w-4 text-vivafit-600 mt-0.5 mr-2 flex-shrink-0" />
                          <p>
                            Você tem dormido menos de 7h em 3 dias desta semana. O sono é crucial para recuperação muscular.
                          </p>
                        </div>
                        <div className="flex">
                          <Heart className="h-4 w-4 text-vivafit-600 mt-0.5 mr-2 flex-shrink-0" />
                          <p>
                            Seu consumo de proteínas está 15% abaixo da meta. Considere adicionar mais fontes magras.
                          </p>
                        </div>
                        <div className="flex">
                          <Heart className="h-4 w-4 text-vivafit-600 mt-0.5 mr-2 flex-shrink-0" />
                          <p>
                            Aumento de 8% na carga dos exercícios para costas. Excelente progresso!
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Exercise Tab */}
              <TabsContent value="exercise" className="mt-0">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Sua Rotina de Exercícios</CardTitle>
                    <CardDescription>Plano semanal personalizado</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {exerciseData.map((day, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="font-medium flex items-center">
                                {day.completed ? (
                                  <CircleCheck className="h-5 w-5 text-green-500 mr-2" />
                                ) : (
                                  <Clock className="h-5 w-5 text-amber-500 mr-2" />
                                )}
                                {day.day}
                              </h3>
                              <p className="text-sm text-muted-foreground">Foco: {day.focus}</p>
                            </div>
                            <Badge variant={day.completed ? "outline" : "secondary"}>
                              {day.completed ? "Completado" : "Pendente"}
                            </Badge>
                          </div>
                          
                          {day.exercises.length > 0 ? (
                            <div className="space-y-3">
                              {day.exercises.map((exercise, idx) => (
                                <div 
                                  key={idx} 
                                  className={`flex items-center justify-between p-3 rounded-md ${
                                    exercise.completed ? 'bg-muted/30' : 'bg-muted/50'
                                  }`}
                                >
                                  <div>
                                    <span className="font-medium">{exercise.name}</span>
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {exercise.sets} séries × {exercise.reps}
                                    </div>
                                  </div>
                                  {exercise.completed ? (
                                    <CircleCheck className="h-5 w-5 text-green-500" />
                                  ) : (
                                    <CircleX className="h-5 w-5 text-muted-foreground" />
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center p-4 text-muted-foreground">
                              Dia de descanso. Aproveite para recuperar!
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Nutrition Tab */}
              <TabsContent value="nutrition" className="mt-0">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Seu Plano Alimentar</CardTitle>
                    <CardDescription>Refeições recomendadas para hoje</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {nutritionData.map((meal, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="font-medium flex items-center">
                                {meal.completed ? (
                                  <CircleCheck className="h-5 w-5 text-green-500 mr-2" />
                                ) : (
                                  <Clock className="h-5 w-5 text-amber-500 mr-2" />
                                )}
                                {meal.meal}
                              </h3>
                              <p className="text-sm text-muted-foreground">{meal.time}</p>
                            </div>
                            <Badge variant={meal.completed ? "outline" : "secondary"}>
                              {meal.completed ? "Completado" : "Pendente"}
                            </Badge>
                          </div>
                          
                          <div className="space-y-3">
                            {meal.items.map((item, idx) => (
                              <div 
                                key={idx} 
                                className={`flex items-center justify-between p-3 rounded-md ${
                                  item.completed ? 'bg-muted/30' : 'bg-muted/50'
                                }`}
                              >
                                <div>
                                  <span className="font-medium">{item.name}</span>
                                  {item.macros && (
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {item.macros}
                                    </div>
                                  )}
                                </div>
                                {item.completed ? (
                                  <CircleCheck className="h-5 w-5 text-green-500" />
                                ) : (
                                  <CircleX className="h-5 w-5 text-muted-foreground" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Metrics Tab */}
              <TabsContent value="metrics" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Acompanhamento de Métricas</CardTitle>
                      <CardDescription>Evolução das últimas 8 semanas</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] flex items-center justify-center">
                        <div className="text-center p-8 rounded-lg bg-muted/50">
                          <ChartLine className="h-12 w-12 text-vivafit-600 mx-auto mb-4" />
                          <h3 className="text-lg font-medium mb-2">Gráficos e métricas detalhadas</h3>
                          <p className="text-sm text-muted-foreground">
                            Visualize sua evolução ao longo do tempo com gráficos interativos
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Dados Históricos</CardTitle>
                      <CardDescription>Registros e tendências</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { label: "Peso inicial", value: "82.5 kg", date: "01/06/2023" },
                          { label: "Peso atual", value: "78.2 kg", date: "Hoje" },
                          { label: "% Gordura inicial", value: "24%", date: "01/06/2023" },
                          { label: "% Gordura atual", value: "19%", date: "Ontem" },
                          { label: "Massa muscular inicial", value: "42.3 kg", date: "01/06/2023" },
                          { label: "Massa muscular atual", value: "45.7 kg", date: "Ontem" },
                        ].map((metric, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded-md">
                            <div>
                              <div className="font-medium">{metric.label}</div>
                              <div className="text-xs text-muted-foreground">
                                Medido em: {metric.date}
                              </div>
                            </div>
                            <div className="text-lg font-semibold">{metric.value}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </motion.div>
          </Tabs>
        </div>
      </div>
    </PageTransition>
  );
};

export default PlanPage;
