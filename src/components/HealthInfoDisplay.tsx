
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Heart, Activity, Moon, Cigarette, Wine, Brain } from "lucide-react";

interface HealthInfo {
  hasMedicalConditions?: boolean;
  medicalConditionsDetails?: string;
  takesMedication?: boolean;
  medicationDetails?: string;
  hasAllergies?: boolean;
  allergiesDetails?: string;
  exerciseLevel?: 'sedentary' | 'light' | 'moderate' | 'intense';
  sleepHours?: string;
  smokingStatus?: 'never' | 'former' | 'current';
  alcoholConsumption?: 'never' | 'social' | 'regular' | 'daily';
  stressLevel?: 'low' | 'moderate' | 'high';
  mentalHealthConcerns?: boolean;
  mentalHealthDetails?: string;
}

interface HealthInfoDisplayProps {
  healthInfo: HealthInfo;
  title?: string;
  showAllFields?: boolean;
}

export const HealthInfoDisplay = ({ 
  healthInfo, 
  title = "Informações de Saúde",
  showAllFields = true 
}: HealthInfoDisplayProps) => {
  const getExerciseLevelLabel = (level: string) => {
    switch (level) {
      case 'sedentary': return 'Sedentário';
      case 'light': return 'Leve (1-2x por semana)';
      case 'moderate': return 'Moderado (3-4x por semana)';
      case 'intense': return 'Intenso (5+ por semana)';
      default: return level;
    }
  };

  const getSmokingStatusLabel = (status: string) => {
    switch (status) {
      case 'never': return 'Nunca fumou';
      case 'former': return 'Ex-fumante';
      case 'current': return 'Fumante atual';
      default: return status;
    }
  };

  const getAlcoholConsumptionLabel = (consumption: string) => {
    switch (consumption) {
      case 'never': return 'Não bebe';
      case 'social': return 'Socialmente';
      case 'regular': return 'Regularmente';
      case 'daily': return 'Diariamente';
      default: return consumption;
    }
  };

  const getStressLevelLabel = (level: string) => {
    switch (level) {
      case 'low': return 'Baixo';
      case 'moderate': return 'Moderado';
      case 'high': return 'Alto';
      default: return level;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          {title}
        </CardTitle>
        <CardDescription>
          Informações médicas e de estilo de vida
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Condições médicas */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Condições médicas:
          </Label>
          <p className="text-sm bg-muted p-3 rounded-lg">
            {healthInfo.hasMedicalConditions ? 
              (healthInfo.medicalConditionsDetails || "Sim, mas sem detalhes especificados") : 
              "Não possui condições médicas conhecidas"
            }
          </p>
        </div>

        {/* Medicamentos */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Medicamentos:
          </Label>
          <p className="text-sm bg-muted p-3 rounded-lg">
            {healthInfo.takesMedication ? 
              (healthInfo.medicationDetails || "Sim, mas sem detalhes especificados") : 
              "Não faz uso de medicamentos"
            }
          </p>
        </div>

        {/* Alergias */}
        {(healthInfo.hasAllergies !== undefined || showAllFields) && (
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Alergias:
            </Label>
            <p className="text-sm bg-muted p-3 rounded-lg">
              {healthInfo.hasAllergies ? 
                (healthInfo.allergiesDetails || "Sim, mas sem detalhes especificados") : 
                "Não possui alergias conhecidas"
              }
            </p>
          </div>
        )}

        {showAllFields && (
          <>
            {/* Nível de exercício */}
            {healthInfo.exerciseLevel && (
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Nível de atividade física:
                </Label>
                <p className="text-sm bg-muted p-3 rounded-lg">
                  {getExerciseLevelLabel(healthInfo.exerciseLevel)}
                </p>
              </div>
            )}

            {/* Horas de sono */}
            {healthInfo.sleepHours && (
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  Horas de sono por noite:
                </Label>
                <p className="text-sm bg-muted p-3 rounded-lg">
                  {healthInfo.sleepHours} horas
                </p>
              </div>
            )}

            {/* Hábito de fumar */}
            {healthInfo.smokingStatus && (
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Cigarette className="h-4 w-4" />
                  Hábito de fumar:
                </Label>
                <p className="text-sm bg-muted p-3 rounded-lg">
                  {getSmokingStatusLabel(healthInfo.smokingStatus)}
                </p>
              </div>
            )}

            {/* Consumo de álcool */}
            {healthInfo.alcoholConsumption && (
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Wine className="h-4 w-4" />
                  Consumo de álcool:
                </Label>
                <p className="text-sm bg-muted p-3 rounded-lg">
                  {getAlcoholConsumptionLabel(healthInfo.alcoholConsumption)}
                </p>
              </div>
            )}

            {/* Nível de estresse */}
            {healthInfo.stressLevel && (
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Nível de estresse:
                </Label>
                <p className="text-sm bg-muted p-3 rounded-lg">
                  {getStressLevelLabel(healthInfo.stressLevel)}
                </p>
              </div>
            )}

            {/* Saúde mental */}
            {healthInfo.mentalHealthConcerns !== undefined && (
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Preocupações com saúde mental:
                </Label>
                <p className="text-sm bg-muted p-3 rounded-lg">
                  {healthInfo.mentalHealthConcerns ? 
                    (healthInfo.mentalHealthDetails || "Sim, mas sem detalhes especificados") : 
                    "Não possui preocupações com saúde mental"
                  }
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
