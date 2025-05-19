import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, ArrowRight, Weight, Ruler, Calendar, Target, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageTransition } from "@/components/layout/PageTransition";
import { useAuth, UserRole, UserGoal } from "@/contexts/AuthContext";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
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
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuth();
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "user",
      goals: [],
    },
  });

  const role = form.watch("role");
  const isUser = role === "user";

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setError("");
    try {
      const { confirmPassword, ...userData } = values;
      const { weight, height, age, goals, ...basicData } = userData;
      
      // Apenas enviar informações físicas se for usuário
      if (isUser) {
        await registerUser(
          basicData.name, 
          basicData.email, 
          basicData.password, 
          basicData.role,
          { weight, height, age, goals }
        );
      } else {
        await registerUser(
          basicData.name, 
          basicData.email, 
          basicData.password, 
          basicData.role
        );
      }
      
      navigate("/dashboard");
    } catch (err) {
      setError("Erro ao criar conta. Tente novamente.");
    }
  };

  const nextStep = () => {
    const fieldsToValidate = step === 1 
      ? ["name", "email", "password", "confirmPassword", "role"]
      : [];

    form.trigger(fieldsToValidate as any).then((valid) => {
      if (valid) {
        setStep(2);
      }
    });
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

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {step === 1 ? (
                  <>
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
                      onClick={nextStep}
                      disabled={isLoading}
                    >
                      {isUser ? "Próximo - Informações Físicas" : "Criar conta"}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  /* Passo 2 - Informações físicas (apenas para usuários) */
                  <>
                    <div className="text-center mb-4">
                      <h2 className="text-lg font-medium">Informações Físicas</h2>
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

                    <div className="flex gap-3 mt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
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
