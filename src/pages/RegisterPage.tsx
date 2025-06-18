
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { PageTransition } from "@/components/layout/PageTransition";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user" as "user" | "professional"
  });
  
  // Health information for users
  const [healthInfo, setHealthInfo] = useState({
    hasMedicalConditions: false,
    medicalConditionsDetails: "",
    takesMedication: false,
    medicationDetails: "",
    hasAllergies: false,
    allergiesDetails: "",
    exerciseLevel: "sedentary" as "sedentary" | "light" | "moderate" | "intense",
    sleepHours: "",
    smokingStatus: "never" as "never" | "former" | "current",
    alcoholConsumption: "never" as "never" | "social" | "regular" | "daily",
    stressLevel: "low" as "low" | "moderate" | "high",
    mentalHealthConcerns: false,
    mentalHealthDetails: ""
  });
  
  const handleNext = () => {
    if (currentStep === 1) {
      // Validate first step
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        toast.error("Por favor, preencha todos os campos");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("As senhas não coincidem");
        return;
      }
      if (formData.password.length < 6) {
        toast.error("A senha deve ter pelo menos 6 caracteres");
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };
  
  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };
  
  const handleRegister = async () => {
    setIsLoading(true);
    
    try {
      const physicalInfo = formData.role === "user" ? {
        hasMedicalConditions: healthInfo.hasMedicalConditions,
        medicalConditionsDetails: healthInfo.medicalConditionsDetails,
        takesMedication: healthInfo.takesMedication,
        medicationDetails: healthInfo.medicationDetails,
        hasAllergies: healthInfo.hasAllergies,
        allergiesDetails: healthInfo.allergiesDetails,
        exerciseLevel: healthInfo.exerciseLevel,
        sleepHours: healthInfo.sleepHours,
        smokingStatus: healthInfo.smokingStatus,
        alcoholConsumption: healthInfo.alcoholConsumption,
        stressLevel: healthInfo.stressLevel,
        mentalHealthConcerns: healthInfo.mentalHealthConcerns,
        mentalHealthDetails: healthInfo.mentalHealthDetails
      } : undefined;
      
      await register(
        formData.email,
        formData.password,
        formData.name,
        formData.role,
        physicalInfo
      );
      
      toast.success("Conta criada com sucesso!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Erro ao criar conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const totalSteps = formData.role === "user" ? 3 : 2;
  const progressPercentage = (currentStep / totalSteps) * 100;
  
  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-vivafit-50 to-leaf-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Criar Conta
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && "Informações básicas"}
                {currentStep === 2 && formData.role === "user" && "Informações de saúde"}
                {currentStep === 2 && formData.role === "professional" && "Finalizar cadastro"}
                {currentStep === 3 && "Informações adicionais de saúde"}
              </CardDescription>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                <motion.div 
                  className="bg-vivafit-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Etapa {currentStep} de {totalSteps}
              </p>
            </CardHeader>
            
            <CardContent>
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Seu nome completo"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="seu@email.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Tipo de conta</Label>
                    <RadioGroup
                      value={formData.role}
                      onValueChange={(value: "user" | "professional") => 
                        setFormData({ ...formData, role: value })
                      }
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="user" id="user" />
                        <Label htmlFor="user">Usuário - Quero melhorar minha saúde</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="professional" id="professional" />
                        <Label htmlFor="professional">Profissional - Quero ajudar outros</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Mínimo 6 caracteres"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar senha</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        placeholder="Digite a senha novamente"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <Button onClick={handleNext} className="w-full">
                    Próximo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              )}
              
              {/* Step 2: Health Information (Users only) or Finish (Professionals) */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  {formData.role === "user" ? (
                    <>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="medical-conditions"
                            checked={healthInfo.hasMedicalConditions}
                            onCheckedChange={(checked) => 
                              setHealthInfo({ ...healthInfo, hasMedicalConditions: checked })
                            }
                          />
                          <Label htmlFor="medical-conditions">Possuo condições médicas</Label>
                        </div>
                        
                        {healthInfo.hasMedicalConditions && (
                          <Textarea
                            placeholder="Descreva suas condições médicas"
                            value={healthInfo.medicalConditionsDetails}
                            onChange={(e) => 
                              setHealthInfo({ ...healthInfo, medicalConditionsDetails: e.target.value })
                            }
                          />
                        )}
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="medications"
                            checked={healthInfo.takesMedication}
                            onCheckedChange={(checked) => 
                              setHealthInfo({ ...healthInfo, takesMedication: checked })
                            }
                          />
                          <Label htmlFor="medications">Faço uso de medicamentos</Label>
                        </div>
                        
                        {healthInfo.takesMedication && (
                          <Textarea
                            placeholder="Liste os medicamentos que utiliza"
                            value={healthInfo.medicationDetails}
                            onChange={(e) => 
                              setHealthInfo({ ...healthInfo, medicationDetails: e.target.value })
                            }
                          />
                        )}
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="allergies"
                            checked={healthInfo.hasAllergies}
                            onCheckedChange={(checked) => 
                              setHealthInfo({ ...healthInfo, hasAllergies: checked })
                            }
                          />
                          <Label htmlFor="allergies">Possuo alergias</Label>
                        </div>
                        
                        {healthInfo.hasAllergies && (
                          <Textarea
                            placeholder="Descreva suas alergias"
                            value={healthInfo.allergiesDetails}
                            onChange={(e) => 
                              setHealthInfo({ ...healthInfo, allergiesDetails: e.target.value })
                            }
                          />
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" onClick={handleBack} className="flex-1">
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Voltar
                        </Button>
                        <Button onClick={handleNext} className="flex-1">
                          Próximo
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-center space-y-4">
                        <div className="mx-auto w-16 h-16 bg-vivafit-100 rounded-full flex items-center justify-center">
                          <Check className="h-8 w-8 text-vivafit-600" />
                        </div>
                        <h3 className="text-lg font-semibold">Quase pronto!</h3>
                        <p className="text-muted-foreground">
                          Clique em finalizar para criar sua conta de profissional.
                        </p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" onClick={handleBack} className="flex-1">
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Voltar
                        </Button>
                        <Button 
                          onClick={handleRegister} 
                          disabled={isLoading}
                          className="flex-1"
                        >
                          {isLoading ? "Criando..." : "Finalizar"}
                        </Button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
              
              {/* Step 3: Additional Health Information (Users only) */}
              {currentStep === 3 && formData.role === "user" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Nível de atividade física</Label>
                      <RadioGroup
                        value={healthInfo.exerciseLevel}
                        onValueChange={(value: "sedentary" | "light" | "moderate" | "intense") => 
                          setHealthInfo({ ...healthInfo, exerciseLevel: value })
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="sedentary" id="sedentary" />
                          <Label htmlFor="sedentary">Sedentário</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="light" id="light" />
                          <Label htmlFor="light">Leve (1-2x por semana)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="moderate" id="moderate" />
                          <Label htmlFor="moderate">Moderado (3-4x por semana)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="intense" id="intense" />
                          <Label htmlFor="intense">Intenso (5+ por semana)</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sleep-hours">Horas de sono por noite</Label>
                      <Input
                        id="sleep-hours"
                        type="number"
                        min="0"
                        max="24"
                        value={healthInfo.sleepHours}
                        onChange={(e) => 
                          setHealthInfo({ ...healthInfo, sleepHours: e.target.value })
                        }
                        placeholder="Ex: 8"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Hábito de fumar</Label>
                      <RadioGroup
                        value={healthInfo.smokingStatus}
                        onValueChange={(value: "never" | "former" | "current") => 
                          setHealthInfo({ ...healthInfo, smokingStatus: value })
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="never" id="never-smoke" />
                          <Label htmlFor="never-smoke">Nunca fumei</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="former" id="former-smoke" />
                          <Label htmlFor="former-smoke">Ex-fumante</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="current" id="current-smoke" />
                          <Label htmlFor="current-smoke">Fumante atual</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Consumo de álcool</Label>
                      <RadioGroup
                        value={healthInfo.alcoholConsumption}
                        onValueChange={(value: "never" | "social" | "regular" | "daily") => 
                          setHealthInfo({ ...healthInfo, alcoholConsumption: value })
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="never" id="never-drink" />
                          <Label htmlFor="never-drink">Não bebo</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="social" id="social-drink" />
                          <Label htmlFor="social-drink">Socialmente</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="regular" id="regular-drink" />
                          <Label htmlFor="regular-drink">Regularmente</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="daily" id="daily-drink" />
                          <Label htmlFor="daily-drink">Diariamente</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Nível de estresse</Label>
                      <RadioGroup
                        value={healthInfo.stressLevel}
                        onValueChange={(value: "low" | "moderate" | "high") => 
                          setHealthInfo({ ...healthInfo, stressLevel: value })
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="low" id="low-stress" />
                          <Label htmlFor="low-stress">Baixo</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="moderate" id="moderate-stress" />
                          <Label htmlFor="moderate-stress">Moderado</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="high" id="high-stress" />
                          <Label htmlFor="high-stress">Alto</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="mental-health"
                        checked={healthInfo.mentalHealthConcerns}
                        onCheckedChange={(checked) => 
                          setHealthInfo({ ...healthInfo, mentalHealthConcerns: checked })
                        }
                      />
                      <Label htmlFor="mental-health">Tenho preocupações com saúde mental</Label>
                    </div>
                    
                    {healthInfo.mentalHealthConcerns && (
                      <Textarea
                        placeholder="Descreva suas preocupações (opcional)"
                        value={healthInfo.mentalHealthDetails}
                        onChange={(e) => 
                          setHealthInfo({ ...healthInfo, mentalHealthDetails: e.target.value })
                        }
                      />
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={handleBack} className="flex-1">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Voltar
                    </Button>
                    <Button 
                      onClick={handleRegister} 
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading ? "Criando..." : "Finalizar"}
                    </Button>
                  </div>
                </motion.div>
              )}
              
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Já tem uma conta?{" "}
                  <Link to="/login" className="text-vivafit-600 hover:underline">
                    Faça login
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default RegisterPage;
