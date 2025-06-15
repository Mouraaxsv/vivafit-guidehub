
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Activity, Dumbbell, Utensils } from "lucide-react";
import { Link } from "react-router-dom";

const upcomingActivities = [
  {
    id: 1,
    title: "Treino de musculação",
    time: "11:00 - 12:00",
    icon: <Dumbbell className="h-5 w-5 text-vivafit-500" />
  },
  {
    id: 2,
    title: "Almoço proteico",
    time: "13:00 - 13:30",
    icon: <Utensils className="h-5 w-5 text-leaf-500" />
  },
  {
    id: 3,
    title: "Meditação guiada",
    time: "19:00 - 19:15",
    icon: <Activity className="h-5 w-5 text-purple-500" />
  }
];

export const UserPlan = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Seu Plano de Hoje</CardTitle>
        <CardDescription>Atividades programadas para hoje</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcomingActivities.map((activity) => (
            <div key={activity.id} className="flex items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="mr-4 p-2 rounded-full bg-muted/50">
                {activity.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{activity.title}</h4>
                <p className="text-sm text-muted-foreground">{activity.time}</p>
              </div>
              <Button variant="ghost" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" className="w-full" asChild>
            <Link to="/plan">
              Ver plano completo
              <ChevronRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
