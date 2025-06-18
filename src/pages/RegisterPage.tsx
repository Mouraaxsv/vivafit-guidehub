import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, ArrowRight, Weight, Ruler, Calendar, Target, ChevronRight, Heart, Pill, Utensils, Moon, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { PageTransition } from "@/components/layout/PageTransition";
import { useAuth, UserRole, UserGoal } from "@/contexts/AuthContext";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string(),
  role: z.enum(["user", "professional"] as const),
  // Campos físicos apenas para usuários
  weight: z.number().optional(),
  height: z.number().optional(),
  age: z.number().optional(),
  goals: z.array(z.enum(["lose_weight", "gain_muscle", "improve_health", "increase_flexibility"] as const)).optional(),
  // Campos de saúde expandidos
  hasMedicalConditions: z.boolean().optional(),
  medicalConditionsDetails: z.string().optional(),
  takesMedication: z.boolean().optional(),
  medicationDetails: z.string().optional(),
  hasAllergies: z.boolean().optional(),
  allergiesDetails: z.string().optional(),
  exerciseFrequency: z.string().optional(),
  smokingStatus: z.string().optional(),
  alcoholConsumption: z.string().optional(),
  sleepHours: z.number().optional(),
  stressLevel: z.string().optional(),
  previousInjuries: z.boolean().optional(),
  injuriesDetails: z.string().optional(),
  dietaryRestrictions: z.boolean().optional(),
  dietaryDetails: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
}).refine(
  data => !data.hasMedicalConditions || (data.hasMedicalConditions && data.medicalConditionsDetails),
  {
    message: "Por favor, detalhe suas condições médicas",
    path: ["medicalConditionsDetails"],
  }
).refine(
  data => !data.takesMedication || (data.takesMedication && data.medicationDetails),
  {
    message: "Por favor, detalhe seus medicamentos",
    path: ["medicationDetails"],
  }
).refine(
  data => !data.hasAllergies || (data.hasAllergies && data.allergiesDetails),
  {
    message: "Por favor, detalhe suas alergias",
    path: ["allergiesDetails"],
  }
).refine(
  data => !data.previousInjuries || (data.previousInjuries && data.injuriesDetails),
  {
    message: "Por favor, detalhe suas lesões anteriores",
    path: ["injuriesDetails"],
  }
).refine(
  data => !data.dietaryRestrictions || (data.dietaryRestrictions && data.dietaryDetails),
  {
    message: "Por favor, detalhe suas restrições alimentares",
    path: ["dietaryDetails"],
  }
);

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuth();
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "user",
      goals: [],
      hasMedicalConditions: false,
      takesMedication: false,
      hasAllergies: false,
      exerciseFrequency: "",
      smokingStatus: "",
      alcoholConsumption: "",
      stressLevel: "",
      previousInjuries: false,
      dietaryRestrictions: false,
    },
  });

  const role = form.watch("role");
  const isUser = role === "user";
  const hasMedicalConditions = form.watch("hasMedicalConditions");
  const takesMedication = form.watch("takesMedication");
  const hasAllergies = form.watch("hasAllergies");
  const previousInjuries = form.watch("previousInjuries");
  const dietaryRestrictions = form.watch("dietaryRestrictions");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setError("");
    try {
      const { confirmPassword, ...userData } = values;
      
      if (isUser) {
        const { 
          weight, height, age, goals, 
          hasMedicalConditions, medicalConditionsDetails,
          takesMedication, medicationDetails,
          hasAllergies, allergiesDetails,
          exerciseFrequency, smokingStatus, alcoholConsumption,
          sleepHours, stressLevel,
          previousInjuries, injuriesDetails,
          dietaryRestrictions, dietaryDetails,
          ...basicData 
        } = userData;
        
        await registerUser(
          basicData.name, 
          basicData.email, 
          basicData.password, 
          basicData.role,
          { 
            weight, 
            height, 
            age, 
            goals,
            hasMedicalConditions,
            medicalConditionsDetails,
            takesMedication,
            medicationDetails,
            hasAllergies,
            allergiesDetails,
            exerciseFrequency,
            smokingStatus,
            alcoholConsumption,
            sleepHours,
            stressLevel,
            previousInjuries,
            injuriesDetails,
            dietaryRestrictions,
            dietaryDetails
          }
        );
      } else {
        // Para profissionais, apenas dados básicos
        const { role, name, email, password } = userData;
        await registerUser(name, email, password, role);
      }
      
      navigate("/dashboard");
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || "Erro ao criar conta. Tente novamente.");
    }
  };

  const nextStep = () => {
    const fieldsToValidate = step === 1 
      ? ["name", "email", "password", "confirmPassword", "role"]
      : step === 2 
      ? ["weight", "height", "age", "goals"] 
      : [];

    form.trigger(fieldsToValidate as any).then((valid) => {
      if (valid) {
        setStep(prev => Math.min(prev + 1, totalSteps));
      }
    });
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const goalOptions: { value: UserGoal, label: string }[] = [
    { value: "lose_weight", label: "Perder peso" },
    { value: "gain_muscle", label: "Ganhar massa muscular" },
    { value: "improve_health", label: "Melhorar saúde geral" },
    { value: "increase_flexibility", label: "Aumentar flexibilidade" },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold">
              <Activity className="h-6 w-6 text-vivafit-600" />
              <span className="text-gradient">VivaFit</span>
            </Link>
            <h1 className="text-2xl font-bold mt-6 mb-2">Crie sua conta</h1>
            <p className="text-muted-foreground">Comece sua jornada para uma vida mais saudável</p>
          </div>

          <motion.div 
            className="glass-card p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6 text-sm">
                {error}
              </div>
            )}
            
            {/* Progress indicator */}
            <div className="flex items-center justify-between mb-6">
              {Array.from({ length: isUser ? totalSteps : 1 }).map((_, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className={`rounded-full w-8 h-8 flex items-center justify-center font-medium transition-colors ${
                      step > index + 1
                        ? "bg-green-100 text-green-700 border-2 border-green-500"
                        : step === index + 1
                        ? "bg-vivafit-100 text-vivafit-700 border-2 border-vivafit-500"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < (isUser ? totalSteps : 1) - 1 && (
                    <div 
                      className={`h-0.5 w-full ${
                        step > index + 1 ? "bg-green-500" : "bg-gray-200"
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {step === 1 ? (
                  <>
                    <div className="text-center mb-4">
                      <h2 className="text-lg font-medium">Dados de Acesso</h2>
                      <p className="text-sm text-muted-foreground">
                        Informações básicas para sua conta
                      </p>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome completo</FormLabel>
                          <FormControl>
                            <Input placeholder="Seu nome" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="seu@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmar Senha</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Tipo de conta</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="user" id="user" />
                                <Label htmlFor="user" className="font-normal cursor-pointer">
                                  Usuário - Quero receber recomendações
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="professional" id="professional" />
                                <Label htmlFor="professional" className="font-normal cursor-pointer">
                                  Profissional - Quero ajudar usuários
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      className="w-full"
                      onClick={() => isUser ? nextStep() : form.handleSubmit(onSubmit)()}
                      disabled={isLoading}
                    >
                      {isUser ? "Próximo - Informações Físicas" : (isLoading ? "Criando conta..." : "Criar conta")}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </>
                ) : step === 2 ? (
                  /* Passo 2 - Informações físicas e estilo de vida (apenas para usuários) */
                  <>
                    <div className="text-center mb-4">
                      <h2 className="text-lg font-medium">Informações Físicas & Estilo de Vida</h2>
                      <p className="text-sm text-muted-foreground">
                        Essas informações nos ajudam a personalizar seu plano
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              <div className="flex items-center gap-1">
                                <Weight className="w-4 h-4" />
                                <span>Peso (kg)</span>
                              </div>
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="70" 
                                {...field}
                                onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="height"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              <div className="flex items-center gap-1">
                                <Ruler className="w-4 h-4" />
                                <span>Altura (cm)</span>
                              </div>
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="170" 
                                {...field}
                                onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>Idade</span>
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="30" 
                              {...field}
                              onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="goals"
                      render={() => (
                        <FormItem>
                          <div className="mb-2 flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            <FormLabel className="mb-0">Seus objetivos</FormLabel>
                          </div>
                          <FormMessage />
                          <div className="space-y-2">
                            {goalOptions.map((option) => (
                              <FormField
                                key={option.value}
                                control={form.control}
                                name="goals"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={option.value}
                                      className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-2 hover:bg-muted/50"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(option.value)}
                                          onCheckedChange={(checked) => {
                                            const currentValues = field.value || [];
                                            const newValues = checked
                                              ? [...currentValues, option.value]
                                              : currentValues.filter(value => value !== option.value);
                                            field.onChange(newValues);
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="cursor-pointer font-normal">
                                        {option.label}
                                      </FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                        </FormItem>
                      )}
                    />

                    {/* Novas perguntas de estilo de vida */}
                    <FormField
                      control={form.control}
                      name="exerciseFrequency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <div className="flex items-center gap-1">
                              <Zap className="w-4 h-4" />
                              <span>Frequência de exercícios</span>
                            </div>
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="sedentario" id="sedentario" />
                                <Label htmlFor="sedentario" className="font-normal cursor-pointer text-sm">
                                  Sedentário (pouco ou nenhum exercício)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="leve" id="leve" />
                                <Label htmlFor="leve" className="font-normal cursor-pointer text-sm">
                                  Leve (1-3 dias por semana)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="moderado" id="moderado" />
                                <Label htmlFor="moderado" className="font-normal cursor-pointer text-sm">
                                  Moderado (3-5 dias por semana)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="intenso" id="intenso" />
                                <Label htmlFor="intenso" className="font-normal cursor-pointer text-sm">
                                  Intenso (6-7 dias por semana)
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="sleepHours"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              <div className="flex items-center gap-1">
                                <Moon className="w-4 h-4" />
                                <span>Horas de sono</span>
                              </div>
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="8" 
                                min="0"
                                max="24"
                                {...field}
                                onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="stressLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nível de estresse</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="baixo" id="stress-baixo" />
                                  <Label htmlFor="stress-baixo" className="font-normal cursor-pointer text-sm">Baixo</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="medio" id="stress-medio" />
                                  <Label htmlFor="stress-medio" className="font-normal cursor-pointer text-sm">Médio</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="alto" id="stress-alto" />
                                  <Label htmlFor="stress-alto" className="font-normal cursor-pointer text-sm">Alto</Label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="smokingStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status de fumante</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="nunca" id="nunca-fumou" />
                                <Label htmlFor="nunca-fumou" className="font-normal cursor-pointer text-sm">
                                  Nunca fumei
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="ex-fumante" id="ex-fumante" />
                                <Label htmlFor="ex-fumante" className="font-normal cursor-pointer text-sm">
                                  Ex-fumante
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="fumante" id="fumante" />
                                <Label htmlFor="fumante" className="font-normal cursor-pointer text-sm">
                                  Fumante atual
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="alcoholConsumption"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Consumo de álcool</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="nao-bebo" id="nao-bebo" />
                                <Label htmlFor="nao-bebo" className="font-normal cursor-pointer text-sm">
                                  Não bebo
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="social" id="social" />
                                <Label htmlFor="social" className="font-normal cursor-pointer text-sm">
                                  Socialmente (1-2 vezes por semana)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="moderado" id="alcool-moderado" />
                                <Label htmlFor="alcool-moderado" className="font-normal cursor-pointer text-sm">
                                  Moderado (3-5 vezes por semana)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="frequente" id="frequente" />
                                <Label htmlFor="frequente" className="font-normal cursor-pointer text-sm">
                                  Frequente (diariamente)
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-3 mt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        className="flex-1"
                      >
                        Voltar
                      </Button>
                      <Button
                        type="button"
                        className="flex-1"
                        onClick={nextStep}
                      >
                        Próximo - Saúde
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  /* Passo 3 - Informações de saúde expandidas */
                  <>
                    <div className="text-center mb-4">
                      <h2 className="text-lg font-medium">Informações de Saúde</h2>
                      <p className="text-sm text-muted-foreground">
                        Detalhes importantes para personalizar suas recomendações
                      </p>
                    </div>

                    <FormField
                      control={form.control}
                      name="hasMedicalConditions"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4 text-red-500" />
                            <FormLabel className="text-base font-medium">Condições Médicas</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <Label htmlFor="hasMedicalConditions" className="text-sm">
                              Possuo condições médicas que precisam de atenção
                            </Label>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {hasMedicalConditions && (
                      <FormField
                        control={form.control}
                        name="medicalConditionsDetails"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Detalhes sobre suas condições médicas</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Ex: Diabetes tipo 2, Hipertensão, problemas cardíacos, etc."
                                className="min-h-[80px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="takesMedication"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Pill className="h-4 w-4 text-blue-500" />
                            <FormLabel className="text-base font-medium">Uso de Medicamentos</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <Label htmlFor="takesMedication" className="text-sm">
                              Faço uso regular de medicamentos
                            </Label>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {takesMedication && (
                      <FormField
                        control={form.control}
                        name="medicationDetails"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quais medicamentos você utiliza</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Ex: Metformina 500mg 2x ao dia, Losartana 50mg 1x ao dia, etc."
                                className="min-h-[80px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="hasAllergies"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4 text-orange-500" />
                            <FormLabel className="text-base font-medium">Alergias</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <Label htmlFor="hasAllergies" className="text-sm">
                              Possuo alergias importantes
                            </Label>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {hasAllergies && (
                      <FormField
                        control={form.control}
                        name="allergiesDetails"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Detalhes sobre suas alergias</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Ex: Alergia a amendoim, lactose, glúten, medicamentos específicos, etc."
                                className="min-h-[80px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="previousInjuries"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-yellow-500" />
                            <FormLabel className="text-base font-medium">Lesões Anteriores</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <Label htmlFor="previousInjuries" className="text-sm">
                              Já tive lesões que afetam atividades físicas
                            </Label>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {previousInjuries && (
                      <FormField
                        control={form.control}
                        name="injuriesDetails"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Detalhes sobre lesões anteriores</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Ex: Lesão no joelho direito, problema na coluna lombar, cirurgia no ombro, etc."
                                className="min-h-[80px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="dietaryRestrictions"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Utensils className="h-4 w-4 text-green-500" />
                            <FormLabel className="text-base font-medium">Restrições Alimentares</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <Label htmlFor="dietaryRestrictions" className="text-sm">
                              Possuo restrições ou preferências alimentares
                            </Label>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {dietaryRestrictions && (
                      <FormField
                        control={form.control}
                        name="dietaryDetails"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Detalhes sobre suas restrições alimentares</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Ex: Vegetariano, vegano, sem glúten, sem lactose, dieta cetogênica, etc."
                                className="min-h-[80px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <div className="flex gap-3 mt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        className="flex-1"
                      >
                        Voltar
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1"
                        disabled={isLoading}
                      >
                        {isLoading ? "Criando conta..." : "Finalizar cadastro"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </form>
            </Form>

            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                Já tem uma conta?{' '}
                <Link to="/login" className="font-medium text-vivafit-600 hover:underline">
                  Faça login
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default RegisterPage;
