
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dumbbell, Utensils, Clock } from "lucide-react";

interface ProgressData {
  workout: number;
  nutrition: number;
  hydration: number;
  sleep: number;
}

interface ProgressOverviewProps {
  progress: ProgressData;
}

export const ProgressOverview = ({ progress }: ProgressOverviewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Seu Progresso Hoje</CardTitle>
        <CardDescription>Acompanhe seus objetivos diários</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Dumbbell className="h-4 w-4 text-vivafit-600" />
              <span>Exercícios</span>
            </div>
            <span className="text-sm font-medium">{progress.workout}%</span>
          </div>
          <Progress value={progress.workout} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Utensils className="h-4 w-4 text-leaf-600" />
              <span>Nutrição</span>
            </div>
            <span className="text-sm font-medium">{progress.nutrition}%</span>
          </div>
          <Progress value={progress.nutrition} className="h-2 bg-muted [&>div]:bg-leaf-500" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="text-blue-500">💧</div>
              <span>Hidratação</span>
            </div>
            <span className="text-sm font-medium">{progress.hydration}%</span>
          </div>
          <Progress value={progress.hydration} className="h-2 bg-muted [&>div]:bg-blue-500" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-600" />
              <span>Sono</span>
            </div>
            <span className="text-sm font-medium">{progress.sleep}%</span>
          </div>
          <Progress value={progress.sleep} className="h-2 bg-muted [&>div]:bg-purple-500" />
        </div>
      </CardContent>
    </Card>
  );
};
