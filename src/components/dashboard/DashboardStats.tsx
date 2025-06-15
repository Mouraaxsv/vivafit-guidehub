
import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, ChartLine, Calendar } from "lucide-react";

interface DashboardStatsProps {
  isProfessional: boolean;
}

export const DashboardStats = ({ isProfessional }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="inline-flex p-3 rounded-full bg-vivafit-100 text-vivafit-600 mb-3">
              {isProfessional ? <Users className="h-6 w-6" /> : <Target className="h-6 w-6" />}
            </div>
            <div className="text-2xl font-bold">
              {isProfessional ? "28" : "6"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {isProfessional ? "Total de Clientes" : "Dias de Streak"}
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="inline-flex p-3 rounded-full bg-leaf-100 text-leaf-600 mb-3">
              {isProfessional ? <ChartLine className="h-6 w-6" /> : <Calendar className="h-6 w-6" />}
            </div>
            <div className="text-2xl font-bold">
              {isProfessional ? "84%" : "3/5"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {isProfessional ? "Taxa de Progresso" : "Treinos na Semana"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
