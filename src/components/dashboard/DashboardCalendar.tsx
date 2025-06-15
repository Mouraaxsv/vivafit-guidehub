
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardCalendarProps {
  isProfessional: boolean;
}

export const DashboardCalendar = ({ isProfessional }: DashboardCalendarProps) => {
  const events = [
    {
      day: "Hoje",
      events: isProfessional 
        ? ["Consulta com Ana Maria", "Revisão de planos"]
        : ["Treino de manhã", "Consulta nutricional"],
      isPast: false,
    },
    {
      day: "Amanhã",
      events: isProfessional 
        ? ["Consulta com Ricardo", "Webinar de Nutrição"]
        : ["Yoga", "Caminhada"],
      isPast: false,
    },
    {
      day: "Quinta-feira",
      events: isProfessional 
        ? ["Consulta com Camila", "Avaliação mensal"]
        : ["Musculação", "Meditação"],
      isPast: false,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isProfessional ? "Agenda da Semana" : "Próximos Eventos"}
        </CardTitle>
        <CardDescription>
          {isProfessional ? "Consultas agendadas" : "Seu calendário de atividades"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((day, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-2 h-2 rounded-full ${day.isPast ? 'bg-muted' : 'bg-vivafit-500'}`}></div>
                <div className="w-0.5 h-full bg-muted"></div>
              </div>
              <div className="flex-1 pb-4">
                <h4 className="font-medium">{day.day}</h4>
                <div className="mt-2 space-y-2">
                  {day.events.map((event, j) => (
                    <div 
                      key={j} 
                      className={`text-sm p-2 rounded-md ${
                        day.isPast ? 'text-muted-foreground bg-muted/30' : 'bg-muted/50'
                      }`}
                    >
                      {event}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
