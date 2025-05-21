
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { User, Settings, Shield, Heart, Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageTransition } from "@/components/layout/PageTransition";
import { useAuth, ThemeType } from "@/contexts/AuthContext";
import { toast } from "sonner";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout, applyTheme, applyFontSize, applyHighContrast } = useAuth();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  if (!user) {
    return null;
  }
  
  const [activeTab, setActiveTab] = useState("profile");
  
  // Form states
  const [name, setName] = useState(user.name);
  const [theme, setTheme] = useState<ThemeType>(user.theme || 'system');
  const [fontSize, setFontSize] = useState(user.fontSize || 'medium');
  const [highContrast, setHighContrast] = useState(user.highContrast || false);
  
  // Medical information
  const [hasMedicalConditions, setHasMedicalConditions] = useState(
    user.physicalInfo?.hasMedicalConditions || false
  );
  const [medicalConditionsDetails, setMedicalConditionsDetails] = useState(
    user.physicalInfo?.medicalConditionsDetails || ''
  );
  const [takesMedication, setTakesMedication] = useState(
    user.physicalInfo?.takesMedication || false
  );
  const [medicationDetails, setMedicationDetails] = useState(
    user.physicalInfo?.medicationDetails || ''
  );
  
  const handleUpdateProfile = () => {
    updateUser({
      name,
      physicalInfo: {
        ...(user.physicalInfo || {}),
        hasMedicalConditions,
        medicalConditionsDetails,
        takesMedication,
        medicationDetails
      }
    });
    toast.success("Perfil atualizado com sucesso!");
  };
  
  const handleUpdateAppearance = () => {
    // Apply changes to the DOM immediately
    applyTheme(theme);
    applyFontSize(fontSize);
    applyHighContrast(highContrast);
    
    // Save to user profile
    updateUser({
      theme,
      fontSize,
      highContrast
    });
    
    toast.success("Preferências de aparência atualizadas!");
  };
  
  return (
    <PageTransition>
      <div className="container py-10 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          <Card className="w-full md:w-64 h-fit">
            <CardHeader>
              <CardTitle>Meu Perfil</CardTitle>
              <CardDescription>Gerencie sua conta</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-1">
                <Button 
                  variant={activeTab === "profile" ? "default" : "ghost"} 
                  className="justify-start"
                  onClick={() => setActiveTab("profile")}
                >
                  <User className="mr-2 h-4 w-4" />
                  Perfil
                </Button>
                <Button 
                  variant={activeTab === "appearance" ? "default" : "ghost"} 
                  className="justify-start"
                  onClick={() => setActiveTab("appearance")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Aparência
                </Button>
                <Button 
                  variant={activeTab === "health" ? "default" : "ghost"} 
                  className="justify-start"
                  onClick={() => setActiveTab("health")}
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Informações de Saúde
                </Button>
                <Button 
                  variant={activeTab === "security" ? "default" : "ghost"} 
                  className="justify-start"
                  onClick={() => setActiveTab("security")}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Segurança
                </Button>
                <Button 
                  variant="destructive" 
                  className="mt-4"
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                >
                  Sair
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex-1">
            {activeTab === "profile" && (
              <Card>
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                  <CardDescription>Atualize suas informações básicas</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => { e.preventDefault(); handleUpdateProfile(); }}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome</Label>
                        <Input 
                          id="name" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          value={user.email} 
                          disabled 
                          className="bg-muted" 
                        />
                        <p className="text-xs text-muted-foreground">O email não pode ser alterado</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Tipo de Conta</Label>
                        <Input 
                          value={user.role === 'user' ? 'Usuário' : 'Profissional'} 
                          disabled 
                          className="bg-muted" 
                        />
                      </div>
                      
                      <Button type="submit">Salvar Alterações</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
            
            {activeTab === "appearance" && (
              <Card>
                <CardHeader>
                  <CardTitle>Aparência e Acessibilidade</CardTitle>
                  <CardDescription>Configure como o aplicativo é exibido</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => { e.preventDefault(); handleUpdateAppearance(); }}>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Tema</h3>
                        <RadioGroup 
                          value={theme} 
                          onValueChange={(value: ThemeType) => setTheme(value)}
                          className="flex flex-col sm:flex-row gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="light" id="light" />
                            <Label htmlFor="light" className="flex items-center cursor-pointer">
                              <Sun className="h-4 w-4 mr-2" />
                              Claro
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="dark" id="dark" />
                            <Label htmlFor="dark" className="flex items-center cursor-pointer">
                              <Moon className="h-4 w-4 mr-2" />
                              Escuro
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="system" id="system" />
                            <Label htmlFor="system" className="flex items-center cursor-pointer">
                              <Monitor className="h-4 w-4 mr-2" />
                              Sistema
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4">Tamanho da Fonte</h3>
                        <RadioGroup 
                          value={fontSize} 
                          onValueChange={(value) => setFontSize(value as 'small' | 'medium' | 'large')}
                          className="flex flex-col sm:flex-row gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="small" id="small" />
                            <Label htmlFor="small" className="text-sm cursor-pointer">Pequeno</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="medium" id="medium" />
                            <Label htmlFor="medium" className="text-base cursor-pointer">Médio</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="large" id="large" />
                            <Label htmlFor="large" className="text-lg cursor-pointer">Grande</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="high-contrast"
                          checked={highContrast}
                          onCheckedChange={setHighContrast}
                        />
                        <Label htmlFor="high-contrast">Alto Contraste</Label>
                      </div>
                      
                      <Button type="submit">Salvar Preferências</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
            
            {activeTab === "health" && (
              <Card>
                <CardHeader>
                  <CardTitle>Informações de Saúde</CardTitle>
                  <CardDescription>Atualize seus dados de saúde para recomendações mais personalizadas</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => { e.preventDefault(); handleUpdateProfile(); }}>
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="medical-conditions"
                            checked={hasMedicalConditions}
                            onCheckedChange={setHasMedicalConditions}
                          />
                          <Label htmlFor="medical-conditions">Possuo condições médicas</Label>
                        </div>
                        
                        {hasMedicalConditions && (
                          <div className="space-y-2">
                            <Label htmlFor="medical-details">Detalhes sobre suas condições médicas:</Label>
                            <Textarea 
                              id="medical-details" 
                              placeholder="Ex: Diabetes tipo 2, Hipertensão, etc."
                              value={medicalConditionsDetails}
                              onChange={(e) => setMedicalConditionsDetails(e.target.value)}
                              className="min-h-[100px]"
                            />
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="medications"
                            checked={takesMedication}
                            onCheckedChange={setTakesMedication}
                          />
                          <Label htmlFor="medications">Faço uso de medicamentos</Label>
                        </div>
                        
                        {takesMedication && (
                          <div className="space-y-2">
                            <Label htmlFor="medication-details">Quais medicamentos você utiliza:</Label>
                            <Textarea 
                              id="medication-details" 
                              placeholder="Ex: Metformina 500mg 2x ao dia, etc."
                              value={medicationDetails}
                              onChange={(e) => setMedicationDetails(e.target.value)}
                              className="min-h-[100px]"
                            />
                          </div>
                        )}
                      </div>
                      
                      <Button type="submit">Salvar Informações</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
            
            {activeTab === "security" && (
              <Card>
                <CardHeader>
                  <CardTitle>Segurança da Conta</CardTitle>
                  <CardDescription>Gerencie sua senha e configurações de segurança</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="font-medium">Alterar Senha</h3>
                      <p className="text-sm text-muted-foreground">Sua senha deve ter pelo menos 8 caracteres.</p>
                      
                      <div className="space-y-4 pt-2">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Senha Atual</Label>
                          <Input id="current-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">Nova Senha</Label>
                          <Input id="new-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                          <Input id="confirm-password" type="password" />
                        </div>
                      </div>
                      
                      <Button className="mt-4">Alterar Senha</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ProfilePage;
